export function computeAge(birthYear, deathYear, atDate = new Date()) {
  const endYear = deathYear ?? atDate.getFullYear();
  return endYear - birthYear;
}

export function hasPassed(deathYear) {
  return deathYear != null;
}
