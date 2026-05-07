import React, { useState, useEffect, useRef } from 'react';

async function fetchShows(tmName, stateCode) {
  const key = tmName + '__' + (stateCode || 'US');
  if (fetchCache[key] !== undefined) return fetchCache[key];
  try {
    const params = new URLSearchParams({ artist: tmName });
    if (stateCode) params.set('state', stateCode);
    const res = await fetch('/.netlify/functions/shows?' + params);
    if (!res.ok) throw new Error(res.status);
    const shows = await res.json();
    fetchCache[key] = shows;
    return shows;
  } catch (err) {
    console.error('Shows fetch error', tmName, err);
    fetchCache[key] = [];
    return [];
  }
}

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
  { name: 'Kris Kristofferson', genre: 'Country', tmName: 'Kris Kristofferson',
    members: [{ name: 'Kris Kristofferson', age: 88 }],
    songs: ['Me and Bobby McGee', 'Help Me Make It Through the Night', 'Sunday Mornin\' Comin\' Down'] },
  { name: 'Emmylou Harris', genre: 'Country', tmName: 'Emmylou Harris',
    members: [{ name: 'Emmylou Harris', age: 77 }],
    songs: ['Boulder to Birmingham', 'Making Believe', 'To Daddy'] },
  { name: 'Crystal Gayle', genre: 'Country', tmName: 'Crystal Gayle',
    members: [{ name: 'Crystal Gayle', age: 73 }],
    songs: ['Don\'t It Make My Brown Eyes Blue', 'Talking in Your Sleep', 'Ready for the Times to Get Better'] },
  { name: 'Jimmy Buffett', genre: 'Country', tmName: 'Jimmy Buffett',
    members: [{ name: 'Jimmy Buffett', age: 76 }],
    songs: ['Margaritaville', 'Cheeseburger in Paradise', 'Come Monday'] },
  { name: 'Herbie Hancock', genre: 'Jazz', tmName: 'Herbie Hancock',
    members: [{ name: 'Herbie Hancock', age: 85 }],
    songs: ['Cantaloupe Island', 'Watermelon Man', 'Rockit'] },
  { name: 'Sonny Rollins', genre: 'Jazz', tmName: 'Sonny Rollins',
    members: [{ name: 'Sonny Rollins', age: 94 }],
    songs: ['St. Thomas', 'Autumn Nocturne', 'Doxy'] },
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
  { name: 'Neil Diamond', genre: 'Pop', tmName: 'Neil Diamond',
    members: [{ name: 'Neil Diamond', age: 84 }],
    songs: ['Sweet Caroline', 'Cracklin\' Rosie', 'Cherry Cherry'] },
  { name: 'Tom Jones', genre: 'Pop', tmName: 'Tom Jones',
    members: [{ name: 'Tom Jones', age: 85 }],
    songs: ['It\'s Not Unusual', 'What\'s New Pussycat?', 'Delilah'] },
  { name: 'Engelbert Humperdinck', genre: 'Pop', tmName: 'Engelbert Humperdinck',
    members: [{ name: 'Engelbert Humperdinck', age: 88 }],
    songs: ['Release Me', 'After the Lovin\'', 'Am I That Easy to Forget'] },
];

const GENRES = ['Rock', 'Country', 'Jazz', 'Soul/R&B', 'Pop'];
const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const GENRE_COLORS = {
  Rock: '#c0392b',
  Country: '#8B6914',
  Jazz: '#1a5276',
  'Soul/R&B': '#6c3483',
  Pop: '#1a7a4a',
};

function ageColor(age) {
  if (age >= 85) return '#b03a2e';
  if (age >= 78) return '#9a7d0a';
  return '#1e8449';
}

const fetchCache = {};

function SwanLogo({ size }) {
  size = size || 38;
  return (
    React.createElement('svg', { width: size, height: size, viewBox: '0 0 44 44', fill: 'none' },
      React.createElement('ellipse', { cx: '27', cy: '29', rx: '13', ry: '8', fill: '#8B6914', opacity: '0.18' }),
      React.createElement('path', { d: 'M10 35 C10 35 15 24 24 21 C33 18 38 11 36 6 C34 1 27 4 22 9 C17 14 14 22 10 35Z', fill: '#8B6914', opacity: '0.85' }),
      React.createElement('circle', { cx: '35.5', cy: '7', r: '2.5', fill: '#8B6914' }),
      React.createElement('path', { d: 'M9 35 Q22 30 35 35', stroke: '#8B6914', strokeWidth: '1.5', strokeLinecap: 'round', opacity: '0.4' })
    )
  );
}

