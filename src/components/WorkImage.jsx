function googleImagesUrl(query) {
  return 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(query);
}

export default function WorkImage({ src, alt, searchQuery }) {
  if (src) {
    return (
      <a href={src} target="_blank" rel="noopener noreferrer" className="work-image work-image--thumb">
        <img src={src} alt={alt} loading="lazy" />
      </a>
    );
  }

  return (
    <a
      href={googleImagesUrl(searchQuery)}
      target="_blank"
      rel="noopener noreferrer"
      className="work-image work-image--fallback"
    >
      View image
    </a>
  );
}
