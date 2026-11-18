// Freelancer profile page. The freelancer is chosen by the id in the address bar, e.g. freelancer.html?id=f1

LLUI.mount('freelancers');

const f = LL.user(LL.param('id'));
const esc = LLUI.esc;

// ===== 1. Main column: who they are, skills, reviews =====
const reviews = LL.reviewsFor(f.id);
const done = LL.state.jobs.filter(j => j.freelancerId === f.id && j.status === 'completed');

document.title = f.name + ' | LocalLance';
document.getElementById('profile').innerHTML = `
  <div class="card">
    <div class="list-item">${LLUI.avatar(f, 84)}
      <div class="body">
        <div class="row"><h1 style="margin:0">${esc(f.name)}</h1>${f.promoted ? '<span class="badge solid">Promoted</span>' : ''}</div>
        <p class="muted">${esc(f.title)}, ${esc(f.suburb)}</p>
        <div class="row">${LLUI.stars(f)}<span class="muted">${f.jobsDone} jobs completed</span>${LLUI.verified(f)}</div>
      </div>
    </div>
    <p style="margin-top:18px">${esc(f.bio)}</p>
    <div class="tags">${f.skills.map(s => `<span class="badge">${esc(s)}</span>`).join('')}</div>
  </div>

  <div class="card">
    <h3>Reviews (${reviews.length})</h3>
    ${reviews.length ? reviews.map(r => {
      const author = LL.user(r.fromId);
      return `<div style="padding:12px 0;border-top:1px solid var(--line)">
        <div class="row"><b>${esc(author.business)}</b><span class="stars">${'&#9733;'.repeat(r.rating)}</span><span class="spacer"></span><span class="small muted">${r.date}</span></div>
        <p class="muted" style="margin:6px 0 0">${esc(r.text)}</p>
      </div>`;
    }).join('') : '<p class="muted">No reviews yet.</p>'}
  </div>

  <div class="card">
    <h3>Completed on LocalLance</h3>
    ${done.length
      ? done.map(j => `<p><a href="job.html?id=${j.id}">${esc(j.title)}</a> <span class="muted">for ${esc(LL.user(j.customerId).business)}</span></p>`).join('')
      : '<p class="muted">Jobs completed through LocalLance will be listed here.</p>'}
  </div>`;

// ===== 2. Side column: rate, hire button, location map =====
const me = LL.me();
const km = me ? LL.distanceKm(me.suburb, f.suburb) : null;
const mapUrl = 'https://www.google.com/maps?q=' + encodeURIComponent(f.suburb + ' VIC, Australia') + '&output=embed';

document.getElementById('side').innerHTML = `
  <div class="card">
    <div class="price">${LL.money(f.rate)} <span class="small muted">per hour</span></div>
    <p class="muted">${f.abnVerified ? 'ABN ' + esc(f.abn) + ' checked against ABN Lookup (simulated).' : 'ABN not yet verified.'}</p>
    <p class="muted">Member since ${f.joined}.</p>
    <a class="btn block" href="post-job.html">Post a job for ${esc(f.name.split(' ')[0])}</a>
  </div>
  <div class="card">
    <h3>Location</h3>
    <p class="muted">${esc(f.suburb)}, Victoria${km === null ? '' : ', ' + km + ' km from you'}</p>
    <iframe class="map-frame" src="${mapUrl}" title="Map of ${esc(f.suburb)}" loading="lazy"></iframe>
  </div>`;
