/* ============================================
   PORTFÓLIO LIVE ENGINE — Luiz Felipe Carvalho
   Client-side JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  loadProjects();
  loadCertificates();
  initActiveNavLinks();
});

/* ---- Navbar ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  function toggleMenu() {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('visible');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', toggleMenu);

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

/* ---- Projects ---- */
let allProjects = [];
let currentFilter = 'all';
let currentSort = 'recent';

async function loadProjects() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    allProjects = data.projects || [];

    // Update project counter
    updateProjectCount(allProjects.length);

    // Render with default sort (recent)
    renderFilteredSorted();

    // Init controls after data loads
    initProjectFilters();
    initProjectSort();
  } catch (error) {
    console.warn('Não foi possível carregar data.json:', error);
    renderProjectsFallback();
  }
}

function updateProjectCount(count) {
  const el = document.getElementById('projectCount');
  if (el) {
    // Animate counter
    animateCounter(el, 0, count, 800);
  }
}

function animateCounter(el, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function sortProjects(projects, sortBy) {
  const sorted = [...projects];

  if (sortBy === 'recent') {
    sorted.sort((a, b) => {
      const dateA = new Date(a.updated_at || 0);
      const dateB = new Date(b.updated_at || 0);
      return dateB - dateA;
    });
  } else if (sortBy === 'stars') {
    sorted.sort((a, b) => b.stars - a.stars);
  }

  return sorted;
}

function filterProjects(projects, filter) {
  if (filter === 'all') return projects;
  return projects.filter(p => p.category === filter);
}

function renderFilteredSorted() {
  let projects = filterProjects(allProjects, currentFilter);
  projects = sortProjects(projects, currentSort);
  renderProjects(projects);
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = `
      <div class="projects__empty">
        <p>Nenhum projeto encontrado nesta categoria.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = projects.map((project, index) => {
    const categoryClass = getCategoryClass(project.category);
    const delayClass = `reveal--delay-${Math.min(index + 1, 4)}`;
    const coverStyle = project.heroImage
      ? `style="background-image: linear-gradient(180deg, rgba(10, 10, 15, 0) 0%, rgba(10, 10, 15, 0.68) 100%), url('${project.heroImage}'); background-size: cover; background-position: center;"`
      : '';
    const language = project.language || 'N/A';
    const forks = Number(project.forks || 0);
    const liveLink = project.liveUrl
      ? `<a href="${project.liveUrl}" target="_blank" rel="noopener" class="project-card__action project-card__action--primary">Demo</a>`
      : '';
    const starsHtml = project.stars > 0
      ? `<span class="project-card__stars">⭐ ${project.stars}</span>`
      : '';
    const dateLabel = project.updated_at
      ? formatDate(project.updated_at)
      : '';
    const techPreview = (project.technologies || []).slice(0, 4);
    const techExtra = (project.technologies || []).length - techPreview.length;

    return `
      <article class="project-card reveal ${delayClass}" data-category="${project.category}">
        <div class="project-card__cover" ${coverStyle}>
          <span class="project-card__category ${categoryClass}">${project.category}</span>
          <span class="project-card__language">${language}</span>
        </div>
        <div class="project-card__header">
          <div class="project-card__meta">
            ${starsHtml}
            ${forks > 0 ? `<span class="project-card__forks">🍴 ${forks}</span>` : ''}
            <a href="${project.repoUrl}" target="_blank" rel="noopener" class="project-card__link" aria-label="Ver repositório">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
          </div>
        </div>
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__desc">${project.shortDescription}</p>
        ${dateLabel ? `<p class="project-card__date">Atualizado em ${dateLabel}</p>` : ''}
        <div class="project-card__actions">
          ${liveLink}
          <a href="${project.repoUrl}" target="_blank" rel="noopener" class="project-card__action">Repositório</a>
        </div>
        <div class="project-card__tech">
          ${techPreview.map(tech => `<span class="project-card__tech-tag">${tech}</span>`).join('')}
          ${techExtra > 0 ? `<span class="project-card__tech-tag project-card__tech-tag--more">+${techExtra}</span>` : ''}
        </div>
      </article>
    `;
  }).join('');

  // Re-init scroll reveal for dynamically added elements
  initScrollReveal();
}

function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

function getCategoryClass(category) {
  const classes = {
    'Back-end': 'project-card__category--backend',
    'Automação': 'project-card__category--automation',
    'Web': 'project-card__category--web',
    'Mobile': 'project-card__category--mobile'
  };
  return classes[category] || '';
}

function renderProjectsFallback() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = `
    <div class="project-card reveal">
      <div class="project-card__cover">
        <span class="project-card__category project-card__category--automation">Automação</span>
      </div>
      <div class="project-card__header">
        <a href="https://github.com/Luizlfc-dev/Projeto-Jarvis-Cerebro" target="_blank" rel="noopener" class="project-card__link" aria-label="Ver repositório">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </a>
      </div>
      <h3 class="project-card__title">Projeto JARVIS</h3>
      <p class="project-card__desc">Assistente de IA 100% privado e auto-hospedado inspirado no Jarvis.</p>
      <div class="project-card__actions">
        <a href="https://github.com/Luizlfc-dev/Projeto-Jarvis-Cerebro" target="_blank" rel="noopener" class="project-card__action">Repositório</a>
      </div>
      <div class="project-card__tech">
        <span class="project-card__tech-tag">C#</span>
        <span class="project-card__tech-tag">.NET</span>
        <span class="project-card__tech-tag">Home Assistant</span>
      </div>
    </div>
  `;

  initScrollReveal();
}

/* ---- Certifications ---- */
async function loadCertificates() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    renderCertificates(data.certificates || []);
  } catch (error) {
    console.warn('Não foi possível carregar certificados do data.json:', error);
    renderCertificatesFallback();
  }
}

function renderCertificates(certificates) {
  const grid = document.getElementById('certificationsGrid');
  if (!grid) return;

  if (certificates.length === 0) {
    grid.innerHTML = `
      <div class="cert-item">
        <span class="cert-item__icon">📄</span>
        <div class="cert-item__info">
          <strong>Nenhum certificado publicado ainda</strong>
          <span>Adicione arquivos na pasta certificates/ para publicação automática.</span>
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = certificates.map((cert, index) => {
    const delayClass = `reveal--delay-${Math.min(index + 1, 4)}`;
    const hasFile = cert.fileUrl && cert.fileUrl.trim().length > 0;
    const safeFileUrl = hasFile ? encodeURI(cert.fileUrl.trim()) : '';
    const isImageFile = hasFile && /\.(png|jpe?g|webp|gif|avif)$/i.test(safeFileUrl);
    const isPdfFile = hasFile && /\.pdf$/i.test(safeFileUrl);
    const action = hasFile
      ? `
        <div class="cert-item__actions">
          <a href="${safeFileUrl}" target="_blank" rel="noopener" class="cert-item__link">Visualizar</a>
          <a href="${safeFileUrl}" target="_blank" rel="noopener" download class="cert-item__link cert-item__link--ghost">Baixar</a>
        </div>
      `
      : '';
    const issuer = cert.issuer || 'Certificação';
    const workload = cert.workload ? ` · ${cert.workload}` : '';
    const issuedAt = cert.issuedAt ? ` · ${cert.issuedAt}` : '';
    const preview = isImageFile
      ? `<img class="cert-item__preview-img" src="${safeFileUrl}" alt="Prévia do certificado ${cert.title}" loading="lazy">`
      : isPdfFile
        ? `
          <object class="cert-item__preview-pdf" data="${safeFileUrl}#page=1&toolbar=0&navpanes=0" type="application/pdf">
            <span class="cert-item__preview-fallback">PDF</span>
          </object>
        `
        : `<span class="cert-item__preview-fallback">Arquivo</span>`;

    return `
      <article class="cert-item cert-item--dynamic reveal ${delayClass}">
        <div class="cert-item__preview">${preview}</div>
        <div class="cert-item__info">
          <strong>${cert.title}</strong>
          <span>${issuer}${workload}${issuedAt}</span>
        </div>
        ${action}
      </article>
    `;
  }).join('');

  initScrollReveal();
}

function renderCertificatesFallback() {
  const grid = document.getElementById('certificationsGrid');
  if (!grid) return;

  grid.innerHTML = `
    <div class="cert-item">
      <span class="cert-item__icon">📄</span>
      <div class="cert-item__info">
        <strong>Microsoft Excel 2016</strong>
        <span>Fundação Bradesco | Escola Virtual · 15h · Jun/2022</span>
      </div>
    </div>
    <div class="cert-item">
      <span class="cert-item__icon">📄</span>
      <div class="cert-item__info">
        <strong>Microsoft Word 2016</strong>
        <span>Fundação Bradesco | Escola Virtual · 9h · Jun/2022</span>
      </div>
    </div>
    <div class="cert-item">
      <span class="cert-item__icon">📄</span>
      <div class="cert-item__info">
        <strong>Microsoft PowerPoint 2016</strong>
        <span>Fundação Bradesco | Escola Virtual · 8h · Jun/2022</span>
      </div>
    </div>
  `;
}

/* ---- Project Filters ---- */
function initProjectFilters() {
  const filters = document.querySelectorAll('.projects__filter');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderFilteredSorted();
    });
  });
}

/* ---- Project Sort ---- */
function initProjectSort() {
  const sortBtns = document.querySelectorAll('.projects__sort-btn');

  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      renderFilteredSorted();
    });
  });
}

/* ---- Active Nav Links ---- */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
