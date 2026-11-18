// Post a job page. Only a logged-in customer can post.

LLUI.mount('');

const me = LL.me();
const holder = document.getElementById('form-holder');

if (!me) {
  holder.innerHTML = LLUI.needLogin('post a job');
} else if (me.role !== 'customer') {
  holder.innerHTML = `<div class="card"><h3>You are logged in as a freelancer</h3><p class="muted">Jobs are posted by customers. Log in with a customer account to post one.</p><a class="btn" href="jobs.html">Find jobs instead</a></div>`;
} else {
  // ===== 1. Fill the dropdowns =====
  document.getElementById('category').innerHTML = LL_SERVICES.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  const suburb = document.getElementById('suburb');
  suburb.innerHTML = Object.keys(LL_SUBURBS).map(name => `<option>${name}</option>`).join('');
  suburb.value = me.suburb;

  // ===== 2. A private offer: post-job.html?offer=f1 sends the job to that freelancer only =====
  const offerTo = LL.user(LL.param('offer'));
  if (offerTo) {
    const first = offerTo.name.split(' ')[0];
    document.getElementById('page-heading').textContent = 'Send a job offer to ' + offerTo.name;
    document.getElementById('page-lead').textContent = `Only ${first} will see this offer. ${first} replies with a price and a timeframe.`;
    document.getElementById('submit-btn').textContent = 'Send job offer';
    document.getElementById('category').value = offerTo.category;
  }

  // ===== 3. Save the job and go to its page =====
  document.getElementById('job-form').addEventListener('submit', event => {
    event.preventDefault();
    const job = LL.postJob({
      title: document.getElementById('title').value.trim(),
      category: document.getElementById('category').value,
      description: document.getElementById('description').value.trim(),
      budget: Number(document.getElementById('budget').value),
      suburb: suburb.value,
      deadline: document.getElementById('deadline').value,
      onsite: document.getElementById('onsite').checked,
      offeredTo: offerTo ? offerTo.id : null
    });
    location.href = 'job.html?id=' + job.id + '&posted=1';
  });
}
