// Job page. This is where the whole customer <-> freelancer flow happens:
// open -> freelancer chosen -> paid (held) -> delivered -> completed and reviewed.
// What you see depends on who is logged in.

LLUI.mount('jobs');

const esc = LLUI.esc;
const jobId = LL.param('id');
const main = document.getElementById('job-main');
const side = document.getElementById('job-side');
const STEPS = ['Posted', 'Freelancer chosen', 'Paid and held', 'Delivered', 'Completed'];
const STEP_OF = { open: 0, assigned: 1, in_progress: 2, delivered: 3, completed: 4 };

// ===== 1. The panel that tells the viewer what they can do next =====
function actionPanel(j, me, ctx) {
  const { freelancer, payment, review, isOwner, isAssigned, myProposal } = ctx;

  if (!me) return j.status === 'open' ? LLUI.needLogin('send a proposal') : '';

  if (isOwner) {
    if (j.status === 'open') return j.offeredTo
      ? `<div class="notice"><b>Your offer went to ${esc(LL.user(j.offeredTo).name)} only.</b> When they reply, accept the proposal below to get started.</div>`
      : `<div class="notice">Compare the proposals below and accept one to get started.</div>`;
    if (j.status === 'assigned') return `<div class="notice wait"><b>Next step: pay ${LL.money(j.price)}.</b> PayPal holds the money until you approve the work.<br><a class="btn" style="margin-top:10px" href="checkout.html?job=${j.id}">Pay with PayPal</a></div>`;
    if (j.status === 'in_progress') return `<div class="notice">Your payment of ${LL.money(payment.amount)} is being held. ${esc(freelancer.name)} is working on the job.</div>`;
    if (j.status === 'delivered') return `<div class="notice wait"><b>${esc(freelancer.name)} has delivered the work.</b> Approve it to release the payment.<br><button class="btn" style="margin-top:10px" data-action="release">Approve work and release payment</button></div>`;
    if (review) return `<div class="notice">You rated this job ${review.rating} out of 5. Thanks for the review.</div>`;
    return `<form class="card" id="review-form"><h3>Leave a review for ${esc(freelancer.name)}</h3>
      <div class="field"><label for="rating">Rating</label><select id="rating"><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Okay</option><option value="2">2 - Poor</option><option value="1">1 - Bad</option></select></div>
      <div class="field"><label for="review-text">Your review</label><textarea id="review-text" required placeholder="How did the job go?"></textarea></div>
      <button class="btn" type="submit">Post review</button></form>`;
  }

  if (isAssigned) {
    if (j.status === 'assigned') return `<div class="notice wait"><b>Your proposal was accepted.</b> Waiting for the customer to pay. Start once the payment shows as held.</div>`;
    if (j.status === 'in_progress') return `<div class="notice"><b>${LL.money(payment.amount)} is held for this job.</b> When the work is finished, mark it as delivered.<br><button class="btn" style="margin-top:10px" data-action="deliver">Mark as delivered</button></div>`;
    if (j.status === 'delivered') return `<div class="notice wait">Delivered. Waiting for the customer to approve the work.</div>`;
    return payment.fee
      ? `<div class="notice"><b>Paid out: ${LL.money(payment.payout)}.</b> That is ${LL.money(payment.amount)} less the 8% LocalLance fee of ${LL.money(payment.fee)}.</div>`
      : `<div class="notice"><b>Paid out: ${LL.money(payment.payout)}.</b> Your first job was fee-free, so you kept the full amount.</div>`;
  }

  // A private offer can only be answered by the freelancer it was sent to.
  if (me.role === 'freelancer' && j.status === 'open' && (!j.offeredTo || j.offeredTo === me.id)) {
    if (myProposal) return `<div class="notice">You offered ${LL.money(myProposal.amount)} in ${myProposal.days} days. The customer has not chosen yet.</div>`;
    return `${j.offeredTo ? `<div class="notice"><b>${esc(LL.user(j.customerId).business)} offered you this job directly.</b> Reply with your price and timeframe.</div>` : ''}
      <form class="card" id="proposal-form"><h3>Send a proposal</h3>
      <div class="field-row">
        <div class="field"><label for="amount">Your price (AUD)</label><input type="number" id="amount" required min="50" step="10" value="${j.budget}"></div>
        <div class="field"><label for="days">Days to deliver</label><input type="number" id="days" required min="1" value="7"></div>
      </div>
      <p class="hint" id="payout-hint"></p>
      <div class="field"><label for="message">Message to the customer</label><textarea id="message" required placeholder="Why are you a good fit for this job?"></textarea></div>
      <button class="btn" type="submit">Send proposal</button></form>`;
  }

  if (myProposal && myProposal.status === 'declined') return `<div class="notice wait">The customer chose another freelancer for this job.</div>`;
  return '';
}

