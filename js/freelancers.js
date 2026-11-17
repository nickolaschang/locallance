// Find freelancers page: filters, distance from the customer's suburb, and a location map.

LLUI.mount('freelancers');

const text = document.getElementById('f-text');
const category = document.getElementById('f-category');
const from = document.getElementById('f-from');
const maxKm = document.getElementById('f-km');
const verifiedOnly = document.getElementById('f-verified');
const sort = document.getElementById('f-sort');

// ===== 1. Fill the dropdowns and read filters from the address bar =====
category.innerHTML += LL_SERVICES.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
from.innerHTML = Object.keys(LL_SUBURBS).map(name => `<option>${name}</option>`).join('');
from.value = LL.me() ? LL.me().suburb : 'Melbourne CBD';
text.value = LL.param('q') || '';
category.value = LL.param('category') || '';

// ===== 2. The map =====
// Turns a suburb's latitude and longitude into a position on a 600 x 320 drawing.
// About 12 pixels per kilometre, so the distance rings are true to scale.
const PX_PER_KM = 12;
function place(suburb) {
  const [lat, lng] = LL_SUBURBS[suburb];
  return { x: (lng - 144.62) / 0.54 * 560 + 20, y: (-37.72 - lat) / 0.20 * 280 + 20 };
}

function drawMap(list) {
  const home = place(from.value);
  const perSuburb = {};
  list.forEach(f => { perSuburb[f.suburb] = (perSuburb[f.suburb] || 0) + 1; });

  const rings = [5, 10, 20].map(km =>
    `<circle cx="${home.x}" cy="${home.y}" r="${km * PX_PER_KM}" fill="none" stroke="#14213D" stroke-opacity="0.18" stroke-dasharray="4 5"/>
     <text x="${home.x + km * PX_PER_KM - 4}" y="${home.y - 4}" font-size="10" fill="#44506A" text-anchor="end">${km} km</text>`).join('');

  // Suburb names alternate above and below their pins so close neighbours do not overlap.
  const pins = Object.keys(perSuburb).map((name, i) => {
    const p = place(name);
    return `<g><title>${perSuburb[name]} freelancer(s) in ${name}</title>
      <circle cx="${p.x}" cy="${p.y}" r="10" fill="#157A52"/>
      <text x="${p.x}" y="${p.y + 4}" font-size="11" font-weight="700" fill="#FDFDFB" text-anchor="middle">${perSuburb[name]}</text>
      <text x="${p.x}" y="${i % 2 ? p.y - 14 : p.y + 22}" font-size="10" fill="#14213D" text-anchor="middle">${name}</text></g>`;
  }).join('');

  document.getElementById('map-holder').innerHTML = `
    <svg class="map" viewBox="0 0 600 320" role="img" aria-label="Map of freelancers around ${from.value}">
      <rect width="600" height="320" fill="#EAF1EC"/>
      <path d="M150 320 L175 250 L250 215 L330 205 L385 225 L420 270 L430 320 Z" fill="#CFE3EE"/>
      <text x="300" y="295" font-size="11" fill="#44506A" text-anchor="middle">Port Phillip Bay</text>
      ${rings}
      ${pins}
      <circle cx="${home.x}" cy="${home.y}" r="6" fill="#14213D" stroke="#FDFDFB" stroke-width="2"/>
      <text x="${home.x + 10}" y="${home.y - 10}" font-size="11" font-weight="700" fill="#14213D">You: ${from.value}</text>
    </svg>`;
}

// ===== 3. Draw the list =====
function render() {
  const words = text.value.trim().toLowerCase();
  const list = LL.freelancers()
    .map(f => Object.assign({ km: LL.distanceKm(from.value, f.suburb) }, f))
    .filter(f => !words || (f.name + ' ' + f.title + ' ' + f.skills.join(' ')).toLowerCase().includes(words))
    .filter(f => !category.value || f.category === category.value)
    .filter(f => !maxKm.value || f.km <= Number(maxKm.value))
    .filter(f => !verifiedOnly.checked || f.abnVerified)
    .sort((a, b) => {
      // Promoted freelancers always come first: that is what they pay for.
      if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;
      if (sort.value === 'rating') return b.rating - a.rating;
      if (sort.value === 'rate') return a.rate - b.rate;
      return a.km - b.km;
    });

  drawMap(list);
  document.getElementById('count').textContent = list.length + ' freelancer' + (list.length === 1 ? '' : 's') + ' found. Promoted profiles are shown first.';
  document.getElementById('freelancer-list').innerHTML = list.length
    ? list.map(f => LLUI.freelancerCard(f, from.value)).join('')
    : LLUI.empty('No freelancers match those filters.');
}

// ===== 4. Redraw whenever a filter changes =====
document.getElementById('filters').addEventListener('input', render);
document.getElementById('filters').addEventListener('submit', event => event.preventDefault());
render();
