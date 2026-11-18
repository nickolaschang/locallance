// LocalLance store: the "database" for the demo.
// All data lives in the browser's localStorage, seeded from data.js the first time the site is opened.

const LL = (() => {
  const KEY = 'locallance-demo-v1';
  const FEE_RATE = 0.08; // flat 8% fee, taken from the freelancer's payout
  const MIN_RATE = 26.44; // lowest hourly rate a freelancer can set: the national minimum wage from 1 July 2026

  const state = JSON.parse(localStorage.getItem(KEY)) || JSON.parse(JSON.stringify(LL_SEED));
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  save();

  // ----- helpers -----
  const newId = prefix => prefix + Date.now().toString(36) + Math.floor(Math.random() * 100);
  const pad = n => String(n).padStart(2, '0');
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const now = () => { const d = new Date(); return `${today()} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const money = n => '$' + Number(n).toLocaleString('en-AU');
  const param = name => new URLSearchParams(location.search).get(name);
  const fee = amount => Math.round(amount * FEE_RATE);

  const daysAgo = date => {
    const days = Math.floor((new Date() - new Date(date)) / 86400000);
    if (days <= 0) return 'today';
    return days === 1 ? 'yesterday' : days + ' days ago';
  };

  // Straight-line distance between two suburbs, in km.
  const distanceKm = (a, b) => {
    const p = LL_SUBURBS[a], q = LL_SUBURBS[b];
    if (!p || !q) return null;
    const rad = d => d * Math.PI / 180;
    const dLat = rad(q[0] - p[0]), dLng = rad(q[1] - p[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(p[0])) * Math.cos(rad(q[0])) * Math.sin(dLng / 2) ** 2;
    return Math.round(12742 * Math.asin(Math.sqrt(h)) * 10) / 10;
  };

  // ----- lookups -----
  const user = id => state.users.find(u => u.id === id);
  const me = () => user(state.sessionUserId);
  const job = id => state.jobs.find(j => j.id === id);
  const service = id => LL_SERVICES.find(s => s.id === id);
  const freelancers = () => state.users.filter(u => u.role === 'freelancer');
  const proposalsFor = jobId => state.proposals.filter(p => p.jobId === jobId);
  const paymentFor = jobId => state.payments.find(p => p.jobId === jobId);
  const reviewsFor = userId => state.reviews.filter(r => r.toId === userId);
  const reviewOf = jobId => state.reviews.find(r => r.jobId === jobId);
  const messagesFor = jobId => state.messages.filter(m => m.jobId === jobId);

  // Jobs every freelancer can see. A private offer (offeredTo) is only shown to the freelancer it was sent to.
  const openJobs = () => state.jobs.filter(j => j.status === 'open' && !j.offeredTo);
  // Private offers this freelancer has not replied to yet.
  const offersFor = freelancerId => state.jobs.filter(j =>
    j.offeredTo === freelancerId && j.status === 'open' && !proposalsFor(j.id).some(p => p.freelancerId === freelancerId));

  // ----- the fee -----
  // New freelancers keep 100% of their first job: there is no fee if they have never
  // completed a job and have never been paid through LocalLance before.
  const firstJobFree = freelancerId =>
    user(freelancerId).jobsDone === 0 && !state.payments.some(p => job(p.jobId).freelancerId === freelancerId);

  // The fee LocalLance takes when this freelancer does a job of this price.
  const feeFor = (amount, freelancerId) => firstJobFree(freelancerId) ? 0 : fee(amount);

  // ----- account actions -----
  const login = id => { state.sessionUserId = id; save(); };
  const logout = () => { state.sessionUserId = null; save(); };
  const reset = () => { localStorage.removeItem(KEY); location.href = 'index.html'; };

  const signUp = data => {
    const u = Object.assign({ id: newId('u'), joined: today() }, data);
    if (u.role === 'freelancer') Object.assign(u, { rating: 0, jobsDone: 0, promoted: false, abnVerified: Boolean(u.abn) });
    state.users.push(u);
    state.sessionUserId = u.id;
    save();
    return u;
  };

  const setPromoted = on => { me().promoted = on; save(); };

  // ----- job flow: post -> propose -> accept -> pay -> deliver -> release -> review -----
  const postJob = data => {
    const j = Object.assign({ id: newId('j'), customerId: state.sessionUserId, postedAt: today(), status: 'open' }, data);
    state.jobs.unshift(j);
    save();
    return j;
  };

  const sendProposal = (jobId, data) => {
    state.proposals.push(Object.assign({ id: newId('p'), jobId, freelancerId: state.sessionUserId, status: 'pending', createdAt: today() }, data));
    save();
  };

  const acceptProposal = proposalId => {
    const chosen = state.proposals.find(p => p.id === proposalId);
    proposalsFor(chosen.jobId).forEach(p => { p.status = p.id === proposalId ? 'accepted' : 'declined'; });
    Object.assign(job(chosen.jobId), { status: 'assigned', freelancerId: chosen.freelancerId, proposalId, price: chosen.amount });
    save();
  };

  // The customer pays the full job price. The money is held until they approve the work.
  const pay = jobId => {
    const j = job(jobId);
    const cut = feeFor(j.price, j.freelancerId);
    state.payments.push({ id: newId('pay'), jobId, amount: j.price, fee: cut, payout: j.price - cut, method: 'PayPal (demo)', status: 'held', paidAt: today(), releasedAt: null });
    j.status = 'in_progress';
    save();
  };

  const markDelivered = jobId => { job(jobId).status = 'delivered'; save(); };

  const releasePayment = jobId => {
    const j = job(jobId);
    Object.assign(paymentFor(jobId), { status: 'released', releasedAt: today() });
    j.status = 'completed';
    user(j.freelancerId).jobsDone += 1;
    save();
  };

  const addReview = (jobId, rating, text) => {
    const j = job(jobId);
    const f = user(j.freelancerId);
    state.reviews.push({ id: newId('r'), jobId, fromId: state.sessionUserId, toId: f.id, rating, text, date: today() });
    // Blend the new rating into the freelancer's average. jobsDone already counts this job.
    f.rating = Math.round((f.rating * (f.jobsDone - 1) + rating) / f.jobsDone * 10) / 10;
    save();
  };

  const sendMessage = (jobId, text) => {
    state.messages.push({ id: newId('m'), jobId, fromId: state.sessionUserId, text, at: now() });
    save();
  };

  const saveContact = data => {
    state.contactMessages.push(Object.assign({ id: newId('cm'), at: now() }, data));
    save();
  };

  return {
    state, FEE_RATE, MIN_RATE, money, param, feeFor, daysAgo, distanceKm,
    user, me, job, service, freelancers, proposalsFor, paymentFor, reviewsFor, reviewOf, messagesFor, openJobs, offersFor,
    login, logout, reset, signUp, setPromoted,
    postJob, sendProposal, acceptProposal, pay, markDelivered, releasePayment, addReview, sendMessage, saveContact
  };
})();
