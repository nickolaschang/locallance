// LocalLance shared interface pieces: header, footer and the small HTML builders every page reuses.

const LLUI = (() => {
  // Escape text typed by users before it goes into the page.
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const pin = (size, color) => `<svg width="${size}" height="${size * 1.25}" viewBox="0 0 48 60" aria-hidden="true"><path d="M24 2C11.85 2 2 11.85 2 24c0 15.5 22 34 22 34s22-18.5 22-34C46 11.85 36.15 2 24 2z" fill="${color}"/><circle cx="24" cy="24" r="8" fill="#FDFDFB"/></svg>`;

  const icons = {
    code: '<path d="M9 8l-5 4 5 4M15 8l5 4-5 4" />',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />',
    wifi: '<path d="M3 9a13 13 0 0118 0M6 12.5a9 9 0 0112 0M9 16a5 5 0 016 0" /><circle cx="12" cy="19" r="1" />',
    megaphone: '<path d="M4 10v4h3l8 4V6L7 10H4zM18 9a4 4 0 010 6" />',
    text: '<path d="M5 6h14M5 10h14M5 14h9M5 18h11" />',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2" />'
  };
  const icon = name => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

  const avatar = (u, size = 44) => {
    const initials = u.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `<span class="avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.38)}px">${esc(initials)}</span>`;
  };

  const stars = u => u.jobsDone || u.rating ? `<span class="stars">&#9733; ${Number(u.rating).toFixed(1)}</span>` : '<span class="badge">New</span>';
  const verified = u => u.abnVerified ? '<span class="badge green">ABN verified</span>' : '<span class="badge amber">ABN pending</span>';

  const STATUS = {
    open: ['Open for proposals', 'green'],
    assigned: ['Awaiting payment', 'amber'],
    in_progress: ['In progress', 'navy'],
    delivered: ['Delivered, awaiting approval', 'amber'],
    completed: ['Completed', '']
  };
  const statusBadge = status => `<span class="badge ${STATUS[status][1]}">${STATUS[status][0]}</span>`;

  // ----- header and footer -----
  const header = active => {
    const me = LL.me();
    const link = (key, href, label) => `<a href="${href}" class="${active === key ? 'active' : ''}">${label}</a>`;
    const account = me
      ? `${link('dashboard', 'dashboard.html', 'Dashboard')}${link('messages', 'messages.html', 'Messages')}
         <span class="user-chip">${avatar(me, 32)} ${esc(me.name.split(' ')[0])}</span>
         <button class="link-btn" id="logout-btn">Log out</button>`
      : `${link('login', 'login.html', 'Log in')}<a class="btn small" href="post-job.html">Post a job</a>`;
    return `<header class="site-header"><div class="wrap">
      <a class="logo" href="index.html">${pin(22, '#157A52')} LocalLance</a>
      <nav class="nav">
        ${link('jobs', 'jobs.html', 'Find jobs')}
        ${link('freelancers', 'freelancers.html', 'Find freelancers')}
        ${link('services', 'services.html', 'Services')}
        ${link('contact', 'contact.html', 'Contact us')}
      </nav>
      <span class="spacer"></span>
      <nav class="nav" style="align-items:center">${account}</nav>
    </div></header>`;
  };

  const footer = () => `<footer class="site-footer"><div class="wrap">
      <div><b>${LL_CONTACT.company}</b>ABN ${LL_CONTACT.abn} (temporary)<br>ACN ${LL_CONTACT.acn} (temporary)<br>${LL_CONTACT.address}</div>
      <div><b>Explore</b><a href="jobs.html">Find jobs</a><a href="freelancers.html">Find freelancers</a><a href="services.html">Services</a><a href="contact.html">Contact us</a></div>
      <div><b>Follow us</b><a href="https://www.facebook.com/" target="_blank" rel="noopener">Facebook</a><a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a></div>
      <div><b>Demo</b>All people, businesses, jobs and payments on this site are fictitious. No real payment is ever taken.<br><button class="link-btn" id="reset-btn">Reset demo data</button></div>
    </div>
    <div class="wrap" style="display:block"><p class="disclaimer">This website/app is for a class assignment and not for commercial purposes.</p></div>
  </footer>`;

  // Every page calls this once to draw the header and footer.
  const mount = active => {
    document.getElementById('site-header').innerHTML = header(active);
    document.getElementById('site-footer').innerHTML = footer();
    const logout = document.getElementById('logout-btn');
    if (logout) logout.addEventListener('click', () => { LL.logout(); location.href = 'index.html'; });
    document.getElementById('reset-btn').addEventListener('click', () => { if (confirm('Reset all demo data to how it started?')) LL.reset(); });
  };

  // ----- cards -----
  const jobCard = j => {
    const customer = LL.user(j.customerId);
    const count = LL.proposalsFor(j.id).length;
    return `<div class="card">
      <div class="row"><span class="badge">${esc(LL.service(j.category).name)}</span>${j.onsite ? '<span class="badge navy">On site</span>' : ''}<span class="spacer"></span><span class="price">${LL.money(j.budget)}</span></div>
      <h3 style="margin-top:10px"><a href="job.html?id=${j.id}">${esc(j.title)}</a></h3>
      <p class="muted">${esc(j.description.slice(0, 130))}${j.description.length > 130 ? '...' : ''}</p>
      <div class="row small muted"><span>${esc(customer.business)}, ${esc(j.suburb)}</span><span class="spacer"></span><span>${count} proposal${count === 1 ? '' : 's'} &middot; posted ${LL.daysAgo(j.postedAt)}</span></div>
    </div>`;
  };

  const freelancerCard = (f, fromSuburb) => {
    const km = fromSuburb ? LL.distanceKm(fromSuburb, f.suburb) : null;
    return `<div class="card">
      <div class="list-item">${avatar(f, 56)}
        <div class="body">
          <div class="row"><h3 style="margin:0"><a href="freelancer.html?id=${f.id}">${esc(f.name)}</a></h3>${f.promoted ? '<span class="badge navy">Promoted</span>' : ''}</div>
          <div class="muted">${esc(f.title)} &middot; ${esc(f.suburb)}${km === null ? '' : ' &middot; ' + km + ' km away'}</div>
        </div>
      </div>
      <p class="muted" style="margin-top:12px">${esc(f.bio)}</p>
      <div class="row">${stars(f)}<span class="small muted">${f.jobsDone} jobs</span>${verified(f)}<span class="spacer"></span><b>${LL.money(f.rate)}/hr</b></div>
    </div>`;
  };

  const promo = ad => `<div class="promo">
      <div><div class="tag">Promotion &middot; ${esc(ad.tag)}</div><h2>${esc(ad.title)}</h2><p>${esc(ad.text)}</p></div>
      <span class="spacer"></span><a class="btn light" href="${ad.link}">${esc(ad.cta)}</a>
    </div>`;

  const empty = text => `<div class="empty">${text}</div>`;

  // A panel asking the visitor to log in, used by pages that need an account.
  const needLogin = what => `<div class="card"><h3>Log in to ${what}</h3><p class="muted">This is a demo, so there are no passwords. Pick a ready-made account or create your own.</p><a class="btn" href="login.html">Log in or sign up</a></div>`;

  return { esc, pin, icon, avatar, stars, verified, statusBadge, mount, jobCard, freelancerCard, promo, empty, needLogin };
})();
