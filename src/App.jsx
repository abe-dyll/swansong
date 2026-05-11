import React, { useState, useEffect } from 'react';

const ARTISTS = [
  { name: 'The Rolling Stones', genre: 'Rock', tmName: 'Rolling Stones',
    members: [{ name: 'Mick Jagger', age: 81 }, { name: 'Keith Richards', age: 80 }, { name: 'Ronnie Wood', age: 77 }],
    songs: ['(I Can\'t Get No) Satisfaction', 'Paint It Black', 'Gimme Shelter'] },
  { name: 'The Eagles', genre: 'Rock', tmName: 'Eagles',
    members: [{ name: 'Don Henley', age: 77 }, { name: 'Joe Walsh', age: 77 }, { name: 'Timothy B. Schmit', age: 77 }],
    songs: ['Hotel California', 'Take It Easy', 'Desperado'] },
  { name: 'The Who', genre: 'Rock', tmName: 'The Who',
    members: [{ name: 'Roger Daltrey', age: 80 }, { name: 'Pete Townshend', age: 79 }],
    songs: ['Baba O\'Riley', 'Won\'t Get Fooled Again', 'My Generation'] },
  { name: 'Bob Dylan', genre: 'Rock', tmName: 'Bob Dylan',
    members: [{ name: 'Bob Dylan', age: 83 }],
    songs: ['Blowin\' in the Wind', 'Like a Rolling Stone', 'The Times They Are A-Changin\''] },
  { name: 'Paul McCartney', genre: 'Rock', tmName: 'Paul McCartney',
    members: [{ name: 'Paul McCartney', age: 82 }],
    songs: ['Hey Jude', 'Let It Be', 'Yesterday'] },
  { name: 'Ringo Starr', genre: 'Rock', tmName: 'Ringo Starr',
    members: [{ name: 'Ringo Starr', age: 84 }],
    songs: ['It Don\'t Come Easy', 'Photograph', 'You\'re Sixteen'] },
  { name: 'Paul Simon', genre: 'Rock', tmName: 'Paul Simon',
    members: [{ name: 'Paul Simon', age: 83 }],
    songs: ['The Sound of Silence', 'Mrs. Robinson', 'Bridge Over Troubled Water'] },
  { name: 'Neil Young', genre: 'Rock', tmName: 'Neil Young',
    members: [{ name: 'Neil Young', age: 79 }],
    songs: ['Heart of Gold', 'Rockin\' in the Free World', 'Old Man'] },
  { name: 'Bruce Springsteen', genre: 'Rock', tmName: 'Bruce Springsteen',
    members: [{ name: 'Bruce Springsteen', age: 75 }],
    songs: ['Born to Run', 'Born in the U.S.A.', 'Thunder Road'] },
  { name: 'Billy Joel', genre: 'Rock', tmName: 'Billy Joel',
    members: [{ name: 'Billy Joel', age: 76 }],
    songs: ['Piano Man', 'It\'s Still Rock and Roll to Me', 'We Didn\'t Start the Fire'] },
  { name: 'Elton John', genre: 'Rock', tmName: 'Elton John',
    members: [{ name: 'Elton John', age: 77 }],
    songs: ['Rocket Man', 'Tiny Dancer', 'Crocodile Rock'] },
  { name: 'Eric Clapton', genre: 'Rock', tmName: 'Eric Clapton',
    members: [{ name: 'Eric Clapton', age: 80 }],
    songs: ['Layla', 'Tears in Heaven', 'Wonderful Tonight'] },
  { name: 'Rod Stewart', genre: 'Rock', tmName: 'Rod Stewart',
    members: [{ name: 'Rod Stewart', age: 80 }],
    songs: ['Maggie May', 'Do Ya Think I\'m Sexy?', 'Have I Told You Lately'] },
  { name: 'Sting', genre: 'Rock', tmName: 'Sting',
    members: [{ name: 'Sting', age: 73 }],
    songs: ['Every Breath You Take', 'Roxanne', 'Fields of Gold'] },
  { name: 'Van Morrison', genre: 'Rock', tmName: 'Van Morrison',
    members: [{ name: 'Van Morrison', age: 79 }],
    songs: ['Brown Eyed Girl', 'Moondance', 'Into the Mystic'] },
  { name: 'James Taylor', genre: 'Rock', tmName: 'James Taylor',
    members: [{ name: 'James Taylor', age: 76 }],
    songs: ['Fire and Rain', 'You\'ve Got a Friend', 'Carolina in My Mind'] },
  { name: 'Jackson Browne', genre: 'Rock', tmName: 'Jackson Browne',
    members: [{ name: 'Jackson Browne', age: 76 }],
    songs: ['Running on Empty', 'Doctor My Eyes', 'The Pretender'] },
  { name: 'Aerosmith', genre: 'Rock', tmName: 'Aerosmith',
    members: [{ name: 'Steven Tyler', age: 76 }, { name: 'Joe Perry', age: 74 }],
    songs: ['Dream On', 'Walk This Way', 'I Don\'t Want to Miss a Thing'] },
  { name: 'Alice Cooper', genre: 'Rock', tmName: 'Alice Cooper',
    members: [{ name: 'Alice Cooper', age: 77 }],
    songs: ['School\'s Out', 'Poison', 'No More Mr. Nice Guy'] },
  { name: 'Carole King', genre: 'Rock', tmName: 'Carole King',
    members: [{ name: 'Carole King', age: 83 }],
    songs: ['I Feel the Earth Move', 'You\'ve Got a Friend', 'It\'s Too Late'] },
  { name: 'Bonnie Raitt', genre: 'Rock', tmName: 'Bonnie Raitt',
    members: [{ name: 'Bonnie Raitt', age: 75 }],
    songs: ['Something to Talk About', 'I Can\'t Make You Love Me', 'Nick of Time'] },
  { name: 'Iggy Pop', genre: 'Rock', tmName: 'Iggy Pop',
    members: [{ name: 'Iggy Pop', age: 77 }],
    songs: ['Lust for Life', 'The Passenger', 'I Wanna Be Your Dog'] },
  { name: 'Willie Nelson', genre: 'Country', tmName: 'Willie Nelson',
    members: [{ name: 'Willie Nelson', age: 92 }],
    songs: ['On the Road Again', 'Always on My Mind', 'Crazy'] },
  { name: 'Dolly Parton', genre: 'Country', tmName: 'Dolly Parton',
    members: [{ name: 'Dolly Parton', age: 79 }],
    songs: ['Jolene', 'I Will Always Love You', '9 to 5'] },
  { name: 'Emmylou Harris', genre: 'Country', tmName: 'Emmylou Harris',
    members: [{ name: 'Emmylou Harris', age: 77 }],
    songs: ['Boulder to Birmingham', 'Making Believe', 'To Daddy'] },
  { name: 'Crystal Gayle', genre: 'Country', tmName: 'Crystal Gayle',
    members: [{ name: 'Crystal Gayle', age: 73 }],
    songs: ['Don\'t It Make My Brown Eyes Blue', 'Talking in Your Sleep', 'Ready for the Times to Get Better'] },
  { name: 'Herbie Hancock', genre: 'Jazz', tmName: 'Herbie Hancock',
    members: [{ name: 'Herbie Hancock', age: 85 }],
    songs: ['Cantaloupe Island', 'Watermelon Man', 'Rockit'] },
  { name: 'Pat Metheny', genre: 'Jazz', tmName: 'Pat Metheny',
    members: [{ name: 'Pat Metheny', age: 70 }],
    songs: ['Last Train Home', 'Phase Dance', 'Are You Going with Me?'] },
  { name: 'Ron Carter', genre: 'Jazz', tmName: 'Ron Carter',
    members: [{ name: 'Ron Carter', age: 87 }],
    songs: ['Little Waltz', 'All Blues', 'Seven Steps to Heaven'] },
  { name: 'Buddy Guy', genre: 'Jazz', tmName: 'Buddy Guy',
    members: [{ name: 'Buddy Guy', age: 88 }],
    songs: ['Damn Right I\'ve Got the Blues', 'Stone Crazy', 'First Time I Met the Blues'] },
  { name: 'Stevie Wonder', genre: 'Soul/R&B', tmName: 'Stevie Wonder',
    members: [{ name: 'Stevie Wonder', age: 75 }],
    songs: ['Superstition', 'Sir Duke', 'Isn\'t She Lovely'] },
  { name: 'Diana Ross', genre: 'Soul/R&B', tmName: 'Diana Ross',
    members: [{ name: 'Diana Ross', age: 81 }],
    songs: ['Ain\'t No Mountain High Enough', 'Endless Love', 'I\'m Coming Out'] },
  { name: 'Smokey Robinson', genre: 'Soul/R&B', tmName: 'Smokey Robinson',
    members: [{ name: 'Smokey Robinson', age: 85 }],
    songs: ['Tears of a Clown', 'Cruisin\'', 'Being with You'] },
  { name: 'Gladys Knight', genre: 'Soul/R&B', tmName: 'Gladys Knight',
    members: [{ name: 'Gladys Knight', age: 80 }],
    songs: ['Midnight Train to Georgia', 'I Heard It Through the Grapevine', 'Neither One of Us'] },
  { name: 'Al Green', genre: 'Soul/R&B', tmName: 'Al Green',
    members: [{ name: 'Al Green', age: 79 }],
    songs: ['Let\'s Stay Together', 'Tired of Being Alone', 'How Can You Mend a Broken Heart'] },
  { name: 'Patti LaBelle', genre: 'Soul/R&B', tmName: 'Patti LaBelle',
    members: [{ name: 'Patti LaBelle', age: 80 }],
    songs: ['Lady Marmalade', 'If You Asked Me To', 'New Attitude'] },
  { name: 'Lionel Richie', genre: 'Soul/R&B', tmName: 'Lionel Richie',
    members: [{ name: 'Lionel Richie', age: 76 }],
    songs: ['All Night Long', 'Hello', 'Dancing on the Ceiling'] },
  { name: 'Dionne Warwick', genre: 'Soul/R&B', tmName: 'Dionne Warwick',
    members: [{ name: 'Dionne Warwick', age: 84 }],
    songs: ['Walk On By', 'What the World Needs Now Is Love', 'That\'s What Friends Are For'] },
  { name: 'Mavis Staples', genre: 'Soul/R&B', tmName: 'Mavis Staples',
    members: [{ name: 'Mavis Staples', age: 85 }],
    songs: ['I\'ll Take You There', 'Respect Yourself', 'Let\'s Do It Again'] },
  { name: 'Chaka Khan', genre: 'Soul/R&B', tmName: 'Chaka Khan',
    members: [{ name: 'Chaka Khan', age: 72 }],
    songs: ['I Feel for You', 'Ain\'t Nobody', 'Tell Me Something Good'] },
  { name: 'Cher', genre: 'Pop', tmName: 'Cher',
    members: [{ name: 'Cher', age: 79 }],
    songs: ['Believe', 'If I Could Turn Back Time', 'I Got You Babe'] },
  { name: 'Barry Manilow', genre: 'Pop', tmName: 'Barry Manilow',
    members: [{ name: 'Barry Manilow', age: 81 }],
    songs: ['Mandy', 'Copacabana', 'I Write the Songs'] },
  { name: 'Tom Jones', genre: 'Pop', tmName: 'Tom Jones',
    members: [{ name: 'Tom Jones', age: 85 }],
    songs: ['It\'s Not Unusual', 'What\'s New Pussycat?', 'Delilah'] },
  { name: 'Engelbert Humperdinck', genre: 'Pop', tmName: 'Engelbert Humperdinck',
    members: [{ name: 'Engelbert Humperdinck', age: 88 }],
    songs: ['Release Me', 'After the Lovin\'', 'Am I That Easy to Forget'] },

  // ── ROCK additions ──
  { name: 'Ozzy Osbourne', genre: 'Rock', tmName: 'Ozzy Osbourne',
    members: [{ name: 'Ozzy Osbourne', age: 76 }],
    songs: ['Crazy Train', 'Mr. Crowley', 'Paranoid'] },
  { name: 'Robert Plant', genre: 'Rock', tmName: 'Robert Plant',
    members: [{ name: 'Robert Plant', age: 76 }],
    songs: ['Whole Lotta Love', 'Stairway to Heaven', 'Kashmir'] },
  { name: 'Graham Nash', genre: 'Rock', tmName: 'Graham Nash',
    members: [{ name: 'Graham Nash', age: 83 }],
    songs: ['Teach Your Children', 'Our House', 'Just a Song Before I Go'] },
  { name: 'Todd Rundgren', genre: 'Rock', tmName: 'Todd Rundgren',
    members: [{ name: 'Todd Rundgren', age: 76 }],
    songs: ['Hello It\'s Me', 'I Saw the Light', 'Bang the Drum All Day'] },
  { name: 'Steve Miller', genre: 'Rock', tmName: 'Steve Miller Band',
    members: [{ name: 'Steve Miller', age: 81 }],
    songs: ['The Joker', 'Fly Like an Eagle', 'Rock\'n Me'] },
  { name: 'Peter Frampton', genre: 'Rock', tmName: 'Peter Frampton',
    members: [{ name: 'Peter Frampton', age: 75 }],
    songs: ['Show Me the Way', 'Baby I Love Your Way', 'Do You Feel Like We Do'] },
  { name: 'Don McLean', genre: 'Rock', tmName: 'Don McLean',
    members: [{ name: 'Don McLean', age: 79 }],
    songs: ['American Pie', 'Vincent', 'Crying'] },
  { name: 'Steely Dan', genre: 'Rock', tmName: 'Steely Dan',
    members: [{ name: 'Donald Fagen', age: 76 }],
    songs: ['Reelin\' in the Years', 'Rikki Don\'t Lose That Number', 'Deacon Blues'] },
  { name: 'Heart', genre: 'Rock', tmName: 'Heart',
    members: [{ name: 'Ann Wilson', age: 74 }, { name: 'Nancy Wilson', age: 70 }],
    songs: ['Crazy on You', 'Barracuda', 'Magic Man'] },
  { name: 'Pat Benatar', genre: 'Rock', tmName: 'Pat Benatar',
    members: [{ name: 'Pat Benatar', age: 72 }, { name: 'Neil Giraldo', age: 70 }],
    songs: ['Hit Me with Your Best Shot', 'Love is a Battlefield', 'Heartbreaker'] },
  { name: 'Foreigner', genre: 'Rock', tmName: 'Foreigner',
    members: [{ name: 'Mick Jones', age: 79 }],
    songs: ['I Want to Know What Love Is', 'Cold as Ice', 'Hot Blooded'] },
  { name: 'Journey', genre: 'Rock', tmName: 'Journey',
    members: [{ name: 'Neal Schon', age: 71 }, { name: 'Jonathan Cain', age: 73 }],
    songs: ['Don\'t Stop Believin\'', 'Open Arms', 'Faithfully'] },
  { name: 'Fleetwood Mac', genre: 'Rock', tmName: 'Fleetwood Mac',
    members: [{ name: 'Mick Fleetwood', age: 77 }, { name: 'John McVie', age: 79 }, { name: 'Stevie Nicks', age: 76 }],
    songs: ['Go Your Own Way', 'The Chain', 'Dreams'] },
  { name: 'Stevie Nicks', genre: 'Rock', tmName: 'Stevie Nicks',
    members: [{ name: 'Stevie Nicks', age: 76 }],
    songs: ['Edge of Seventeen', 'Stand Back', 'Stop Draggin\' My Heart Around'] },
  { name: 'Cyndi Lauper', genre: 'Rock', tmName: 'Cyndi Lauper',
    members: [{ name: 'Cyndi Lauper', age: 71 }],
    songs: ['Girls Just Want to Have Fun', 'Time After Time', 'True Colors'] },
  { name: 'Bryan Adams', genre: 'Rock', tmName: 'Bryan Adams',
    members: [{ name: 'Bryan Adams', age: 65 }],
    songs: ['Summer of \'69', 'Run to You', 'Everything I Do'] },
  { name: 'John Mellencamp', genre: 'Rock', tmName: 'John Mellencamp',
    members: [{ name: 'John Mellencamp', age: 73 }],
    songs: ['Jack & Diane', 'Hurts So Good', 'Pink Houses'] },
  { name: 'Tom Waits', genre: 'Rock', tmName: 'Tom Waits',
    members: [{ name: 'Tom Waits', age: 75 }],
    songs: ['Jersey Girl', 'Downtown Train', 'Tom Traubert\'s Blues'] },

  // ── COUNTRY additions ──

  // ── SOUL / R&B additions ──
  { name: 'Earth Wind & Fire', genre: 'Soul/R&B', tmName: 'Earth Wind and Fire',
    members: [{ name: 'Philip Bailey', age: 73 }, { name: 'Ralph Johnson', age: 75 }],
    songs: ['September', 'Shining Star', 'Boogie Wonderland'] },
  { name: 'The Isley Brothers', genre: 'Soul/R&B', tmName: 'Isley Brothers',
    members: [{ name: 'Ronald Isley', age: 82 }, { name: 'Ernie Isley', age: 72 }],
    songs: ['Shout', 'It\'s Your Thing', 'Who\'s That Lady'] },
  { name: 'Four Tops', genre: 'Soul/R&B', tmName: 'Four Tops',
    members: [{ name: 'Duke Fakir', age: 88 }],
    songs: ['I Can\'t Help Myself', 'Reach Out I\'ll Be There', 'Bernadette'] },
  { name: 'The Temptations', genre: 'Soul/R&B', tmName: 'The Temptations',
    members: [{ name: 'Otis Williams', age: 82 }],
    songs: ['My Girl', 'Papa Was a Rollin\' Stone', 'Just My Imagination'] },

  // ── POP additions ──
  { name: 'Julio Iglesias', genre: 'Pop', tmName: 'Julio Iglesias',
    members: [{ name: 'Julio Iglesias', age: 81 }],
    songs: ['To All the Girls I\'ve Loved Before', 'Hey', 'Begin the Beguine'] },
  { name: 'Wayne Newton', genre: 'Pop', tmName: 'Wayne Newton',
    members: [{ name: 'Wayne Newton', age: 83 }],
    songs: ['Danke Schoen', 'Red Roses for a Blue Lady', 'Daddy Don\'t You Walk So Fast'] },
];

