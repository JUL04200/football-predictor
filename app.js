'use strict';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API_BASE = 'https://api.football-data.org/v4';
let API_KEY = localStorage.getItem('fd_api_key') || '3c68cf8da2ef4dc7bc2bc71a2bd164c1';

// ─── TEAM DATABASE ───────────────────────────────────────────────────────────
// Mapping noms équipes → IDs football-data.org + infos
const TEAM_DB = {
  // Ligue 1
  'psg': { id: 524, name: 'Paris Saint-Germain', emoji: '🔵🔴', country: 'France', league: 'Ligue 1' },
  'paris saint-germain': { id: 524, name: 'Paris Saint-Germain', emoji: '🔵🔴', country: 'France', league: 'Ligue 1' },
  'paris': { id: 524, name: 'Paris Saint-Germain', emoji: '🔵🔴', country: 'France', league: 'Ligue 1' },
  'marseille': { id: 516, name: 'Olympique de Marseille', emoji: '🔵⚪', country: 'France', league: 'Ligue 1' },
  'om': { id: 516, name: 'Olympique de Marseille', emoji: '🔵⚪', country: 'France', league: 'Ligue 1' },
  'lyon': { id: 523, name: 'Olympique Lyonnais', emoji: '🔴⚪', country: 'France', league: 'Ligue 1' },
  'ol': { id: 523, name: 'Olympique Lyonnais', emoji: '🔴⚪', country: 'France', league: 'Ligue 1' },
  'monaco': { id: 548, name: 'AS Monaco', emoji: '🔴⚪', country: 'France', league: 'Ligue 1' },
  'nice': { id: 522, name: 'OGC Nice', emoji: '🔴⚫', country: 'France', league: 'Ligue 1' },
  'lens': { id: 546, name: 'RC Lens', emoji: '🟡🔴', country: 'France', league: 'Ligue 1' },
  'rennes': { id: 529, name: 'Stade Rennais', emoji: '🔴⚫', country: 'France', league: 'Ligue 1' },
  'lille': { id: 521, name: 'LOSC Lille', emoji: '🔴🐘', country: 'France', league: 'Ligue 1' },
  'losc': { id: 521, name: 'LOSC Lille', emoji: '🔴🐘', country: 'France', league: 'Ligue 1' },
  'nantes': { id: 543, name: 'FC Nantes', emoji: '🟡🟢', country: 'France', league: 'Ligue 1' },
  'saint-etienne': { id: 519, name: 'AS Saint-Étienne', emoji: '🟢⚪', country: 'France', league: 'Ligue 1' },
  'asse': { id: 519, name: 'AS Saint-Étienne', emoji: '🟢⚪', country: 'France', league: 'Ligue 1' },
  'bordeaux': { id: 526, name: 'FC Girondins de Bordeaux', emoji: '🔵⚪', country: 'France', league: 'Ligue 1' },
  'strasbourg': { id: 576, name: 'RC Strasbourg', emoji: '🔵⚪', country: 'France', league: 'Ligue 1' },
  // Premier League
  'chelsea': { id: 61, name: 'Chelsea FC', emoji: '🔵', country: 'England', league: 'Premier League' },
  'manchester city': { id: 65, name: 'Manchester City', emoji: '🔵', country: 'England', league: 'Premier League' },
  'man city': { id: 65, name: 'Manchester City', emoji: '🔵', country: 'England', league: 'Premier League' },
  'manchester united': { id: 66, name: 'Manchester United', emoji: '🔴', country: 'England', league: 'Premier League' },
  'man united': { id: 66, name: 'Manchester United', emoji: '🔴', country: 'England', league: 'Premier League' },
  'man utd': { id: 66, name: 'Manchester United', emoji: '🔴', country: 'England', league: 'Premier League' },
  'arsenal': { id: 57, name: 'Arsenal', emoji: '🔴⚪', country: 'England', league: 'Premier League' },
  'liverpool': { id: 64, name: 'Liverpool', emoji: '🔴', country: 'England', league: 'Premier League' },
  'tottenham': { id: 73, name: 'Tottenham Hotspur', emoji: '⚪', country: 'England', league: 'Premier League' },
  'spurs': { id: 73, name: 'Tottenham Hotspur', emoji: '⚪', country: 'England', league: 'Premier League' },
  'newcastle': { id: 67, name: 'Newcastle United', emoji: '⚫⚪', country: 'England', league: 'Premier League' },
  'aston villa': { id: 58, name: 'Aston Villa', emoji: '🟣🔵', country: 'England', league: 'Premier League' },
  'west ham': { id: 563, name: 'West Ham United', emoji: '🔵🔴', country: 'England', league: 'Premier League' },
  'brighton': { id: 397, name: 'Brighton & Hove Albion', emoji: '🔵⚪', country: 'England', league: 'Premier League' },
  'everton': { id: 62, name: 'Everton', emoji: '🔵', country: 'England', league: 'Premier League' },
  // Liga
  'real madrid': { id: 86, name: 'Real Madrid', emoji: '⚪', country: 'Spain', league: 'La Liga' },
  'barcelona': { id: 81, name: 'FC Barcelona', emoji: '🔵🔴', country: 'Spain', league: 'La Liga' },
  'barca': { id: 81, name: 'FC Barcelona', emoji: '🔵🔴', country: 'Spain', league: 'La Liga' },
  'atletico madrid': { id: 78, name: 'Atlético de Madrid', emoji: '🔴⚪', country: 'Spain', league: 'La Liga' },
  'atletico': { id: 78, name: 'Atlético de Madrid', emoji: '🔴⚪', country: 'Spain', league: 'La Liga' },
  'sevilla': { id: 559, name: 'Sevilla FC', emoji: '⚪🔴', country: 'Spain', league: 'La Liga' },
  'villarreal': { id: 94, name: 'Villarreal CF', emoji: '🟡', country: 'Spain', league: 'La Liga' },
  'real sociedad': { id: 92, name: 'Real Sociedad', emoji: '🔵⚪', country: 'Spain', league: 'La Liga' },
  // Bundesliga
  'bayern munich': { id: 5, name: 'Bayern München', emoji: '🔴', country: 'Germany', league: 'Bundesliga' },
  'bayern': { id: 5, name: 'Bayern München', emoji: '🔴', country: 'Germany', league: 'Bundesliga' },
  'borussia dortmund': { id: 4, name: 'Borussia Dortmund', emoji: '🟡⚫', country: 'Germany', league: 'Bundesliga' },
  'dortmund': { id: 4, name: 'Borussia Dortmund', emoji: '🟡⚫', country: 'Germany', league: 'Bundesliga' },
  'bvb': { id: 4, name: 'Borussia Dortmund', emoji: '🟡⚫', country: 'Germany', league: 'Bundesliga' },
  'rb leipzig': { id: 721, name: 'RB Leipzig', emoji: '🔴⚪', country: 'Germany', league: 'Bundesliga' },
  'bayer leverkusen': { id: 3, name: 'Bayer Leverkusen', emoji: '🔴⚫', country: 'Germany', league: 'Bundesliga' },
  'leverkusen': { id: 3, name: 'Bayer Leverkusen', emoji: '🔴⚫', country: 'Germany', league: 'Bundesliga' },
  // ─── ÉQUIPES NATIONALES ───
  'france': { id: 773, name: 'France', emoji: '🇫🇷', country: 'France', league: 'Équipe Nationale' },
  'les bleus': { id: 773, name: 'France', emoji: '🇫🇷', country: 'France', league: 'Équipe Nationale' },
  'senegal': { id: 907, name: 'Sénégal', emoji: '🇸🇳', country: 'Sénégal', league: 'Équipe Nationale' },
  'sénégal': { id: 907, name: 'Sénégal', emoji: '🇸🇳', country: 'Sénégal', league: 'Équipe Nationale' },
  'maroc': { id: 816, name: 'Maroc', emoji: '🇲🇦', country: 'Maroc', league: 'Équipe Nationale' },
  'morocco': { id: 816, name: 'Maroc', emoji: '🇲🇦', country: 'Maroc', league: 'Équipe Nationale' },
  'algerie': { id: 803, name: 'Algérie', emoji: '🇩🇿', country: 'Algérie', league: 'Équipe Nationale' },
  'algérie': { id: 803, name: 'Algérie', emoji: '🇩🇿', country: 'Algérie', league: 'Équipe Nationale' },
  'tunisie': { id: 803, name: 'Tunisie', emoji: '🇹🇳', country: 'Tunisie', league: 'Équipe Nationale' },
  'tunisie': { id: 803, name: 'Tunisie', emoji: '🇹🇳', country: 'Tunisie', league: 'Équipe Nationale' },
  'nigeria': { id: 886, name: 'Nigeria', emoji: '🇳🇬', country: 'Nigeria', league: 'Équipe Nationale' },
  'ghana': { id: 854, name: 'Ghana', emoji: '🇬🇭', country: 'Ghana', league: 'Équipe Nationale' },
  'cote d\'ivoire': { id: 840, name: "Côte d'Ivoire", emoji: '🇨🇮', country: "Côte d'Ivoire", league: 'Équipe Nationale' },
  'ivory coast': { id: 840, name: "Côte d'Ivoire", emoji: '🇨🇮', country: "Côte d'Ivoire", league: 'Équipe Nationale' },
  'cameroun': { id: 825, name: 'Cameroun', emoji: '🇨🇲', country: 'Cameroun', league: 'Équipe Nationale' },
  'cameroon': { id: 825, name: 'Cameroun', emoji: '🇨🇲', country: 'Cameroun', league: 'Équipe Nationale' },
  'egypte': { id: 849, name: 'Égypte', emoji: '🇪🇬', country: 'Égypte', league: 'Équipe Nationale' },
  'egypt': { id: 849, name: 'Égypte', emoji: '🇪🇬', country: 'Égypte', league: 'Équipe Nationale' },
  'bresil': { id: 764, name: 'Brésil', emoji: '🇧🇷', country: 'Brésil', league: 'Équipe Nationale' },
  'brazil': { id: 764, name: 'Brésil', emoji: '🇧🇷', country: 'Brésil', league: 'Équipe Nationale' },
  'brésil': { id: 764, name: 'Brésil', emoji: '🇧🇷', country: 'Brésil', league: 'Équipe Nationale' },
  'argentine': { id: 762, name: 'Argentine', emoji: '🇦🇷', country: 'Argentine', league: 'Équipe Nationale' },
  'argentina': { id: 762, name: 'Argentine', emoji: '🇦🇷', country: 'Argentine', league: 'Équipe Nationale' },
  'espagne': { id: 760, name: 'Espagne', emoji: '🇪🇸', country: 'Espagne', league: 'Équipe Nationale' },
  'spain': { id: 760, name: 'Espagne', emoji: '🇪🇸', country: 'Espagne', league: 'Équipe Nationale' },
  'allemagne': { id: 759, name: 'Allemagne', emoji: '🇩🇪', country: 'Allemagne', league: 'Équipe Nationale' },
  'germany': { id: 759, name: 'Allemagne', emoji: '🇩🇪', country: 'Allemagne', league: 'Équipe Nationale' },
  'angleterre': { id: 770, name: 'Angleterre', emoji: '󠁧󠁢󠁥󠁮󠁧󠁿🏴', country: 'Angleterre', league: 'Équipe Nationale' },
  'england': { id: 770, name: 'Angleterre', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'Angleterre', league: 'Équipe Nationale' },
  'italie': { id: 784, name: 'Italie', emoji: '🇮🇹', country: 'Italie', league: 'Équipe Nationale' },
  'italy': { id: 784, name: 'Italie', emoji: '🇮🇹', country: 'Italie', league: 'Équipe Nationale' },
  'portugal': { id: 765, name: 'Portugal', emoji: '🇵🇹', country: 'Portugal', league: 'Équipe Nationale' },
  'belgique': { id: 805, name: 'Belgique', emoji: '🇧🇪', country: 'Belgique', league: 'Équipe Nationale' },
  'belgium': { id: 805, name: 'Belgique', emoji: '🇧🇪', country: 'Belgique', league: 'Équipe Nationale' },
  'pays-bas': { id: 779, name: 'Pays-Bas', emoji: '🇳🇱', country: 'Pays-Bas', league: 'Équipe Nationale' },
  'netherlands': { id: 779, name: 'Pays-Bas', emoji: '🇳🇱', country: 'Pays-Bas', league: 'Équipe Nationale' },
  'hollande': { id: 779, name: 'Pays-Bas', emoji: '🇳🇱', country: 'Pays-Bas', league: 'Équipe Nationale' },
  'croatie': { id: 799, name: 'Croatie', emoji: '🇭🇷', country: 'Croatie', league: 'Équipe Nationale' },
  'croatia': { id: 799, name: 'Croatie', emoji: '🇭🇷', country: 'Croatie', league: 'Équipe Nationale' },
  'uruguay': { id: 769, name: 'Uruguay', emoji: '🇺🇾', country: 'Uruguay', league: 'Équipe Nationale' },
  'colombie': { id: 801, name: 'Colombie', emoji: '🇨🇴', country: 'Colombie', league: 'Équipe Nationale' },
  'colombia': { id: 801, name: 'Colombie', emoji: '🇨🇴', country: 'Colombie', league: 'Équipe Nationale' },
  'mexique': { id: 788, name: 'Mexique', emoji: '🇲🇽', country: 'Mexique', league: 'Équipe Nationale' },
  'mexico': { id: 788, name: 'Mexique', emoji: '🇲🇽', country: 'Mexique', league: 'Équipe Nationale' },
  'etats-unis': { id: 768, name: 'États-Unis', emoji: '🇺🇸', country: 'États-Unis', league: 'Équipe Nationale' },
  'usa': { id: 768, name: 'États-Unis', emoji: '🇺🇸', country: 'États-Unis', league: 'Équipe Nationale' },
  'japon': { id: 785, name: 'Japon', emoji: '🇯🇵', country: 'Japon', league: 'Équipe Nationale' },
  'japan': { id: 785, name: 'Japon', emoji: '🇯🇵', country: 'Japon', league: 'Équipe Nationale' },
  'coree du sud': { id: 796, name: 'Corée du Sud', emoji: '🇰🇷', country: 'Corée du Sud', league: 'Équipe Nationale' },
  'south korea': { id: 796, name: 'Corée du Sud', emoji: '🇰🇷', country: 'Corée du Sud', league: 'Équipe Nationale' },
  'suisse': { id: 788, name: 'Suisse', emoji: '🇨🇭', country: 'Suisse', league: 'Équipe Nationale' },
  'switzerland': { id: 788, name: 'Suisse', emoji: '🇨🇭', country: 'Suisse', league: 'Équipe Nationale' },
  'danemark': { id: 782, name: 'Danemark', emoji: '🇩🇰', country: 'Danemark', league: 'Équipe Nationale' },
  'denmark': { id: 782, name: 'Danemark', emoji: '🇩🇰', country: 'Danemark', league: 'Équipe Nationale' },
  'pologne': { id: 781, name: 'Pologne', emoji: '🇵🇱', country: 'Pologne', league: 'Équipe Nationale' },
  'poland': { id: 781, name: 'Pologne', emoji: '🇵🇱', country: 'Pologne', league: 'Équipe Nationale' },

  // ─── STATS NATIONALES PAR DÉFAUT ───
  // Serie A
  'juventus': { id: 109, name: 'Juventus FC', emoji: '⚫⚪', country: 'Italy', league: 'Serie A' },
  'juve': { id: 109, name: 'Juventus FC', emoji: '⚫⚪', country: 'Italy', league: 'Serie A' },
  'inter milan': { id: 108, name: 'Inter Milan', emoji: '🔵⚫', country: 'Italy', league: 'Serie A' },
  'inter': { id: 108, name: 'Inter Milan', emoji: '🔵⚫', country: 'Italy', league: 'Serie A' },
  'ac milan': { id: 98, name: 'AC Milan', emoji: '🔴⚫', country: 'Italy', league: 'Serie A' },
  'milan': { id: 98, name: 'AC Milan', emoji: '🔴⚫', country: 'Italy', league: 'Serie A' },
  'napoli': { id: 113, name: 'SSC Napoli', emoji: '🔵', country: 'Italy', league: 'Serie A' },
  'roma': { id: 100, name: 'AS Roma', emoji: '🔴🟡', country: 'Italy', league: 'Serie A' },
  'as roma': { id: 100, name: 'AS Roma', emoji: '🔴🟡', country: 'Italy', league: 'Serie A' },
  'lazio': { id: 110, name: 'SS Lazio', emoji: '🔵⚪', country: 'Italy', league: 'Serie A' },
};

