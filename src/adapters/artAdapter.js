import { ART_ARTISTS, ART_CATEGORIES, ART_CATEGORY_COLORS } from '../data/artArtists';

export default {
  id: 'art',
  label: 'Art',
  eyebrow: 'For the hands that never stopped',
  headline: 'The masters are still creating.',
  subhead: 'Find where to see the gallery and museum works of the artists who shaped a movement, while they\'re still creating.',
  categories: ART_CATEGORIES,
  categoryColors: ART_CATEGORY_COLORS,
  categoryLabel: 'Movement',
  roster: ART_ARTISTS,
  ageDefaultFloor: 70, // roster is curated at 60+; UI defaults to surfacing 70+
  showLocationSearch: false,
};
