// Checkout page: the online payment step.
// This is a demonstration of a PayPal payment. No real account is used and no money moves.

LLUI.mount('');

const esc = LLUI.esc;
const job = LL.job(LL.param('job'));
const me = LL.me();
const box = document.getElementById('checkout');

if (!me || me.id !== job.customerId) {
  box.innerHTML = `<div class="notice amber">Only the customer who posted this job can pay for it. <a href="login.html">Log in</a></div>`;
} else if (job.status !== 'assigned') {
  box.innerHTML = `<div class="notice">This job has already been paid for. <a href="job.html?id=${job.id}">Back to the job</a></div>`;
} else {
  const freelancer = LL.user(job.freelancerId);

  // ===== 1. Order summary =====
  box.innerHTML = `
    <div class="card">
      <h3>${esc(job.title)}</h3>
      <div class="list-item" style="margin-bottom:14px">${LLUI.avatar(freelancer, 44)}<div class="body"><b>${esc(freelancer.name)}</b><div class="small muted">${esc(freelancer.title)} &middot; ${esc(freelancer.suburb)}</div></div>${LLUI.verified(freelancer)}</div>
      <div class="summary-line"><span>Agreed job price</span><span>${LL.money(job.price)}</span></div>
      <div class="summary-line"><span>LocalLance fee for customers</span><span>${LL.money(0)}</span></div>
      <div class="summary-line total"><span>Total today</span><span>${LL.money(job.price)}</span></div>
      <p class="small muted">${esc(freelancer.name.split(' ')[0])} receives ${LL.money(job.price - LL.fee(job.price))} after the flat 8% fee, once you approve the work.</p>
    </div>
    <div class="card" style="margin-top:20px" id="pay-box">
      <h3>Payment method</h3>
      <label class="check"><input type="radio" checked> PayPal</label>
      <p class="hint">Demonstration only. No real PayPal account is used and no money is taken.</p>
      <button class="btn paypal-btn block" id="paypal-btn">Pay with PayPal</button>
    </div>`;

  // ===== 2. Simulated PayPal approval, then record the payment as held =====
  const payBox = document.getElementById('pay-box');
  document.getElementById('paypal-btn').addEventListener('click', () => {
    payBox.innerHTML = `
      <h3>PayPal (demonstration)</h3>
      <p>Paying as <b>${esc(me.email)}</b></p>
      <div class="summary-line total"><span>Pay ${esc(LL_CONTACT.company)}</span><span>${LL.money(job.price)}</span></div>
      <p class="hint">In a real checkout this step would happen on PayPal's own site.</p>
      <button class="btn paypal-btn block" id="confirm-btn">Confirm payment</button>`;

    document.getElementById('confirm-btn').addEventListener('click', () => {
      LL.pay(job.id);
      payBox.innerHTML = `
        <div class="notice"><b>Payment of ${LL.money(job.price)} received and held.</b> ${esc(freelancer.name)} has been told to start work.</div>
        <a class="btn" href="job.html?id=${job.id}">Back to the job</a>
        <a class="btn ghost" href="messages.html?job=${job.id}">Message ${esc(freelancer.name.split(' ')[0])}</a>`;
    });
  });
}
