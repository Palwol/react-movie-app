import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Movies from "./Routes/Movies";
import Search from "./Routes/Search";
import Series from "./Routes/Series";

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Netflix</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500&family=Noto+Sans+KR&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Header />
        <Routes>
          <Route path="/" element={<Movies />}>
            <Route path="/movies/:movieId" element={<Movies />}></Route>
          </Route>
          <Route path="/series" element={<Series />}>
            <Route path="/series/:tvId" element={<Series />}></Route>
          </Route>
          <Route path="/search" element={<Search />}></Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