const GENRES = ['Rock', 'Country', 'Jazz', 'Soul/R&B', 'Pop'];
const RADIUS_OPTIONS = [25, 50, 100, 250];
const GENRE_COLORS = {
  'Rock': '#c0392b', 'Country': '#8B6914', 'Jazz': '#1a5276', 'Soul/R&B': '#6c3483', 'Pop': '#1a7a4a'
};

function ageColor(age) {
  if (age >= 80) return '#b03a2e';
  if (age >= 72) return '#9a7d0a';
  return '#1e8449';
}

var fetchCache = {};
var spotifyCache = {};

async function fetchSpotifyInfo(artistName) {
  if (spotifyCache[artistName] !== undefined) return spotifyCache[artistName];
  try {
    var res = await fetch('/api/artist-info?artist=' + encodeURIComponent(artistName));
    if (!res.ok) throw new Error(res.status);
    var data = await res.json();
    spotifyCache[artistName] = data;
    return data;
  } catch (err) {
    spotifyCache[artistName] = null;
    return null;
  }
}

function buildUrl(tmName, displayName, tmId, opts) {
  var params = 'artist=' + encodeURIComponent(tmName) + '&artistDisplay=' + encodeURIComponent(displayName);
  if (tmId) params += '&tmId=' + encodeURIComponent(tmId);
  if (opts && opts.lat && opts.lng) {
    params += '&lat=' + opts.lat + '&lng=' + opts.lng + '&radius=' + (opts.radius || 50);
  }
  return '/api/shows?' + params;
}