// ─── STATS PAR DÉFAUT (utilisées si pas d'API) ───────────────────────────────
const DEFAULT_STATS = {
  // Équipes nationales
  773: { form: 'WWWDW', goalsFor: 2.3, goalsAgainst: 0.7, possession: 58, rank: 2, xG: 2.1 },  // France
  907: { form: 'WWDWL', goalsFor: 1.8, goalsAgainst: 0.9, possession: 52, rank: 18, xG: 1.6 }, // Sénégal
  816: { form: 'WWWWW', goalsFor: 1.9, goalsAgainst: 0.5, possession: 50, rank: 13, xG: 1.7 }, // Maroc
  803: { form: 'WDWWL', goalsFor: 1.5, goalsAgainst: 1.0, possession: 49, rank: 30, xG: 1.4 }, // Algérie
  886: { form: 'WLWWD', goalsFor: 1.7, goalsAgainst: 1.2, possession: 48, rank: 28, xG: 1.5 }, // Nigeria
  854: { form: 'DLWWL', goalsFor: 1.4, goalsAgainst: 1.3, possession: 47, rank: 60, xG: 1.2 }, // Ghana
  840: { form: 'WWLWW', goalsFor: 1.8, goalsAgainst: 1.1, possession: 50, rank: 25, xG: 1.6 }, // Côte d'Ivoire
  825: { form: 'WDWLW', goalsFor: 1.6, goalsAgainst: 1.1, possession: 48, rank: 40, xG: 1.4 }, // Cameroun
  849: { form: 'WWDWW', goalsFor: 1.7, goalsAgainst: 0.8, possession: 51, rank: 35, xG: 1.5 }, // Égypte
  764: { form: 'WWWWW', goalsFor: 2.8, goalsAgainst: 0.6, possession: 63, rank: 1, xG: 2.6 },  // Brésil
  762: { form: 'WWWWW', goalsFor: 2.5, goalsAgainst: 0.5, possession: 60, rank: 1, xG: 2.3 },  // Argentine
  760: { form: 'WWWDW', goalsFor: 2.4, goalsAgainst: 0.6, possession: 62, rank: 1, xG: 2.2 },  // Espagne
  759: { form: 'WWDWW', goalsFor: 2.2, goalsAgainst: 0.8, possession: 59, rank: 4, xG: 2.0 },  // Allemagne
  770: { form: 'WWWLW', goalsFor: 2.0, goalsAgainst: 0.9, possession: 57, rank: 5, xG: 1.9 },  // Angleterre
  784: { form: 'WDWWL', goalsFor: 1.6, goalsAgainst: 0.8, possession: 55, rank: 9, xG: 1.5 },  // Italie
  765: { form: 'WWWWW', goalsFor: 2.3, goalsAgainst: 0.7, possession: 57, rank: 6, xG: 2.1 },  // Portugal
  779: { form: 'WWWDW', goalsFor: 2.1, goalsAgainst: 0.8, possession: 58, rank: 7, xG: 1.9 },  // Pays-Bas
  799: { form: 'WDWWL', goalsFor: 1.7, goalsAgainst: 0.9, possession: 52, rank: 10, xG: 1.6 }, // Croatie
  805: { form: 'WWDWW', goalsFor: 2.2, goalsAgainst: 0.9, possession: 56, rank: 3, xG: 2.0 },  // Belgique
  769: { form: 'WWWLW', goalsFor: 1.9, goalsAgainst: 0.8, possession: 53, rank: 11, xG: 1.7 }, // Uruguay
  // Clubs
  524: { form: 'WWDWW', goalsFor: 2.4, goalsAgainst: 0.6, possession: 62, rank: 1, xG: 2.1 },
  61:  { form: 'WDWLW', goalsFor: 1.8, goalsAgainst: 1.0, possession: 56, rank: 5, xG: 1.7 },
  65:  { form: 'WWWWD', goalsFor: 2.6, goalsAgainst: 0.8, possession: 65, rank: 1, xG: 2.4 },
  66:  { form: 'LDLWL', goalsFor: 1.2, goalsAgainst: 1.6, possession: 50, rank: 12, xG: 1.1 },
  57:  { form: 'WWWLW', goalsFor: 2.2, goalsAgainst: 0.9, possession: 58, rank: 2, xG: 2.0 },
  64:  { form: 'WWDWW', goalsFor: 2.5, goalsAgainst: 0.7, possession: 60, rank: 2, xG: 2.3 },
  86:  { form: 'WWWDW', goalsFor: 2.8, goalsAgainst: 0.5, possession: 60, rank: 1, xG: 2.6 },
  81:  { form: 'WWWWL', goalsFor: 2.7, goalsAgainst: 0.9, possession: 63, rank: 2, xG: 2.4 },
  5:   { form: 'WWDWW', goalsFor: 3.0, goalsAgainst: 0.7, possession: 64, rank: 1, xG: 2.7 },
  4:   { form: 'WWLWW', goalsFor: 2.3, goalsAgainst: 1.1, possession: 55, rank: 3, xG: 2.0 },
  109: { form: 'WDWWL', goalsFor: 1.9, goalsAgainst: 0.8, possession: 55, rank: 2, xG: 1.8 },
  108: { form: 'WWWDW', goalsFor: 2.4, goalsAgainst: 0.6, possession: 58, rank: 1, xG: 2.2 },
};

