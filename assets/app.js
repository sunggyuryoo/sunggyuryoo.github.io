document.documentElement.classList.add('js');

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  menu.textContent = open ? 'Close' : 'Menu';
});

document.querySelectorAll('[data-filter-scope]').forEach(scope => {
  const buttons = [...scope.querySelectorAll('[data-filter]')];
  const search = scope.querySelector('[data-search]');
  let selected = 'all';
  const apply = () => {
    const query = (search?.value || '').trim().toLowerCase();
    const records = [...scope.querySelectorAll('[data-record]')];
    records.forEach(record => {
      const categories = record.dataset.categories.split(' ');
      record.hidden = (selected !== 'all' && !categories.includes(selected)) || !record.textContent.toLowerCase().includes(query);
    });
    scope.querySelectorAll('[data-record-group]').forEach(group => {
      group.hidden = ![...group.querySelectorAll('[data-record]')].some(record => !record.hidden);
    });
    const visible = records.filter(record => !record.hidden).length;
    const empty = scope.querySelector('[data-empty]');
    if (empty) empty.hidden = visible !== 0;
    const count = scope.querySelector('[data-results]');
    if (count) count.textContent = `${visible} ${visible === 1 ? 'entry' : 'entries'} shown`;
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.filter;
    buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    apply();
  }));
  search?.addEventListener('input', apply);
  apply();
});

// The downloadable preview includes every page in one file. The deployed site
// uses ordinary HTML links; this router runs only inside that preview file.
if (document.body.hasAttribute('data-standalone-preview')) {
  const routes = [...document.querySelectorAll('[data-route]')];
  const names = ['home', 'research', 'publications', 'conferences', 'news', 'contact'];
  const initialRoute = names.includes(document.body.dataset.initialRoute) ? document.body.dataset.initialRoute : 'home';
  const route = () => {
    const match = location.hash.match(/^#\/?([^/]*)(?:\/(.*))?$/);
    const name = names.includes(match?.[1]) ? match[1] : initialRoute;
    const detailId = name === 'news' && match?.[2] ? decodeURIComponent(match[2]) : '';
    const post = detailId ? routes.find(section => section.dataset.route === `news/${detailId}`) : null;
    const activeRoute = post ? post.dataset.route : name;
    routes.forEach(section => { section.hidden = section.dataset.route !== activeRoute; });
    nav.querySelectorAll('[data-nav]').forEach(link => {
      if (link.dataset.nav === name) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = post ? `${post.dataset.pageTitle} · Sunggyu Ryoo` : name === 'home' ? 'Sunggyu Ryoo · Physics & 2D Devices' : `${name[0].toUpperCase() + name.slice(1)} · Sunggyu Ryoo`;
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded','false');
    menu.textContent = 'Menu';
    if (match?.[2] && !post) document.getElementById(decodeURIComponent(match[2]))?.scrollIntoView();
    else window.scrollTo(0,0);
  };
  addEventListener('hashchange',route);
  route();
}
