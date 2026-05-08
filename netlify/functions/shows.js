const TM_KEY = "NVPeiOI6iUQOfiXXxGjRdYPUIBedQmBy";

function normalize(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\bthe\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function attractionMatches(attractions, artistName) {
  if (!attractions || attractions.length === 0) return false;
  var normArtist = normalize(artistName);
  for (var i = 0; i < attractions.length; i++) {
    var normAttraction = normalize(attractions[i].name || '');
    if (normAttraction === normArtist) return true;
    if (normAttraction.indexOf(normArtist) !== -1) return true;
    if (normArtist.indexOf(normAttraction) !== -1 && normAttraction.length > 4) return true;
  }
  return false;
}

exports.handler = async function(event) {
  var params = event.queryStringParameters || {};
  var artist = params.artist;
  var artistDisplay = params.artistDisplay || artist;
  var tmId = params.tmId; // hardcoded attraction ID if provided
  var lat = params.lat;
  var lng = params.lng;
  var radius = params.radius || "50";

  if (!artist) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing artist param" }) };
  }

  var locationParam = "";
  if (lat && lng) {
    locationParam = "&latlong=" + lat + "," + lng + "&radius=" + radius + "&unit=miles";
  } else {
    locationParam = "&countryCode=US";
  }

  var attractionId = tmId || null;

  // If no hardcoded ID, look up the attraction ID
  if (!attractionId) {
    var attractionUrl = "https://app.ticketmaster.com/discovery/v2/attractions.json"
      + "?keyword=" + encodeURIComponent(artist)
      + "&classificationName=music"
      + "&size=5"
      + "&apikey=" + TM_KEY;

    try {
      var aRes = await fetch(attractionUrl);
      var aData = await aRes.json();
      var attractions = (aData && aData._embedded && aData._embedded.attractions) ? aData._embedded.attractions : [];
      var normArtist = normalize(artistDisplay);

      // Only accept exact name match for attraction ID — no partial matches
      for (var i = 0; i < attractions.length; i++) {
        var normName = normalize(attractions[i].name || '');
        if (normName === normArtist) {
          attractionId = attractions[i].id;
          break;
        }
      }
    } catch (e) {
      // Fall through to keyword search
    }
  }

  // Search events by attraction ID (clean) or keyword (fallback)
  var eventsUrl;
  if (attractionId) {
    eventsUrl = "https://app.ticketmaster.com/discovery/v2/events.json"
      + "?attractionId=" + attractionId
      + "&classificationName=music"
      + "&sort=date,asc"
      + "&size=10"
      + locationParam
      + "&apikey=" + TM_KEY;
  } else {
    eventsUrl = "https://app.ticketmaster.com/discovery/v2/events.json"
      + "?keyword=" + encodeURIComponent(artist)
      + "&classificationName=music"
      + "&sort=date,asc"
      + "&size=15"
      + locationParam
      + "&apikey=" + TM_KEY;
  }

  try {
    var res = await fetch(eventsUrl);
    var data = await res.json();
    var events = (data && data._embedded && data._embedded.events) ? data._embedded.events : [];

    var shows = [];
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      var eventAttractions = e._embedded && e._embedded.attractions;

      // For keyword fallback only: verify attraction matches
      if (!attractionId) {
        if (!attractionMatches(eventAttractions, artistDisplay)) continue;
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
