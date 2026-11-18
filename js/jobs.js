// Find jobs page: filter and sort the open jobs.

LLUI.mount('jobs');

const text = document.getElementById('f-text');
const category = document.getElementById('f-category');
const suburb = document.getElementById('f-suburb');
const onsite = document.getElementById('f-onsite');
const sort = document.getElementById('f-sort');

// ===== 1. Fill the dropdowns and read filters from the address bar =====
category.innerHTML += LL_SERVICES.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
suburb.innerHTML += Object.keys(LL_SUBURBS).map(name => `<option>${name}</option>`).join('');
text.value = LL.param('q') || '';
category.value = LL.param('category') || '';

document.getElementById('promo').innerHTML = LLUI.promo(LL.state.ads[0]);

// ===== 2. Draw the list =====
function render() {
  const words = text.value.trim().toLowerCase();
  const jobs = LL.openJobs()
    .filter(j => !words || (j.title + ' ' + j.description).toLowerCase().includes(words))
    .filter(j => !category.value || j.category === category.value)
    .filter(j => !suburb.value || j.suburb === suburb.value)
    .filter(j => !onsite.checked || j.onsite)
    .sort((a, b) => sort.value === 'budget' ? b.budget - a.budget : b.postedAt.localeCompare(a.postedAt));

  document.getElementById('count').textContent = jobs.length + ' open job' + (jobs.length === 1 ? '' : 's');
  document.getElementById('job-list').innerHTML = jobs.length
    ? `<div class="list">${jobs.map(LLUI.jobRow).join('')}</div>`
    : LLUI.empty('No jobs match those filters.');
}

// ===== 3. Redraw whenever a filter changes =====
document.getElementById('filters').addEventListener('input', render);
document.getElementById('filters').addEventListener('submit', event => event.preventDefault());
render();
