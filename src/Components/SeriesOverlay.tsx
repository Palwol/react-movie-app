import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSeriesDetails, ISeries } from "../Routes/api";
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
  margin-bottom: 25px;
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
  margin-bottom: 15px;
`;

const Episode = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 30px;
  h3 {
    font-size: 18px;
    font-weight: 500;
  }
`;

const EpisodeDetail = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;

const EpisodeCover = styled.div<{ bgphoto: string }>`
  width: 110px;
  height: 60px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
`;

const EpisodeOverview = styled.div`
  display: flex;
  width: 300px;
  flex-direction: column;
  margin-left: 12px;
  p {
    font-size: 10px;
    font-weight: 100;
    line-height: 0.9rem;
  }
`;
const EpisodeTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  h4 {
    font-size: 12px;
    font-weight: 400;
  }
  span {
    margin-left: 15px;
    font-size: 10px;
    font-weight: 300;
  }
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

function SeriesOverlay() {
  const navigate = useNavigate();
  const bigSeriesMatch = useMatch("/series/:tvId");
  const { scrollY } = useViewportScroll();
  const onOverlayClicked = () => navigate("/series");
  const { data: bigSeries } = useQuery<ISeries>(
    "series",
    () => getSeriesDetails(bigSeriesMatch?.params.tvId),
    { enabled: !!bigSeriesMatch }
  );
  return (
    <AnimatePresence initial={false}>
      {bigSeriesMatch ? (
        <>
          <BigMovie
            variants={bigVariants}
            initial="initial"
            animate="clicked"
            exit="exit"
            style={{ top: scrollY.get() + 70 }}
          >
            {bigSeries && (
              <>
                <ExitBtn onClick={onOverlayClicked}>×</ExitBtn>
                <BigCover
                  bgphoto={
                    bigSeries.backdrop_path
                      ? makeImagePath(bigSeries.backdrop_path, "w500")
                      : NETFLIX_LOGO_URL
                  }
                >
                  <BigTitle>
                    <h3>{bigSeries?.name}</h3>
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
                    <span>{bigSeries?.first_air_date.slice(0, 4)}</span>
                    <h5>Episodes : </h5>
                    <span>{bigSeries?.number_of_episodes}</span>
                  </Info>
                  {bigSeries.tagline ? (
                    <Tagline>{`"${bigSeries?.tagline}"`}</Tagline>
                  ) : null}
                  <p>{bigSeries?.overview}</p>
                </BigOverview>
                <Episode>
                  <h3>Last Episode</h3>
                  <EpisodeDetail>
                    <EpisodeCover
                      bgphoto={
                        bigSeries?.last_episode_to_air?.still_path
                          ? makeImagePath(
                              bigSeries?.last_episode_to_air.still_path,
                              "w500"
                            )
                          : NETFLIX_LOGO_URL
                      }
                    />
                    <EpisodeOverview>
                      <EpisodeTitle>
                        <h4>{bigSeries?.last_episode_to_air?.name}</h4>
                        <span>
                          {bigSeries?.last_episode_to_air?.runtime
                            ? bigSeries?.last_episode_to_air.runtime + "min"
                            : null}
                        </span>
                      </EpisodeTitle>
                      <p>{bigSeries?.last_episode_to_air?.overview}</p>
                    </EpisodeOverview>
                  </EpisodeDetail>
                </Episode>
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
export default SeriesOverlay;