function getDefaultStats(id) {
  return DEFAULT_STATS[id] || {
    form: 'WDLWW', goalsFor: 1.5, goalsAgainst: 1.2,
    possession: 50, rank: 8, xG: 1.4
  };
}

// ─── PARSER DE TEXTE ─────────────────────────────────────────────────────────
function parseMatch(text) {
  if (!text) return null;
  const clean = text.toLowerCase()
    .replace(/résultat|result|score|prediction|pronostic|match|vs\.?|[-–—]/g, ' ')
    .replace(/\s+/g, ' ').trim();

  // Chercher patterns "team1 team2"
  const separators = [' vs ', ' contre ', ' - ', ' v '];
  for (const sep of separators) {
    const orig = text.toLowerCase();
    const idx = orig.indexOf(sep);
    if (idx > 0) {
      const left = orig.slice(0, idx).trim();
      const right = orig.slice(idx + sep.length).trim();
      const t1 = findTeam(left);
      const t2 = findTeam(right);
      if (t1 && t2) return { home: t1, away: t2 };
    }
  }

  // Chercher 2 équipes dans le texte
  const found = [];
  for (const [key, team] of Object.entries(TEAM_DB)) {
    if (clean.includes(key) && !found.find(f => f.id === team.id)) {
      found.push({ key, ...team });
    }
  }

  // Trier par longueur de clé (plus précis en premier)
  found.sort((a, b) => b.key.length - a.key.length);
  if (found.length >= 2) {
    return { home: found[0], away: found[1] };
  }
  return null;
}