// Shown to the customer once a job is finished: an invitation to hire the same freelancer again.
function hireAgain(f) {
  const first = esc(f.name.split(' ')[0]);
  return `<div class="promo">
    <div><h2>Did you like working with ${first}?</h2><p>Consider hiring ${first} again. Your job offer goes straight to ${first}.</p></div>
    <span class="spacer"></span><a class="btn" href="post-job.html?offer=${f.id}">Send a job offer</a>
  </div>`;
}

// ===== 2. The list of proposals (only the job's owner sees the details) =====
function proposalList(j, ctx) {
  const proposals = LL.proposalsFor(j.id);
  if (!ctx.isOwner) return `<div class="card"><h3>Proposals</h3><p class="muted">${proposals.length} freelancer${proposals.length === 1 ? ' has' : 's have'} sent a proposal. Only the customer can see the details.</p></div>`;
  if (!proposals.length) return `<div class="card"><h3>Proposals</h3><p class="muted">No proposals yet. Freelancers usually reply within a day.</p></div>`;

  return `<div class="card"><h3>Proposals (${proposals.length})</h3>${proposals.map(p => {
    const f = LL.user(p.freelancerId);
    const state = p.status === 'accepted' ? '<span class="badge ok">Accepted</span>' : p.status === 'declined' ? '<span class="badge">Not chosen</span>' : '';
    return `<div class="list-item" style="padding:16px 0;border-top:1px solid var(--line)">${LLUI.avatar(f, 48)}
      <div class="body">
        <div class="row"><b><a href="freelancer.html?id=${f.id}">${esc(f.name)}</a></b>${LLUI.stars(f)}${LLUI.verified(f)}${state}</div>
        <div class="small muted">${esc(f.title)}, ${esc(f.suburb)}, ${LL.distanceKm(j.suburb, f.suburb)} km from the job</div>
        <p style="margin:8px 0">${esc(p.message)}</p>
      </div>
      <div class="right"><div class="price">${LL.money(p.amount)}</div><div class="small muted">${p.days} days</div>
        ${j.status === 'open' ? `<button class="btn small" style="margin-top:8px" data-accept="${p.id}">Accept</button>` : ''}</div>
    </div>`;
  }).join('')}</div>`;
}

