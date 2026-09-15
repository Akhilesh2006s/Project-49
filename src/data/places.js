/**
 * Where Project 49 builds. Shown on the satellite map.
 *
 * Edit freely: name, one-line note, latitude, longitude. `center` / `zoom`
 * set the opening view; clicking a pin flies in close enough to see houses.
 *
 * `video` (optional): a short aerial/flyover clip (e.g. from Flow) shown in
 * place of the live map when set, e.g. '/places/hyderabad-flyover.mp4'.
 */
export const PLACES = {
  center: [17.425, 78.375],
  zoom: 12.6,
  video: '',
  poster: '',
  pins: [
    { name: 'Jubilee Hills', note: 'The old money hill', lat: 17.4325, lng: 78.4073 },
    { name: 'Banjara Hills', note: 'Rock, shade and quiet lanes', lat: 17.4156, lng: 78.4347 },
    { name: 'Film Nagar', note: 'Between the two hills', lat: 17.4160, lng: 78.4030 },
    { name: 'Manikonda', note: 'Above the lake', lat: 17.4030, lng: 78.3800 },
    { name: 'Gachibowli', note: 'Wide plots, west', lat: 17.4401, lng: 78.3489 },
    { name: 'Nanakramguda', note: 'Financial District', lat: 17.4180, lng: 78.3390 },
    { name: 'Kokapet', note: 'Neopolis', lat: 17.3980, lng: 78.3350 },
    { name: 'Tellapur', note: 'Open land, further west', lat: 17.4680, lng: 78.2780 },
  ],
};

export default PLACES;