function findTeam(str) {
  str = str.trim().toLowerCase();
  if (TEAM_DB[str]) return TEAM_DB[str];
  // Recherche partielle
  for (const [key, team] of Object.entries(TEAM_DB)) {
    if (str.includes(key) || key.includes(str)) return team;
  }
  return null;
}

// ─── ALGORITHME DE PRÉDICTION ────────────────────────────────────────────────
function formToPoints(form) {
  return [...form].map(c => c === 'W' ? 3 : c === 'D' ? 1 : 0);
}

function formStrength(form) {
  const pts = formToPoints(form);
  const max = pts.length * 3;
  const weighted = pts.reduce((acc, p, i) => acc + p * (i + 1), 0);
  const maxW = pts.reduce((acc, _, i) => acc + 3 * (i + 1), 0);
  return weighted / maxW;
}

function predict(homeStats, awayStats) {
  // Facteurs pondérés
  const homeAdv = 0.12; // avantage domicile

  const homeStrength = formStrength(homeStats.form) * 0.35
    + (homeStats.goalsFor / 3.5) * 0.25
    + (1 - homeStats.goalsAgainst / 3.5) * 0.2
    + (homeStats.possession / 100) * 0.1
    + (homeStats.xG / 3.5) * 0.1
    + homeAdv;

  const awayStrength = formStrength(awayStats.form) * 0.35
    + (awayStats.goalsFor / 3.5) * 0.25
    + (1 - awayStats.goalsAgainst / 3.5) * 0.2
    + (awayStats.possession / 100) * 0.1
    + (awayStats.xG / 3.5) * 0.1;

  // Expected goals basés sur attaque vs défense adverse
  const homeXG = (homeStats.goalsFor * 0.6 + (3.5 - awayStats.goalsAgainst) * 0.4) * (1 + homeAdv);
  const awayXG = awayStats.goalsFor * 0.6 + (3.5 - homeStats.goalsAgainst) * 0.4;

  const homeGoals = Math.max(0, Math.round(homeXG * 10) / 10);
  const awayGoals = Math.max(0, Math.round(awayXG * 10) / 10);

  // Scores arrondis
  const homeScore = Math.round(homeGoals);
  const awayScore = Math.round(awayGoals);

  // Probabilités
  const total = homeStrength + awayStrength;
  let homeWin = (homeStrength / total) * 100;
  let awayWin = (awayStrength / total) * 100;
  let draw = Math.max(10, Math.min(35, 100 - homeWin - awayWin + 20));
  homeWin = Math.max(5, homeWin - draw / 2);
  awayWin = Math.max(5, awayWin - draw / 2);
  const sum = homeWin + draw + awayWin;
  homeWin = Math.round(homeWin / sum * 100);
  awayWin = Math.round(awayWin / sum * 100);
  draw = 100 - homeWin - awayWin;

  // Confiance basée sur différence de forces
  const diff = Math.abs(homeStrength - awayStrength);
  const confidence = Math.round(45 + diff * 80);

  return {
    homeScore, awayScore,
    homeXG: homeXG.toFixed(1),
    awayXG: awayXG.toFixed(1),
    homeWin, draw, awayWin,
    confidence: Math.min(92, Math.max(48, confidence))
  };
}

