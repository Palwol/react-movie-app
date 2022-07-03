import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getMovieSearch, IMovieResult } from "./api";
import { makeImagePath, NETFLIX_LOGO_URL } from "./utils";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  row-gap: 30px;
  column-gap: 25px;
  align-items: center;
  margin: 30px 45px;
`;

const MovieContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MoviePoster = styled.div<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  width: 100%;
  height: 190px;
  background-size: cover;
  background-position: center center;
`;

function MoviesSearch() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { isLoading, data } = useQuery<IMovieResult>(
    ["movieSearch", keyword],
    () => getMovieSearch(keyword)
  );
  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : data?.results.length ? (
        <Wrapper>
          {data?.results.map((movie) => (
            <MovieContainer key={movie.id}>
              <MoviePoster
                bgphoto={
                  movie.poster_path
                    ? makeImagePath(movie.poster_path, "w500")
                    : NETFLIX_LOGO_URL
                }
              />
            </MovieContainer>
          ))}
        </Wrapper>
      ) : (
        <h2>There is no result</h2>
      )}
    </>
  );
}

export default MoviesSearch;
