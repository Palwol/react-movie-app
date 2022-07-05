import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetails, IMovie } from "../Routes/api";
import { makeImagePath, NETFLIX_LOGO_URL } from "../Routes/utils";
import PlaySvg from "../Svg/PlaySvg";

const OverBg = styled(motion.div)`
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
  z-index: 30;
  background-color: black;
`;

const ExitBtn = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 20px;
  background-color: ${(props) => props.theme.black.veryDark};
  color: ${(props) => props.theme.white.darker};
  font-size: 22px;
  position: absolute;
  right: 0;
  margin: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.black.lighter};
  }
`;

const BigCover = styled.div<{ bgphoto: string }>`
  width: 100%;
  background-image: linear-gradient(transparent, 80%, black),
    url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 300px;
  position: relative;
`;

const BigTitle = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  margin: 0px 30px;
  margin-bottom: 30px;
  bottom: 0;
  h3 {
    font-size: 30px;
    color: ${(props) => props.theme.white.lighter};
    margin-bottom: 15px;
  }
`;

const BigBtns = styled.div`
  display: flex;
  align-items: flex-end;
`;

const PlayBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 77px;
  height: 25px;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 3px;
  border: none;
  span {
    margin-left: 7px;
    font-size: 14px;
    font-weight: 300;
    color: ${(props) => props.theme.black.veryDark};
  }
  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const BigOverview = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 30px;
  margin-bottom: 20px;
  top: -30px;
  p {
    font-size: 12px;
    font-weight: 200;
    line-height: 1.1rem;
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Info = styled.div`
  display: flex;
  margin-bottom: 10px;
  h5 {
    margin-right: 5px;
    font-size: 12px;
    font-weight: 400;
    color: ${(props) => props.theme.white.darker};
  }
  span {
    margin-right: 10px;
    font-size: 12px;
    font-weight: 100;
  }
`;

const Tagline = styled.span`
  font-size: 15px;
  font-weight: 400;
  margin: 15px 0;
`;

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

interface IMoviesProps {
  search: string | null;
}

function MovieOverlay({ search }: IMoviesProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const movieMatch = useMatch("/movies/:movieId");
  const movieSearchMatch = useMatch("/search/movies/:movieId");
  const movieId = movieMatch
    ? location.pathname.slice(8)
    : location.pathname.slice(15);
  const { scrollY } = useViewportScroll();
  const onOverlayClicked = () => {
    if (movieSearchMatch) {
      navigate(`/search/movies?keyword=${search}`);
    } else if (movieMatch) {
      navigate("/");
    }
  };
  const { data: bigMovie } = useQuery<IMovie>(
    ["movie", movieId],
    () => getMovieDetails(movieId),
    { enabled: !!movieMatch || !!movieSearchMatch }
  );
  return (
    <AnimatePresence initial={false}>
      {movieMatch || movieSearchMatch ? (
        <>
          <BigMovie
            variants={bigVariants}
            initial="initial"
            animate="clicked"
            exit="exit"
            style={{ top: scrollY.get() + 70 }}
          >
            {bigMovie && (
              <>
                <BigCover
                  bgphoto={
                    bigMovie.backdrop_path
                      ? makeImagePath(bigMovie.backdrop_path, "w500")
                      : NETFLIX_LOGO_URL
                  }
                >
                  <ExitBtn onClick={onOverlayClicked}>×</ExitBtn>
                  <BigTitle>
                    <h3>{bigMovie?.title}</h3>
                    <BigBtns>
                      <PlayBtn>
                        <PlaySvg width="12px" height="12px" />
                        <span>Play</span>
                      </PlayBtn>
                    </BigBtns>
                  </BigTitle>
                </BigCover>
                <BigOverview>
                  <Info>
                    <h5>Release : </h5>
                    <span>{bigMovie?.release_date.slice(0, 4)}</span>
                    <h5>Runtime : </h5>
                    <span>{bigMovie?.runtime}min</span>
                  </Info>
                  {bigMovie.tagline ? (
                    <Tagline>{`"${bigMovie?.tagline}"`}</Tagline>
                  ) : null}
                  <p>{bigMovie?.overview}</p>
                </BigOverview>
              </>
            )}
          </BigMovie>
          <OverBg
            onClick={onOverlayClicked}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </>
      ) : null}
    </AnimatePresence>
  );
}
export default MovieOverlay;
