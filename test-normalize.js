// Test de la fonction normalizeToMidnightUTC

function normalizeToMidnightUTC(date) {
  const d = new Date(date);
  console.log('Avant setUTCHours:', d, d.toISOString());
  d.setUTCHours(0, 0, 0, 0);
  console.log('Après setUTCHours:', d, d.toISOString());
  return d;
}

console.log('=== Test 1: avec toISOString() incluant l\'heure ===');
const date1 = new Date();
console.log('Date initiale:', date1.toISOString());
const normalized1 = normalizeToMidnightUTC(date1.toISOString());
console.log('Résultat:', normalized1.toISOString());
console.log('');

console.log('=== Test 2: avec une date string sans heure (YYYY-MM-DD) ===');
const date2String = '2025-11-11';
const normalized2 = normalizeToMidnightUTC(date2String);
console.log('Date initiale:', date2String);
console.log('Résultat:', normalized2.toISOString());
console.log('');

console.log('=== Test 3: avec un objet Date complet ===');
const date3 = new Date('2025-11-11T20:25:55.676Z');
console.log('Date initiale:', date3.toISOString());
const normalized3 = normalizeToMidnightUTC(date3);
console.log('Résultat:', normalized3.toISOString());
