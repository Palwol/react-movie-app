const API_KEY = "4f3d28dc15785ca96797994efe3972a5";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies(type: string) {
  return fetch(`${BASE_PATH}/movie/${type}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getDetails(id: string | undefined) {
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