async function fetchShows(tmName, displayName, tmId, opts) {
  var key = tmName + '__' + (tmId || '') + '__' + (opts ? (opts.lat + ',' + opts.lng + ',' + opts.radius) : 'world');
  if (fetchCache[key] !== undefined) return fetchCache[key];
  try {
    var res = await fetch(buildUrl(tmName, displayName, tmId, opts));
    if (!res.ok) throw new Error(res.status);
    var data = await res.json();
    var shows = Array.isArray(data) ? data : [];
    fetchCache[key] = shows;
    return shows;
  } catch (err) {
    fetchCache[key] = [];
    return [];
  }
}

async function geocodeZip(zip) {
  try {
    var res = await fetch('https://api.zippopotam.us/us/' + zip);
    if (!res.ok) return null;
    var data = await res.json();
    if (data && data.places && data.places[0]) {
      return {
        lat: parseFloat(data.places[0]['latitude']),
        lng: parseFloat(data.places[0]['longitude']),
        city: data.places[0]['place name'],
        state: data.places[0]['state abbreviation']
      };
    }
    return null;
  } catch (e) { return null; }
}



function TrackRow(props) {
  var track = props.track;
  var ac = props.ac;
  return React.createElement('a', {
    href: track.url, target: '_blank', rel: 'noopener noreferrer',
    style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7,
      textDecoration: 'none', padding: '8px 12px', borderRadius: 8,
      background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(139,105,20,0.1)',
      transition: 'all 0.15s' },
    onMouseEnter: function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.borderColor = '#d4243a'; },
    onMouseLeave: function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(139,105,20,0.1)'; }
  },
    React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: '#d4243a', style: { flexShrink: 0 } },
      React.createElement('path', { d: 'M10.584 17.21l-.88-2.392s-1.43 1.596-3.573 1.596c-1.897 0-3.244-1.652-3.244-4.297 0-3.381 1.704-4.596 3.381-4.596 2.418 0 3.188 1.566 3.849 3.574l.88 2.392c.88 2.64 2.528 4.76 7.287 4.76 3.409 0 5.74-1.047 5.74-3.793 0-2.22-1.267-3.37-3.629-3.921l-1.76-.385c-1.213-.275-1.567-.77-1.567-1.595 0-.935.742-1.485 1.954-1.485 1.32 0 2.033.495 2.143 1.677l2.75-.33C23.64 6.33 22.15 5 19.317 5c-2.584 0-4.814 1.1-4.814 3.959 0 1.876.99 3.079 3.464 3.684l1.87.44c1.374.33 1.594.88 1.594 1.705 0 1.017-.99 1.43-2.97 1.43-2.859 0-4.05-1.54-4.73-3.63l-.88-2.42C12.267 7.19 10.55 5 6.473 5 2.2 5 0 7.89 0 12.227 0 16.4 2.09 19 6.308 19c3.354 0 4.276-1.79 4.276-1.79z' })
    ),
    React.createElement('div', { style: { flex: 1, minWidth: 0 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#2c1810',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, track.name)
    ),
    track.playcountDisplay && React.createElement('div', { style: { flexShrink: 0, textAlign: 'right' } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: '#8B6914' } }, track.playcountDisplay),
      React.createElement('div', { style: { fontSize: 8, color: '#b08a50', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 1 } }, 'plays')
    )
  );
}


