import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getDetails, getMovies, IMovie, IMoviesResult } from "./api";
import { makeImagePath, NETFLIX_LOGO_URL } from "./utils";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  background-image: linear-gradient(
      0.25turn,
      rgba(0, 0, 0, 0.4),
      60%,
      rgba(0, 0, 0, 0)
    ),
    linear-gradient(rgba(0, 0, 0, 0), 95%, rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  width: 35vw;
  font-size: 38px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 700;
`;

const Overview = styled.p`
  width: 35vw;
  font-size: 13px;
  font-weight: 300;
  text-shadow: 1px 1px 5px rgba(47, 54, 64, 0.3);
  line-height: 1.1rem;
  margin-bottom: 20px;
`;

const BannerBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 30px;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  border: none;
  span {
    margin-left: 7px;
    font-size: 15px;
    font-weight: 300;
    color: ${(props) => props.theme.white.lighter};
  }
  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Slider = styled.div`
  position: relative;
  top: -80px;
  margin-bottom: 120px;
`;

const SliderTitle = styled.span`
  font-size: 13px;
  font-weight: 500;
  margin-left: 30px;
  color: ${(props) => props.theme.white.darker};
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  padding: 0 30px;
  margin-top: 5px;
  margin-bottom: 10px;
  width: 100%;
  left: 0;
  right: 0;
`;

const RowBtn = styled(motion.button)`
  font-size: 25px;
  width: 30px;
  height: 100px;
  position: absolute;
  top: 24px;
  color: ${(props) => props.theme.white.darker};
  background-color: transparent;
  border: none;
  z-index: 99;
  &:hover {
    cursor: pointer;
  }
`;

const Box = styled(motion.div)`
  height: auto;
  &:hover {
    cursor: pointer;
  }
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const CoverImage = styled.div<{ bgphoto: string }>`
  width: 100%;
  height: 100px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
`;

const Info = styled(motion.div)`
  padding: 5px;
  background-color: black;
  opacity: 0;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 8px;
    font-weight: 400;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: auto;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 99;
  background-color: black;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 300px;
`;

const BigTitle = styled.h3`
  font-size: 23px;
  position: relative;
  top: -70px;
  margin: 0 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigOverview = styled.p`
  margin: 0 20px;
  margin-bottom: 10px;
  position: relative;
  top: -30px;
  font-size: 12px;
  font-weight: 200;
  line-height: 1.1rem;
  color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -40,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};

const bigVariants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  clicked: {
    scale: 1,
    opacity: 1,
    transition: { type: "tween", duration: 0.3 },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { type: "tween", duration: 0.3 },
  },
};

const offset = 6;

