/* ============================================
   PORTFÓLIO LIVE ENGINE — Luiz Felipe Carvalho
   Client-side JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  loadProjects();
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
    const starsHtml = project.stars > 0
      ? `<span class="project-card__stars">⭐ ${project.stars}</span>`
      : '';
    const dateLabel = project.updated_at
      ? formatDate(project.updated_at)
      : '';

    return `
      <article class="project-card reveal ${delayClass}" data-category="${project.category}">
        <div class="project-card__header">
          <span class="project-card__category ${categoryClass}">${project.category}</span>
          <div class="project-card__meta">
            ${starsHtml}
            <a href="${project.repoUrl}" target="_blank" rel="noopener" class="project-card__link" aria-label="Ver repositório">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
          </div>
        </div>
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__desc">${project.shortDescription}</p>
        ${dateLabel ? `<p class="project-card__date">Atualizado em ${dateLabel}</p>` : ''}
        <div class="project-card__tech">
          ${project.technologies.map(tech => `<span class="project-card__tech-tag">${tech}</span>`).join('')}
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
    'Web': 'project-card__category--web'
  };
  return classes[category] || '';
}

function renderProjectsFallback() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = `
    <div class="project-card reveal">
      <div class="project-card__header">
        <span class="project-card__category project-card__category--automation">Automação</span>
        <a href="https://github.com/Luizlfc-dev/Projeto-Jarvis-Cerebro" target="_blank" rel="noopener" class="project-card__link" aria-label="Ver repositório">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </a>
      </div>
      <h3 class="project-card__title">Projeto JARVIS</h3>
      <p class="project-card__desc">Assistente de IA 100% privado e auto-hospedado inspirado no Jarvis.</p>
      <div class="project-card__tech">
        <span class="project-card__tech-tag">C#</span>
        <span class="project-card__tech-tag">.NET</span>
        <span class="project-card__tech-tag">Home Assistant</span>
      </div>
    </div>
  `;

  initScrollReveal();
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
