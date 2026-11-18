// Log in page: switch between demo accounts, or create a new customer or freelancer.

LLUI.mount('login');

const esc = LLUI.esc;

// ===== 1. Demo accounts =====
const accountRow = u => `<div class="list-item" style="padding:10px 0;border-top:1px solid var(--line);align-items:center">
    ${LLUI.avatar(u, 40)}
    <div class="body"><b>${esc(u.name)}</b><div class="small muted">${esc(u.role === 'customer' ? u.business : u.title)}, ${esc(u.suburb)}</div></div>
    <button class="btn small ghost" data-login="${u.id}">Log in</button>
  </div>`;

const users = LL.state.users;
document.getElementById('demo-customers').innerHTML = users.filter(u => u.role === 'customer').map(accountRow).join('');
document.getElementById('demo-freelancers').innerHTML = users.filter(u => u.role === 'freelancer').map(accountRow).join('');

document.addEventListener('click', event => {
  const id = event.target.dataset.login;
  if (id) { LL.login(id); location.href = 'dashboard.html'; }
});

// ===== 2. Sign-up form =====
const value = id => document.getElementById(id).value.trim();
document.getElementById('suburb').innerHTML = Object.keys(LL_SUBURBS).map(name => `<option>${name}</option>`).join('');
document.getElementById('category').innerHTML = LL_SERVICES.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

const form = document.getElementById('signup-form');
const role = () => form.querySelector('input[name=role]:checked').value;

// Show the fields that belong to the chosen role.
form.addEventListener('change', () => {
  document.getElementById('customer-fields').classList.toggle('hidden', role() !== 'customer');
  document.getElementById('freelancer-fields').classList.toggle('hidden', role() !== 'freelancer');
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const account = { role: role(), name: value('name'), email: value('email'), suburb: value('suburb') };

  if (account.role === 'customer') {
    account.business = value('business') || account.name;
  } else {
    const abn = value('abn');
    Object.assign(account, {
      title: value('title') || 'Freelancer',
      category: value('category'),
      rate: Number(value('rate')),
      abn: abn.replace(/\D/g, '').length === 11 ? abn : '',
      bio: value('bio') || 'New to LocalLance.',
      skills: []
    });
  }

  LL.signUp(account);
  location.href = 'dashboard.html';
});
