// Home page.

LLUI.mount('home');

// ===== 1. Freelancers near you =====
// Uses the logged-in user's suburb, or the LocalLance office suburb for visitors.
const homeSuburb = LL.me() ? LL.me().suburb : 'Footscray';
const nearest = LL.freelancers()
  .map(f => ({ f, km: LL.distanceKm(homeSuburb, f.suburb) }))
  .sort((a, b) => a.km - b.km)
  .slice(0, 3);

document.getElementById('near-title').textContent = 'Freelancers near ' + homeSuburb;
document.getElementById('near-list').innerHTML = nearest.map(({ f, km }) => `
  <a class="mini-person" href="freelancer.html?id=${f.id}">
    ${LLUI.avatar(f, 44)}
    <div><b>${LLUI.esc(f.name)}</b><div class="meta">${LLUI.esc(f.title)} &middot; ${LLUI.esc(f.suburb)} &middot; ${km} km</div></div>
    <span class="spacer"></span>
    <div class="right"><b>${f.rating.toFixed(1)} / 5</b><div class="meta">${f.jobsDone} jobs</div></div>
  </a>`).join('');

// ===== 2. Promotion banner =====
// A different promotion each day of the month.
const ads = LL.state.ads;
document.getElementById('promo').innerHTML = LLUI.promo(ads[new Date().getDate() % ads.length]);

// ===== 3. Services =====
document.getElementById('services').innerHTML = LL_SERVICES.map(s => `
  <a class="card" href="freelancers.html?category=${s.id}" style="color:inherit">
    <div class="icon-box">${LLUI.icon(s.icon)}</div>
    <h3>${s.name}</h3>
    <p class="muted">${s.blurb}</p>
    <span class="small">From ${LL.money(s.from)}</span>
  </a>`).join('');

// ===== 4. Featured freelancers and latest jobs =====
document.getElementById('featured').innerHTML = LL.freelancers()
  .filter(f => f.promoted)
  .slice(0, 3)
  .map(f => LLUI.freelancerCard(f, homeSuburb))
  .join('');

const openJobs = LL.state.jobs.filter(j => j.status === 'open');
document.getElementById('latest-jobs').innerHTML = openJobs
  .slice()
  .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
  .slice(0, 3)
  .map(LLUI.jobCard)
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

// ===== 6. Search box =====
document.getElementById('search-form').addEventListener('submit', event => {
  event.preventDefault();
  const text = document.getElementById('search-text').value.trim();
  const page = document.getElementById('search-kind').value;
  location.href = page + '.html' + (text ? '?q=' + encodeURIComponent(text) : '');
});
