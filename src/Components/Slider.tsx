import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMovieResult, ISeriesResult } from "../Routes/api";
import { makeImagePath, NETFLIX_LOGO_URL } from "../Routes/utils";
import PlaySvg from "../Svg/PlaySvg";

const SliderContainer = styled.div`
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
  z-index: 10;
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
  display: flex;
  flex-direction: column;
  padding: 5px;
  background-color: black;
  opacity: 0;
  width: 100%;
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

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.innerWidth : window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.innerWidth : -window.innerWidth,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.5,
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

interface SliderProps {
  type: string;
  title: string;
  data?: IMovieResult | ISeriesResult;
}

const offset = 6;

function Slider({ type, title, data }: SliderProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const increase = () => {
    setIsBack(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const total = data.results.length - 1;
      const maxIndex = Math.floor(total / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decrease = () => {
    setIsBack(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const total = data.results.length - 1;
      const maxIndex = Math.floor(total / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (id: number | undefined) => {
    navigate(`/${type}/${id}`);
  };
  return (
    <SliderContainer>
      <SliderTitle>{title}</SliderTitle>
      <RowBtn
        onClick={decrease}
        whileHover={{
          scale: 1.3,
          transition: { type: "tween", duration: 0.1 },
        }}
        style={{ left: 0 }}
      >
        ❮
      </RowBtn>
      <RowBtn
        onClick={increase}
        whileHover={{
          scale: 1.3,
          transition: { type: "tween", duration: 0.1 },
        }}
        style={{ right: 0 }}
      >
        ❯
      </RowBtn>
      <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        custom={isBack}
      >
        <Row
          variants={rowVariants}
          key={index}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          custom={isBack}
        >
          {data?.results
            .slice(offset * index, offset * (index + 1))
            .map((content) => (
              <Box
                variants={boxVariants}
                key={content.id}
                initial="normal"
                whileHover="hover"
                onClick={() => {
                  onBoxClicked(content.id);
                }}
                transition={{ type: "tween" }}
              >
                <CoverImage
                  bgphoto={
                    content.backdrop_path
                      ? makeImagePath(content.backdrop_path, "w500")
                      : NETFLIX_LOGO_URL
                  }
                ></CoverImage>
                <Info variants={infoVariants}>
                  <h4>{content.title || content.name}</h4>
                  <InfoButtons>
                    <PlayBtn>
                      <PlaySvg width="8px" height="8px"></PlaySvg>
                    </PlayBtn>
                  </InfoButtons>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </SliderContainer>
  );
}

export default Slider;
