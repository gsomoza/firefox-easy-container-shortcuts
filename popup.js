let allContainers = [];
let selectedIndex = -1;

function renderContainers(containers) {
  const list = document.getElementById('container-list');
  list.innerHTML = '';
  selectedIndex = -1;

  if (containers.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'no-results';
    empty.textContent = 'No containers found';
    list.appendChild(empty);
    return;
  }

  containers.forEach((container, index) => {
    const item = document.createElement('div');
    item.className = 'container-item';
    item.dataset.index = index;

    const colorDot = document.createElement('div');
    colorDot.className = 'container-color';
    colorDot.style.backgroundColor = container.colorCode;

    const name = document.createElement('span');
    name.textContent = container.name;

    item.appendChild(colorDot);
    item.appendChild(name);
    item.addEventListener('click', () => openTabInContainer(container));
    list.appendChild(item);
  });

  selectedIndex = 0;
  updateSelection(list.querySelectorAll('.container-item'));
}

function getFilteredContainers() {
  const query = document.getElementById('search').value.toLowerCase();
  if (!query) return allContainers;
  return allContainers
    .map(c => ({ c, lower: c.name.toLowerCase() }))
    .filter(({ lower }) => lower.includes(query))
    .sort((a, b) => (a.lower.startsWith(query) ? 0 : 1) - (b.lower.startsWith(query) ? 0 : 1))
    .map(({ c }) => c);
}

function updateSelection(items) {
  items.forEach((item, i) => {
    item.classList.toggle('selected', i === selectedIndex);
    if (i === selectedIndex) {
      item.scrollIntoView({ block: 'nearest' });
    }
  });
}

function openTabInContainer(container) {
  browser.tabs.create({ cookieStoreId: container.cookieStoreId });
  window.close();
}

function openWindowInContainer(container) {
  browser.windows.create({ cookieStoreId: container.cookieStoreId });
  window.close();
}

document.getElementById('search').addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

document.getElementById('search').addEventListener('input', () => {
  renderContainers(getFilteredContainers());
});

document.getElementById('search').addEventListener('keydown', (e) => {
  const list = document.getElementById('container-list');
  const items = list.querySelectorAll('.container-item');
  const filtered = getFilteredContainers();

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    updateSelection(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, -1);
    updateSelection(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const index = selectedIndex >= 0 ? selectedIndex : 0;
    if (filtered.length > 0) {
      if (e.ctrlKey || e.metaKey) {
        openWindowInContainer(filtered[index]);
      } else {
        openTabInContainer(filtered[index]);
      }
    }
  }
});

browser.contextualIdentities.query({}).then(containers => {
  allContainers = containers;
  renderContainers(containers);
  document.getElementById('search').focus();
}).catch(() => {
  const list = document.getElementById('container-list');
  const msg = document.createElement('div');
  msg.className = 'no-results';
  msg.textContent = 'Containers are not available';
  list.appendChild(msg);
  document.getElementById('search').focus();
});
