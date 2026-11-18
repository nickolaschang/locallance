// Home page.

LLUI.mount('home');

const RADIUS_KM = 10;
const suburbSelect = document.getElementById('finder-suburb');
const serviceSelect = document.getElementById('finder-service');
const openJobs = LL.state.jobs.filter(j => j.status === 'open');
const released = LL.state.payments.filter(p => p.status === 'released');
const paidOut = LL.money(released.reduce((sum, p) => sum + p.payout, 0));

// ===== 1. The search bar: suburb + service -> counters, map and nearest list =====
document.getElementById('seg-where').insertAdjacentHTML('afterbegin', LLUI.icon('place', 22));
document.getElementById('seg-what').insertAdjacentHTML('afterbegin', LLUI.icon('briefcase', 22));
suburbSelect.innerHTML = Object.keys(LL_SUBURBS).map(name => `<option>${name}</option>`).join('');
serviceSelect.innerHTML += LL_SERVICES.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
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

  document.getElementById('finder-go').href =
    `freelancers.html?from=${encodeURIComponent(home)}&km=${RADIUS_KM}${service ? '&category=' + service : ''}`;

  document.getElementById('counters').innerHTML = [
    [near.length, `freelancer${near.length === 1 ? '' : 's'} within ${RADIUS_KM} km`],
    [openJobs.length, 'jobs open now'],
    [paidOut, 'paid out to locals']
  ].map(([value, label]) => `<div><b>${value}</b><span>${label}</span></div>`).join('');

  // The map pins and the list rows share the same numbers.
  document.getElementById('near-title').textContent = 'Freelancers near ' + home;
  document.getElementById('hero-map').innerHTML = LLUI.map(near, home);
  document.getElementById('near-list').innerHTML = near.length
    ? `<div class="list compact">${near.slice(0, 4).map((f, i) => LLUI.freelancerRow(f, home, i + 1)).join('')}</div>`
    : LLUI.empty(`Nobody offers that within ${RADIUS_KM} km of ${home} yet. <a href="post-job.html">Post a job</a> and freelancers from further out can reply.`);
}

document.getElementById('finder').addEventListener('input', renderFinder);
renderFinder();

// ===== 2. Service categories, with live counts =====
document.getElementById('services').innerHTML = LL_SERVICES.map(s => {
  const people = LL.freelancers().filter(f => f.category === s.id).length;
  return `<a class="cat" href="freelancers.html?category=${s.id}">
    ${LLUI.icon(s.icon, 40)}
    <span class="chip">${people} freelancer${people === 1 ? '' : 's'}</span>
    <b>${s.name}</b>
    <span class="muted">${s.blurb}</span>
  </a>`;
}).join('');

// ===== 3. Latest jobs and a promotion =====
document.getElementById('latest-jobs').innerHTML = openJobs
  .slice()
  .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
  .slice(0, 5)
  .map(LLUI.jobRow)
  .join('');

// A different promotion each day of the month.
const ads = LL.state.ads;
document.getElementById('promo').innerHTML = LLUI.promo(ads[new Date().getDate() % ads.length]);

// ===== 4. Top rated freelancers =====
document.getElementById('top-rated').innerHTML = LL.freelancers()
  .slice()
  .sort((a, b) => b.rating - a.rating || b.jobsDone - a.jobsDone)
  .slice(0, 4)
  .map(f => LLUI.freelancerCard(f, suburbSelect.value))
  .join('');

// ===== 5. Numbers band =====
const stats = [
  [LL.freelancers().filter(f => f.abnVerified).length, 'ABN-verified freelancers'],
  [openJobs.length, 'jobs open right now'],
  [paidOut, 'paid out to local freelancers'],
  ['8%', 'flat fee, free for customers']
];
document.getElementById('stats').innerHTML = stats.map(([value, label]) =>
  `<div><div class="num">${value}</div><div>${label}</div></div>`).join('');
