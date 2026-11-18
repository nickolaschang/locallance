// Find freelancers page: filters, distance from the customer's suburb, and a location map.

LLUI.mount('freelancers');

const text = document.getElementById('f-text');
const category = document.getElementById('f-category');
const from = document.getElementById('f-from');
const maxKm = document.getElementById('f-km');
const verifiedOnly = document.getElementById('f-verified');
const sort = document.getElementById('f-sort');

// ===== 1. Fill the dropdowns and read filters from the address bar =====
// The home page finder links here with ?from=Suburb&km=10&category=web
category.innerHTML += LL_SERVICES.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
from.innerHTML = Object.keys(LL_SUBURBS).map(name => `<option>${name}</option>`).join('');
from.value = LL.param('from') || (LL.me() ? LL.me().suburb : 'Melbourne CBD');
maxKm.value = LL.param('km') || '';
text.value = LL.param('q') || '';
category.value = LL.param('category') || '';

// ===== 2. Draw the map and the list =====
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

  // The numbers on the map pins match the numbers on the rows.
  document.getElementById('map-holder').innerHTML = LLUI.map(list, from.value);
  document.getElementById('count').textContent = list.length + ' freelancer' + (list.length === 1 ? '' : 's') + ' found. Promoted profiles are shown first.';
  document.getElementById('freelancer-list').innerHTML = list.length
    ? `<div class="list">${list.map((f, i) => LLUI.freelancerRow(f, from.value, i + 1)).join('')}</div>`
    : LLUI.empty('No freelancers match those filters.');
}

// ===== 3. Redraw whenever a filter changes =====
document.getElementById('filters').addEventListener('input', render);
document.getElementById('filters').addEventListener('submit', event => event.preventDefault());
render();
