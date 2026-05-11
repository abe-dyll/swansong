const SPOTIFY_CLIENT_ID = "f9957bf2d4af4edfa7e8d05c98983bee";
const SPOTIFY_CLIENT_SECRET = "944ebe751b904913a7e828586b2fd36e";

async function getSpotifyToken() {
  var credentials = Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64");
  var res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + credentials,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  var data = await res.json();
  return data.access_token;
}

async function searchArtist(token, artistName) {
  var url = "https://api.spotify.com/v1/search"
    + "?q=" + encodeURIComponent(artistName)
    + "&type=artist&limit=5";
  var res = await fetch(url, {
    headers: { "Authorization": "Bearer " + token }
  });
  var data = await res.json();
  var artists = (data && data.artists && data.artists.items) || [];

  // Find best match — exact name match preferred
  var normTarget = artistName.toLowerCase().trim();
  for (var i = 0; i < artists.length; i++) {
    if (artists[i].name.toLowerCase().trim() === normTarget) {
      return artists[i];
    }
  }
  // Fallback: first result with reasonable follower count
  if (artists.length > 0) return artists[0];
  return null;
}

async function getTopTracks(token, artistId) {
  var url = "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?market=US";
  var res = await fetch(url, {
    headers: { "Authorization": "Bearer " + token }
  });
  var data = await res.json();
  return (data && data.tracks) || [];
}

exports.handler = async function(event) {
  var params = event.queryStringParameters || {};
  var artistName = params.artist;

  if (!artistName) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing artist param" }) };
  }

  try {
    var token = await getSpotifyToken();
    var artist = await searchArtist(token, artistName);

    if (!artist) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ tracks: [], genres: [] })
      };
    }

    var topTracks = await getTopTracks(token, artist.id);

    // Return top 3 tracks
    var tracks = topTracks.slice(0, 3).map(function(t) {
      return {
        name: t.name,
        popularity: t.popularity,
        spotifyUrl: t.external_urls && t.external_urls.spotify,
        albumName: t.album && t.album.name,
        albumImage: t.album && t.album.images && t.album.images[2] && t.album.images[2].url
      };
    });

    // Spotify genres are on the artist object
    var genres = artist.genres || [];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        tracks: tracks,
        genres: genres,
        followers: artist.followers && artist.followers.total,
        spotifyUrl: artist.external_urls && artist.external_urls.spotify,
        image: artist.images && artist.images[1] && artist.images[1].url
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
