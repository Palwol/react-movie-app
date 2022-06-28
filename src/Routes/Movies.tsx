import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MovieOverlay from "../Components/MovieOverlay";
import Slider from "../Components/Slider";
import DetailSvg from "../Svg/DetailSvg";
import PlaySvg from "../Svg/PlaySvg";
import { getMovies, IMovieResult } from "./api";
import { makeImagePath } from "./utils";

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

const BannerBtns = styled.div`
  display: flex;
`;
const BannerPlay = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 30px;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 5px;
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

const BannerDetails = styled(BannerPlay)`
  background-color: rgba(255, 255, 255, 0.3);
  margin-left: 10px;
  span {
    color: ${(props) => props.theme.white.lighter};
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

function Movies() {
  const navigate = useNavigate();
  const { data: nowData, isLoading } = useQuery<IMovieResult>(
    ["movies", "nowPlaying"],
    () => getMovies("now_playing")
  );
  const { data: upcomingData } = useQuery<IMovieResult>(
    ["movies", "upcoming"],
    () => getMovies("upcoming")
  );
  const { data: topData } = useQuery<IMovieResult>(["movies", "top"], () =>
    getMovies("top_rated")
  );
  const onBoxClicked = (movieId: number | undefined) => {
    navigate(`/movies/${movieId}`);
  };
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
            <BannerBtns>
              <BannerPlay>
                <PlaySvg width="12px" height="12px" />
                <span>Play</span>
              </BannerPlay>
              <BannerDetails
                onClick={() => onBoxClicked(nowData?.results[0].id)}
              >
                <DetailSvg />
                <span>Details</span>
              </BannerDetails>
            </BannerBtns>
          </Banner>
          <Slider key="now" type="movies" title="Now Playing" data={nowData} />
          <Slider
            key="upcoming"
            type="movies"
            title="Upcoming"
            data={upcomingData}
          />
          <Slider key="top" type="movies" title="Top Rated" data={topData} />
          <MovieOverlay />
        </>
      )}
    </Wrapper>
  );
}

export default Movies;
