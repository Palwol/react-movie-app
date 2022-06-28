export function makeImagePath(id: string | undefined, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export const NETFLIX_LOGO_URL =
  "https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";

export interface ISvg {
  width: string;
  height: string;
}
