// Services page: the list of available services, with live counts from the demo data.

LLUI.mount('services');

document.getElementById('service-list').innerHTML = LL_SERVICES.map(s => {
  const people = LL.freelancers().filter(f => f.category === s.id).length;
  const jobs = LL.state.jobs.filter(j => j.category === s.id && j.status === 'open').length;
  return `<div class="item service-row" id="${s.id}">
    <span class="icon-box">${LLUI.icon(s.icon)}</span>
    <span><b>${s.name}</b><br><span class="muted">${s.blurb}</span></span>
    <span>${people} freelancer${people === 1 ? '' : 's'}<br><span class="muted">${jobs} open job${jobs === 1 ? '' : 's'}</span></span>
    <span class="figure">from ${LL.money(s.from)}</span>
    <span class="row">
      <a class="btn small" href="freelancers.html?category=${s.id}">Find freelancers</a>
      <a class="btn small ghost" href="jobs.html?category=${s.id}">See jobs</a>
    </span>
  </div>`;
}).join('');

document.getElementById('promo').innerHTML = LLUI.promo(LL.state.ads[1]);