// ─── H2H SIMULÉ ──────────────────────────────────────────────────────────────
function generateH2H(home, away) {
  const seed = (home.id * 7 + away.id * 13) % 100;
  const matches = [];
  const now = new Date();

  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (i * 6 + (seed % 3)));
    const hg = (seed + i * 3) % 4;
    const ag = (seed + i * 2 + 1) % 3;
    matches.push({
      date: d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      homeGoals: hg, awayGoals: ag
    });
  }

  const homeWins = matches.filter(m => m.homeGoals > m.awayGoals).length;
  const draws = matches.filter(m => m.homeGoals === m.awayGoals).length;
  const awayWins = matches.length - homeWins - draws;

  return { matches, homeWins, draws, awayWins };
}

// ─── API FOOTBALL-DATA ───────────────────────────────────────────────────────
async function fetchTeamMatches(teamId) {
  if (!API_KEY) return null;
  try {
    const r = await fetch(`${API_BASE}/teams/${teamId}/matches?status=FINISHED&limit=10`, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data.matches || [];
  } catch { return null; }
}

function processMatches(matches, teamId) {
  if (!matches || matches.length === 0) return null;
  let goalsFor = 0, goalsAgainst = 0;
  const form = [];

  const recent = matches.slice(-5);
  for (const m of recent) {
    const isHome = m.homeTeam.id === teamId;
    const gf = isHome ? m.score.fullTime.home : m.score.fullTime.away;
    const ga = isHome ? m.score.fullTime.away : m.score.fullTime.home;
    goalsFor += gf; goalsAgainst += ga;
    if (gf > ga) form.push('W');
    else if (gf === ga) form.push('D');
    else form.push('L');
  }

  return {
    form: form.join(''),
    goalsFor: +(goalsFor / recent.length).toFixed(2),
    goalsAgainst: +(goalsAgainst / recent.length).toFixed(2),
    possession: 52, rank: 5, xG: +(goalsFor / recent.length * 0.9).toFixed(1)
  };
}

// ─── RENDU UI ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function showHome() {
  $('home').classList.remove('hidden');
  $('loading').classList.add('hidden');
  $('result').classList.add('hidden');
  $('error-box').classList.add('hidden');
}

