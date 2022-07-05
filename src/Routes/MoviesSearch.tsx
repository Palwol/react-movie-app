import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MovieOverlay from "../Components/MovieOverlay";
import PlaySvg from "../Svg/PlaySvg";
import { getMovieSearch, IMovieResult } from "./api";
import { makeImagePath, NETFLIX_LOGO_URL } from "./utils";

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(124px, 1fr));
  column-gap: 25px;
  align-items: flex-start;
  justify-items: center;
  margin: 45px 50px 30px 50px;
`;

const MovieDetail = styled(motion.div)`
  display: flex;
  flex-direction: column;
  &:hover {
    cursor: pointer;
  }
`;

const MoviePoster = styled.div<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  width: 124px;
  height: 190px;
  background-size: cover;
  background-position: center center;
`;

const Info = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 5px;
  background-color: black;
  opacity: 0;
  width: 124px;
  bottom: 0;
  h4 {
    margin: 5px 5px;
    font-size: 12px;
    font-weight: 600;
  }
  span {
    font-size: 8px;
  }
`;

const InfoButtons = styled.div`
  display: flex;
  margin: 5px 5px;
`;

const PlayBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  width: 17px;
  height: 17px;
  background-color: white;
  border-radius: 10px;
  border: none;
  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.9);
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -40,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
    zIndex: 2,
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
    zIndex: 2,
  },
};

function MoviesSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { isLoading, data } = useQuery<IMovieResult>(
    ["movieSearch", keyword],
    () => getMovieSearch(keyword)
  );
  const onBoxClicked = (movieId: number | undefined) => {
    navigate(`/search/movies/${movieId}?keyword=${keyword}`);
  };
  return (
    <>
      {isLoading ? (
        <Loading>
          <h1>Loading...</h1>
        </Loading>
      ) : data?.results.length ? (
        <Wrapper>
          {data?.results.map((movie) => (
            <MovieDetail
              key={movie.id}
              onClick={() => onBoxClicked(movie.id)}
              variants={boxVariants}
              initial="normal"
              whileHover="hover"
              transition={{ type: "tween" }}
            >
              <MoviePoster
                bgphoto={
                  movie.poster_path
                    ? makeImagePath(movie.poster_path, "w500")
                    : NETFLIX_LOGO_URL
                }
              />
              <Info variants={infoVariants}>
                <h4>{movie.title}</h4>
                <InfoButtons>
                  <PlayBtn>
                    <PlaySvg width="8px" height="8px"></PlaySvg>
                  </PlayBtn>
                </InfoButtons>
              </Info>
            </MovieDetail>
          ))}
        </Wrapper>
      ) : (
        <Loading>
          <h2>There is no result</h2>
        </Loading>
      )}
      <MovieOverlay search={keyword} />
    </>
  );
}

export default MoviesSearch;
