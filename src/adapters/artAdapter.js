import { ART_ARTISTS, ART_CATEGORIES, ART_CATEGORY_COLORS } from '../data/artArtists';

export default {
  id: 'art',
  label: 'Art',
  tagline: 'Before the paint dries.',
  categories: ART_CATEGORIES,
  categoryColors: ART_CATEGORY_COLORS,
  categoryLabel: 'Movement',
  roster: ART_ARTISTS,
  ageDefaultFloor: 70, // roster is curated at 60+; UI defaults to surfacing 70+
  showLocationSearch: false,
};
