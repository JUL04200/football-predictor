'use strict';

const API_BASE = 'https://api.football-data.org/v4';
let API_KEY = localStorage.getItem('fd_api_key') || '3c68cf8da2ef4dc7bc2bc71a2bd164c1';

// ─── BASE D'ÉQUIPES (IDs vérifiés via API) ────────────────────────────────────
// comp = code compétition principale pour récupérer les matchs
const TEAM_DB = {
  // Ligue 1 (comp: FL1)
  'psg': { id: 524, name: 'Paris Saint-Germain', emoji: '🔵🔴', league: 'Ligue 1', comp: 'FL1' },
  'paris saint-germain': { id: 524, name: 'Paris Saint-Germain', emoji: '🔵🔴', league: 'Ligue 1', comp: 'FL1' },
  'paris': { id: 524, name: 'Paris Saint-Germain', emoji: '🔵🔴', league: 'Ligue 1', comp: 'FL1' },
  'marseille': { id: 516, name: 'Olympique de Marseille', emoji: '🔵⚪', league: 'Ligue 1', comp: 'FL1' },
  'om': { id: 516, name: 'Olympique de Marseille', emoji: '🔵⚪', league: 'Ligue 1', comp: 'FL1' },
  'lyon': { id: 523, name: 'Olympique Lyonnais', emoji: '🔴⚪', league: 'Ligue 1', comp: 'FL1' },
  'ol': { id: 523, name: 'Olympique Lyonnais', emoji: '🔴⚪', league: 'Ligue 1', comp: 'FL1' },
  'monaco': { id: 548, name: 'AS Monaco', emoji: '🔴⚪', league: 'Ligue 1', comp: 'FL1' },
  'nice': { id: 522, name: 'OGC Nice', emoji: '🔴⚫', league: 'Ligue 1', comp: 'FL1' },
  'lens': { id: 546, name: 'RC Lens', emoji: '🟡🔴', league: 'Ligue 1', comp: 'FL1' },
  'rennes': { id: 529, name: 'Stade Rennais', emoji: '🔴⚫', league: 'Ligue 1', comp: 'FL1' },
  'lille': { id: 521, name: 'LOSC Lille', emoji: '🔴⚪', league: 'Ligue 1', comp: 'FL1' },
  'losc': { id: 521, name: 'LOSC Lille', emoji: '🔴⚪', league: 'Ligue 1', comp: 'FL1' },
  'nantes': { id: 543, name: 'FC Nantes', emoji: '🟡🟢', league: 'Ligue 1', comp: 'FL1' },
  'strasbourg': { id: 576, name: 'RC Strasbourg', emoji: '🔵⚪', league: 'Ligue 1', comp: 'FL1' },
  'saint-etienne': { id: 519, name: 'AS Saint-Étienne', emoji: '🟢⚪', league: 'Ligue 1', comp: 'FL1' },
  'asse': { id: 519, name: 'AS Saint-Étienne', emoji: '🟢⚪', league: 'Ligue 1', comp: 'FL1' },
  // Premier League (comp: PL)
  'chelsea': { id: 61, name: 'Chelsea FC', emoji: '🔵', league: 'Premier League', comp: 'PL' },
  'manchester city': { id: 65, name: 'Manchester City', emoji: '🔵', league: 'Premier League', comp: 'PL' },
  'man city': { id: 65, name: 'Manchester City', emoji: '🔵', league: 'Premier League', comp: 'PL' },
  'manchester united': { id: 66, name: 'Manchester United', emoji: '🔴', league: 'Premier League', comp: 'PL' },
  'man united': { id: 66, name: 'Manchester United', emoji: '🔴', league: 'Premier League', comp: 'PL' },
  'man utd': { id: 66, name: 'Manchester United', emoji: '🔴', league: 'Premier League', comp: 'PL' },
  'arsenal': { id: 57, name: 'Arsenal', emoji: '🔴⚪', league: 'Premier League', comp: 'PL' },
  'liverpool': { id: 64, name: 'Liverpool', emoji: '🔴', league: 'Premier League', comp: 'PL' },
  'tottenham': { id: 73, name: 'Tottenham Hotspur', emoji: '⚪', league: 'Premier League', comp: 'PL' },
  'spurs': { id: 73, name: 'Tottenham Hotspur', emoji: '⚪', league: 'Premier League', comp: 'PL' },
  'newcastle': { id: 67, name: 'Newcastle United', emoji: '⚫⚪', league: 'Premier League', comp: 'PL' },
  'aston villa': { id: 58, name: 'Aston Villa', emoji: '🟣🔵', league: 'Premier League', comp: 'PL' },
  'west ham': { id: 563, name: 'West Ham United', emoji: '🔵🔴', league: 'Premier League', comp: 'PL' },
  'brighton': { id: 397, name: 'Brighton', emoji: '🔵⚪', league: 'Premier League', comp: 'PL' },
  'everton': { id: 62, name: 'Everton', emoji: '🔵', league: 'Premier League', comp: 'PL' },
  // La Liga (comp: PD)
  'real madrid': { id: 86, name: 'Real Madrid', emoji: '⚪', league: 'La Liga', comp: 'PD' },
  'barcelona': { id: 81, name: 'FC Barcelona', emoji: '🔵🔴', league: 'La Liga', comp: 'PD' },
  'barca': { id: 81, name: 'FC Barcelona', emoji: '🔵🔴', league: 'La Liga', comp: 'PD' },
  'atletico madrid': { id: 78, name: 'Atlético de Madrid', emoji: '🔴⚪', league: 'La Liga', comp: 'PD' },
  'atletico': { id: 78, name: 'Atlético de Madrid', emoji: '🔴⚪', league: 'La Liga', comp: 'PD' },
  'sevilla': { id: 559, name: 'Sevilla FC', emoji: '⚪🔴', league: 'La Liga', comp: 'PD' },
  'villarreal': { id: 94, name: 'Villarreal CF', emoji: '🟡', league: 'La Liga', comp: 'PD' },
  'real sociedad': { id: 92, name: 'Real Sociedad', emoji: '🔵⚪', league: 'La Liga', comp: 'PD' },
  // Bundesliga (comp: BL1)
  'bayern munich': { id: 5, name: 'Bayern München', emoji: '🔴', league: 'Bundesliga', comp: 'BL1' },
  'bayern': { id: 5, name: 'Bayern München', emoji: '🔴', league: 'Bundesliga', comp: 'BL1' },
  'borussia dortmund': { id: 4, name: 'Borussia Dortmund', emoji: '🟡⚫', league: 'Bundesliga', comp: 'BL1' },
  'dortmund': { id: 4, name: 'Borussia Dortmund', emoji: '🟡⚫', league: 'Bundesliga', comp: 'BL1' },
  'bvb': { id: 4, name: 'Borussia Dortmund', emoji: '🟡⚫', league: 'Bundesliga', comp: 'BL1' },
  'rb leipzig': { id: 721, name: 'RB Leipzig', emoji: '🔴⚪', league: 'Bundesliga', comp: 'BL1' },
  'bayer leverkusen': { id: 3, name: 'Bayer Leverkusen', emoji: '🔴⚫', league: 'Bundesliga', comp: 'BL1' },
  'leverkusen': { id: 3, name: 'Bayer Leverkusen', emoji: '🔴⚫', league: 'Bundesliga', comp: 'BL1' },
  // Serie A (comp: SA)
  'juventus': { id: 109, name: 'Juventus FC', emoji: '⚫⚪', league: 'Serie A', comp: 'SA' },
  'juve': { id: 109, name: 'Juventus FC', emoji: '⚫⚪', league: 'Serie A', comp: 'SA' },
  'inter milan': { id: 108, name: 'Inter Milan', emoji: '🔵⚫', league: 'Serie A', comp: 'SA' },
  'inter': { id: 108, name: 'Inter Milan', emoji: '🔵⚫', league: 'Serie A', comp: 'SA' },
  'ac milan': { id: 98, name: 'AC Milan', emoji: '🔴⚫', league: 'Serie A', comp: 'SA' },
  'milan': { id: 98, name: 'AC Milan', emoji: '🔴⚫', league: 'Serie A', comp: 'SA' },
  'napoli': { id: 113, name: 'SSC Napoli', emoji: '🔵', league: 'Serie A', comp: 'SA' },
  'roma': { id: 100, name: 'AS Roma', emoji: '🔴🟡', league: 'Serie A', comp: 'SA' },
  'as roma': { id: 100, name: 'AS Roma', emoji: '🔴🟡', league: 'Serie A', comp: 'SA' },
  'lazio': { id: 110, name: 'SS Lazio', emoji: '🔵⚪', league: 'Serie A', comp: 'SA' },
  // Équipes nationales (IDs vérifiés depuis l'API WC 2026)
  // Européennes → EC (Euro 2024) + WC 2026
  'france': { id: 773, name: 'France', emoji: '🇫🇷', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'les bleus': { id: 773, name: 'France', emoji: '🇫🇷', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'allemagne': { id: 759, name: 'Allemagne', emoji: '🇩🇪', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'germany': { id: 759, name: 'Allemagne', emoji: '🇩🇪', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'espagne': { id: 760, name: 'Espagne', emoji: '🇪🇸', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'spain': { id: 760, name: 'Espagne', emoji: '🇪🇸', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'angleterre': { id: 770, name: 'Angleterre', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'england': { id: 770, name: 'Angleterre', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'portugal': { id: 765, name: 'Portugal', emoji: '🇵🇹', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'belgique': { id: 805, name: 'Belgique', emoji: '🇧🇪', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'belgium': { id: 805, name: 'Belgique', emoji: '🇧🇪', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'pays-bas': { id: 8601, name: 'Pays-Bas', emoji: '🇳🇱', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'netherlands': { id: 8601, name: 'Pays-Bas', emoji: '🇳🇱', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'hollande': { id: 8601, name: 'Pays-Bas', emoji: '🇳🇱', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'croatie': { id: 799, name: 'Croatie', emoji: '🇭🇷', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'croatia': { id: 799, name: 'Croatie', emoji: '🇭🇷', league: 'Équipe Nationale', comp: 'EC', comp2: 'WC' },
  'italie': { id: 784, name: 'Italie', emoji: '🇮🇹', league: 'Équipe Nationale', comp: 'EC' },
  'italy': { id: 784, name: 'Italie', emoji: '🇮🇹', league: 'Équipe Nationale', comp: 'EC' },
  // Non-européennes → WC uniquement
  'senegal': { id: 804, name: 'Sénégal', emoji: '🇸🇳', league: 'Équipe Nationale', comp: 'WC' },
  'sénégal': { id: 804, name: 'Sénégal', emoji: '🇸🇳', league: 'Équipe Nationale', comp: 'WC' },
  'maroc': { id: 815, name: 'Maroc', emoji: '🇲🇦', league: 'Équipe Nationale', comp: 'WC' },
  'morocco': { id: 815, name: 'Maroc', emoji: '🇲🇦', league: 'Équipe Nationale', comp: 'WC' },
  'algerie': { id: 778, name: 'Algérie', emoji: '🇩🇿', league: 'Équipe Nationale', comp: 'WC' },
  'algérie': { id: 778, name: 'Algérie', emoji: '🇩🇿', league: 'Équipe Nationale', comp: 'WC' },
  'ghana': { id: 763, name: 'Ghana', emoji: '🇬🇭', league: 'Équipe Nationale', comp: 'WC' },
  "cote d'ivoire": { id: 1935, name: "Côte d'Ivoire", emoji: '🇨🇮', league: 'Équipe Nationale', comp: 'WC' },
  'ivory coast': { id: 1935, name: "Côte d'Ivoire", emoji: '🇨🇮', league: 'Équipe Nationale', comp: 'WC' },
  'egypte': { id: 825, name: 'Égypte', emoji: '🇪🇬', league: 'Équipe Nationale', comp: 'WC' },
  'egypt': { id: 825, name: 'Égypte', emoji: '🇪🇬', league: 'Équipe Nationale', comp: 'WC' },
  'bresil': { id: 764, name: 'Brésil', emoji: '🇧🇷', league: 'Équipe Nationale', comp: 'WC' },
  'brazil': { id: 764, name: 'Brésil', emoji: '🇧🇷', league: 'Équipe Nationale', comp: 'WC' },
  'brésil': { id: 764, name: 'Brésil', emoji: '🇧🇷', league: 'Équipe Nationale', comp: 'WC' },
  'argentine': { id: 762, name: 'Argentine', emoji: '🇦🇷', league: 'Équipe Nationale', comp: 'WC' },
  'argentina': { id: 762, name: 'Argentine', emoji: '🇦🇷', league: 'Équipe Nationale', comp: 'WC' },
  'uruguay': { id: 758, name: 'Uruguay', emoji: '🇺🇾', league: 'Équipe Nationale', comp: 'WC' },
  'mexique': { id: 795, name: 'Mexique', emoji: '🇲🇽', league: 'Équipe Nationale', comp: 'WC' },
  'mexico': { id: 795, name: 'Mexique', emoji: '🇲🇽', league: 'Équipe Nationale', comp: 'WC' },
  'usa': { id: 768, name: 'États-Unis', emoji: '🇺🇸', league: 'Équipe Nationale', comp: 'WC' },
  'etats-unis': { id: 768, name: 'États-Unis', emoji: '🇺🇸', league: 'Équipe Nationale', comp: 'WC' },
  'japon': { id: 785, name: 'Japon', emoji: '🇯🇵', league: 'Équipe Nationale', comp: 'WC' },
  'japan': { id: 785, name: 'Japon', emoji: '🇯🇵', league: 'Équipe Nationale', comp: 'WC' },
};

// ─── PARSER ───────────────────────────────────────────────────────────────────
function parseMatch(text) {
  if (!text) return null;
  const lower = text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // enlever accents pour la recherche
    .replace(/résultat|resultat|result|score|prediction|pronostic|match/g, ' ')
    .replace(/\s+/g, ' ').trim();

  const separators = [' vs ', ' contre ', ' - ', ' v '];
  for (const sep of separators) {
    const idx = lower.indexOf(sep);
    if (idx > 0) {
      const t1 = findTeam(lower.slice(0, idx).trim());
      const t2 = findTeam(lower.slice(idx + sep.length).trim());
      if (t1 && t2 && t1.id !== t2.id) return { home: t1, away: t2 };
    }
  }

  // Cherche toutes les équipes dans le texte, trier par longueur de match
  const found = [];
  const entries = Object.entries(TEAM_DB).sort((a, b) => b[0].length - a[0].length);
  for (const [key, team] of entries) {
    const keyNorm = key.normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (lower.includes(keyNorm) && !found.find(f => f.id === team.id)) {
      found.push(team);
    }
  }
  if (found.length >= 2) return { home: found[0], away: found[1] };
  return null;
}

function findTeam(str) {
  const norm = str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const entries = Object.entries(TEAM_DB).sort((a, b) => b[0].length - a[0].length);
  for (const [key, team] of entries) {
    const keyNorm = key.normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (norm === keyNorm || norm.includes(keyNorm) || keyNorm.includes(norm)) return team;
  }
  return null;
}

// ─── API CALLS ────────────────────────────────────────────────────────────────
async function apiFetch(path) {
  const r = await fetch(`${API_BASE}${path}`, { headers: { 'X-Auth-Token': API_KEY } });
  if (!r.ok) throw new Error(`Erreur API ${r.status} sur ${path}`);
  return r.json();
}

// Récupère tous les matchs terminés d'une compétition et filtre par équipe
async function fetchMatchesFromComp(compCode, teamId, season) {
  const s = season ? `&season=${season}` : '';
  const data = await apiFetch(`/competitions/${compCode}/matches?status=FINISHED${s}`);
  const all = data.matches || [];
  return all.filter(m => m.homeTeam.id === teamId || m.awayTeam.id === teamId);
}

async function getRealStats(team) {
  const { id, comp, comp2 } = team;
  let matches = [];

  // Saison courante d'abord, puis saison précédente si pas assez de matchs
  for (const compCode of [comp, comp2].filter(Boolean)) {
    for (const season of [null, '2024', '2023']) {
      try {
        const m = await fetchMatchesFromComp(compCode, id, season);
        matches.push(...m);
        if (matches.length >= 8) break;
      } catch {}
      if (matches.length >= 8) break;
    }
    if (matches.length >= 5) break;
  }

  // Dédupliquer par id de match
  const seen = new Set();
  matches = matches.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });

  // Trier du plus récent au plus ancien
  matches.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
  const recent = matches.slice(0, 10);

  if (recent.length === 0) throw new Error(`Aucun match trouvé pour ${team.name} (comp: ${comp})`);

  let goalsFor = 0, goalsAgainst = 0, wins = 0, draws = 0, losses = 0;
  const form = [];

  for (const m of recent) {
    const isHome = m.homeTeam.id === id;
    const gf = isHome ? m.score.fullTime.home : m.score.fullTime.away;
    const ga = isHome ? m.score.fullTime.away : m.score.fullTime.home;
    if (gf === null || ga === null) continue;
    goalsFor += gf; goalsAgainst += ga;
    if (gf > ga) { form.push('W'); wins++; }
    else if (gf === ga) { form.push('D'); draws++; }
    else { form.push('L'); losses++; }
  }

  const n = form.length;
  if (n === 0) throw new Error(`Scores manquants pour ${team.name}`);

  return {
    form: form.slice(0, 5).join(''),
    goalsFor: +(goalsFor / n).toFixed(2),
    goalsAgainst: +(goalsAgainst / n).toFixed(2),
    wins, draws, losses,
    winRate: Math.round((wins / n) * 100),
    xG: +(goalsFor / n * 0.92).toFixed(2),
    matchesAnalyzed: n,
    sourceComp: comp,
  };
}

async function getRealH2H(homeTeam, awayTeam) {
  // Chercher dans les mêmes compétitions
  const comps = [...new Set([homeTeam.comp, homeTeam.comp2, awayTeam.comp, awayTeam.comp2].filter(Boolean))];
  const h2hMatches = [];

  for (const compCode of comps) {
    for (const season of [null, '2024', '2023', '2022']) {
      try {
        const data = await apiFetch(`/competitions/${compCode}/matches?status=FINISHED${season ? '&season=' + season : ''}`);
        const all = data.matches || [];
        const found = all.filter(m =>
          (m.homeTeam.id === homeTeam.id && m.awayTeam.id === awayTeam.id) ||
          (m.homeTeam.id === awayTeam.id && m.awayTeam.id === homeTeam.id)
        );
        h2hMatches.push(...found);
      } catch {}
    }
  }

  if (h2hMatches.length === 0) return null;

  // Dédupliquer et trier
  const seen = new Set();
  const unique = h2hMatches.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
  unique.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

  const results = unique.slice(0, 8).map(m => {
    const isHome = m.homeTeam.id === homeTeam.id;
    const g1 = isHome ? m.score.fullTime.home : m.score.fullTime.away;
    const g2 = isHome ? m.score.fullTime.away : m.score.fullTime.home;
    return {
      date: new Date(m.utcDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      competition: m.competition?.name || '',
      homeGoals: g1, awayGoals: g2,
    };
  });

  const homeWins = results.filter(r => r.homeGoals > r.awayGoals).length;
  const dr = results.filter(r => r.homeGoals === r.awayGoals).length;
  const awayWins = results.length - homeWins - dr;
  return { matches: results, homeWins, draws: dr, awayWins, total: results.length };
}

// ─── ALGORITHME DE PRÉDICTION (basé sur vraies stats) ─────────────────────────
function formStrength(formStr) {
  const pts = [...formStr].map(c => c === 'W' ? 3 : c === 'D' ? 1 : 0);
  if (pts.length === 0) return 0.5;
  // Pondération exponentielle : match récent = plus important
  const weighted = pts.reduce((acc, p, i) => acc + p * Math.pow(1.3, i), 0);
  const maxW = pts.reduce((acc, _, i) => acc + 3 * Math.pow(1.3, i), 0);
  return weighted / maxW;
}

function predict(homeStats, awayStats, h2h) {
  const HOME_ADV = 0.10;

  // Force offensive / défensive
  const homeAttack = homeStats.goalsFor;
  const homeDefense = homeStats.goalsAgainst;
  const awayAttack = awayStats.goalsFor;
  const awayDefense = awayStats.goalsAgainst;

  // xG attendu : attaque de l'équipe vs défense de l'adversaire
  // Normalisation par la moyenne européenne (~1.5 buts/match/équipe)
  const AVG = 1.5;
  let homeXG = (homeAttack / AVG) * (AVG / Math.max(awayDefense, 0.4)) * AVG * (1 + HOME_ADV);
  let awayXG = (awayAttack / AVG) * (AVG / Math.max(homeDefense, 0.4)) * AVG;

  // Ajustement par la forme récente
  const homeForm = formStrength(homeStats.form);
  const awayForm = formStrength(awayStats.form);
  homeXG *= (0.6 + homeForm * 0.8);
  awayXG *= (0.6 + awayForm * 0.8);

  // Ajustement H2H si dispo
  if (h2h && h2h.total >= 3) {
    const h2hHomeRate = h2h.homeWins / h2h.total;
    const h2hAwayRate = h2h.awayWins / h2h.total;
    homeXG *= (0.85 + h2hHomeRate * 0.3);
    awayXG *= (0.85 + h2hAwayRate * 0.3);
  }

  // Limiter à des valeurs réalistes
  homeXG = Math.min(Math.max(homeXG, 0.3), 4.5);
  awayXG = Math.min(Math.max(awayXG, 0.3), 4.5);

  // Score le plus probable (distribution de Poisson simplifiée)
  const homeScore = Math.round(homeXG);
  const awayScore = Math.round(awayXG);

  // Probabilités via simulation Monte Carlo légère (1000 tirages)
  let hw = 0, dr = 0, aw = 0;
  for (let i = 0; i < 2000; i++) {
    const hg = poissonRandom(homeXG);
    const ag = poissonRandom(awayXG);
    if (hg > ag) hw++;
    else if (hg === ag) dr++;
    else aw++;
  }
  const total = hw + dr + aw;
  const homeWin = Math.round(hw / total * 100);
  const awayWin = Math.round(aw / total * 100);
  const draw = 100 - homeWin - awayWin;

  // Indice de confiance : basé sur nombre de matchs analysés + différence de forme
  const dataPts = Math.min(homeStats.matchesAnalyzed, awayStats.matchesAnalyzed);
  const formDiff = Math.abs(homeForm - awayForm);
  const confidence = Math.round(Math.min(88, Math.max(50,
    40 + dataPts * 2.5 + formDiff * 30
  )));

  return {
    homeScore, awayScore,
    homeXG: homeXG.toFixed(2),
    awayXG: awayXG.toFixed(2),
    homeWin, draw, awayWin,
    confidence,
  };
}

function poissonRandom(lambda) {
  // Générateur de Poisson par méthode de Knuth
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

// ─── UI ───────────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function showHome() {
  $('home').classList.remove('hidden');
  $('loading').classList.add('hidden');
  $('result').classList.add('hidden');
  $('error-box').classList.add('hidden');
}

function showLoading(msg = 'Récupération des vraies données...') {
  $('home').classList.add('hidden');
  $('loading').classList.remove('hidden');
  $('result').classList.add('hidden');
  $('error-box').classList.add('hidden');
  $('loading-msg').textContent = msg;
}

function showError(msg) {
  $('home').classList.add('hidden');
  $('loading').classList.add('hidden');
  $('result').classList.add('hidden');
  $('error-box').classList.remove('hidden');
  $('error-msg').textContent = msg;
}

function renderForm(name, form, n) {
  const dots = [...form].map(r => `<div class="form-dot ${r}">${r}</div>`).join('');
  return `<div class="form-card">
    <div class="form-header">
      <span class="form-team-name">${name}</span>
      <span style="font-size:11px;color:var(--muted)">5 derniers (sur ${n} analysés)</span>
    </div>
    <div class="form-dots">${dots}</div>
  </div>`;
}

function renderStat(label, val, max, color) {
  const pct = Math.min(100, Math.round((val / max) * 100));
  return `<div class="stat-row">
    <span class="stat-label">${label}</span>
    <div class="stat-bar-wrap"><div class="stat-bar" style="width:${pct}%;background:${color}"></div></div>
    <span class="stat-val">${val}</span>
  </div>`;
}

function renderResult(home, away, homeStats, awayStats, pred, h2h) {
  // Facteurs clés dynamiques
  const factors = [];

  const homeFormStr = formStrength(homeStats.form);
  const awayFormStr = formStrength(awayStats.form);

  if (homeFormStr > 0.75) factors.push({ icon: '🔥', title: `${home.name} en grande forme`, desc: `${homeStats.wins}V ${homeStats.draws}N ${homeStats.losses}D sur les ${homeStats.matchesAnalyzed} derniers matchs`, badge: 'pos', bText: '+' });
  if (awayFormStr > 0.75) factors.push({ icon: '🔥', title: `${away.name} en grande forme`, desc: `${awayStats.wins}V ${awayStats.draws}N ${awayStats.losses}D sur les ${awayStats.matchesAnalyzed} derniers matchs`, badge: 'pos', bText: '+' });
  if (homeStats.goalsAgainst < 0.8) factors.push({ icon: '🛡️', title: `Défense solide de ${home.name}`, desc: `Seulement ${homeStats.goalsAgainst} buts encaissés/match (données réelles)`, badge: 'pos', bText: '+' });
  if (awayStats.goalsAgainst < 0.8) factors.push({ icon: '🛡️', title: `Défense solide de ${away.name}`, desc: `Seulement ${awayStats.goalsAgainst} buts encaissés/match (données réelles)`, badge: 'pos', bText: '+' });
  if (homeStats.goalsFor > 2.2) factors.push({ icon: '⚡', title: `Attaque puissante de ${home.name}`, desc: `${homeStats.goalsFor} buts marqués/match en moyenne réelle`, badge: 'pos', bText: '+' });
  if (awayStats.goalsFor > 2.2) factors.push({ icon: '⚡', title: `Attaque puissante de ${away.name}`, desc: `${awayStats.goalsFor} buts marqués/match en moyenne réelle`, badge: 'pos', bText: '+' });
  factors.push({ icon: '🏠', title: `Avantage domicile`, desc: `${home.name} joue à domicile (+10% statistiquement)`, badge: 'neu', bText: '~' });
  if (h2h && h2h.total >= 3) {
    if (h2h.homeWins > h2h.awayWins) factors.push({ icon: '📊', title: `H2H favorable à ${home.name}`, desc: `${h2h.homeWins}V - ${h2h.draws}N - ${h2h.awayWins}D en confrontations directes réelles`, badge: 'pos', bText: '+' });
    else if (h2h.awayWins > h2h.homeWins) factors.push({ icon: '📊', title: `H2H favorable à ${away.name}`, desc: `${h2h.awayWins}V - ${h2h.draws}N - ${h2h.homeWins}D pour ${away.name} en H2H réel`, badge: 'neg', bText: '-' });
  }
  if (homeFormStr < 0.35) factors.push({ icon: '📉', title: `${home.name} en méforme`, desc: `Faible taux de victoire récent basé sur vraies données`, badge: 'neg', bText: '-' });
  if (awayFormStr < 0.35) factors.push({ icon: '📉', title: `${away.name} en méforme`, desc: `Faible taux de victoire récent basé sur vraies données`, badge: 'neg', bText: '-' });

  const h2hHtml = h2h && h2h.matches.length > 0
    ? `<div class="h2h-summary">
        <div class="h2h-box home"><div class="num">${h2h.homeWins}</div><div class="lbl">${home.name}</div></div>
        <div class="h2h-box draw"><div class="num">${h2h.draws}</div><div class="lbl">Nuls</div></div>
        <div class="h2h-box away"><div class="num">${h2h.awayWins}</div><div class="lbl">${away.name}</div></div>
      </div>
      <div class="h2h-matches">
        ${h2h.matches.slice(0, 5).map(m => `
          <div class="h2h-match">
            <span class="date">${m.date}</span>
            <span class="teams-h2h">${home.name} – ${away.name}</span>
            <span class="score-h2h">${m.homeGoals} – ${m.awayGoals}</span>
          </div>`).join('')}
      </div>`
    : `<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">
        Pas de confrontations directes trouvées dans les données disponibles
      </div>`;

  $('result').innerHTML = `
    <div style="padding:12px 0 4px">
      <button id="back-btn" style="background:none;border:none;color:var(--accent);font-size:14px;cursor:pointer">← Nouvelle analyse</button>
    </div>

    <div class="match-card">
      <div class="competition-badge">📡 Données réelles API</div>
      <div class="teams">
        <div class="team">
          <div class="team-emoji">${home.emoji}</div>
          <div class="team-name">${home.name}</div>
          <div class="team-ranking">${home.league}</div>
        </div>
        <div class="vs">VS</div>
        <div class="team">
          <div class="team-emoji">${away.emoji}</div>
          <div class="team-name">${away.name}</div>
          <div class="team-ranking">${away.league}</div>
        </div>
      </div>
      <div class="match-meta">Analyse basée sur ${homeStats.matchesAnalyzed} matchs (${home.name}) et ${awayStats.matchesAnalyzed} matchs (${away.name})</div>
    </div>

    <div class="prediction-card">
      <h2>🎯 Score le plus probable</h2>
      <div class="score-display">
        <div class="score-num">${pred.homeScore}</div>
        <div class="score-sep">—</div>
        <div class="score-num">${pred.awayScore}</div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:16px">
        xG attendus : ${pred.homeXG} – ${pred.awayXG} (simulation Monte Carlo 2000 tirages)
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="width:${pred.confidence}%"></div>
      </div>
      <div class="confidence-text">Indice de confiance : <strong>${pred.confidence}%</strong></div>
      <div class="proba-row">
        <div class="proba-box win">
          <div class="proba-label">Victoire</div>
          <div class="proba-val">${pred.homeWin}%</div>
          <div class="proba-sublabel">${home.name}</div>
        </div>
        <div class="proba-box draw">
          <div class="proba-label">Nul</div>
          <div class="proba-val">${pred.draw}%</div>
          <div class="proba-sublabel">Match nul</div>
        </div>
        <div class="proba-box lose">
          <div class="proba-label">Victoire</div>
          <div class="proba-val">${pred.awayWin}%</div>
          <div class="proba-sublabel">${away.name}</div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <div class="section-title">📈 Statistiques réelles</div>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>${home.name}</h3>
          ${renderStat('Buts marqués/match', homeStats.goalsFor, 4, 'var(--green)')}
          ${renderStat('Buts encaissés/match', homeStats.goalsAgainst, 4, 'var(--red)')}
          ${renderStat('xG estimé', homeStats.xG, 3.5, 'var(--accent)')}
          ${renderStat('% victoires', homeStats.winRate, 100, 'var(--accent2)')}
        </div>
        <div class="stat-card">
          <h3>${away.name}</h3>
          ${renderStat('Buts marqués/match', awayStats.goalsFor, 4, 'var(--green)')}
          ${renderStat('Buts encaissés/match', awayStats.goalsAgainst, 4, 'var(--red)')}
          ${renderStat('xG estimé', awayStats.xG, 3.5, 'var(--accent)')}
          ${renderStat('% victoires', awayStats.winRate, 100, 'var(--accent2)')}
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="section-title">📋 Forme récente (vraies données)</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${renderForm(home.name, homeStats.form, homeStats.matchesAnalyzed)}
        ${renderForm(away.name, awayStats.form, awayStats.matchesAnalyzed)}
      </div>
    </div>

    <div class="h2h-section">
      <div class="section-title">🆚 Face à face (données réelles)</div>
      <div class="h2h-card">${h2hHtml}</div>
    </div>

    <div class="factors-section">
      <div class="section-title">🔍 Facteurs clés</div>
      <div class="factors-card">
        ${factors.slice(0, 5).map(f => `
          <div class="factor">
            <div class="factor-icon">${f.icon}</div>
            <div class="factor-text">
              <div class="factor-title">${f.title}</div>
              <div class="factor-desc">${f.desc}</div>
            </div>
            <div class="factor-badge ${f.badge}">${f.bText}</div>
          </div>`).join('')}
      </div>
    </div>

    <div class="disclaimer">
      ✅ Toutes les statistiques proviennent de l'API football-data.org.<br>
      ⚠️ Les prédictions ne constituent pas des conseils de paris.
    </div>
  `;

  $('home').classList.add('hidden');
  $('loading').classList.add('hidden');
  $('result').classList.remove('hidden');
  $('error-box').classList.add('hidden');
}

// ─── ANALYSE PRINCIPALE ───────────────────────────────────────────────────────
async function analyzeMatch(text) {
  showLoading('Identification des équipes...');
  const match = parseMatch(text);

  if (!match) {
    showError(`Équipes non trouvées dans "${text}". Essaie "France Sénégal", "PSG Chelsea", "Real Madrid Barcelona".`);
    return;
  }

  const { home, away } = match;

  try {
    showLoading(`Récupération des stats réelles (${home.name})...`);
    const homeStats = await getRealStats(home);

    showLoading(`Récupération des stats réelles (${away.name})...`);
    const awayStats = await getRealStats(away);

    showLoading('Analyse des confrontations directes...');
    let h2h = null;
    try { h2h = await getRealH2H(home, away); } catch {}

    showLoading('Calcul de la prédiction...');
    const pred = predict(homeStats, awayStats, h2h);

    renderResult(home, away, homeStats, awayStats, pred, h2h);

  } catch (err) {
    showError(`Erreur API : ${err.message}. Vérifie ta clé API ou ta connexion.`);
  }
}

// ─── SHARE TARGET ─────────────────────────────────────────────────────────────
function handleShareTarget() {
  const params = new URLSearchParams(window.location.search);
  const combined = [params.get('title'), params.get('text'), params.get('url')]
    .filter(Boolean).join(' ').trim();
  if (combined) {
    $('share-banner').classList.remove('hidden');
    $('share-text').textContent = `"${combined.slice(0, 60)}"`;
    window.history.replaceState({}, '', '/');
    setTimeout(() => analyzeMatch(combined), 300);
    return true;
  }
  return false;
}

// ─── PWA INSTALL ──────────────────────────────────────────────────────────────
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredPrompt = e;
  $('install-banner').classList.remove('hidden');
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});

  $('api-key-input').value = API_KEY;
  $('save-key-btn').onclick = () => {
    API_KEY = $('api-key-input').value.trim();
    localStorage.setItem('fd_api_key', API_KEY);
    $('api-key-input').style.borderColor = 'var(--green)';
    setTimeout(() => { $('api-key-input').style.borderColor = ''; }, 1500);
  };

  $('install-btn').onclick = async () => {
    if (deferredPrompt) { deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; if (outcome === 'accepted') $('install-banner').classList.add('hidden'); }
  };

  $('search-btn').onclick = () => { const v = $('search-input').value.trim(); if (v) analyzeMatch(v); };
  $('search-input').addEventListener('keypress', e => { if (e.key === 'Enter') { const v = $('search-input').value.trim(); if (v) analyzeMatch(v); } });
  document.addEventListener('click', e => { if (e.target.id === 'back-btn') showHome(); });

  if (!handleShareTarget()) showHome();
});