function ShowRow({ show }) {
  const dateStr = show.date
    ? new Date(show.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date TBA';
  const loc = [show.venue, show.city, show.state || show.country].filter(Boolean).join('  -  ');
  return (
    React.createElement('a', {
      href: show.url, target: '_blank', rel: 'noopener noreferrer',
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        textDecoration: 'none', padding: '10px 14px', borderRadius: 8,
        background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(139,105,20,0.15)',
        marginBottom: 6 }
    },
      React.createElement('div', { style: { flex: 1, minWidth: 0, fontSize: 13, color: '#3d2b1f', fontWeight: 500,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, loc),
      React.createElement('div', { style: { flexShrink: 0, textAlign: 'right' } },
        React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: '#8B6914' } }, dateStr),
        React.createElement('div', { style: { fontSize: 10, color: '#b08a30', letterSpacing: '0.07em', marginTop: 1 } }, 'TICKETS')
      )
    )
  );
}

function ArtistRow({ artist, expanded, onToggle, entry, stateMode }) {
  const maxAge = Math.max.apply(null, artist.members.map(function(m) { return m.age; }));
  const ac = ageColor(maxAge);
  const isSolo = artist.members.length === 1;
  const gc = GENRE_COLORS[artist.genre] || '#555';
  const shows = entry ? entry.shows : null;
  const loading = entry ? entry.loading : false;

  return (
    React.createElement('div', { style: { borderRadius: 12, overflow: 'hidden',
      background: 'rgba(255,250,240,0.75)', border: '1px solid rgba(139,105,20,0.18)',
      boxShadow: '0 2px 8px rgba(60,30,0,0.06)', marginBottom: 10 } },
      React.createElement('button', { onClick: onToggle,
        style: { width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
          background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' } },
        React.createElement('div', { style: { width: 4, alignSelf: 'stretch', borderRadius: 4, background: ac, flexShrink: 0 } }),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: '#2c1810',
            fontFamily: 'Playfair Display, serif', lineHeight: 1.2, marginBottom: isSolo ? 0 : 4 } },
            artist.name
          ),
          !isSolo && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '2px 14px' } },
            artist.members.map(function(m) {
              return React.createElement('span', { key: m.name, style: { fontSize: 12, color: '#8a6a50' } },
                m.name + ' ',
                React.createElement('span', { style: { color: ageColor(m.age), fontWeight: 700 } }, m.age)
              );
            })
          )
        ),
        isSolo && React.createElement('div', { style: { flexShrink: 0, width: 44, height: 44, borderRadius: '50%',
          border: '2px solid ' + ac, background: ac + '14',
          display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          React.createElement('span', { style: { fontSize: 16, fontWeight: 700, color: ac,
            fontFamily: 'Playfair Display, serif' } }, maxAge)
        ),
        React.createElement('span', { style: { fontSize: 14, color: '#b08a50', flexShrink: 0,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' } }, '▾')
      ),
      expanded && React.createElement('div', { style: { padding: '0 18px 16px 36px', borderTop: '1px solid rgba(139,105,20,0.1)' } },
        React.createElement('div', { style: { marginTop: 12, marginBottom: shows !== null ? 14 : 0 } },
          React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#b08a50', marginBottom: 6 } }, 'Known For'),
          artist.songs.map(function(s, i) {
            return React.createElement('div', { key: s, style: { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 } },
              React.createElement('span', { style: { fontSize: 11, color: ac + '99', fontWeight: 700, minWidth: 12 } }, i + 1),
              React.createElement('span', { style: { fontSize: 14, color: '#5a3d28', fontStyle: 'italic',
                fontFamily: 'Playfair Display, serif' } }, s)
            );
          })
        ),
        shows !== null && React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#b08a50', marginBottom: 8 } },
            stateMode ? 'Shows in Your State' : 'Upcoming Shows'
          ),
          loading
            ? React.createElement('div', { style: { fontSize: 13, color: '#b08a50', fontStyle: 'italic' } }, 'Searching...')
            : shows.length > 0
              ? shows.map(function(s, i) { return React.createElement(ShowRow, { key: i, show: s }); })
              : React.createElement('div', { style: { fontSize: 13, color: '#c4a882', fontStyle: 'italic' } },
                  'No upcoming shows found' + (stateMode ? ' in this state' : '') + '.'
                )
        )
      )
    )
  );
}

