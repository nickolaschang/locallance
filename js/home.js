// Home page.

LLUI.mount('home');

const RADIUS_KM = 10;
const suburbSelect = document.getElementById('finder-suburb');
const serviceSelect = document.getElementById('finder-service');

// ===== 1. The finder: suburb + service -> map, count and nearest list =====
suburbSelect.innerHTML = Object.keys(LL_SUBURBS).map(name => `<option>${name}</option>`).join('');
serviceSelect.innerHTML += LL_SERVICES.map(s => `<option value="${s.id}">${s.name.toLowerCase()}</option>`).join('');
// Start from the logged-in user's suburb, or the LocalLance office suburb for visitors.
suburbSelect.value = LL.me() ? LL.me().suburb : 'Footscray';

function renderFinder() {
  const home = suburbSelect.value;
  const service = serviceSelect.value;
  const near = LL.freelancers()
    .filter(f => !service || f.category === service)
    .map(f => Object.assign({ km: LL.distanceKm(home, f.suburb) }, f))
    .filter(f => f.km <= RADIUS_KM)
    .sort((a, b) => a.km - b.km);

  document.getElementById('finder-readout').textContent =
    `${near.length} freelancer${near.length === 1 ? '' : 's'} within ${RADIUS_KM} km of ${home}`;

  const go = document.getElementById('finder-go');
  go.href = `freelancers.html?from=${encodeURIComponent(home)}&km=${RADIUS_KM}${service ? '&category=' + service : ''}`;
  go.textContent = near.length > 5 ? `See all ${near.length}` : 'Open the full list';

  // The map pins and the list rows share the same numbers.
  document.getElementById('hero-map').innerHTML = LLUI.map(near, home);
  document.getElementById('near-title').textContent = 'Nearest to ' + home;
  document.getElementById('near-list').innerHTML = near.length
    ? `<div class="list">${near.slice(0, 5).map((f, i) => LLUI.freelancerRow(f, home, i + 1)).join('')}</div>`
    : LLUI.empty(`Nobody offers that within ${RADIUS_KM} km of ${home} yet. <a href="post-job.html">Post a job</a> and freelancers from further out can reply.`);
}

document.getElementById('finder').addEventListener('input', renderFinder);
renderFinder();

document.getElementById('trust').innerHTML = ['ABN-verified freelancers', 'Free for customers', 'Flat 8% freelancer fee']
  .map(text => `<span>${LLUI.icon('check', 16)} ${text}</span>`).join('');

// ===== 2. Promotion strip =====
// A different promotion each day of the month.
const ads = LL.state.ads;
document.getElementById('promo').innerHTML = LLUI.promo(ads[new Date().getDate() % ads.length]);

// ===== 3. Services =====
document.getElementById('services').innerHTML = LL_SERVICES.map(s => `
  <a class="item service" href="freelancers.html?category=${s.id}">
    <span class="icon-box">${LLUI.icon(s.icon)}</span>
    <span><b>${s.name}</b><br><span class="muted">${s.blurb}</span></span>
    <span class="muted">from ${LL.money(s.from)}</span>
  </a>`).join('');

// ===== 4. Latest jobs =====
const openJobs = LL.state.jobs.filter(j => j.status === 'open');
document.getElementById('latest-jobs').innerHTML = openJobs
  .slice()
  .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
  .slice(0, 4)
  .map(LLUI.jobRow)
  .join('');

// ===== 5. Numbers strip =====
const released = LL.state.payments.filter(p => p.status === 'released');
const stats = [
  [LL.freelancers().filter(f => f.abnVerified).length, 'ABN-verified freelancers'],
  [openJobs.length, 'jobs open right now'],
  [LL.money(released.reduce((sum, p) => sum + p.payout, 0)), 'paid out to local freelancers'],
  ['8%', 'flat fee, free for customers']
];
document.getElementById('stats').innerHTML = stats.map(([value, label]) =>
  `<div class="card"><div class="num">${value}</div><div class="muted">${label}</div></div>`).join('');
