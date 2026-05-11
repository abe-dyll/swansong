const TM_KEY = "NVPeiOI6iUQOfiXXxGjRdYPUIBedQmBy";

function normalize(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\bthe\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Returns true if the event's attractions contain an exact match for our artist
function eventHasArtist(eventAttractions, artistName) {
  if (!eventAttractions || eventAttractions.length === 0) return false;
  var normArtist = normalize(artistName);
  for (var i = 0; i < eventAttractions.length; i++) {
    var normAttraction = normalize(eventAttractions[i].name || '');
    if (normAttraction === normArtist) return true;
  }
  return false;
}

exports.handler = async function(event) {
  var params = event.queryStringParameters || {};
  var artist = params.artist;
  var artistDisplay = params.artistDisplay || artist;
  var tmId = params.tmId;
  var lat = params.lat;
  var lng = params.lng;
  var radius = params.radius || "50";

  if (!artist) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing artist param" }) };
  }

  var locationParam = lat && lng
    ? "&latlong=" + lat + "," + lng + "&radius=" + radius + "&unit=miles"
    : "&countryCode=US";

  var attractionId = tmId || null;

  // Step 1: Look up attraction ID if not hardcoded
  if (!attractionId) {
    try {
      var aUrl = "https://app.ticketmaster.com/discovery/v2/attractions.json"
        + "?keyword=" + encodeURIComponent(artist)
        + "&classificationName=music&size=10&apikey=" + TM_KEY;
      var aRes = await fetch(aUrl);
      var aData = await aRes.json();
      var attractions = (aData && aData._embedded && aData._embedded.attractions) || [];
      var normArtist = normalize(artistDisplay);

      // Strict: only accept if normalized attraction name is an exact match
      for (var i = 0; i < attractions.length; i++) {
        if (normalize(attractions[i].name || '') === normArtist) {
          attractionId = attractions[i].id;
          break;
        }
      }
    } catch (e) {}
  }

  // Step 2: Fetch events
  var eventsUrl = attractionId
    ? "https://app.ticketmaster.com/discovery/v2/events.json"
        + "?attractionId=" + attractionId
        + "&classificationName=music&sort=date,asc&size=10"
        + locationParam + "&apikey=" + TM_KEY
    : "https://app.ticketmaster.com/discovery/v2/events.json"
        + "?keyword=" + encodeURIComponent(artist)
        + "&classificationName=music&sort=date,asc&size=20"
        + locationParam + "&apikey=" + TM_KEY;

  try {
    var res = await fetch(eventsUrl);
    var data = await res.json();
    var events = (data && data._embedded && data._embedded.events) || [];

    var shows = [];
    for (var i = 0; i < events.length; i++) {
      var e = events[i];

      // When using attraction ID search, results are already clean
      // When falling back to keyword, enforce strict attraction name match
      if (!attractionId) {
        var eventAttractions = e._embedded && e._embedded.attractions;
        if (!eventHasArtist(eventAttractions, artistDisplay)) continue;
      }

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
        eventName: e.name || "",
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