function ShowCard(props) {
  var show = props.show;
  var dateStr = show.date
    ? new Date(show.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date TBA';
  var location = [show.city, show.state].filter(Boolean).join(', ');
  if (!show.state && show.country && show.country !== 'United States Of America') {
    location = [show.city, show.country].filter(Boolean).join(', ');
  }

  return React.createElement('a', {
    href: show.url, target: '_blank', rel: 'noopener noreferrer',
    style: { display: 'block', textDecoration: 'none', padding: '13px 15px', borderRadius: 10,
      background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(139,105,20,0.18)',
      marginBottom: 8, transition: 'all 0.15s' },
    onMouseEnter: function(e) {
      e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
      e.currentTarget.style.borderColor = '#8B6914';
      e.currentTarget.style.boxShadow = '0 3px 14px rgba(139,105,20,0.18)';
    },
    onMouseLeave: function(e) {
      e.currentTarget.style.background = 'rgba(255,255,255,0.65)';
      e.currentTarget.style.borderColor = 'rgba(139,105,20,0.18)';
      e.currentTarget.style.boxShadow = 'none';
    }
  },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 } },
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },

        // Concert name — prominent at top
        React.createElement('div', { style: { fontSize: 14, fontWeight: 700, color: '#2c1810',
          fontFamily: 'Playfair Display, serif', marginBottom: 5, lineHeight: 1.3 } }, show.eventName),

        // Date
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#8B6914', marginBottom: 3 } }, dateStr),

        // City, State
        React.createElement('div', { style: { fontSize: 13, color: '#5a3d28', fontWeight: 500, marginBottom: 2 } }, location),

        // Venue
        React.createElement('div', { style: { fontSize: 12, color: '#9a7d5a',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, show.venue)
      ),
      React.createElement('div', { style: { flexShrink: 0, paddingTop: 2 } },
        React.createElement('div', { style: { fontSize: 10, color: '#fff', background: '#8B6914',
          borderRadius: 5, padding: '4px 8px', fontWeight: 700, letterSpacing: '0.07em', whiteSpace: 'nowrap' } },
          'GET TICKETS'
        )
      )
    )
  );
}

