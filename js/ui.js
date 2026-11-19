// LocalLance shared interface pieces: header, footer, list rows, cards, the location map,
// and the small HTML builders every page reuses.

const LLUI = (() => {
  // Escape text typed by users before it goes into the page.
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const BLUE = '#1257B8';
  const INK = '#102A43';

  const pin = (size, color) => `<svg width="${size}" height="${size * 1.25}" viewBox="0 0 48 60" aria-hidden="true"><path d="M24 2C11.85 2 2 11.85 2 24c0 15.5 22 34 22 34s22-18.5 22-34C46 11.85 36.15 2 24 2z" fill="${color}"/><circle cx="24" cy="24" r="8" fill="#fff"/></svg>`;

  // ----- icons (simple line drawings, so there are no icon files to load) -----
  const icons = {
    code: '<path d="M9 8l-5 4 5 4M15 8l5 4-5 4" />',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />',
    wifi: '<path d="M3 9a13 13 0 0118 0M6 12.5a9 9 0 0112 0M9 16a5 5 0 016 0" /><circle cx="12" cy="19" r="1" />',
    megaphone: '<path d="M4 10v4h3l8 4V6L7 10H4zM18 9a4 4 0 010 6" />',
    text: '<path d="M5 6h14M5 10h14M5 14h9M5 18h11" />',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2" />',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5" />',
    place: '<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" />',
    clock: '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />',
    building: '<path d="M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16M15 10h4a1 1 0 011 1v10M2 21h20M8 8h3M8 12h3M8 16h3" />',
    bell: '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4l2-2zM10 20a2 2 0 004 0" />',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />',
    chat: '<path d="M4 5h16v11H9l-5 4V5z" />',
    search: '<circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" />',
    menu: '<path d="M4 7h16M4 12h16M4 17h16" />'
  };
  const icon = (name, size = 22) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

  // A small icon followed by text, e.g. a pin and a suburb.
  const meta = (name, text) => `<span class="meta-item">${icon(name, 15)} ${text}</span>`;

  // The blue tick shown beside ABN-verified freelancers.
  const tick = u => u.abnVerified ? `<span class="tick" title="ABN verified">${icon('check', 11)}</span>` : '';

  // ----- pictures of people and businesses -----
  const SHADES = [BLUE, '#34455C', '#3E7CCB', '#5B6B82', '#0E3D82'];
  const shade = text => SHADES[[...text].reduce((sum, c) => sum + c.charCodeAt(0), 0) % SHADES.length];
  const initials = text => text.split(' ').filter(w => /[a-z]/i.test(w[0])).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // The demo people (ids c1-c6 and f1-f12) have a photo in img/people. Anyone who signs up gets their initials.
  const avatar = (u, size = 44) => /^[cf]\d+$/.test(u.id)
    ? `<img class="avatar" src="img/people/${u.id}.jpg" alt="" width="${size}" height="${size}" style="width:${size}px;height:${size}px">`
    : `<span class="avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.38)}px;background:${shade(u.name)}">${esc(initials(u.name))}</span>`;

  // A square "logo" for a customer's business, made from its initials.
  const logo = (u, size = 46) => `<span class="logo-tile" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.36)}px;background:${shade(u.business)}">${esc(initials(u.business))}</span>`;

  const starIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3 6.6 7 .8-5.2 4.8 1.5 7-6.3-3.7-6.3 3.7 1.5-7L2 9.4l7-.8z"/></svg>';
  const stars = u => u.jobsDone || u.rating ? `<span class="stars">${starIcon} ${Number(u.rating).toFixed(1)}</span>` : '<span class="badge">New</span>';
  const verified = u => u.abnVerified ? '<span class="badge ok">ABN verified</span>' : '<span class="badge wait">ABN pending</span>';

  const STATUS = {
    open: ['Open for proposals', 'ok'],
    assigned: ['Awaiting payment', 'wait'],
    in_progress: ['In progress', 'solid'],
    delivered: ['Delivered, awaiting approval', 'wait'],
    completed: ['Completed', '']
  };
  const statusBadge = status => `<span class="badge ${STATUS[status][1]}">${STATUS[status][0]}</span>`;

  // ----- header and footer -----
  // Jobs that are waiting on this user to do something, plus job offers they have not replied to (the number on the bell).
  const waitingOn = me => LL.offersFor(me.id).length + LL.state.jobs.filter(j => {
    if (me.role === 'customer' && j.customerId === me.id) {
      return (j.status === 'open' && LL.proposalsFor(j.id).length) || j.status === 'assigned' || j.status === 'delivered' || (j.status === 'completed' && !LL.reviewOf(j.id));
    }
    return me.role === 'freelancer' && j.freelancerId === me.id && j.status === 'in_progress';
  }).length;

  // Conversations where the other person wrote last (the number on the envelope).
  const unanswered = me => LL.state.jobs.filter(j => {
    if (!j.freelancerId || (j.customerId !== me.id && j.freelancerId !== me.id)) return false;
    const last = LL.messagesFor(j.id).slice(-1)[0];
    return last && last.fromId !== me.id;
  }).length;

  // On phones the page links sit behind a menu button. "wide-only" pieces show on big screens only,
  // "phone-only" pieces show in the phone menu only (see the end of style.css).
  const header = active => {
    const me = LL.me();
    const link = (key, href, label, extra = '') => `<a href="${href}" class="${active === key ? 'active' : ''} ${extra}">${label}</a>`;
    const iconLink = (key, href, name, count, label) => `<a class="icon-btn ${active === key ? 'active' : ''}" href="${href}" title="${label}" aria-label="${label}">${icon(name, 21)}${count ? `<span class="count">${count}</span>` : ''}</a>`;
    const account = me
      ? `${iconLink('dashboard', 'dashboard.html', 'bell', waitingOn(me), waitingOn(me) + ' waiting on you')}
         ${iconLink('messages', 'messages.html', 'mail', unanswered(me), unanswered(me) + ' to reply to')}
         <a class="user-chip" href="dashboard.html">${avatar(me, 34)} <span class="wide-only">${esc(me.name.split(' ')[0])}</span></a>
         <button class="link-btn wide-only logout-btn">Log out</button>`
      : `${link('login', 'login.html', 'Log in', 'wide-only')}<a class="btn small" href="post-job.html">Post a job</a>`;
    return `<header class="site-header"><div class="wrap">
      <a class="logo" href="index.html">${pin(20, BLUE)} LocalLance</a>
      <nav class="nav main">
        ${link('jobs', 'jobs.html', 'Find jobs')}
        ${link('freelancers', 'freelancers.html', 'Find freelancers')}
        ${link('services', 'services.html', 'Services')}
        ${link('contact', 'contact.html', 'Contact us')}
        ${me ? link('dashboard', 'dashboard.html', 'Dashboard') : ''}
        ${me ? '<button class="link-btn phone-only logout-btn">Log out</button>' : link('login', 'login.html', 'Log in', 'phone-only')}
      </nav>
      <span class="spacer"></span>
      <nav class="nav account">${account}</nav>
      <button class="menu-btn" id="menu-btn" aria-label="Menu" aria-expanded="false">${icon('menu')}</button>
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
    document.querySelectorAll('.logout-btn').forEach(button =>
      button.addEventListener('click', () => { LL.logout(); location.href = 'index.html'; }));
    // The phone menu button opens and closes the list of page links.
    const menu = document.getElementById('menu-btn');
    menu.addEventListener('click', () => {
      const open = document.querySelector('.site-header').classList.toggle('open');
      menu.setAttribute('aria-expanded', open);
    });
    document.getElementById('reset-btn').addEventListener('click', () => { if (confirm('Reset all demo data to how it started?')) LL.reset(); });
  };

  // ----- list rows and cards -----
  // One open job as a row: the business, what it needs, where and when, and the budget.
  const jobRow = j => {
    const customer = LL.user(j.customerId);
    const count = LL.proposalsFor(j.id).length;
    return `<a class="item job" href="job.html?id=${j.id}">
      ${logo(customer)}
      <span>
        <b class="clip">${esc(j.title)}</b>
        <span class="metas">
          ${meta('building', esc(customer.business))}
          ${meta('place', esc(j.suburb) + (j.onsite ? ', on site' : ''))}
          ${meta('briefcase', esc(LL.service(j.category).name))}
          ${meta('clock', 'Posted ' + LL.daysAgo(j.postedAt))}
          ${meta('chat', count + ' proposal' + (count === 1 ? '' : 's'))}
        </span>
      </span>
      <span class="budget">${LL.money(j.budget)}</span>
      <span class="btn small ghost go">View job</span>
    </a>`;
  };

  // One freelancer as a row. `rank` is the number shown on the matching map pin.
  const freelancerRow = (f, fromSuburb, rank) => `<a class="item person" href="freelancer.html?id=${f.id}">
      <span class="rank">${rank}</span>
      ${avatar(f, 52)}
      <span>
        <b class="clip">${esc(f.name)} ${tick(f)}${f.promoted ? ' <span class="badge solid">Promoted</span>' : ''}</b>
        <span class="muted clip">${esc(f.title)}</span>
        <span class="metas">
          ${meta('place', esc(f.suburb) + ', ' + LL.distanceKm(fromSuburb, f.suburb) + ' km away')}
          ${meta('briefcase', f.jobsDone + ' jobs done')}
        </span>
      </span>
      <span class="rating">${stars(f)}</span>
      <span class="rate">${LL.money(f.rate)}<span class="muted small">/hr</span></span>
      <span class="btn small ghost go">View profile</span>
    </a>`;

  // One freelancer as a card, used for the "top rated" strip on the home page.
  const freelancerCard = (f, fromSuburb) => `<a class="card person-card" href="freelancer.html?id=${f.id}">
      ${avatar(f, 84)}
      <b>${esc(f.name)} ${tick(f)}</b>
      <span class="muted">${esc(f.title)}</span>
      <span>${stars(f)} <span class="muted small">${f.jobsDone} jobs</span></span>
      <span class="facts">
        <span><span class="muted small">Location</span><b>${esc(f.suburb)}</b></span>
        <span><span class="muted small">Away</span><b>${LL.distanceKm(fromSuburb, f.suburb)} km</b></span>
        <span><span class="muted small">Rate</span><b>${LL.money(f.rate)}/hr</b></span>
      </span>
      <span class="btn block">View profile</span>
    </a>`;

  const promo = ad => `<div class="promo">
      <div><div class="tag">Promotion, ${esc(ad.tag.toLowerCase())}</div><h2>${esc(ad.title)}</h2><p>${esc(ad.text)}</p></div>
      <span class="spacer"></span><a class="btn" href="${ad.link}">${esc(ad.cta)}</a>
    </div>`;

  const empty = text => `<div class="empty">${text}</div>`;

  // A panel asking the visitor to log in, used by pages that need an account.
  const needLogin = what => `<div class="card"><h3>Log in to ${what}</h3><p class="muted">This is a demo, so there are no passwords. Pick a ready-made account or create your own.</p><a class="btn" href="login.html">Log in or sign up</a></div>`;

  // ----- location map -----
  // Draws the freelancers in `list` around the suburb `home`, with distance rings.
  // Pins are numbered in list order, so the map matches the numbered rows beside it
  // and no place names need to be squeezed onto the drawing.
  const BAY = [[-37.868, 144.905], [-37.842, 144.93], [-37.853, 144.96], [-37.87, 144.972], [-37.92, 144.985], [-37.955, 145.0], [-38.1, 145.0], [-38.1, 144.6], [-37.975, 144.69], [-37.9, 144.79], [-37.875, 144.83]];

  const map = (list, home) => {
    const W = 600, H = 360, PAD = 30, GAP = 25;
    const [lat0, lng0] = LL_SUBURBS[home];

    // Step 1: kilometres east (x) and south (y) of the home suburb.
    const toKm = ([lat, lng]) => ({ x: (lng - lng0) * 88, y: (lat0 - lat) * 111 });
    const spots = list.map(f => toKm(LL_SUBURBS[f.suburb]));

    // Step 2: pick a zoom that fits the furthest pin, with the home suburb in the middle.
    const furthestX = Math.max(6, ...spots.map(p => Math.abs(p.x)));
    const furthestY = Math.max(4, ...spots.map(p => Math.abs(p.y)));
    const scale = Math.min((W / 2 - PAD) / furthestX, (H / 2 - PAD) / furthestY);
    const toPx = p => ({ x: W / 2 + p.x * scale, y: H / 2 + p.y * scale });
    const pins = spots.map(toPx);

    // Step 3: nudge pins apart so close neighbours (and the home marker) stay readable.
    const separate = (a, b, moveA) => {
      let dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      if (d >= GAP) return;
      if (d < 0.01) { dx = Math.cos(pins.indexOf(b)); dy = Math.sin(pins.indexOf(b)); d = 1; }
      const push = (GAP - d) / (moveA ? 2 : 1);
      b.x += dx / d * push; b.y += dy / d * push;
      if (moveA) { a.x -= dx / d * push; a.y -= dy / d * push; }
    };
    const centre = { x: W / 2, y: H / 2 };
    for (let pass = 0; pass < 40; pass++) {
      pins.forEach((a, i) => pins.slice(i + 1).forEach(b => separate(a, b, true)));
      pins.forEach(p => separate(centre, p, false));
    }

    // Step 4: build the drawing. The bay is only drawn when there is room to name it.
    const bayLabel = toPx(toKm([-37.95, 144.87]));
    const showBay = bayLabel.x > 60 && bayLabel.x < W - 60 && bayLabel.y > 16 && bayLabel.y < H - 12;
    const bay = BAY.map(toKm).map(toPx).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const rings = [2, 5, 10, 20, 40].filter(km => km * scale > 45 && km * scale < W / 2).map(km => {
      const r = km * scale, lx = W / 2 + r * 0.7 + 4, ly = H / 2 - r * 0.7 - 4;
      return `<circle cx="${W / 2}" cy="${H / 2}" r="${r.toFixed(1)}" fill="none" stroke="#9FB0C6" stroke-dasharray="3 5"/>
        ${lx < W - 30 && ly > 12 ? `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="11" fill="#6B7A90">${km} km</text>` : ''}`;
    }).join('');
    // Drawn last to first, so pin 1 (top of the list) sits on top.
    const dots = pins.map((p, i) => `<g data-f="${list[i].id}">
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="11" fill="${BLUE}" stroke="#fff" stroke-width="2"/>
        <text x="${p.x.toFixed(1)}" y="${(p.y + 4).toFixed(1)}" font-size="12" font-weight="600" fill="#fff" text-anchor="middle">${i + 1}</text></g>`).reverse().join('');

    return `<svg class="map" data-home="${esc(home)}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of freelancers around ${esc(home)}" font-family="Bahnschrift, 'DIN Alternate', 'Segoe UI', sans-serif">
      ${showBay ? `<polygon points="${bay}" fill="#D5E3F5"/><text x="${bayLabel.x.toFixed(1)}" y="${bayLabel.y.toFixed(1)}" font-size="12" fill="#6B7A90" text-anchor="middle">Port Phillip Bay</text>` : ''}
      ${rings}
      ${dots}
      <circle cx="${W / 2}" cy="${H / 2}" r="7" fill="${INK}" stroke="#fff" stroke-width="2.5"/>
      <circle cx="20" cy="${H - 20}" r="6" fill="${INK}" stroke="#fff" stroke-width="2"/>
      <text x="33" y="${H - 15}" font-size="13" font-weight="600" fill="${INK}" stroke="#EEF2F7" stroke-width="4" style="paint-order:stroke">You: ${esc(home)}</text>
    </svg>`;
  };

  // ----- map tooltip -----
  // Hovering a numbered pin shows who it is. One tooltip is shared by every map.
  const tip = document.createElement('div');
  tip.className = 'map-tip';
  tip.hidden = true;
  document.body.appendChild(tip);

  document.addEventListener('mouseover', event => {
    const dot = event.target.closest('.map [data-f]');
    tip.hidden = !dot;
    if (!dot) return;

    const f = LL.user(dot.dataset.f);
    const home = dot.closest('.map').dataset.home;
    tip.innerHTML = `${avatar(f, 44)}<span>
        <b>${esc(f.name)} ${tick(f)}</b>
        <span class="muted">${esc(f.title)}</span>
        <span class="metas">${meta('place', esc(f.suburb) + ', ' + LL.distanceKm(home, f.suburb) + ' km away')}</span>
        <span class="metas">${stars(f)} ${LL.money(f.rate)}/hr</span>
      </span>`;

    // Sit above the pin (below it when the page header is in the way) and stay inside the window.
    const at = dot.getBoundingClientRect();
    const half = tip.offsetWidth / 2;
    const x = Math.max(half + 8, Math.min(document.documentElement.clientWidth - half - 8, at.left + at.width / 2));
    const above = at.top - tip.offsetHeight - 8;
    tip.style.left = x + scrollX + 'px';
    tip.style.top = (above < 70 ? at.bottom + 8 : above) + scrollY + 'px';
  });

  return { esc, pin, icon, meta, tick, avatar, logo, stars, verified, statusBadge, mount, jobRow, freelancerRow, freelancerCard, promo, empty, needLogin, map };
})();