// ===== 3. Draw the whole page =====
function render() {
  const j = LL.job(jobId);
  const me = LL.me();
  const customer = LL.user(j.customerId);
  const freelancer = j.freelancerId ? LL.user(j.freelancerId) : null;
  const ctx = {
    freelancer,
    payment: LL.paymentFor(j.id),
    review: LL.reviewOf(j.id),
    isOwner: Boolean(me) && me.id === j.customerId,
    isAssigned: Boolean(me) && me.id === j.freelancerId,
    myProposal: me ? LL.proposalsFor(j.id).find(p => p.freelancerId === me.id) : null
  };
  const step = STEP_OF[j.status];

  document.title = j.title + ' | LocalLance';
  main.innerHTML = `
    ${LL.param('posted') && j.status === 'open' && !j.offeredTo ? '<div class="notice"><b>Your job is live.</b> Freelancers can now send proposals.</div>' : ''}
    <div class="card">
      <div class="row"><span class="badge">${esc(LL.service(j.category).name)}</span>${j.onsite ? '<span class="badge solid">On site</span>' : ''}${j.offeredTo && j.status === 'open' ? '<span class="badge ok">Private offer</span>' : LLUI.statusBadge(j.status)}<span class="spacer"></span><span class="price">${LL.money(j.price || j.budget)}</span></div>
      <h1 style="margin-top:12px">${esc(j.title)}</h1>
      <p>${esc(j.description)}</p>
      <div class="row small muted"><span>${esc(j.suburb)}, needed by ${j.deadline}, posted ${LL.daysAgo(j.postedAt)}</span></div>
      <div class="steps">${STEPS.map((label, i) => `<div class="step ${i < step ? 'done' : i === step ? 'now' : ''}">${i + 1}. ${label}</div>`).join('')}</div>
    </div>
    ${actionPanel(j, me, ctx)}
    ${ctx.isOwner && j.status === 'completed' ? hireAgain(freelancer) : ''}
    ${ctx.review ? `<div class="card"><h3>Customer review</h3><div class="stars">${'&#9733;'.repeat(ctx.review.rating)}</div><p class="muted">${esc(ctx.review.text)}</p></div>` : ''}
    ${proposalList(j, ctx)}`;

  side.innerHTML = `
    <div class="card"><h3>Customer</h3>
      <div class="list-item">${LLUI.avatar(customer, 48)}<div class="body"><b>${esc(customer.business)}</b><div class="small muted">${esc(customer.name)}, ${esc(customer.suburb)}</div></div></div>
    </div>
    ${freelancer ? `<div class="card"><h3>Freelancer</h3>
      <div class="list-item">${LLUI.avatar(freelancer, 48)}<div class="body"><b><a href="freelancer.html?id=${freelancer.id}">${esc(freelancer.name)}</a></b><div class="small muted">${esc(freelancer.title)}, ${esc(freelancer.suburb)}</div><div class="row" style="margin-top:6px">${LLUI.stars(freelancer)}${LLUI.verified(freelancer)}</div></div></div>
    </div>` : ''}
    ${ctx.payment ? `<div class="card"><h3>Payment</h3>
      <div class="summary-line"><span>Paid by customer</span><b>${LL.money(ctx.payment.amount)}</b></div>
      <div class="summary-line"><span>LocalLance fee (${ctx.payment.fee ? '8%' : 'first job free'})</span><span>${LL.money(ctx.payment.fee)}</span></div>
      <div class="summary-line"><span>Freelancer receives</span><b>${LL.money(ctx.payment.payout)}</b></div>
      <p class="small muted" style="margin-top:10px">${ctx.payment.method}, ${ctx.payment.status === 'held' ? 'held since ' + ctx.payment.paidAt : 'released on ' + ctx.payment.releasedAt}</p>
    </div>` : ''}
    ${(ctx.isOwner || ctx.isAssigned) && freelancer ? `<a class="btn ghost block" href="messages.html?job=${j.id}">Open messages</a>` : ''}`;

  // Show the freelancer what they will take home as they type a price.
  const amount = document.getElementById('amount');
  if (amount) {
    const hint = () => {
      const cut = LL.feeFor(amount.value, LL.me().id);
      document.getElementById('payout-hint').textContent = cut
        ? `You receive ${LL.money(amount.value - cut)} after the 8% fee of ${LL.money(cut)}. The customer pays no fee.`
        : `Your first job is fee-free, so you receive the full ${LL.money(amount.value)}. The customer pays no fee.`;
    };
    amount.addEventListener('input', hint);
    hint();
  }
}

// ===== 4. Buttons and forms =====
main.addEventListener('click', event => {
  const accept = event.target.dataset.accept;
  const action = event.target.dataset.action;
  if (accept) LL.acceptProposal(accept);
  if (action === 'deliver') LL.markDelivered(jobId);
  if (action === 'release') LL.releasePayment(jobId);
  if (accept || action) render();
});

main.addEventListener('submit', event => {
  event.preventDefault();
  if (event.target.id === 'proposal-form') {
    LL.sendProposal(jobId, {
      amount: Number(document.getElementById('amount').value),
      days: Number(document.getElementById('days').value),
      message: document.getElementById('message').value.trim()
    });
  }
  if (event.target.id === 'review-form') {
    LL.addReview(jobId, Number(document.getElementById('rating').value), document.getElementById('review-text').value.trim());
  }
  render();
});

render();
