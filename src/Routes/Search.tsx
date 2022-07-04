import { Link, Outlet, useLocation, useMatch } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.ul`
  display: flex;
  justify-content: center;
  margin-top: 80px;
  margin-bottom: 20px;
`;

const Type = styled.li<{ isMatch: boolean }>`
  font-size: 14px;
  margin: 0 40px;
  color: ${(props) =>
    props.isMatch ? "rgba(255, 255, 255, 0.9)" : "rgba(255,255,255,0.6)"};
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

function Search() {
  const location = useLocation();
  const moviesMatch = useMatch("/search/movies");
  const seriesMatch = useMatch("/search/series");
  const keyword = new URLSearchParams(location.search).get("keyword");
  return (
    <>
      <Nav>
        <Type isMatch={moviesMatch ? true : false}>
          <Link to={`movies?keyword=${keyword}`}>Movies</Link>
        </Type>
        <Type isMatch={seriesMatch ? true : false}>
          <Link to={`series?keyword=${keyword}`}>Series</Link>
        </Type>
      </Nav>
      <Outlet />
    </>
  );
}

export default Search;
