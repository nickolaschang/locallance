// Dashboard. Customers see their jobs; freelancers see their work, proposals and earnings.

LLUI.mount('dashboard');

const esc = LLUI.esc;
const board = document.getElementById('dashboard');

const statCards = stats => `<div class="grid c4">${stats.map(([value, label]) =>
  `<div class="card"><div class="num">${value}</div><div class="muted">${label}</div></div>`).join('')}</div>`;

const jobLink = j => `<a href="job.html?id=${j.id}">${esc(j.title)}</a>`;

// ===== 1. Customer view =====
function customerView(me) {
  const jobs = LL.state.jobs.filter(j => j.customerId === me.id);
  const paid = LL.state.payments.filter(p => jobs.some(j => j.id === p.jobId));

  const nextStep = j => {
    const count = LL.proposalsFor(j.id).length;
    if (j.status === 'open') return count ? `<a href="job.html?id=${j.id}">Review ${count} proposal${count === 1 ? '' : 's'}</a>` : 'Waiting for proposals';
    if (j.status === 'assigned') return `<a href="checkout.html?job=${j.id}">Pay to start</a>`;
    if (j.status === 'in_progress') return 'Work in progress';
    if (j.status === 'delivered') return `<a href="job.html?id=${j.id}">Approve and release payment</a>`;
    return LL.reviewOf(j.id) ? 'Reviewed' : `<a href="job.html?id=${j.id}">Leave a review</a>`;
  };

  return `
    <div class="row"><div><h1>Hi ${esc(me.name.split(' ')[0])}</h1><p class="muted">${esc(me.business)}, ${esc(me.suburb)}</p></div><span class="spacer"></span><a class="btn" href="post-job.html">Post a job</a></div>
    ${statCards([
      [jobs.filter(j => j.status === 'open').length, 'open jobs'],
      [jobs.filter(j => ['assigned', 'in_progress', 'delivered'].includes(j.status)).length, 'jobs under way'],
      [jobs.filter(j => j.status === 'completed').length, 'jobs completed'],
      [LL.money(paid.reduce((sum, p) => sum + p.amount, 0)), 'paid through LocalLance']
    ])}
    <div class="card"><h3>My jobs</h3>
      ${jobs.length ? `<div class="table-wrap"><table>
        <tr><th>Job</th><th>Status</th><th>Freelancer</th><th>Price</th><th>Next step</th></tr>
        ${jobs.map(j => `<tr><td>${jobLink(j)}</td><td>${LLUI.statusBadge(j.status)}</td><td>${j.freelancerId ? esc(LL.user(j.freelancerId).name) : '<span class="muted">Not chosen</span>'}</td><td>${LL.money(j.price || j.budget)}</td><td>${nextStep(j)}</td></tr>`).join('')}
      </table></div>` : LLUI.empty('You have not posted a job yet. <a href="post-job.html">Post your first job</a>')}
    </div>`;
}

// ===== 2. Freelancer view =====
function freelancerView(me) {
  const jobs = LL.state.jobs.filter(j => j.freelancerId === me.id);
  const active = jobs.filter(j => j.status !== 'completed');
  const proposals = LL.state.proposals.filter(p => p.freelancerId === me.id && p.status !== 'accepted');
  const payments = LL.state.payments.filter(p => jobs.some(j => j.id === p.jobId));
  const total = status => payments.filter(p => p.status === status).reduce((sum, p) => sum + p.payout, 0);

  // What the freelancer takes home: the recorded payout once paid, otherwise the price less the fee that would apply.
  const receives = j => {
    const payment = LL.paymentFor(j.id);
    return payment ? payment.payout : j.price - LL.feeFor(j.price, me.id);
  };

  const nextStep = j => {
    if (j.status === 'assigned') return 'Waiting for the customer to pay';
    if (j.status === 'in_progress') return `<a href="job.html?id=${j.id}">Mark as delivered</a>`;
    return 'Waiting for approval';
  };

  return `
    <div class="row"><div><h1>Hi ${esc(me.name.split(' ')[0])}</h1><p class="muted">${esc(me.title)}, ${esc(me.suburb)} ${LLUI.verified(me)}</p></div><span class="spacer"></span><a class="btn" href="jobs.html">Find jobs</a></div>
    ${statCards([
      [active.length, 'active jobs'],
      [proposals.filter(p => p.status === 'pending').length, 'proposals waiting'],
      [LL.money(total('released')), 'earned after fees'],
      [LL.money(total('held')), 'held until approval']
    ])}
    <div class="promo">
      <div><div class="tag">Promotion, promoted listings</div>
        <h2>${me.promoted ? 'Your profile is promoted' : 'Get seen first for $15 a week'}</h2>
        <p>${me.promoted ? 'You appear at the top of search results and on the home page.' : 'Promoted freelancers appear at the top of search results. Demo only, nothing is charged.'}</p></div>
      <span class="spacer"></span><button class="btn ghost" id="promote-btn">${me.promoted ? 'Stop promoting' : 'Promote my profile'}</button>
    </div>
    <div class="card"><h3>Active jobs</h3>
      ${active.length ? `<div class="table-wrap"><table>
        <tr><th>Job</th><th>Customer</th><th>Status</th><th>You receive</th><th>Next step</th></tr>
        ${active.map(j => `<tr><td>${jobLink(j)}</td><td>${esc(LL.user(j.customerId).business)}</td><td>${LLUI.statusBadge(j.status)}</td><td>${LL.money(receives(j))}</td><td>${nextStep(j)}</td></tr>`).join('')}
      </table></div>` : LLUI.empty('No active jobs. <a href="jobs.html">Find a job</a> and send a proposal.')}
    </div>
    <div class="card"><h3>My proposals</h3>
      ${proposals.length ? `<div class="table-wrap"><table>
        <tr><th>Job</th><th>Your price</th><th>Days</th><th>Sent</th><th>Status</th></tr>
        ${proposals.map(p => `<tr><td>${jobLink(LL.job(p.jobId))}</td><td>${LL.money(p.amount)}</td><td>${p.days}</td><td>${p.createdAt}</td><td>${p.status === 'pending' ? '<span class="badge wait">Waiting</span>' : '<span class="badge">Not chosen</span>'}</td></tr>`).join('')}
      </table></div>` : LLUI.empty('You have no proposals waiting.')}
    </div>
    <div class="card"><h3>Earnings</h3>
      ${payments.length ? `<div class="table-wrap"><table>
        <tr><th>Job</th><th>Job price</th><th>LocalLance fee</th><th>You receive</th><th>Status</th></tr>
        ${payments.map(p => `<tr><td>${jobLink(LL.job(p.jobId))}</td><td>${LL.money(p.amount)}</td><td>${LL.money(p.fee)}</td><td><b>${LL.money(p.payout)}</b></td><td>${p.status === 'held' ? '<span class="badge wait">Held</span>' : '<span class="badge ok">Paid out ' + p.releasedAt + '</span>'}</td></tr>`).join('')}
      </table></div>` : LLUI.empty('Payments for your jobs will appear here.')}
    </div>`;
}

// ===== 3. Draw the right view =====
function render() {
  const me = LL.me();
  if (!me) { board.innerHTML = LLUI.needLogin('see your dashboard'); return; }
  board.innerHTML = me.role === 'customer' ? customerView(me) : freelancerView(me);
}

board.addEventListener('click', event => {
  if (event.target.id === 'promote-btn') { LL.setPromoted(!LL.me().promoted); render(); }
});

render();
