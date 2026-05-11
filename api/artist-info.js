const LASTFM_KEY = "41b73b241f0a7c07e99a475a4343f32a";

module.exports = async function handler(req, res) {
  var artistName = req.query.artist;

  if (!artistName) {
    return res.status(400).json({ error: "Missing artist param" });
  }

  try {
    var url = "https://ws.audioscrobbler.com/2.0/"
      + "?method=artist.gettoptracks"
      + "&artist=" + encodeURIComponent(artistName)
      + "&api_key=" + LASTFM_KEY
      + "&format=json"
      + "&limit=3";

    var response = await fetch(url);
    var data = await response.json();
    var rawTracks = (data && data.toptracks && data.toptracks.track) || [];

    var tracks = rawTracks.slice(0, 3).map(function(t) {
      var playcount = parseInt(t.playcount || 0);
      var playcountDisplay = playcount >= 1000000
        ? (playcount / 1000000).toFixed(1) + "M"
        : playcount >= 1000
          ? (playcount / 1000).toFixed(0) + "K"
          : String(playcount);

      return {
        name: t.name,
        playcount: playcount,
        playcountDisplay: playcountDisplay,
        url: t.url
      };
    });

    // Also get artist info for image and bio
    var infoUrl = "https://ws.audioscrobbler.com/2.0/"
      + "?method=artist.getinfo"
      + "&artist=" + encodeURIComponent(artistName)
      + "&api_key=" + LASTFM_KEY
      + "&format=json";

    var infoRes = await fetch(infoUrl);
    var infoData = await infoRes.json();
    var artistInfo = infoData && infoData.artist;

    var listeners = artistInfo && artistInfo.stats && artistInfo.stats.listeners;
    var listenersDisplay = null;
    if (listeners) {
      var l = parseInt(listeners);
      listenersDisplay = l >= 1000000
        ? (l / 1000000).toFixed(1) + "M listeners"
        : (l / 1000).toFixed(0) + "K listeners";
    }

    return res.status(200).json({
      tracks: tracks,
      listeners: listenersDisplay,
      lastfmUrl: artistInfo && artistInfo.url
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
