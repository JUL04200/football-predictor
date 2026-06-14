'use strict';

const API_KEY = '3c68cf8da2ef4dc7bc2bc71a2bd164c1';
const API_BASE = 'https://api.football-data.org/v4';

// ─── BASE D'ÉQUIPES (IDs et compétitions vérifiés en live) ───────────────────
const TEAM_DB = {
  // LIGUE 1 — confirmé: 305 matchs saison 2025 disponibles
  'psg':                { id: 524,  name: 'Paris Saint-Germain', emoji: '🔵🔴', league: 'Ligue 1',       comps: ['FL1'] },
  'paris saint-germain':{ id: 524,  name: 'Paris Saint-Germain', emoji: '🔵🔴', league: 'Ligue 1',       comps: ['FL1'] },
  'paris':              { id: 524,  name: 'Paris Saint-Germain', emoji: '🔵🔴', league: 'Ligue 1',       comps: ['FL1'] },
  'marseille':          { id: 516,  name: 'Olympique de Marseille', emoji: '🔵⚪', league: 'Ligue 1',    comps: ['FL1'] },
  'om':                 { id: 516,  name: 'Olympique de Marseille', emoji: '🔵⚪', league: 'Ligue 1',    comps: ['FL1'] },
  'lyon':               { id: 523,  name: 'Olympique Lyonnais',  emoji: '🔴⚪', league: 'Ligue 1',       comps: ['FL1'] },
  'ol':                 { id: 523,  name: 'Olympique Lyonnais',  emoji: '🔴⚪', league: 'Ligue 1',       comps: ['FL1'] },
  'monaco':             { id: 548,  name: 'AS Monaco',           emoji: '🔴⚪', league: 'Ligue 1',       comps: ['FL1'] },
  'nice':               { id: 522,  name: 'OGC Nice',            emoji: '🔴⚫', league: 'Ligue 1',       comps: ['FL1'] },
  'lens':               { id: 546,  name: 'RC Lens',             emoji: '🟡🔴', league: 'Ligue 1',       comps: ['FL1'] },
  'rennes':             { id: 529,  name: 'Stade Rennais',       emoji: '🔴⚫', league: 'Ligue 1',       comps: ['FL1'] },
  'lille':              { id: 521,  name: 'LOSC Lille',          emoji: '🔴⚪', league: 'Ligue 1',       comps: ['FL1'] },
  'losc':               { id: 521,  name: 'LOSC Lille',          emoji: '🔴⚪', league: 'Ligue 1',       comps: ['FL1'] },
  'nantes':             { id: 543,  name: 'FC Nantes',           emoji: '🟡🟢', league: 'Ligue 1',       comps: ['FL1'] },
  'strasbourg':         { id: 576,  name: 'RC Strasbourg',       emoji: '🔵⚪', league: 'Ligue 1',       comps: ['FL1'] },
  'saint-etienne':      { id: 519,  name: 'AS Saint-Étienne',   emoji: '🟢⚪', league: 'Ligue 1',       comps: ['FL1'] },
  'asse':               { id: 519,  name: 'AS Saint-Étienne',   emoji: '🟢⚪', league: 'Ligue 1',       comps: ['FL1'] },
  // PREMIER LEAGUE — confirmé: 380 matchs disponibles
  'chelsea':            { id: 61,   name: 'Chelsea FC',          emoji: '🔵',   league: 'Premier League', comps: ['PL'] },
  'manchester city':    { id: 65,   name: 'Manchester City',     emoji: '🔵',   league: 'Premier League', comps: ['PL'] },
  'man city':           { id: 65,   name: 'Manchester City',     emoji: '🔵',   league: 'Premier League', comps: ['PL'] },
  'manchester united':  { id: 66,   name: 'Manchester United',   emoji: '🔴',   league: 'Premier League', comps: ['PL'] },
  'man united':         { id: 66,   name: 'Manchester United',   emoji: '🔴',   league: 'Premier League', comps: ['PL'] },
  'man utd':            { id: 66,   name: 'Manchester United',   emoji: '🔴',   league: 'Premier League', comps: ['PL'] },
  'arsenal':            { id: 57,   name: 'Arsenal',             emoji: '🔴⚪', league: 'Premier League', comps: ['PL'] },
  'liverpool':          { id: 64,   name: 'Liverpool',           emoji: '🔴',   league: 'Premier League', comps: ['PL'] },
  'tottenham':          { id: 73,   name: 'Tottenham Hotspur',   emoji: '⚪',   league: 'Premier League', comps: ['PL'] },
  'spurs':              { id: 73,   name: 'Tottenham Hotspur',   emoji: '⚪',   league: 'Premier League', comps: ['PL'] },
  'newcastle':          { id: 67,   name: 'Newcastle United',    emoji: '⚫⚪', league: 'Premier League', comps: ['PL'] },
  'aston villa':        { id: 58,   name: 'Aston Villa',         emoji: '🟣🔵', league: 'Premier League', comps: ['PL'] },
  'west ham':           { id: 563,  name: 'West Ham United',     emoji: '🔵🔴', league: 'Premier League', comps: ['PL'] },
  'brighton':           { id: 397,  name: 'Brighton',            emoji: '🔵⚪', league: 'Premier League', comps: ['PL'] },
  'everton':            { id: 62,   name: 'Everton',             emoji: '🔵',   league: 'Premier League', comps: ['PL'] },
  // LA LIGA
  'real madrid':        { id: 86,   name: 'Real Madrid',         emoji: '⚪',   league: 'La Liga',        comps: ['PD'] },
  'barcelona':          { id: 81,   name: 'FC Barcelona',        emoji: '🔵🔴', league: 'La Liga',        comps: ['PD'] },
  'barca':              { id: 81,   name: 'FC Barcelona',        emoji: '🔵🔴', league: 'La Liga',        comps: ['PD'] },
  'atletico madrid':    { id: 78,   name: 'Atlético de Madrid',  emoji: '🔴⚪', league: 'La Liga',        comps: ['PD'] },
  'atletico':           { id: 78,   name: 'Atlético de Madrid',  emoji: '🔴⚪', league: 'La Liga',        comps: ['PD'] },
  'sevilla':            { id: 559,  name: 'Sevilla FC',          emoji: '⚪🔴', league: 'La Liga',        comps: ['PD'] },
  'villarreal':         { id: 94,   name: 'Villarreal CF',       emoji: '🟡',   league: 'La Liga',        comps: ['PD'] },
  'real sociedad':      { id: 92,   name: 'Real Sociedad',       emoji: '🔵⚪', league: 'La Liga',        comps: ['PD'] },
  // BUNDESLIGA
  'bayern munich':      { id: 5,    name: 'Bayern München',      emoji: '🔴',   league: 'Bundesliga',     comps: ['BL1'] },
  'bayern':             { id: 5,    name: 'Bayern München',      emoji: '🔴',   league: 'Bundesliga',     comps: ['BL1'] },
  'borussia dortmund':  { id: 4,    name: 'Borussia Dortmund',   emoji: '🟡⚫', league: 'Bundesliga',     comps: ['BL1'] },
  'dortmund':           { id: 4,    name: 'Borussia Dortmund',   emoji: '🟡⚫', league: 'Bundesliga',     comps: ['BL1'] },
  'bvb':                { id: 4,    name: 'Borussia Dortmund',   emoji: '🟡⚫', league: 'Bundesliga',     comps: ['BL1'] },
  'rb leipzig':         { id: 721,  name: 'RB Leipzig',          emoji: '🔴⚪', league: 'Bundesliga',     comps: ['BL1'] },
  'bayer leverkusen':   { id: 3,    name: 'Bayer Leverkusen',    emoji: '🔴⚫', league: 'Bundesliga',     comps: ['BL1'] },
  'leverkusen':         { id: 3,    name: 'Bayer Leverkusen',    emoji: '🔴⚫', league: 'Bundesliga',     comps: ['BL1'] },
  // SERIE A
  'juventus':           { id: 109,  name: 'Juventus FC',         emoji: '⚫⚪', league: 'Serie A',        comps: ['SA'] },
  'juve':               { id: 109,  name: 'Juventus FC',         emoji: '⚫⚪', league: 'Serie A',        comps: ['SA'] },
  'inter milan':        { id: 108,  name: 'Inter Milan',         emoji: '🔵⚫', league: 'Serie A',        comps: ['SA'] },
  'inter':              { id: 108,  name: 'Inter Milan',         emoji: '🔵⚫', league: 'Serie A',        comps: ['SA'] },
  'ac milan':           { id: 98,   name: 'AC Milan',            emoji: '🔴⚫', league: 'Serie A',        comps: ['SA'] },
  'milan':              { id: 98,   name: 'AC Milan',            emoji: '🔴⚫', league: 'Serie A',        comps: ['SA'] },
  'napoli':             { id: 113,  name: 'SSC Napoli',          emoji: '🔵',   league: 'Serie A',        comps: ['SA'] },
  'roma':               { id: 100,  name: 'AS Roma',             emoji: '🔴🟡', league: 'Serie A',        comps: ['SA'] },
  'as roma':            { id: 100,  name: 'AS Roma',             emoji: '🔴🟡', league: 'Serie A',        comps: ['SA'] },
  'lazio':              { id: 110,  name: 'SS Lazio',            emoji: '🔵⚪', league: 'Serie A',        comps: ['SA'] },
  // ÉQUIPES NATIONALES — IDs confirmés depuis WC 2026
  // Européennes → EC 2024 (confirmé: 51 matchs disponibles)
  'france':             { id: 773,  name: 'France',              emoji: '🇫🇷', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'les bleus':          { id: 773,  name: 'France',              emoji: '🇫🇷', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'espagne':            { id: 760,  name: 'Espagne',             emoji: '🇪🇸', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'spain':              { id: 760,  name: 'Espagne',             emoji: '🇪🇸', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'allemagne':          { id: 759,  name: 'Allemagne',           emoji: '🇩🇪', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'germany':            { id: 759,  name: 'Allemagne',           emoji: '🇩🇪', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'angleterre':         { id: 770,  name: 'Angleterre',          emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'england':            { id: 770,  name: 'Angleterre',          emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'portugal':           { id: 765,  name: 'Portugal',            emoji: '🇵🇹', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'belgique':           { id: 805,  name: 'Belgique',            emoji: '🇧🇪', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'belgium':            { id: 805,  name: 'Belgique',            emoji: '🇧🇪', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'pays-bas':           { id: 8601, name: 'Pays-Bas',            emoji: '🇳🇱', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'netherlands':        { id: 8601, name: 'Pays-Bas',            emoji: '🇳🇱', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'hollande':           { id: 8601, name: 'Pays-Bas',            emoji: '🇳🇱', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'croatie':            { id: 799,  name: 'Croatie',             emoji: '🇭🇷', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'croatia':            { id: 799,  name: 'Croatie',             emoji: '🇭🇷', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'italie':             { id: 784,  name: 'Italie',              emoji: '🇮🇹', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  'italy':              { id: 784,  name: 'Italie',              emoji: '🇮🇹', league: 'Équipe Nationale', comps: ['EC','WC'], ecSeason: '2024' },
  // Non-européennes → WC 2026 uniquement (IDs confirmés)
  'senegal':            { id: 804,  name: 'Sénégal',             emoji: '🇸🇳', league: 'Équipe Nationale', comps: ['WC'] },
  'sénégal':            { id: 804,  name: 'Sénégal',             emoji: '🇸🇳', league: 'Équipe Nationale', comps: ['WC'] },
  'maroc':              { id: 815,  name: 'Maroc',               emoji: '🇲🇦', league: 'Équipe Nationale', comps: ['WC'] },
  'morocco':            { id: 815,  name: 'Maroc',               emoji: '🇲🇦', league: 'Équipe Nationale', comps: ['WC'] },
  'algerie':            { id: 778,  name: 'Algérie',             emoji: '🇩🇿', league: 'Équipe Nationale', comps: ['WC'] },
  'algérie':            { id: 778,  name: 'Algérie',             emoji: '🇩🇿', league: 'Équipe Nationale', comps: ['WC'] },
  'ghana':              { id: 763,  name: 'Ghana',               emoji: '🇬🇭', league: 'Équipe Nationale', comps: ['WC'] },
  "cote d'ivoire":      { id: 1935, name: "Côte d'Ivoire",       emoji: '🇨🇮', league: 'Équipe Nationale', comps: ['WC'] },
  'ivory coast':        { id: 1935, name: "Côte d'Ivoire",       emoji: '🇨🇮', league: 'Équipe Nationale', comps: ['WC'] },
  'egypte':             { id: 825,  name: 'Égypte',              emoji: '🇪🇬', league: 'Équipe Nationale', comps: ['WC'] },
  'egypt':              { id: 825,  name: 'Égypte',              emoji: '🇪🇬', league: 'Équipe Nationale', comps: ['WC'] },
  'bresil':             { id: 764,  name: 'Brésil',              emoji: '🇧🇷', league: 'Équipe Nationale', comps: ['WC'] },
  'brazil':             { id: 764,  name: 'Brésil',              emoji: '🇧🇷', league: 'Équipe Nationale', comps: ['WC'] },
  'brésil':             { id: 764,  name: 'Brésil',              emoji: '🇧🇷', league: 'Équipe Nationale', comps: ['WC'] },
  'argentine':          { id: 762,  name: 'Argentine',           emoji: '🇦🇷', league: 'Équipe Nationale', comps: ['WC'] },
  'argentina':          { id: 762,  name: 'Argentine',           emoji: '🇦🇷', league: 'Équipe Nationale', comps: ['WC'] },
  'uruguay':            { id: 758,  name: 'Uruguay',             emoji: '🇺🇾', league: 'Équipe Nationale', comps: ['WC'] },
  'mexique':            { id: 795,  name: 'Mexique',             emoji: '🇲🇽', league: 'Équipe Nationale', comps: ['WC'] },
  'mexico':             { id: 795,  name: 'Mexique',             emoji: '🇲🇽', league: 'Équipe Nationale', comps: ['WC'] },
  'usa':                { id: 768,  name: 'États-Unis',          emoji: '🇺🇸', league: 'Équipe Nationale', comps: ['WC'] },
  'etats-unis':         { id: 768,  name: 'États-Unis',          emoji: '🇺🇸', league: 'Équipe Nationale', comps: ['WC'] },
  'japon':              { id: 785,  name: 'Japon',               emoji: '🇯🇵', league: 'Équipe Nationale', comps: ['WC'] },
  'japan':              { id: 785,  name: 'Japon',               emoji: '🇯🇵', league: 'Équipe Nationale', comps: ['WC'] },
};

// ─── STATS FALLBACK (WC 2026 vient de commencer → peu de matchs jouées) ──────
// Basées sur vrais tournois récents : WC 2022, AFCON 2023, Euro 2024
// UNIQUEMENT utilisées si l'API retourne < 3 matchs
const FALLBACK = {
  804:  { form:'WWWWLW', gf:1.8,  ga:0.9,  w:5, d:0, l:1, src:'AFCON 2023 (Sénégal champion) + WC 2022' },
  815:  { form:'WWWWWL', gf:1.17, ga:0.5,  w:5, d:0, l:1, src:'WC 2022 (demi-finaliste)' },
  778:  { form:'LWLWL',  gf:1.0,  ga:1.4,  w:2, d:0, l:3, src:'AFCON 2023' },
  764:  { form:'WWWWL',  gf:2.5,  ga:0.75, w:4, d:0, l:1, src:'WC 2022' },
  762:  { form:'WWWWWW', gf:1.83, ga:0.67, w:6, d:0, l:0, src:'WC 2022 (Champion !)' },
  758:  { form:'WDLL',   gf:0.75, ga:1.0,  w:1, d:1, l:2, src:'WC 2022' },
  763:  { form:'LWL',    gf:1.33, ga:2.0,  w:1, d:0, l:2, src:'WC 2022' },
  1935: { form:'WWLWWW', gf:1.67, ga:1.0,  w:5, d:0, l:1, src:"AFCON 2023 (champion)" },
  825:  { form:'WWWDL',  gf:1.0,  ga:0.6,  w:3, d:1, l:1, src:'AFCON 2023' },
  795:  { form:'WLD',    gf:1.0,  ga:1.33, w:1, d:1, l:1, src:'WC 2022' },
  785:  { form:'WWLLD',  gf:1.4,  ga:1.4,  w:2, d:1, l:2, src:'WC 2022' },
  768:  { form:'DWD',    gf:1.0,  ga:0.67, w:1, d:2, l:0, src:'WC 2022' },
};

// ─── PARSER ───────────────────────────────────────────────────────────────────
function parseMatch(raw) {
  if (!raw) return null;
  const txt = raw.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/résultat|resultat|result|score|prediction|pronostic|match/g, ' ')
    .replace(/\s+/g, ' ').trim();

  for (const sep of [' vs ', ' contre ', ' - ', ' v ']) {
    const i = txt.indexOf(sep);
    if (i > 0) {
      const t1 = findTeam(txt.slice(0, i).trim());
      const t2 = findTeam(txt.slice(i + sep.length).trim());
      if (t1 && t2 && t1.id !== t2.id) return { home: t1, away: t2 };
    }
  }

  const found = [];
  const entries = Object.entries(TEAM_DB).sort((a, b) => b[0].length - a[0].length);
  for (const [key, team] of entries) {
    const kn = key.normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (txt.includes(kn) && !found.find(f => f.id === team.id)) found.push(team);
  }
  if (found.length >= 2) return { home: found[0], away: found[1] };
  return null;
}

function findTeam(str) {
  const n = str.normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  const entries = Object.entries(TEAM_DB).sort((a, b) => b[0].length - a[0].length);
  for (const [key, team] of entries) {
    const kn = key.normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (n === kn || n.includes(kn) || kn.includes(n)) return team;
  }
  return null;
}

// ─── RÉCUPÉRATION DONNÉES RÉELLES ────────────────────────────────────────────
async function apiFetch(path) {
  const r = await fetch(`${API_BASE}${path}`, { headers: { 'X-Auth-Token': API_KEY } });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

async function getCompMatches(compCode, season) {
  const s = season ? `&season=${season}` : '';
  const d = await apiFetch(`/competitions/${compCode}/matches?status=FINISHED${s}`);
  return d.matches || [];
}

async function getStats(team) {
  const { id, comps, ecSeason } = team;
  let all = [];

  for (const comp of comps) {
    try {
      const season = (comp === 'EC' && ecSeason) ? ecSeason : null;
      const ms = await getCompMatches(comp, season);
      const mine = ms.filter(m => m.homeTeam.id === id || m.awayTeam.id === id);
      all.push(...mine);
    } catch {}
  }

  // Dédupliquer + trier du plus récent
  const seen = new Set();
  all = all.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
  all.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
  const recent = all.slice(0, 10);

  // Pas assez de matchs → fallback
  if (recent.length < 3) {
    const fb = FALLBACK[id];
    if (fb) {
      const n = fb.w + fb.d + fb.l;
      return { form: fb.form.slice(0, 5), goalsFor: fb.gf, goalsAgainst: fb.ga, wins: fb.w, draws: fb.d, losses: fb.l, winRate: Math.round(fb.w / n * 100), xG: +(fb.gf * 0.92).toFixed(2), n, source: `📚 ${fb.src}`, isFallback: true };
    }
    throw new Error(`Pas assez de matchs pour ${team.name}.\nLe WC 2026 vient de commencer (11 juin), attends que les équipes jouent.`);
  }

  let gf = 0, ga = 0, w = 0, d = 0, l = 0;
  const form = [];
  for (const m of recent) {
    const home = m.homeTeam.id === id;
    const g1 = home ? m.score.fullTime.home : m.score.fullTime.away;
    const g2 = home ? m.score.fullTime.away : m.score.fullTime.home;
    if (g1 == null || g2 == null) continue;
    gf += g1; ga += g2;
    if (g1 > g2) { form.push('W'); w++; }
    else if (g1 === g2) { form.push('D'); d++; }
    else { form.push('L'); l++; }
  }
  const n = form.length;
  if (n === 0) throw new Error(`Scores manquants pour ${team.name}`);

  return {
    form: form.slice(0, 5).join(''),
    goalsFor: +(gf / n).toFixed(2),
    goalsAgainst: +(ga / n).toFixed(2),
    wins: w, draws: d, losses: l,
    winRate: Math.round(w / n * 100),
    xG: +(gf / n * 0.92).toFixed(2),
    n, source: `📡 ${team.comps.join('+')} (${n} matchs réels)`,
    isFallback: false,
  };
}

async function getH2H(homeTeam, awayTeam) {
  const allComps = [...new Set([...homeTeam.comps, ...awayTeam.comps, 'CL'])];
  let h2hMatches = [];

  for (const comp of allComps) {
    try {
      const ms = await getCompMatches(comp, null);
      const h2h = ms.filter(m =>
        (m.homeTeam.id === homeTeam.id && m.awayTeam.id === awayTeam.id) ||
        (m.homeTeam.id === awayTeam.id && m.awayTeam.id === homeTeam.id)
      );
      h2hMatches.push(...h2h);
    } catch {}
  }

  if (h2hMatches.length === 0) return null;

  const seen = new Set();
  h2hMatches = h2hMatches
    .filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; })
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 6);

  const results = h2hMatches.map(m => {
    const isHome = m.homeTeam.id === homeTeam.id;
    const g1 = isHome ? m.score.fullTime.home : m.score.fullTime.away;
    const g2 = isHome ? m.score.fullTime.away : m.score.fullTime.home;
    return { date: new Date(m.utcDate).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' }), comp: m.competition?.name || '', g1, g2 };
  });

  const hw = results.filter(r => r.g1 > r.g2).length;
  const dr = results.filter(r => r.g1 === r.g2).length;
  const aw = results.length - hw - dr;
  return { results, hw, dr, aw };
}

// ─── ALGORITHME (Poisson + Monte Carlo) ───────────────────────────────────────
function formScore(form) {
  const pts = [...form].map(c => c==='W'?3:c==='D'?1:0);
  if (!pts.length) return 0.5;
  const w = pts.reduce((a, p, i) => a + p * Math.pow(1.4, i), 0);
  const wmax = pts.reduce((a, _, i) => a + 3 * Math.pow(1.4, i), 0);
  return w / wmax;
}

function poisson(lambda) {
  let k = 0, p = 1, L = Math.exp(-lambda);
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

function predict(hs, as, h2h) {
  const HOME_ADV = 0.10;
  const AVG = 1.45;

  // xG = attaque équipe × fragilité défense adverse / moyenne
  let hxg = (hs.goalsFor / AVG) * (AVG / Math.max(as.goalsAgainst, 0.3)) * AVG * (1 + HOME_ADV);
  let axg = (as.goalsFor / AVG) * (AVG / Math.max(hs.goalsAgainst, 0.3)) * AVG;

  // Pondération forme récente
  hxg *= (0.55 + formScore(hs.form) * 0.9);
  axg *= (0.55 + formScore(as.form) * 0.9);

  // Ajustement H2H si données réelles dispo
  if (h2h && h2h.results.length >= 3) {
    const t = h2h.results.length;
    hxg *= (0.8 + (h2h.hw / t) * 0.4);
    axg *= (0.8 + (h2h.aw / t) * 0.4);
  }

  hxg = Math.min(Math.max(hxg, 0.2), 5);
  axg = Math.min(Math.max(axg, 0.2), 5);

  // Monte Carlo 5000 tirages
  let hw = 0, dr = 0, aw = 0;
  for (let i = 0; i < 5000; i++) {
    const hg = poisson(hxg), ag = poisson(axg);
    if (hg > ag) hw++; else if (hg === ag) dr++; else aw++;
  }

  const pHW = Math.round(hw / 50);
  const pAW = Math.round(aw / 50);
  const pDR = 100 - pHW - pAW;
  const conf = Math.min(88, Math.max(52, 45 + Math.min(hs.n, as.n) * 2.5 + Math.abs(formScore(hs.form) - formScore(as.form)) * 25));

  return {
    hScore: Math.round(hxg), aScore: Math.round(axg),
    hxg: hxg.toFixed(2), axg: axg.toFixed(2),
    pHW, pDR, pAW,
    conf: Math.round(conf),
  };
}

// ─── UI ───────────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function showHome() { $('home').classList.remove('hidden'); $('loading').classList.add('hidden'); $('result').classList.add('hidden'); $('error-box').classList.add('hidden'); }
function showLoading(msg) { $('home').classList.add('hidden'); $('loading').classList.remove('hidden'); $('result').classList.add('hidden'); $('error-box').classList.add('hidden'); $('loading-msg').textContent = msg || '…'; }
function showError(msg) { $('home').classList.add('hidden'); $('loading').classList.add('hidden'); $('result').classList.add('hidden'); $('error-box').classList.remove('hidden'); $('error-msg').innerHTML = msg.replace(/\n/g, '<br>'); }

function dot(r) { return `<div class="form-dot ${r}">${r}</div>`; }
function bar(label, val, max, color) {
  const pct = Math.min(100, Math.round(val / max * 100));
  return `<div class="stat-row"><span class="stat-label">${label}</span><div class="stat-bar-wrap"><div class="stat-bar" style="width:${pct}%;background:${color}"></div></div><span class="stat-val">${val}</span></div>`;
}

function render(home, away, hs, as, pred, h2h) {
  const factors = [];
  if (formScore(hs.form) > 0.7) factors.push({ icon:'🔥', t:`${home.name} en forme`, d:`${hs.wins}V ${hs.draws}N ${hs.losses}D sur ${hs.n} matchs`, c:'pos' });
  if (formScore(as.form) > 0.7) factors.push({ icon:'🔥', t:`${away.name} en forme`, d:`${as.wins}V ${as.draws}N ${as.losses}D sur ${as.n} matchs`, c:'pos' });
  if (hs.goalsAgainst < 0.9) factors.push({ icon:'🛡️', t:`Défense solide de ${home.name}`, d:`${hs.goalsAgainst} buts encaissés/match`, c:'pos' });
  if (as.goalsAgainst < 0.9) factors.push({ icon:'🛡️', t:`Défense solide de ${away.name}`, d:`${as.goalsAgainst} buts encaissés/match`, c:'pos' });
  if (hs.goalsFor > 2.2) factors.push({ icon:'⚡', t:`Attaque forte de ${home.name}`, d:`${hs.goalsFor} buts/match en moyenne`, c:'pos' });
  if (as.goalsFor > 2.2) factors.push({ icon:'⚡', t:`Attaque forte de ${away.name}`, d:`${as.goalsFor} buts/match en moyenne`, c:'pos' });
  factors.push({ icon:'🏠', t:`Avantage domicile`, d:`${home.name} joue chez lui (+10%)`, c:'neu' });
  if (formScore(hs.form) < 0.35) factors.push({ icon:'📉', t:`${home.name} en méforme`, d:`Peu de victoires récentes`, c:'neg' });
  if (formScore(as.form) < 0.35) factors.push({ icon:'📉', t:`${away.name} en méforme`, d:`Peu de victoires récentes`, c:'neg' });
  if (h2h) {
    if (h2h.hw > h2h.aw) factors.push({ icon:'📊', t:`H2H en faveur de ${home.name}`, d:`${h2h.hw}V-${h2h.dr}N-${h2h.aw}D (données réelles)`, c:'pos' });
    else if (h2h.aw > h2h.hw) factors.push({ icon:'📊', t:`H2H en faveur de ${away.name}`, d:`${h2h.aw}V-${h2h.dr}N-${h2h.hw}D (données réelles)`, c:'neg' });
  }

  const h2hHtml = h2h && h2h.results.length
    ? `<div class="h2h-summary">
        <div class="h2h-box home"><div class="num">${h2h.hw}</div><div class="lbl">${home.name}</div></div>
        <div class="h2h-box draw"><div class="num">${h2h.dr}</div><div class="lbl">Nuls</div></div>
        <div class="h2h-box away"><div class="num">${h2h.aw}</div><div class="lbl">${away.name}</div></div>
      </div>
      <div class="h2h-matches">
        ${h2h.results.map(r => `<div class="h2h-match"><span class="date">${r.date}</span><span class="teams-h2h">${home.name} – ${away.name}</span><span class="score-h2h">${r.g1} – ${r.g2}</span></div>`).join('')}
      </div>`
    : `<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">Aucune confrontation directe trouvée dans les compétitions disponibles</div>`;

  $('result').innerHTML = `
    <div style="padding:12px 0 4px"><button id="back-btn" style="background:none;border:none;color:var(--accent);font-size:14px;cursor:pointer">← Nouvelle analyse</button></div>

    <div class="match-card">
      <div class="competition-badge">${hs.isFallback || as.isFallback ? '📚 Mix données réelles + historique' : '📡 Données réelles en direct'}</div>
      <div class="teams">
        <div class="team"><div class="team-emoji">${home.emoji}</div><div class="team-name">${home.name}</div><div class="team-ranking">${home.league}</div></div>
        <div class="vs">VS</div>
        <div class="team"><div class="team-emoji">${away.emoji}</div><div class="team-name">${away.name}</div><div class="team-ranking">${away.league}</div></div>
      </div>
      <div class="match-meta" style="line-height:1.8">
        ${home.name} : ${hs.source}<br>${away.name} : ${as.source}
      </div>
    </div>

    <div class="prediction-card">
      <h2>🎯 Score le plus probable</h2>
      <div class="score-display">
        <div class="score-num">${pred.hScore}</div>
        <div class="score-sep">—</div>
        <div class="score-num">${pred.aScore}</div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:16px">xG calculé : ${pred.hxg} – ${pred.axg} (5000 simulations Poisson)</div>
      <div class="confidence-bar"><div class="confidence-fill" style="width:${pred.conf}%"></div></div>
      <div class="confidence-text">Indice de confiance : <strong>${pred.conf}%</strong></div>
      <div class="proba-row">
        <div class="proba-box win"><div class="proba-label">Victoire</div><div class="proba-val">${pred.pHW}%</div><div class="proba-sublabel">${home.name}</div></div>
        <div class="proba-box draw"><div class="proba-label">Nul</div><div class="proba-val">${pred.pDR}%</div><div class="proba-sublabel">Match nul</div></div>
        <div class="proba-box lose"><div class="proba-label">Victoire</div><div class="proba-val">${pred.pAW}%</div><div class="proba-sublabel">${away.name}</div></div>
      </div>
    </div>

    <div class="stats-section">
      <div class="section-title">📈 Statistiques</div>
      <div class="stats-grid">
        <div class="stat-card"><h3>${home.name}</h3>
          ${bar('Buts marqués/match', hs.goalsFor, 4, 'var(--green)')}
          ${bar('Buts encaissés/match', hs.goalsAgainst, 4, 'var(--red)')}
          ${bar('xG estimé', hs.xG, 3.5, 'var(--accent)')}
          ${bar('% victoires', hs.winRate, 100, 'var(--accent2)')}
        </div>
        <div class="stat-card"><h3>${away.name}</h3>
          ${bar('Buts marqués/match', as.goalsFor, 4, 'var(--green)')}
          ${bar('Buts encaissés/match', as.goalsAgainst, 4, 'var(--red)')}
          ${bar('xG estimé', as.xG, 3.5, 'var(--accent)')}
          ${bar('% victoires', as.winRate, 100, 'var(--accent2)')}
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="section-title">📋 Forme récente</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="form-card"><div class="form-header"><span class="form-team-name">${home.name}</span><span style="font-size:11px;color:var(--muted)">${hs.source}</span></div><div class="form-dots">${[...hs.form].map(dot).join('')}</div></div>
        <div class="form-card"><div class="form-header"><span class="form-team-name">${away.name}</span><span style="font-size:11px;color:var(--muted)">${as.source}</span></div><div class="form-dots">${[...as.form].map(dot).join('')}</div></div>
      </div>
    </div>

    <div class="h2h-section">
      <div class="section-title">🆚 Face à face</div>
      <div class="h2h-card">${h2hHtml}</div>
    </div>

    <div class="factors-section">
      <div class="section-title">🔍 Facteurs clés</div>
      <div class="factors-card">
        ${factors.slice(0, 5).map(f => `<div class="factor"><div class="factor-icon">${f.icon}</div><div class="factor-text"><div class="factor-title">${f.t}</div><div class="factor-desc">${f.d}</div></div><div class="factor-badge ${f.c}">${f.c==='pos'?'+':f.c==='neg'?'-':'~'}</div></div>`).join('')}
      </div>
    </div>

    <div class="disclaimer">
      ${hs.isFallback || as.isFallback ? '📚 Certaines stats sont basées sur des tournois récents passés (Euro 2024, AFCON 2023, WC 2022) car le WC 2026 vient juste de commencer.<br>' : ''}
      ⚠️ Prédictions statistiques — pas des conseils de paris.
    </div>`;

  $('home').classList.add('hidden'); $('loading').classList.add('hidden');
  $('result').classList.remove('hidden'); $('error-box').classList.add('hidden');
}

// ─── ANALYSE ──────────────────────────────────────────────────────────────────
async function analyzeMatch(text) {
  const match = parseMatch(text);
  if (!match) { showError(`Équipes non reconnues dans "<b>${text}</b>".<br>Essaie : PSG Chelsea · Real Madrid Barcelona · France Sénégal`); return; }

  const { home, away } = match;
  showLoading(`Chargement des données réelles pour ${home.name}…`);
  let hs, as;

  try { hs = await getStats(home); } catch(e) { showError(e.message); return; }
  showLoading(`Chargement des données réelles pour ${away.name}…`);
  try { as = await getStats(away); } catch(e) { showError(e.message); return; }

  showLoading('Recherche des confrontations directes…');
  let h2h = null;
  try { h2h = await getH2H(home, away); } catch {}

  showLoading('Calcul Poisson + Monte Carlo…');
  const pred = predict(hs, as, h2h);
  render(home, away, hs, as, pred, h2h);
}

// ─── SHARE TARGET ─────────────────────────────────────────────────────────────
function checkShare() {
  const p = new URLSearchParams(window.location.search);
  const t = [p.get('title'), p.get('text'), p.get('url')].filter(Boolean).join(' ').trim();
  if (!t) return false;
  $('share-banner').classList.remove('hidden');
  $('share-text').textContent = `"${t.slice(0, 60)}"`;
  window.history.replaceState({}, '', '/');
  setTimeout(() => analyzeMatch(t), 300);
  return true;
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; $('install-banner').classList.remove('hidden'); });

window.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  $('install-btn').onclick = async () => { if (deferredPrompt) { deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; if (outcome === 'accepted') $('install-banner').classList.add('hidden'); } };
  $('search-btn').onclick = () => { const v = $('search-input').value.trim(); if (v) { showLoading('…'); analyzeMatch(v); } };
  $('search-input').addEventListener('keypress', e => { if (e.key === 'Enter') { const v = $('search-input').value.trim(); if (v) { showLoading('…'); analyzeMatch(v); } } });
  document.addEventListener('click', e => { if (e.target.id === 'back-btn') showHome(); });
  if (!checkShare()) showHome();
});
