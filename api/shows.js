const TM_KEY = "NVPeiOI6iUQOfiXXxGjRdYPUIBedQmBy";

function normalize(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\bthe\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function eventHasArtist(eventAttractions, artistName) {
  if (!eventAttractions || eventAttractions.length === 0) return false;
  var normArtist = normalize(artistName);
  for (var i = 0; i < eventAttractions.length; i++) {
    var normAttraction = normalize(eventAttractions[i].name || '');
    if (normAttraction === normArtist) return true;
  }
  return false;
}

export default async function handler(req, res) {
  var params = req.query || {};
  var artist = params.artist;
  var artistDisplay = params.artistDisplay || artist;
  var tmId = params.tmId;
  var lat = params.lat;
  var lng = params.lng;
  var radius = params.radius || "50";

  if (!artist) {
    return res.status(400).json({ error: "Missing artist param" });
  }

  var locationParam = lat && lng
    ? "&latlong=" + lat + "," + lng + "&radius=" + radius + "&unit=miles"
    : "&countryCode=US";

  var attractionId = tmId || null;

  if (!attractionId) {
    try {
      var aUrl = "https://app.ticketmaster.com/discovery/v2/attractions.json"
        + "?keyword=" + encodeURIComponent(artist)
        + "&classificationName=music&size=10&apikey=" + TM_KEY;
      var aRes = await fetch(aUrl);
      var aData = await aRes.json();
      var attractions = (aData && aData._embedded && aData._embedded.attractions) || [];
      var normArtist = normalize(artistDisplay);

      var exactMatches = attractions.filter(function(a) {
        return normalize(a.name || '') === normArtist;
      });

      if (exactMatches.length === 1) {
        attractionId = exactMatches[0].id;
      } else if (exactMatches.length > 1) {
        exactMatches.sort(function(a, b) {
          var aCount = (a.upcomingEvents && a.upcomingEvents._total) || 0;
          var bCount = (b.upcomingEvents && b.upcomingEvents._total) || 0;
          return bCount - aCount;
        });
        attractionId = exactMatches[0].id;
      }
    } catch (e) {}
  }

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
    var evRes = await fetch(eventsUrl);
    var data = await evRes.json();
    var events = (data && data._embedded && data._embedded.events) || [];

    var shows = [];
    for (var i = 0; i < events.length; i++) {
      var e = events[i];

      if (!attractionId) {
        var eventAttractions = e._embedded && e._embedded.attractions;
        if (!eventHasArtist(eventAttractions, artistDisplay)) continue;
      }

      var venue = e._embedded && e._embedded.venues && e._embedded.venues[0];

      shows.push({
        date: e.dates && e.dates.start && e.dates.start.localDate,
        time: e.dates && e.dates.start && e.dates.start.localTime,
        eventName: e.name || "",
        venue: venue && venue.name,
        city: venue && venue.city && venue.city.name,
        state: venue && venue.state && venue.state.stateCode,
        country: venue && venue.country && venue.country.name,
        url: e.url
      });

      if (shows.length >= 5) break;
    }

    return res.status(200).json(shows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
