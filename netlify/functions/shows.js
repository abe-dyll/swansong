const TM_KEY = “NVPeiOI6iUQOfiXXxGjRdYPUIBedQmBy”;

exports.handler = async function (event) {
const { artist, state } = event.queryStringParameters || {};

if (!artist) {
return { statusCode: 400, body: JSON.stringify({ error: “Missing artist param” }) };
}

const stateParam = state ? `&stateCode=${state}&countryCode=US` : `&countryCode=US`;
const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(artist)}&classificationName=music&sort=date,asc&size=5${stateParam}&apikey=${TM_KEY}`;

try {
const res = await fetch(url);
const data = await res.json();
const events = data?._embedded?.events || [];

```
const shows = events.map(e => ({
  date:    e.dates?.start?.localDate,
  venue:   e._embedded?.venues?.[0]?.name,
  city:    e._embedded?.venues?.[0]?.city?.name,
  state:   e._embedded?.venues?.[0]?.state?.stateCode,
  country: e._embedded?.venues?.[0]?.country?.name,
  url:     e.url,
}));

return {
  statusCode: 200,
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify(shows),
};
```

} catch (err) {
return {
statusCode: 500,
body: JSON.stringify({ error: err.message }),
};
}
};
