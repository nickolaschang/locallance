// Contact us page: company details, a location map, social links and a contact form.

LLUI.mount('contact');

const esc = LLUI.esc;

// ===== 1. Company details and map =====
document.getElementById('details').innerHTML = `
  <h3>${LL_CONTACT.company}</h3>
  <p>${LL_CONTACT.address}</p>
  <p>Phone: ${LL_CONTACT.phone}<br>Email: <a href="mailto:${LL_CONTACT.email}">${LL_CONTACT.email}</a></p>
  <p class="muted">Monday to Friday, 9 am to 5 pm</p>
  <p class="muted">ABN ${LL_CONTACT.abn} (temporary)<br>ACN ${LL_CONTACT.acn} (temporary)</p>
  <div class="row">
    <a class="btn small ghost" href="https://www.facebook.com/" target="_blank" rel="noopener">Facebook</a>
    <a class="btn small ghost" href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a>
    <a class="btn small ghost" href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a>
  </div>`;

document.getElementById('office-map').src = 'https://www.google.com/maps?q=' + encodeURIComponent(LL_CONTACT.mapQuery) + '&output=embed';

// ===== 2. Fill in the form for logged-in users =====
const me = LL.me();
if (me) {
  document.getElementById('name').value = me.name;
  document.getElementById('email').value = me.email;
}

// ===== 3. Save the message and confirm =====
document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  LL.saveContact({
    name,
    email: document.getElementById('email').value.trim(),
    topic: document.getElementById('topic').value,
    message: document.getElementById('message').value.trim()
  });
  document.getElementById('form-holder').innerHTML = `<div class="notice"><b>Thanks, ${esc(name.split(' ')[0])}.</b> Your message has been received and we will reply within one business day.</div>
    <p class="muted">Demo note: the message is saved in this browser only. Nothing is emailed.</p>`;
});
