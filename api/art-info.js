const WIKIDATA_ID_PATTERN = /^Q[0-9]+$/;

function googleImagesUrl(query) {
  return 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(query);
}

async function fetchWikipediaSummary(wikidataId) {
  try {
    const entityRes = await fetch(
      'https://www.wikidata.org/wiki/Special:EntityData/' + wikidataId + '.json'
    );
    if (!entityRes.ok) return { bio: null, thumbnail: null, wikipediaUrl: null, sitelinkTitle: null };
    const entityData = await entityRes.json();
    const entity = entityData && entityData.entities && entityData.entities[wikidataId];
    const enwiki = entity && entity.sitelinks && entity.sitelinks.enwiki;
    if (!enwiki || !enwiki.title) {
      return { bio: null, thumbnail: null, wikipediaUrl: null, sitelinkTitle: null, entity };
    }

    const summaryRes = await fetch(
      'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(enwiki.title)
    );
    if (!summaryRes.ok) return { bio: null, thumbnail: null, wikipediaUrl: null, sitelinkTitle: enwiki.title, entity };
    const summary = await summaryRes.json();

    return {
      bio: summary.extract || null,
      thumbnail: (summary.thumbnail && summary.thumbnail.source) || null,
      wikipediaUrl: (summary.content_urls && summary.content_urls.desktop && summary.content_urls.desktop.page) || null,
      sitelinkTitle: enwiki.title,
      entity,
    };
  } catch (e) {
    console.error('art-info: Wikipedia/Wikidata lookup failed for', wikidataId, e);
    return { bio: null, thumbnail: null, wikipediaUrl: null, sitelinkTitle: null, entity: null };
  }
}

// Property IDs used from the Wikidata entity's claims.
const PROP_NOTABLE_WORK = 'P800';
const PROP_COLLECTION = 'P195';
const PROP_LOCATION = 'P276';

async function fetchLabel(qid) {
  try {
    const res = await fetch(
      'https://www.wikidata.org/wiki/Special:EntityData/' + qid + '.json'
    );
    if (!res.ok) return null;
    const data = await res.json();
    const entity = data && data.entities && data.entities[qid];
    const label = entity && entity.labels && entity.labels.en && entity.labels.en.value;
    return label || null;
  } catch (e) {
    return null;
  }
}

async function resolveNotableWorks(entity, artistName) {
  if (!entity || !entity.claims || !entity.claims[PROP_NOTABLE_WORK]) return [];
  const workClaims = entity.claims[PROP_NOTABLE_WORK].slice(0, 5);

  const works = [];
  for (const claim of workClaims) {
    const workId = claim.mainsnak && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value && claim.mainsnak.datavalue.value.id;
    if (!workId) continue;
    const title = await fetchLabel(workId);
    if (!title) continue;

    let institution = null;
    try {
      const workRes = await fetch('https://www.wikidata.org/wiki/Special:EntityData/' + workId + '.json');
      if (workRes.ok) {
        const workData = await workRes.json();
        const workEntity = workData && workData.entities && workData.entities[workId];
        const collectionClaim = workEntity && workEntity.claims
          && (workEntity.claims[PROP_COLLECTION] || workEntity.claims[PROP_LOCATION]);
        const collectionId = collectionClaim && collectionClaim[0] && collectionClaim[0].mainsnak
          && collectionClaim[0].mainsnak.datavalue && collectionClaim[0].mainsnak.datavalue.value
          && collectionClaim[0].mainsnak.datavalue.value.id;
        if (collectionId) institution = await fetchLabel(collectionId);
      }
    } catch (e) {
      console.error('art-info: failed to resolve institution for work', workId, e);
    }

    works.push({
      title,
      institution,
      imageUrl: null, // Commons image resolution is deliberately out of scope here — see WorkImage's fallback rule
      googleImagesUrl: googleImagesUrl(artistName + ' ' + title),
    });
  }
  return works;
}

async function resolveCollections(entity) {
  if (!entity || !entity.claims || !entity.claims[PROP_COLLECTION]) return [];
  const claims = entity.claims[PROP_COLLECTION].slice(0, 5);
  const collections = [];
  for (const claim of claims) {
    const collectionId = claim.mainsnak && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value && claim.mainsnak.datavalue.value.id;
    if (!collectionId) continue;
    const name = await fetchLabel(collectionId);
    if (name) collections.push({ name, url: null });
  }
  return collections;
}

module.exports = async function handler(req, res) {
  const wikidataId = req.query.wikidataId;
  const artistName = req.query.artistName || wikidataId;

  if (!wikidataId || typeof wikidataId !== 'string' || !WIKIDATA_ID_PATTERN.test(wikidataId)) {
    return res.status(400).json({ error: 'Missing or invalid wikidataId param' });
  }

  try {
    const { bio, thumbnail, wikipediaUrl, entity } = await fetchWikipediaSummary(wikidataId);
    const works = await resolveNotableWorks(entity, artistName);
    const collections = await resolveCollections(entity);

    return res.status(200).json({
      bio,
      thumbnail,
      wikipediaUrl,
      works,
      collections,
      auctionPrice: null, // no free, comprehensive art-market API exists — see design spec's non-goals
    });
  } catch (err) {
    console.error('art-info failed for', wikidataId, err);
    return res.status(502).json({ error: 'Failed to fetch artist info' });
  }
};
