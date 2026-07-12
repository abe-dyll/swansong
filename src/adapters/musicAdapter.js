import { ARTISTS, GENRES, GENRE_COLORS } from '../data/artists';

export default {
  id: 'music',
  label: 'Music',
  eyebrow: 'For the acts who never stopped',
  headline: 'The legends are still touring.',
  subhead: 'Track tour dates from the legends who make up your favorite playlists before their final curtain call.',
  categories: GENRES,
  categoryColors: GENRE_COLORS,
  categoryLabel: 'Genre',
  roster: ARTISTS,
  ageDefaultFloor: null, // no age floor — the Music roster is already curated to only include what should be shown
  showLocationSearch: true,
};
