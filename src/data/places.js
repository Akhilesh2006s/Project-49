/**
 * Where Project 49 builds. Shown on the satellite map.
 *
 * Edit freely: name, one-line note, latitude, longitude. `center` / `zoom`
 * set the opening view; clicking a pin flies in close enough to see houses.
 * These six are the outskirts west of the city; swap in the real list when it is final.
 *
 * `video` (optional): a short aerial/flyover clip (e.g. from Flow) shown in
 * place of the live map when set, e.g. '/places/hyderabad-flyover.mp4'.
 */
export const PLACES = {
  center: [17.405, 78.23],
  zoom: 11.2,
  video: '',
  poster: '',
  pins: [
    { name: 'Kokapet', note: 'Beside Neopolis, close to the city', lat: 17.3980, lng: 78.3350 },
    { name: 'Gandipet', note: 'By the Osman Sagar lake', lat: 17.3800, lng: 78.3000 },
    { name: 'Tellapur', note: 'Open land, west', lat: 17.4680, lng: 78.2780 },
    { name: 'Mokila', note: 'Farmland and quiet roads', lat: 17.4230, lng: 78.2300 },
    { name: 'Shankarpally', note: 'Wide plots, further west', lat: 17.4560, lng: 78.1310 },
    { name: 'Moinabad', note: 'Gardens, orchards and big skies', lat: 17.3270, lng: 78.2650 },
  ],
};

export default PLACES;