function ArtistRow(props) {
  var artist = props.artist;
  var expanded = props.expanded;
  var onToggle = props.onToggle;
  var locationLabel = props.locationLabel;
  var locationOpts = props.locationOpts;
  var [entry, setEntry] = useState(null);
  var [loadKey, setLoadKey] = useState('');
  var [spotifyInfo, setSpotifyInfo] = useState(null);
  var [spotifyLoading, setSpotifyLoading] = useState(false);

  var currentKey = artist.tmName + '__' + JSON.stringify(locationOpts || {});

  useEffect(function() {
    if (!expanded) return;
    if (currentKey === loadKey && entry !== null) return;
    setLoadKey(currentKey);
    setEntry({ loading: true, shows: null });
    fetchShows(artist.tmName, artist.name, artist.tmId || null, locationOpts || null).then(function(shows) {
      setEntry({ loading: false, shows: shows });
    });
  }, [expanded, currentKey]);

  useEffect(function() {
    if (!expanded) return;
    if (spotifyInfo !== null || spotifyLoading) return;
    setSpotifyLoading(true);
    fetchSpotifyInfo(artist.name).then(function(info) {
      setSpotifyInfo(info);
      setSpotifyLoading(false);
    });
  }, [expanded]);

  var maxAge = Math.max.apply(null, artist.members.map(function(m) { return m.age; }));
  var ac = ageColor(maxAge);
  var isSolo = artist.members.length === 1;
  var shows = entry ? entry.shows : null;
  var loading = entry ? entry.loading : false;
  var hasShows = shows && shows.length > 0;

  return React.createElement('div', {
    style: { borderRadius: 12, overflow: 'hidden', background: 'rgba(255,250,240,0.85)',
      border: '1px solid rgba(139,105,20,0.18)', boxShadow: '0 2px 8px rgba(60,30,0,0.06)', marginBottom: 10 }
  },
    React.createElement('button', { onClick: onToggle,
      style: { width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
        background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' } },
      React.createElement('div', { style: { width: 4, alignSelf: 'stretch', borderRadius: 4, background: ac, flexShrink: 0 } }),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 17, fontWeight: 700, color: '#2c1810',
          fontFamily: 'Playfair Display, serif', lineHeight: 1.2, marginBottom: isSolo ? 0 : 5 } }, artist.name),
        !isSolo && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '2px 14px', marginTop: 3 } },
          artist.members.map(function(m) {
            return React.createElement('span', { key: m.name, style: { fontSize: 13, color: '#8a6a50' } },
              m.name + ' ',
              React.createElement('span', { style: { color: ageColor(m.age), fontWeight: 700 } }, m.age)
            );
          })
        )
      ),
      hasShows && React.createElement('div', {
        style: { flexShrink: 0, background: '#c0392b', color: 'white', borderRadius: 20,
          fontSize: 12, fontWeight: 700, padding: '3px 10px', marginRight: 6, whiteSpace: 'nowrap' } },
        shows.length + ' show' + (shows.length !== 1 ? 's' : '')
      ),
      isSolo && React.createElement('div', {
        style: { flexShrink: 0, width: 46, height: 46, borderRadius: '50%',
          border: '2px solid ' + ac, background: ac + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center' } },
        React.createElement('span', { style: { fontSize: 17, fontWeight: 700, color: ac,
          fontFamily: 'Playfair Display, serif' } }, maxAge)
      ),
      React.createElement('span', { style: { fontSize: 18, color: '#b08a50', flexShrink: 0,
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' } }, '\u25be')
    ),
    expanded && React.createElement('div', { style: { padding: '4px 20px 18px 38px', borderTop: '1px solid rgba(139,105,20,0.1)' } },
      React.createElement('div', { style: { marginTop: 14, marginBottom: 16 } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
          React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b08a50' } }, 'Top Songs'),
          spotifyInfo && spotifyInfo.listeners && React.createElement('div', { style: { fontSize: 10, color: '#d4243a', fontWeight: 600 } }, spotifyInfo.listeners)
        ),,
        spotifyLoading && React.createElement('div', { style: { fontSize: 12, color: '#b08a50', fontStyle: 'italic' } }, 'Loading...'),
        !spotifyLoading && spotifyInfo && spotifyInfo.tracks && spotifyInfo.tracks.length > 0
          ? spotifyInfo.tracks.map(function(track, i) {
              return React.createElement(TrackRow, { key: track.name, track: track, ac: ac });
            })
          : !spotifyLoading && React.createElement('div', null,
              artist.songs.map(function(s, i) {
                return React.createElement('div', { key: s,
                  style: { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5 } },
                  React.createElement('span', { style: { fontSize: 12, color: ac + '88', fontWeight: 700, minWidth: 14 } }, i + 1),
                  React.createElement('span', { style: { fontSize: 14, color: '#5a3d28', fontStyle: 'italic',
                    fontFamily: 'Playfair Display, serif' } }, s)
                );
              })
            )
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#b08a50', marginBottom: 10 } },
          locationLabel ? 'Shows near ' + locationLabel : 'Upcoming Shows Worldwide'
        ),
        loading && React.createElement('div', { style: { fontSize: 14, color: '#b08a50', fontStyle: 'italic', padding: '8px 0' } }, 'Searching for shows...'),
        !loading && hasShows && shows.map(function(s, i) { return React.createElement(ShowCard, { key: i, show: s }); }),
        !loading && shows && shows.length === 0 && React.createElement('div', {
          style: { fontSize: 14, color: '#c4a882', fontStyle: 'italic', padding: '6px 0' } },
          'No upcoming shows found' + (locationLabel ? ' near ' + locationLabel : '') + '.'
        )
      )
    )
  );
}

export default function SwanSong() {
  var [genreFilters, setGenreFilters] = useState([]);
  var [zipInput, setZipInput] = useState('');
  var [radius, setRadius] = useState(50);
  var [geoInfo, setGeoInfo] = useState(null);
  var [geoError, setGeoError] = useState('');
  var [geoLoading, setGeoLoading] = useState(false);
  var [search, setSearch] = useState('');
  var [expanded, setExpanded] = useState({});

  var locationOpts = geoInfo ? { lat: geoInfo.lat, lng: geoInfo.lng, radius: radius } : null;
  var locationLabel = geoInfo ? geoInfo.city + ', ' + geoInfo.state : null;
  var filterActive = !!(genreFilters.length > 0 || geoInfo || search);

  async function handleZipSubmit() {
    if (!zipInput || zipInput.length < 5) return;
    setGeoLoading(true);
    setGeoError('');
    var info = await geocodeZip(zipInput);
    if (!info) { setGeoLoading(false); setGeoError('ZIP code not found. Try another.'); return; }

    // Clear ALL caches before new search so stale results never bleed through
    fetchCache = {};
    spotifyCache = {};

    var currentRadius = radius;
    var opts = { lat: info.lat, lng: info.lng, radius: currentRadius };

    setGeoInfo(info);
    setExpanded({});

    // Pre-fetch all artists sequentially in small batches to avoid rate limiting
    var scope = genreFilters.length > 0
      ? ARTISTS.filter(function(a) { return genreFilters.indexOf(a.genre) !== -1; })
      : ARTISTS;

    // Fire all fetches — re-render after each one completes so artists disappear progressively
    var fetches = scope.map(function(artist) {
      return fetchShows(artist.tmName, artist.name, artist.tmId || null, opts).then(function(shows) {
        // Trigger re-render after each result comes in
        setGeoInfo(function(prev) { return prev ? Object.assign({}, prev, { _tick: Math.random() }) : prev; });
        return shows;
      });
    });

    await Promise.all(fetches);
    setGeoLoading(false);
  }

  function clearLocation() {
    setGeoInfo(null); setZipInput(''); setGeoError('');
    setExpanded({});
    fetchCache = {};
  }

  function toggleGenre(g) {
    setGenreFilters(function(prev) {
      var idx = prev.indexOf(g);
      if (idx === -1) return prev.concat([g]);
      return prev.filter(function(x) { return x !== g; });
    });
    setExpanded({});
  }

  function clearAll() {
    setGenreFilters([]); setSearch('');
    clearLocation();
  }

  function toggleExpand(name) {
    setExpanded(function(prev) {
      var next = Object.assign({}, prev);
      next[name] = !prev[name];
      return next;
    });
  }

  var allSorted = ARTISTS.slice().sort(function(a, b) {
    return Math.max.apply(null, b.members.map(function(m) { return m.age; })) -
           Math.max.apply(null, a.members.map(function(m) { return m.age; }));
  });

  // When location active, hide artists confirmed to have zero shows in range
  var visibleArtists = allSorted.filter(function(a) {
    if (genreFilters.length > 0 && genreFilters.indexOf(a.genre) === -1) return false;
    if (search && a.name.toLowerCase().indexOf(search.toLowerCase()) === -1) return false;
    if (geoInfo) {
      var cacheKey = a.tmName + '__' + (a.tmId || '') + '__' + (locationOpts ? (locationOpts.lat + ',' + locationOpts.lng + ',' + locationOpts.radius) : 'world');
      var cached = fetchCache[cacheKey];
      // Hide only once confirmed empty — keep visible while loading or not yet fetched
      if (cached !== undefined && Array.isArray(cached) && cached.length === 0) return false;
    }
    return true;
  });

  return React.createElement('div', {
    style: { minHeight: '100vh', fontFamily: 'Georgia, serif',
      background: 'linear-gradient(160deg, #fdf6e3 0%, #f5e6c8 40%, #ede0c4 100%)', color: '#2c1810' }
  },
    React.createElement('style', null, `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #fdf6e3; }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .fade { animation: fadeUp 0.35s ease both; }
      input::placeholder { color: #c4a882; }
      button:focus { outline: none; }
    `),

    // HERO
    React.createElement('div', {
      style: { textAlign: 'center', padding: '24px 24px 20px',
        background: 'linear-gradient(180deg, rgba(139,105,20,0.1) 0%, transparent 100%)',
        borderBottom: '2px solid rgba(139,105,20,0.18)' }
    },
      React.createElement('div', { style: { display: 'inline-block', marginBottom: 12 } },
        React.createElement('svg', { width: 40, height: 40, viewBox: '0 0 44 44', fill: 'none' },
          React.createElement('ellipse', { cx: '27', cy: '29', rx: '13', ry: '8', fill: '#8B6914', opacity: '0.18' }),
          React.createElement('path', { d: 'M10 35 C10 35 15 24 24 21 C33 18 38 11 36 6 C34 1 27 4 22 9 C17 14 14 22 10 35Z', fill: '#8B6914', opacity: '0.85' }),
          React.createElement('circle', { cx: '35.5', cy: '7', r: '2.5', fill: '#8B6914' }),
          React.createElement('path', { d: 'M9 35 Q22 30 35 35', stroke: '#8B6914', strokeWidth: '1.5', strokeLinecap: 'round', opacity: '0.4' })
        )
      ),
      React.createElement('h1', { style: { fontSize: 'clamp(52px, 10vw, 96px)', fontWeight: 900,
        fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em', lineHeight: 1,
        color: '#2c1810', marginBottom: 10, textShadow: '2px 3px 0px rgba(139,105,20,0.2)' } }, 'Swan Song'),

      // Tagline — original words, Cormorant Garamond, larger, spaced
      React.createElement('p', { style: {
        fontFamily: 'Cormorant Garamond, Georgia, serif', marginBottom: 16,
        fontSize: 'clamp(16px, 2.2vw, 22px)',
        fontWeight: 300,
        fontStyle: 'italic',
        color: '#6b4c2a',
        letterSpacing: '0.06em',
        lineHeight: 1.5,
        marginBottom: 28,
        textShadow: '0 1px 2px rgba(139,105,20,0.1)'
      } }, 'See them while you still can.'),

      React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' } },
        [['#b03a2e','80+'],['#9a7d0a','72-79'],['#1e8449','65-71']].map(function(item) {
          return React.createElement('div', { key: item[1], style: { display: 'flex', alignItems: 'center', gap: 8 } },
            React.createElement('div', { style: { width: 11, height: 11, borderRadius: '50%', background: item[0] } }),
            React.createElement('span', { style: { fontSize: 14, color: '#8a6a50', fontWeight: 500 } }, item[1])
          );
        })
      )
    ),

    // FILTER BAR
    React.createElement('div', {
      style: { background: 'rgba(255,250,235,0.97)', borderBottom: '1px solid rgba(139,105,20,0.15)',
        position: 'sticky', top: 0, zIndex: 100, padding: '16px 24px' }
    },
      React.createElement('div', { style: { maxWidth: 1100, margin: '0 auto' } },
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14, alignItems: 'center' } },
          React.createElement('span', { style: { fontSize: 13, color: '#8B6914', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 4 } }, 'Genre'),
          GENRES.map(function(g) {
            var gc = GENRE_COLORS[g];
            var active = genreFilters.indexOf(g) !== -1;
            return React.createElement('button', { key: g, onClick: function() { toggleGenre(g); },
              style: { padding: '6px 18px', borderRadius: 30, fontSize: 13, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                border: '1.5px solid ' + (active ? gc : 'rgba(139,105,20,0.22)'),
                background: active ? gc : 'transparent',
                color: active ? '#fff' : '#8a6a50', transition: 'all 0.15s' },
              onMouseEnter: function(e) { if (!active) { e.currentTarget.style.borderColor = gc; e.currentTarget.style.color = gc; } },
              onMouseLeave: function(e) { if (!active) { e.currentTarget.style.borderColor = 'rgba(139,105,20,0.22)'; e.currentTarget.style.color = '#8a6a50'; } }
            }, g);
          })
        ),
        React.createElement('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' } },
          React.createElement('span', { style: { fontSize: 13, color: '#8B6914', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase' } }, 'Near'),
          React.createElement('input', {
            placeholder: 'ZIP code', value: zipInput, maxLength: 5,
            onChange: function(e) { setZipInput(e.target.value.replace(/\D/g, '')); },
            onKeyDown: function(e) { if (e.key === 'Enter') handleZipSubmit(); },
            style: { width: 88, background: 'rgba(255,255,255,0.85)',
              border: '1.5px solid rgba(139,105,20,0.3)', color: '#2c1810',
              borderRadius: 8, padding: '7px 10px', fontSize: 14, outline: 'none' }
          }),
          React.createElement('select', {
            value: radius,
            onChange: function(e) { setRadius(parseInt(e.target.value)); fetchCache = {}; setExpanded({}); },
            style: { background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(139,105,20,0.25)',
              color: '#5a3a10', borderRadius: 8, padding: '7px 12px', fontSize: 14, cursor: 'pointer', outline: 'none' }
          },
            RADIUS_OPTIONS.map(function(r) {
              return React.createElement('option', { key: r, value: r }, r + ' mi');
            })
          ),
          React.createElement('button', {
            onClick: handleZipSubmit,
            disabled: geoLoading || zipInput.length < 5,
            style: { padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              border: 'none', background: zipInput.length >= 5 ? '#8B6914' : '#c4b080',
              color: 'white', cursor: zipInput.length < 5 ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }
          }, geoLoading ? 'Searching...' : 'Search'),
          geoInfo && React.createElement('div', {
            style: { display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(139,105,20,0.1)',
              borderRadius: 8, padding: '6px 12px', border: '1px solid rgba(139,105,20,0.25)' } },
            React.createElement('span', { style: { fontSize: 13, color: '#5a3a10', fontWeight: 600 } },
              locationLabel + ' / ' + radius + ' mi'),
            React.createElement('button', { onClick: clearLocation,
              style: { background: 'none', border: 'none', cursor: 'pointer', color: '#8B6914',
                fontSize: 16, fontWeight: 700, lineHeight: 1, padding: '0 0 0 4px' } }, 'x')
          ),
          geoError && React.createElement('span', { style: { fontSize: 13, color: '#c0392b', fontWeight: 500 } }, geoError),
          React.createElement('input', {
            placeholder: 'Search artist...', value: search,
            onChange: function(e) { setSearch(e.target.value); },
            style: { flex: '1 1 140px', minWidth: 120, background: 'rgba(255,255,255,0.85)',
              border: '1.5px solid rgba(139,105,20,0.25)', color: '#2c1810',
              borderRadius: 8, padding: '7px 12px', fontSize: 14, outline: 'none' }
          }),
          filterActive && React.createElement('button', { onClick: clearAll,
            style: { padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: '1.5px solid rgba(139,105,20,0.3)', background: 'transparent',
              color: '#8a6a50', cursor: 'pointer' } }, 'Clear all')
        )
      )
    ),

    // CONTENT
    React.createElement('div', { style: { maxWidth: 1100, margin: '0 auto', padding: '28px 24px 80px' } },
      React.createElement('p', { style: { textAlign: 'center', fontSize: 15, color: '#a08060',
        fontStyle: 'italic', marginBottom: 28, lineHeight: 1.9 } },
        filterActive
          ? (geoLoading
              ? 'Searching for shows near ' + locationLabel + '...'
              : visibleArtists.length + ' artist' + (visibleArtists.length !== 1 ? 's' : '') +
                (genreFilters.length > 0 ? ' in ' + genreFilters.join(' & ') : '') +
                (locationLabel ? ' with shows near ' + locationLabel + ' within ' + radius + ' mi' : '') +
                ' — click any to expand')
          : 'Click any artist to see their songs and upcoming shows worldwide. Enter a ZIP to find shows near you.'
      ),
      React.createElement('div', { style: { columns: '2 310px', gap: 12 } },
        visibleArtists.map(function(artist, i) {
          return React.createElement('div', { key: artist.name, className: 'fade',
            style: { breakInside: 'avoid', animationDelay: Math.min(i * 0.02, 0.4) + 's' } },
            React.createElement(ArtistRow, {
              artist: artist,
              expanded: !!expanded[artist.name],
              onToggle: function() { toggleExpand(artist.name); },
              locationOpts: locationOpts,
              locationLabel: locationLabel
            })
          );
        })
      )
    ),

    React.createElement('div', { style: { textAlign: 'center', padding: '0 0 36px',
      fontSize: 12, color: '#c4a882', letterSpacing: '0.1em', fontWeight: 500 } },
      'SWAN SONG  -  SEE THEM WHILE YOU CAN  -  POWERED BY TICKETMASTER'
    )
  );
}
