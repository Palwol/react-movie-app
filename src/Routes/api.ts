const API_KEY = "4f3d28dc15785ca96797994efe3972a5";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  name?: string;
  overview: string;
  tagline: string;
  runtime: number;
  release_date: string;
}

export interface IMovieResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ISeries {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name: string;
  overview: string;
  tagline: string;
  number_of_episodes: number;
  first_air_date: string;
  last_episode_to_air: {
    name: string;
    overview: string;
    runtime: number;
    still_path: string;
  };
}
export interface ISeriesResult {
  page: number;
  results: ISeries[];
  total_pages: number;
  total_results: number;
}

export function getMovies(type: string) {
  return fetch(`${BASE_PATH}/movie/${type}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getMovieDetails(id: string | undefined) {
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getSeries(type: string) {
  return fetch(`${BASE_PATH}/tv/${type}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getSeriesDetails(id: string | undefined) {
  return fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