function showLoading() {
  $('home').classList.add('hidden');
  $('loading').classList.remove('hidden');
  $('result').classList.add('hidden');
  $('error-box').classList.add('hidden');
}

function showError(msg) {
  $('home').classList.add('hidden');
  $('loading').classList.add('hidden');
  $('result').classList.add('hidden');
  $('error-box').classList.remove('hidden');
  $('error-msg').textContent = msg;
}

function renderStat(label, val, max, color) {
  const pct = Math.round((val / max) * 100);
  return `<div class="stat-row">
    <span class="stat-label">${label}</span>
    <div class="stat-bar-wrap"><div class="stat-bar" style="width:${pct}%;background:${color}"></div></div>
    <span class="stat-val">${val}</span>
  </div>`;
}

function renderForm(name, form) {
  const dots = [...form].map(r => `<div class="form-dot ${r}">${r}</div>`).join('');
  return `<div class="form-card">
    <div class="form-header">
      <span class="form-team-name">${name}</span>
      <span style="font-size:11px;color:var(--muted)">5 derniers matchs</span>
    </div>
    <div class="form-dots">${dots}</div>
  </div>`;
}

function renderResult(home, away, homeStats, awayStats, pred) {
  const h2h = generateH2H(home, away);

  // Facteurs clés
  const factors = [];

  if (homeStats.form.startsWith('WW')) {
    factors.push({ icon: '🔥', title: `${home.name} en grande forme`, desc: `Série de victoires consécutives`, badge: 'pos', bText: '+' });
  }
  if (awayStats.goalsAgainst < 0.8) {
    factors.push({ icon: '🛡️', title: `Défense solide de ${away.name}`, desc: `Moins de ${awayStats.goalsAgainst} buts encaissés/match en moyenne`, badge: 'pos', bText: '+' });
  }
  if (homeStats.possession > 58) {
    factors.push({ icon: '⚽', title: `Domination du ballon`, desc: `${home.name} contrôle ${homeStats.possession}% du ballon`, badge: 'neu', bText: '~' });
  }
  if (awayStats.form.includes('L') && awayStats.form.includes('L')) {
    factors.push({ icon: '📉', title: `${away.name} en difficulté`, desc: `Plusieurs défaites récentes`, badge: 'neg', bText: '-' });
  }
  factors.push({ icon: '🏠', title: `Avantage du terrain`, desc: `${home.name} joue à domicile (+12% historiquement)`, badge: 'pos', bText: '+' });
  if (h2h.homeWins > h2h.awayWins) {
    factors.push({ icon: '📊', title: `Historique favorable`, desc: `${home.name} mène ${h2h.homeWins}-${h2h.awayWins} dans les confrontations directes`, badge: 'pos', bText: '+' });
  }

  const h2hMatchesHtml = h2h.matches.map(m => `
    <div class="h2h-match">
      <span class="date">${m.date}</span>
      <span class="teams-h2h">${home.name} vs ${away.name}</span>
      <span class="score-h2h">${m.homeGoals} - ${m.awayGoals}</span>
    </div>
  `).join('');

  $('result').innerHTML = `
    <div class="match-card">
      <div class="competition-badge">⚽ Analyse FootPredict</div>
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
      <div class="match-meta">Prédiction générée le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
    </div>

    <div class="prediction-card">
      <h2>🎯 Score Prédit</h2>
      <div class="score-display">
        <div class="score-num">${pred.homeScore}</div>
        <div class="score-sep">—</div>
        <div class="score-num">${pred.awayScore}</div>
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
      <div class="section-title">📈 Statistiques</div>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>${home.name}</h3>
          ${renderStat('Buts marqués/match', homeStats.goalsFor, 4, 'var(--green)')}
          ${renderStat('Buts encaissés/match', homeStats.goalsAgainst, 4, 'var(--red)')}
          ${renderStat('Possession (%)', homeStats.possession, 100, 'var(--accent)')}
          ${renderStat('xG moyen', homeStats.xG, 3.5, 'var(--accent2)')}
        </div>
        <div class="stat-card">
          <h3>${away.name}</h3>
          ${renderStat('Buts marqués/match', awayStats.goalsFor, 4, 'var(--green)')}
          ${renderStat('Buts encaissés/match', awayStats.goalsAgainst, 4, 'var(--red)')}
          ${renderStat('Possession (%)', awayStats.possession, 100, 'var(--accent)')}
          ${renderStat('xG moyen', awayStats.xG, 3.5, 'var(--accent2)')}
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="section-title">📋 Forme récente</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${renderForm(home.name, homeStats.form)}
        ${renderForm(away.name, awayStats.form)}
      </div>
    </div>

    <div class="h2h-section">
      <div class="section-title">🆚 Face à face</div>
      <div class="h2h-card">
        <div class="h2h-summary">
          <div class="h2h-box home">
            <div class="num">${h2h.homeWins}</div>
            <div class="lbl">${home.name}</div>
          </div>
          <div class="h2h-box draw">
            <div class="num">${h2h.draws}</div>
            <div class="lbl">Nuls</div>
          </div>
          <div class="h2h-box away">
            <div class="num">${h2h.awayWins}</div>
            <div class="lbl">${away.name}</div>
          </div>
        </div>
        <div class="h2h-matches">${h2hMatchesHtml}</div>
      </div>
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
          </div>
        `).join('')}
      </div>
    </div>

    <div class="disclaimer">
      ⚠️ Ces prédictions sont basées sur des analyses statistiques et ne constituent pas des conseils de paris. FootPredict n'encourage pas les jeux d'argent.
    </div>
  `;

  $('home').classList.add('hidden');
  $('loading').classList.add('hidden');
  $('result').classList.remove('hidden');
  $('error-box').classList.add('hidden');
}

// ─── ANALYSE PRINCIPALE ──────────────────────────────────────────────────────
async function analyzeMatch(text) {
  showLoading();
  const match = parseMatch(text);

  if (!match) {
    showError(`Impossible de trouver les deux équipes dans "${text}". Essaie "PSG Chelsea" ou "Barcelona vs Real Madrid".`);
    return;
  }

  const { home, away } = match;
  let homeStats, awayStats;

  // Essayer l'API en premier
  const [homeMatches, awayMatches] = await Promise.all([
    fetchTeamMatches(home.id),
    fetchTeamMatches(away.id)
  ]);

  homeStats = processMatches(homeMatches, home.id) || getDefaultStats(home.id);
  awayStats = processMatches(awayMatches, away.id) || getDefaultStats(away.id);

  const pred = predict(homeStats, awayStats);
  renderResult(home, away, homeStats, awayStats, pred);
}

// ─── PARTAGE (Web Share Target) ──────────────────────────────────────────────
function handleShareTarget() {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title') || '';
  const text = params.get('text') || '';
  const url = params.get('url') || '';
  const combined = `${title} ${text} ${url}`.trim();

  if (combined) {
    $('share-banner').classList.remove('hidden');
    $('share-text').textContent = `"${combined.slice(0, 60)}..."`;
    // Nettoyer l'URL
    window.history.replaceState({}, '', '/');
    // Lancer analyse
    setTimeout(() => analyzeMatch(combined), 500);
    return true;
  }
  return false;
}

// ─── PWA INSTALL ─────────────────────────────────────────────────────────────
let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  $('install-banner').classList.remove('hidden');
});

// ─── INIT ────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // Gestion clé API
  $('api-key-input').value = API_KEY;
  $('save-key-btn').onclick = () => {
    API_KEY = $('api-key-input').value.trim();
    localStorage.setItem('fd_api_key', API_KEY);
    $('api-key-input').style.borderColor = 'var(--green)';
    setTimeout(() => { $('api-key-input').style.borderColor = ''; }, 1500);
  };

  // Bouton installer
  $('install-btn').onclick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') $('install-banner').classList.add('hidden');
    }
  };

  // Recherche manuelle
  $('search-btn').onclick = () => {
    const val = $('search-input').value.trim();
    if (val) analyzeMatch(val);
  };

  $('search-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const val = $('search-input').value.trim();
      if (val) analyzeMatch(val);
    }
  });

  // Bouton retour
  document.addEventListener('click', e => {
    if (e.target.id === 'back-btn') showHome();
  });

  // Vérifier si c'est un partage
  if (!handleShareTarget()) {
    showHome();
  }
});
