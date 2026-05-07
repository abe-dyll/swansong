const TM_KEY = "NVPeiOI6iUQOfiXXxGjRdYPUIBedQmBy";

exports.handler = async function(event) {
  const params = event.queryStringParameters || {};
  const artist = params.artist;
  const state = params.state;
  const lat = params.lat;
  const lng = params.lng;
  const radius = params.radius || "50";

  if (!artist) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing artist param" })
    };
  }

  let locationParam = "";
  if (lat && lng) {
    locationParam = "&latlong=" + lat + "," + lng + "&radius=" + radius + "&unit=miles";
  } else if (state) {
    locationParam = "&stateCode=" + state + "&countryCode=US";
  } else {
    locationParam = "&countryCode=US";
  }

  const url = "https://app.ticketmaster.com/discovery/v2/events.json"
    + "?keyword=" + encodeURIComponent(artist)
    + "&classificationName=music"
    + "&sort=date,asc"
    + "&size=5"
    + locationParam
    + "&apikey=" + TM_KEY;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const events = (data && data._embedded && data._embedded.events) ? data._embedded.events : [];

    const shows = events.map(function(e) {
      const venue = e._embedded && e._embedded.venues && e._embedded.venues[0];
      const priceRanges = e.priceRanges && e.priceRanges[0];
      let priceLevel = null;
      if (priceRanges && priceRanges.min) {
        const min = priceRanges.min;
        if (min < 40) priceLevel = 1;
        else if (min < 80) priceLevel = 2;
        else if (min < 150) priceLevel = 3;
        else priceLevel = 4;
      }
      return {
        date: e.dates && e.dates.start && e.dates.start.localDate,
        time: e.dates && e.dates.start && e.dates.start.localTime,
        venue: venue && venue.name,
        city: venue && venue.city && venue.city.name,
        state: venue && venue.state && venue.state.stateCode,
        country: venue && venue.country && venue.country.name,
        tour: e.classifications && e.classifications[0] && e.classifications[0].segment && e.classifications[0].segment.name,
        eventName: e.name,
        priceLevel: priceLevel,
        url: e.url
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(shows)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
