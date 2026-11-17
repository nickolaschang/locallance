// Services page: the list of available services, with live counts from the demo data.

LLUI.mount('services');

document.getElementById('service-list').innerHTML = LL_SERVICES.map(s => {
  const people = LL.freelancers().filter(f => f.category === s.id);
  const jobs = LL.state.jobs.filter(j => j.category === s.id && j.status === 'open');
  return `<div class="card" id="${s.id}">
    <div class="list-item">
      <div class="icon-box">${LLUI.icon(s.icon)}</div>
      <div class="body">
        <h3>${s.name}</h3>
        <p class="muted">${s.blurb}</p>
        <p><b>From ${LL.money(s.from)}</b> &middot; ${people.length} freelancer${people.length === 1 ? '' : 's'} &middot; ${jobs.length} open job${jobs.length === 1 ? '' : 's'}</p>
        <div class="row">
          <a class="btn small" href="freelancers.html?category=${s.id}">Find freelancers</a>
          <a class="btn small ghost" href="jobs.html?category=${s.id}">See jobs</a>
        </div>
      </div>
    </div>
  </div>`;
}).join('');

document.getElementById('promo').innerHTML = LLUI.promo(LL.state.ads[1]);
