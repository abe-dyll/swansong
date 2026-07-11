import { ARTISTS, GENRES, GENRE_COLORS } from '../data/artists';

export default {
  id: 'music',
  label: 'Music',
  tagline: 'See them while you still can.',
  categories: GENRES,
  categoryColors: GENRE_COLORS,
  categoryLabel: 'Genre',
  roster: ARTISTS,
  ageDefaultFloor: null, // no age floor — the Music roster is already curated to only include what should be shown
  showLocationSearch: true,
};