export default function SwanSong() {
  const [genreFilter, setGenreFilter] = useState(null);
  const [stateFilter, setStateFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const [showsMap, setShowsMap] = useState({});
  const fetchedKeys = useRef(new Set());

  const filterActive = !!(genreFilter || stateFilter || search);

  const visibleArtists = ARTISTS.filter(function(a) {
    if (genreFilter && a.genre !== genreFilter) return false;
    if (search && a.name.toLowerCase().indexOf(search.toLowerCase()) === -1) return false;
    if (stateFilter) {
      const e = showsMap[a.name];
      if (e && !e.loading && e.shows.length === 0) return false;
    }
    return true;
  }).sort(function(a, b) {
    return Math.max.apply(null, b.members.map(function(m) { return m.age; })) -
           Math.max.apply(null, a.members.map(function(m) { return m.age; }));
  });

  useEffect(function() {
    if (!genreFilter && !stateFilter) return;
    const scope = genreFilter ? ARTISTS.filter(function(a) { return a.genre === genreFilter; }) : ARTISTS;
    scope.forEach(function(artist) {
      const key = artist.name + '__' + (stateFilter || 'US');
      if (fetchedKeys.current.has(key)) return;
      fetchedKeys.current.add(key);
      setShowsMap(function(prev) {
        const next = Object.assign({}, prev);
        next[artist.name] = { loading: true, shows: null };
        return next;
      });
      fetchShows(artist.tmName, stateFilter).then(function(shows) {
        setShowsMap(function(prev) {
          const next = Object.assign({}, prev);
          next[artist.name] = { loading: false, shows: shows };
          return next;
        });
      });
    });
  }, [genreFilter, stateFilter]);

  function setGenreFn(g) {
    setGenreFilter(function(prev) { return prev === g ? null : g; });
    setShowsMap({});
    fetchedKeys.current.clear();
    setExpanded({});
  }

  function setStateFn(s) {
    setStateFilter(function(prev) { return prev === s ? null : s; });
    setShowsMap({});
    fetchedKeys.current.clear();
    setExpanded({});
  }

  function clearAll() {
    setGenreFilter(null);
    setStateFilter(null);
    setSearch('');
    setShowsMap({});
    fetchedKeys.current.clear();
    setExpanded({});
  }

  function toggleExpand(name) {
    setExpanded(function(prev) {
      const next = Object.assign({}, prev);
      next[name] = !prev[name];
      return next;
    });
  }

  const loadingCount = Object.values(showsMap).filter(function(v) { return v.loading; }).length;
  const allSorted = ARTISTS.slice().sort(function(a, b) {
    return Math.max.apply(null, b.members.map(function(m) { return m.age; })) -
           Math.max.apply(null, a.members.map(function(m) { return m.age; }));
  });

  return (
    React.createElement('div', { style: { minHeight: '100vh', fontFamily: 'Georgia, serif',
      background: 'linear-gradient(160deg, #fdf6e3 0%, #f5e6c8 40%, #ede0c4 100%)',
      color: '#2c1810' } },
      React.createElement('style', null, `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fdf6e3; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade { animation: fadeUp 0.35s ease both; }
        input::placeholder { color: #c4a882; }
        select option { background: #fdf6e3; color: #2c1810; }
        button:focus { outline: none; }
      `),
      React.createElement('div', { style: { textAlign: 'center', padding: '52px 24px 36px',
        background: 'linear-gradient(180deg, rgba(139,105,20,0.08) 0%, transparent 100%)',
        borderBottom: '2px solid rgba(139,105,20,0.15)' } },
        React.createElement('div', { style: { display: 'inline-block', marginBottom: 10 } },
          React.createElement(SwanLogo, { size: 52 })
        ),
        React.createElement('h1', { style: { fontSize: 'clamp(52px,9vw,90px)', fontWeight: 900,
          fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em', lineHeight: 1,
          color: '#2c1810', marginBottom: 6 } }, 'Swan Song'),
        React.createElement('div', { style: { fontSize: 17, color: '#8B6914', fontStyle: 'italic',
          fontWeight: 300, marginBottom: 28 } }, 'See them while you still can.'),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' } },
          [['#b03a2e','85+'],['#9a7d0a','78-84'],['#1e8449','70-77']].map(function(item) {
            return React.createElement('div', { key: item[1], style: { display: 'flex', alignItems: 'center', gap: 8 } },
              React.createElement('div', { style: { width: 10, height: 10, borderRadius: '50%', background: item[0] } }),
              React.createElement('span', { style: { fontSize: 12, color: '#8a6a50' } }, item[1])
            );
          })
        )
      ),
      React.createElement('div', { style: { background: 'rgba(255,250,235,0.95)', borderBottom: '1px solid rgba(139,105,20,0.15)',
        position: 'sticky', top: 0, zIndex: 100, padding: '14px 24px' } },
        React.createElement('div', { style: { maxWidth: 1100, margin: '0 auto' } },
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, alignItems: 'center' } },
            React.createElement('span', { style: { fontSize: 11, color: '#b08a50', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 4 } }, 'Genre'),
            GENRES.map(function(g) {
              const gc = GENRE_COLORS[g];
              const active = genreFilter === g;
              return React.createElement('button', { key: g, onClick: function() { setGenreFn(g); },
                style: { padding: '5px 16px', borderRadius: 30, fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.07em', textTransform: 'uppercase', cursor: 'pointer',
                  border: '1.5px solid ' + (active ? gc : 'rgba(139,105,20,0.2)'),
                  background: active ? gc : 'transparent',
                  color: active ? '#fff' : '#8a6a50', transition: 'all 0.15s' } }, g);
            })
          ),
          React.createElement('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' } },
            React.createElement('span', { style: { fontSize: 11, color: '#b08a50', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase' } }, 'State'),
            React.createElement('select', {
              value: stateFilter || '',
              onChange: function(e) { setStateFn(e.target.value || null); },
              style: { background: stateFilter ? 'rgba(139,105,20,0.1)' : 'rgba(255,255,255,0.7)',
                border: '1.5px solid ' + (stateFilter ? '#8B6914' : 'rgba(139,105,20,0.25)'),
                color: stateFilter ? '#5a3a10' : '#8a6a50', borderRadius: 8,
                padding: '6px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer', outline: 'none' } },
              React.createElement('option', { value: '' }, 'All Locations'),
              STATES.map(function(s) { return React.createElement('option', { key: s, value: s }, s); })
            ),
            React.createElement('input', { placeholder: 'Search artist...', value: search,
              onChange: function(e) { setSearch(e.target.value); },
              style: { flex: '1 1 160px', minWidth: 130, background: 'rgba(255,255,255,0.7)',
                border: '1.5px solid rgba(139,105,20,0.25)', color: '#2c1810',
                borderRadius: 8, padding: '6px 12px', fontSize: 13, outline: 'none' } }),
            filterActive && React.createElement('button', { onClick: clearAll,
              style: { padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: '1.5px solid rgba(139,105,20,0.25)', background: 'transparent',
                color: '#8a6a50', cursor: 'pointer' } }, 'Clear'),
            loadingCount > 0 && React.createElement('span', { style: { fontSize: 12, color: '#b08a50', fontStyle: 'italic' } },
              'Loading shows... (' + loadingCount + ' left)')
          )
        )
      ),
      React.createElement('div', { style: { maxWidth: 1100, margin: '0 auto', padding: '28px 24px 80px' } },
        !filterActive && React.createElement('div', null,
          React.createElement('p', { style: { textAlign: 'center', fontSize: 15, color: '#b08a50',
            fontStyle: 'italic', marginBottom: 28, lineHeight: 1.8 } },
            'Select a genre to see worldwide shows, or choose a state to see who is coming near you. Click any artist to expand.'
          ),
          React.createElement('div', { style: { columns: '2 300px', gap: 10 } },
            allSorted.map(function(artist, i) {
              return React.createElement('div', { key: artist.name, className: 'fade',
                style: { breakInside: 'avoid', marginBottom: 10, animationDelay: Math.min(i * 0.025, 0.6) + 's' } },
                React.createElement(ArtistRow, { artist: artist, expanded: !!expanded[artist.name],
                  onToggle: function() { toggleExpand(artist.name); }, entry: null, stateMode: false })
              );
            })
          )
        ),
        filterActive && React.createElement('div', null,
          visibleArtists.length === 0 && loadingCount === 0 &&
            React.createElement('div', { style: { textAlign: 'center', padding: '60px 0', fontSize: 16,
              color: '#c4a882', fontStyle: 'italic' } }, 'No artists with upcoming shows found.'),
          visibleArtists.length === 0 && loadingCount > 0 &&
            React.createElement('div', { style: { textAlign: 'center', padding: '60px 0', fontSize: 16,
              color: '#c4a882', fontStyle: 'italic' } }, 'Searching for shows...'),
          React.createElement('div', { style: { columns: '2 310px', gap: 10 } },
            visibleArtists.map(function(artist, i) {
              return React.createElement('div', { key: artist.name, className: 'fade',
                style: { breakInside: 'avoid', marginBottom: 10, animationDelay: Math.min(i * 0.04, 0.5) + 's' } },
                React.createElement(ArtistRow, { artist: artist, expanded: !!expanded[artist.name],
                  onToggle: function() { toggleExpand(artist.name); },
                  entry: showsMap[artist.name], stateMode: !!stateFilter })
              );
            })
          )
        )
      ),
      React.createElement('div', { style: { textAlign: 'center', padding: '0 0 32px',
        fontSize: 11, color: '#c4a882', letterSpacing: '0.1em' } },
        'SWAN SONG  -  SEE THEM WHILE YOU CAN  -  POWERED BY TICKETMASTER'
      )
    )
  );
}
