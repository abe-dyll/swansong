const LASTFM_KEY = "41b73b241f0a7c07e99a475a4343f32a";
const SPOTIFY_CLIENT_ID = "f9957bf2d4af4edfa7e8d05c98983bee";
const SPOTIFY_CLIENT_SECRET = "944ebe751b904913a7e828586b2fd36e";

async function getSpotifyArtistUrl(artistName) {
  try {
    var credentials = Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64");
    var tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Authorization": "Basic " + credentials, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials"
    });
    var tokenData = await tokenRes.json();
    var token = tokenData.access_token;
    if (!token) return null;

    var searchRes = await fetch("https://api.spotify.com/v1/search?q=" + encodeURIComponent(artistName) + "&type=artist&limit=5", {
      headers: { "Authorization": "Bearer " + token }
    });
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
    return null;
  }
}

module.exports = async function handler(req, res) {
  var artistName = req.query.artist;
  if (!artistName) return res.status(400).json({ error: "Missing artist param" });

  try {
    // Last.fm top tracks
    var tracksUrl = "https://ws.audioscrobbler.com/2.0/"
      + "?method=artist.gettoptracks"
      + "&artist=" + encodeURIComponent(artistName)
      + "&api_key=" + LASTFM_KEY
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

    // Spotify artist URL (still works on free tier)
    var spotifyUrl = await getSpotifyArtistUrl(artistName);

    return res.status(200).json({
      tracks: tracks,
      spotifyUrl: spotifyUrl
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
