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
    + "&type=artist&limit=10";
  var res = await fetch(url, {
    headers: { "Authorization": "Bearer " + token }
  });
  var data = await res.json();
  var artists = (data && data.artists && data.artists.items) || [];
  if (artists.length === 0) return null;

  var normTarget = artistName.toLowerCase().replace(/^the /, '').trim();

  // Among exact name matches, pick the one with the most followers
  // This ensures we get the real Bob Dylan not a tribute act
  var exactMatches = artists.filter(function(a) {
    return a.name.toLowerCase().replace(/^the /, '').trim() === normTarget;
  });

  if (exactMatches.length > 0) {
    exactMatches.sort(function(a, b) {
      return (b.followers && b.followers.total || 0) - (a.followers && a.followers.total || 0);
    });
    return exactMatches[0];
  }

  // No exact match — return highest follower count result
  artists.sort(function(a, b) {
    return (b.followers && b.followers.total || 0) - (a.followers && a.followers.total || 0);
  });
  return artists[0];
}

async function getTopTracks(token, artistId) {
  // Try with market=US first (required for client credentials flow)
  var markets = ["US", "GB", "AU"];
  for (var i = 0; i < markets.length; i++) {
    var url = "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?market=" + markets[i];
    var res = await fetch(url, {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!res.ok) continue;
    var data = await res.json();
    var tracks = (data && data.tracks) || [];
    if (tracks.length > 0) return tracks;
  }
  return [];
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

    var tracks = topTracks.slice(0, 3).map(function(t) {
      return {
        name: t.name,
        popularity: t.popularity,
        previewUrl: t.preview_url || null,
        spotifyUrl: t.external_urls && t.external_urls.spotify,
        albumName: t.album && t.album.name,
        albumImage: t.album && t.album.images && t.album.images[2] && t.album.images[2].url
      };
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        tracks: tracks,
        genres: artist.genres || [],
        followers: artist.followers && artist.followers.total,
        spotifyUrl: artist.external_urls && artist.external_urls.spotify,
        image: artist.images && artist.images[1] && artist.images[1].url
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
