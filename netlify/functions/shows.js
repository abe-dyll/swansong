const TM_KEY = "NVPeiOI6iUQOfiXXxGjRdYPUIBedQmBy";

// Words that indicate a tribute/impersonator show even if artist name is present
var TRIBUTE_WORDS = ["tribute", "starring", "experience", "legacy", "salute", "impersonat", "celebration of", "the music of", "songs of", "piano men"];

function isBadMatch(eventName, artistName) {
  var lower = eventName.toLowerCase();

  // Block if any tribute indicator word is present
  for (var i = 0; i < TRIBUTE_WORDS.length; i++) {
    if (lower.indexOf(TRIBUTE_WORDS[i]) !== -1) return true;
  }

  // Event must contain at least one significant word from the artist name
  var artistWords = artistName.toLowerCase()
    .replace(/^the /, "")
    .split(" ")
    .filter(function(w) { return w.length > 2; });

  for (var j = 0; j < artistWords.length; j++) {
    if (lower.indexOf(artistWords[j]) !== -1) return false;
  }

  // No artist name word found in event title - reject it
  return true;
}

exports.handler = async function(event) {
  var params = event.queryStringParameters || {};
  var artist = params.artist;
  var artistDisplay = params.artistDisplay || artist;
  var state = params.state;
  var lat = params.lat;
  var lng = params.lng;
  var radius = params.radius || "50";

  if (!artist) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing artist param" }) };
  }

  var locationParam = "";
  if (lat && lng) {
    locationParam = "&latlong=" + lat + "," + lng + "&radius=" + radius + "&unit=miles";
  } else if (state) {
    locationParam = "&stateCode=" + state + "&countryCode=US";
  } else {
    locationParam = "&countryCode=US";
  }

  var url = "https://app.ticketmaster.com/discovery/v2/events.json"
    + "?keyword=" + encodeURIComponent(artist)
    + "&classificationName=music"
    + "&sort=date,asc"
    + "&size=15"
    + locationParam
    + "&apikey=" + TM_KEY;

  try {
    var res = await fetch(url);
    var data = await res.json();
    var events = (data && data._embedded && data._embedded.events) ? data._embedded.events : [];

    var shows = [];
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      var eventName = e.name || "";

      if (isBadMatch(eventName, artistDisplay)) continue;

      var venue = e._embedded && e._embedded.venues && e._embedded.venues[0];
      var priceRanges = e.priceRanges && e.priceRanges[0];
      var priceLevel = null;
      if (priceRanges && priceRanges.min) {
        var min = priceRanges.min;
        if (min < 40) priceLevel = 1;
        else if (min < 80) priceLevel = 2;
        else if (min < 150) priceLevel = 3;
        else priceLevel = 4;
      }

      shows.push({
        date: e.dates && e.dates.start && e.dates.start.localDate,
        time: e.dates && e.dates.start && e.dates.start.localTime,
        eventName: eventName,
        venue: venue && venue.name,
        city: venue && venue.city && venue.city.name,
        state: venue && venue.state && venue.state.stateCode,
        country: venue && venue.country && venue.country.name,
        priceLevel: priceLevel,
        url: e.url
      });

      if (shows.length >= 5) break;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(shows)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
