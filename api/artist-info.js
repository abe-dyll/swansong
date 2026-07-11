async function getSpotifyArtistUrl(artistName, clientId, clientSecret) {
  try {
    var credentials = Buffer.from(clientId + ":" + clientSecret).toString("base64");
    var tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Authorization": "Basic " + credentials, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials"
    });
    if (!tokenRes.ok) return null;
    var tokenData = await tokenRes.json();
    var token = tokenData.access_token;
    if (!token) return null;

    var searchRes = await fetch("https://api.spotify.com/v1/search?q=" + encodeURIComponent(artistName) + "&type=artist&limit=5", {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!searchRes.ok) return null;
    var searchData = await searchRes.json();
    var artists = (searchData && searchData.artists && searchData.artists.items) || [];

    // Pick highest follower count exact match
    var normTarget = artistName.toLowerCase().replace(/^the /, '').trim();
    var exactMatches = artists.filter(function(a) {
      return a.name.toLowerCase().replace(/^the /, '').trim() === normTarget;
    });
    var pool = exactMatches.length > 0 ? exactMatches : artists;
    pool.sort(function(a, b) {
      return (b.followers && b.followers.total || 0) - (a.followers && a.followers.total || 0);
    });

    return pool.length > 0 ? (pool[0].external_urls && pool[0].external_urls.spotify) : null;
  } catch (e) {
    console.error("Spotify lookup failed:", e);
    return null;
  }
}

export default async function handler(req, res) {
  var artistName = req.query.artist;
  if (!artistName || typeof artistName !== "string" || artistName.length > 200) {
    return res.status(400).json({ error: "Missing or invalid artist param" });
  }

  var lastfmKey = process.env.LASTFM_API_KEY;
  var spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
  var spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!lastfmKey || !spotifyClientId || !spotifyClientSecret) {
    console.error("artist-info: missing required environment variables");
    return res.status(500).json({ error: "Server is not configured correctly" });
  }

  try {
    var tracksUrl = "https://ws.audioscrobbler.com/2.0/"
      + "?method=artist.gettoptracks"
      + "&artist=" + encodeURIComponent(artistName)
      + "&api_key=" + lastfmKey
      + "&format=json&limit=3&autocorrect=1";

    var tracksRes = await fetch(tracksUrl);
    var tracksData = await tracksRes.json();
    var rawTracks = (tracksData && tracksData.toptracks && tracksData.toptracks.track) || [];

    var tracks = rawTracks.slice(0, 3).map(function(t) {
      return {
        name: t.name,
        playcount: parseInt(t.playcount || 0)
      };
    });

    var spotifyUrl = await getSpotifyArtistUrl(artistName, spotifyClientId, spotifyClientSecret);

    return res.status(200).json({
      tracks: tracks,
      spotifyUrl: spotifyUrl
    });
  } catch (err) {
    console.error("artist-info failed for", artistName, err);
    return res.status(502).json({ error: "Failed to fetch artist info" });
  }
}
