import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSeriesSearch, ISeriesResult } from "./api";
import { makeImagePath, NETFLIX_LOGO_URL } from "./utils";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  row-gap: 30px;
  column-gap: 25px;
  align-items: center;
  margin: 30px 45px;
`;

const SeriesContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SeriesPoster = styled.div<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  width: 100%;
  height: 190px;
  background-size: cover;
  background-position: center center;
`;

function SeriesSearch() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { isLoading, data } = useQuery<ISeriesResult>(
    ["seriesSearch", keyword],
    () => getSeriesSearch(keyword)
  );
  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : data?.results.length ? (
        <Wrapper>
          {data?.results.map((series) => (
            <SeriesContainer key={series.id}>
              <SeriesPoster
                bgphoto={
                  series.poster_path
                    ? makeImagePath(series.poster_path, "w500")
                    : NETFLIX_LOGO_URL
                }
              />
            </SeriesContainer>
          ))}
        </Wrapper>
      ) : (
        <h2>There is no result</h2>
      )}
    </>
  );
}

export default SeriesSearch;