function Movies() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const { data: nowData, isLoading } = useQuery<IMoviesResult>(
    ["movies", "nowPlaying"],
    () => getMovies("now_playing")
  );
  const { data: latestData } = useQuery<IMovie>(["movies", "latest"], () =>
    getMovies("latest")
  );
  const { data: topData } = useQuery<IMoviesResult>(["movies", "top"], () =>
    getMovies("top_rated")
  );
  const { data: upcomingData } = useQuery<IMoviesResult>(
    ["movies", "upcoming"],
    () => getMovies("upcoming")
  );
  const { data: newMovie } = useQuery<IMovie>(
    "movie",
    () => getDetails(bigMovieMatch?.params.movieId),
    { enabled: !!bigMovieMatch }
  );
  const [nowIndex, setNowIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [layoutId, setLayoutId] = useState("");
  const nowIncrease = () => {
    if (nowData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setNowIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const topIncrease = () => {
    if (topData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const upcomingIncrease = () => {
    if (upcomingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upcomingData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number | undefined) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClicked = () => navigate("/");
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(nowData?.results[0].backdrop_path || "")}
          >
            <Title>{nowData?.results[0].title}</Title>
            <Overview>{nowData?.results[0].overview}</Overview>
            <BannerBtn onClick={() => onBoxClicked(nowData?.results[0].id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23px"
                height="23px"
                fill="white"
              >
                <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
              </svg>
              <span>Details</span>
            </BannerBtn>
          </Banner>
          <Slider id="now">
            <SliderTitle>Now Playing</SliderTitle>
            <RowBtn
              onClick={nowIncrease}
              whileHover={{
                scale: 1.3,
                transition: { type: "tween", duration: 0.1 },
              }}
              style={{ right: 0 }}
            >
              ❯
            </RowBtn>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                key={nowIndex}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {nowData?.results
                  .slice(1)
                  .slice(offset * nowIndex, offset * (nowIndex + 1))
                  .map((movie) => (
                    <Box
                      variants={boxVariants}
                      key={"now" + movie.id}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => {
                        onBoxClicked(movie.id);
                        setLayoutId("now" + movie.id);
                      }}
                      transition={{ type: "tween" }}
                    >
                      <CoverImage
                        bgphoto={
                          movie.backdrop_path
                            ? makeImagePath(movie.backdrop_path, "w500")
                            : NETFLIX_LOGO_URL
                        }
                      ></CoverImage>
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider id="top">
            <SliderTitle>Top Rated</SliderTitle>
            <RowBtn
              onClick={topIncrease}
              whileHover={{
                scale: 1.3,
                transition: { type: "tween", duration: 0.1 },
              }}
              style={{ right: 0 }}
            >
              ❯
            </RowBtn>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={topIndex}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {topData?.results
                  .slice(offset * topIndex, offset * (topIndex + 1))
                  .map((movie) => (
                    <Box
                      variants={boxVariants}
                      key={"top" + movie.id}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => {
                        onBoxClicked(movie.id);
                        setLayoutId("top" + movie.id);
                      }}
                      transition={{ type: "tween" }}
                    >
                      <CoverImage
                        bgphoto={
                          movie.backdrop_path
                            ? makeImagePath(movie.backdrop_path, "w500")
                            : NETFLIX_LOGO_URL
                        }
                      ></CoverImage>
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider id="upcoming">
            <SliderTitle>Upcoming</SliderTitle>
            <RowBtn
              onClick={upcomingIncrease}
              whileHover={{
                scale: 1.3,
                transition: { type: "tween", duration: 0.1 },
              }}
              style={{ right: 0 }}
            >
              ❯
            </RowBtn>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={upcomingIndex}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {upcomingData?.results
                  .slice(offset * upcomingIndex, offset * (upcomingIndex + 1))
                  .map((movie) => (
                    <Box
                      variants={boxVariants}
                      key={"upcoming" + movie.id}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => {
                        onBoxClicked(movie.id);
                        setLayoutId("upcoming" + movie.id);
                      }}
                      transition={{ type: "tween" }}
                    >
                      <CoverImage
                        bgphoto={
                          movie.backdrop_path
                            ? makeImagePath(movie.backdrop_path, "w500")
                            : NETFLIX_LOGO_URL
                        }
                      ></CoverImage>
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider id="latest">
            <SliderTitle>Latest Movie</SliderTitle>
            <Row key={"latest" + latestData?.id}>
              <Box
                variants={boxVariants}
                key={"latest" + latestData?.id}
                initial="normal"
                whileHover="hover"
                onClick={() => {
                  onBoxClicked(latestData?.id);
                  setLayoutId("latest" + latestData?.id);
                }}
                transition={{ type: "tween" }}
              >
                <CoverImage
                  bgphoto={
                    latestData?.backdrop_path
                      ? makeImagePath(latestData?.backdrop_path, "w500")
                      : NETFLIX_LOGO_URL
                  }
                ></CoverImage>
                <Info variants={infoVariants}>
                  <h4>{latestData?.title}</h4>
                </Info>
              </Box>
            </Row>
          </Slider>
          <AnimatePresence initial={false}>
            {bigMovieMatch ? (
              <>
                <BigMovie
                  variants={bigVariants}
                  initial="initial"
                  animate="clicked"
                  exit="exit"
                  style={{ top: scrollY.get() + 40 }}
                >
                  {newMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(transparent, 80%, black),url(
                            ${makeImagePath(newMovie?.backdrop_path)}
                          )`,
                        }}
                      />
                      <BigTitle>{newMovie?.title}</BigTitle>
                      <BigOverview>{newMovie?.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Movies;
