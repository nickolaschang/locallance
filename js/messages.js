// Messages page: one conversation per job, between the customer and the chosen freelancer.

LLUI.mount('messages');

const esc = LLUI.esc;
const box = document.getElementById('messages');
const me = LL.me();

function render(selectedId) {
  // ===== 1. The conversations this user is part of =====
  const jobs = LL.state.jobs.filter(j => j.freelancerId && (j.customerId === me.id || j.freelancerId === me.id));
  if (!jobs.length) { box.innerHTML = LLUI.empty('No conversations yet. A conversation opens when a proposal is accepted.'); return; }

  const job = jobs.find(j => j.id === selectedId) || jobs[0];
  const other = j => LL.user(j.customerId === me.id ? j.freelancerId : j.customerId);

  // ===== 2. Conversation list and the open thread =====
  const threads = jobs.map(j => {
    const last = LL.messagesFor(j.id).slice(-1)[0];
    return `<a class="thread-link ${j.id === job.id ? 'active' : ''}" href="messages.html?job=${j.id}">
      ${LLUI.avatar(other(j), 42)}
      <span><b>${esc(other(j).name)}</b><span class="small muted clip">${esc(j.title)}</span>
      <span class="small muted clip">${last ? esc(last.text.slice(0, 40)) : 'No messages yet'}</span></span></a>`;
  }).join('');

  const bubbles = LL.messagesFor(job.id).map(m =>
    `<div class="bubble ${m.fromId === me.id ? 'mine' : ''}">${esc(m.text)}<div class="when">${esc(LL.user(m.fromId).name.split(' ')[0])}, ${m.at}</div></div>`).join('');

  box.innerHTML = `<div class="cols side-left">
    <div class="card">${threads}</div>
    <div class="card">
      <div class="row"><div><h3 style="margin:0">${esc(other(job).name)}</h3><a class="small" href="job.html?id=${job.id}">${esc(job.title)}</a></div><span class="spacer"></span>${LLUI.statusBadge(job.status)}</div>
      <div class="chat" id="chat" style="margin:16px 0">${bubbles || '<p class="muted">Say hello to get started.</p>'}</div>
      <form class="row" id="send-form">
        <input type="text" id="send-text" placeholder="Write a message" required style="flex:1" autocomplete="off">
        <button class="btn" type="submit">Send</button>
      </form>
    </div>
  </div>`;

  // Scroll to the newest message.
  const chat = document.getElementById('chat');
  chat.scrollTop = chat.scrollHeight;

  // ===== 3. Send a message =====
  document.getElementById('send-form').addEventListener('submit', event => {
    event.preventDefault();
    LL.sendMessage(job.id, document.getElementById('send-text').value.trim());
    render(job.id);
  });
}

if (me) render(LL.param('job'));
else box.innerHTML = LLUI.needLogin('read your messages');
