const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const STORAGE_KEY = 'numbers_progress';
const THEME_KEY = 'site_theme';

let userProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let currentModuleId = null;
let pageGeneration = 0;

document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    buildHomeModules();
    updateSidebar();
    applyHash();

    ['calc-number', 'calc-from', 'calc-to'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', runAdvCalc);
    });
    runAdvCalc();

    const tr = document.getElementById('trainer-input');
    if (tr) tr.addEventListener('keydown', function (e) { if (e.key === 'Enter') checkTrainer(); });

    const up = document.getElementById('back-to-top');
    if (up) window.addEventListener('scroll', function () { up.classList.toggle('visible', window.scrollY > 400); });
});

window.addEventListener('hashchange', applyHash);

async function applyHash() {
    const hash = (location.hash || '#home').slice(1);
    await showPage(hash);
}

function buildHomeModules() {
    const grid = document.getElementById('modules-grid');
    if (!grid) return;
    const visibleModules = MODULES.filter(m => typeof isVisibleModule !== 'function' || isVisibleModule(m.id));
    grid.innerHTML = visibleModules.map(renderModuleCard).join('');
}

function ensurePageSection(sectionId, containerId) {
    let section = document.getElementById(sectionId);
    if (section) return section;
    const container = document.getElementById(containerId);
    if (!container) return null;
    section = document.createElement('section');
    section.id = sectionId;
    section.className = 'page';
    container.appendChild(section);
    return section;
}

async function switchPage(pageId) {
    location.hash = pageId;
}

async function showPage(pageId) {
    const gen = ++pageGeneration;
    let mod = null;
    let lessonId = null;

    if (pageId.indexOf('module-') === 0) {
        mod = MODULES.find(m => m.id === pageId.slice(7));
    } else if (pageId.indexOf('lesson-') === 0) {
        lessonId = pageId.slice(7);
        mod = await findModuleByLesson(lessonId);
    } else if (pageId.indexOf('tools-') === 0) {
        mod = MODULES.find(m => m.id === pageId.slice(6));
    }

    if (gen !== pageGeneration) return;
    currentModuleId = mod ? mod.id : null;

    if (mod && mod.courseFile) {
        await ensureModuleLoaded(mod);
        if (gen !== pageGeneration) return;
    }

    if (lessonId && mod) {
        const lesson = getModuleLessons(mod).find(l => l.id === lessonId);
        if (lesson) {
            const target = ensurePageSection('page-lesson-' + lessonId, 'lessons-container');
            if (target) {
                target.innerHTML = renderLesson(lesson, mod);
                if (typeof renderCommentsBlock === 'function') {
                    renderCommentsBlock(lesson.id, 'lesson').then(html => {
                        const cBox = document.getElementById('lesson-comments-container-' + lesson.id);
                        if (cBox) cBox.innerHTML = html;
                    }).catch(e => console.error(e));
                }
            }
        }
    }

    if (pageId.indexOf('module-') === 0 && mod) {
        const target = ensurePageSection('page-' + pageId, 'modules-container');
        if (target) {
            target.innerHTML = renderModuleLanding(mod);
            if (typeof renderCommentsBlock === 'function') {
                renderCommentsBlock(mod.id, 'module').then(html => {
                    const cBox = document.getElementById('module-comments-container-' + mod.id);
                    if (cBox) cBox.innerHTML = html;
                }).catch(e => console.error(e));
            }
        }
    }

    if (pageId === 'profile' || pageId.indexOf('user-') === 0) {
        let targetUid = currentUser ? currentUser.uid : null;
        let isOwn = true;
        if (pageId.indexOf('user-') === 0) {
            targetUid = pageId.slice(5);
            isOwn = currentUser && (targetUid === currentUser.uid);
        }
        if (!targetUid) { window.location.hash = 'home'; return; }
        const target = document.getElementById('page-profile');
        if (target) {
            target.innerHTML = '<p>Загрузка профиля...</p>';
            if (typeof renderProfilePage === 'function') {
                renderProfilePage(targetUid, isOwn).then(html => { target.innerHTML = html; });
            }
        }
    }

    document.querySelectorAll('section.page').forEach(p => p.classList.remove('active'));
    let target = document.getElementById('page-' + pageId);
    if (pageId === 'profile' || pageId.indexOf('user-') === 0) target = document.getElementById('page-profile');
    if (!target && pageId !== 'home') target = document.getElementById('page-home');
    if (target) target.classList.add('active');

    updateSidebar(pageId);
    window.scrollTo(0, 0);
    closeSidebar();
}

function updateSidebar(currentPageId) {
    const aside = document.getElementById('sidebar');
    if (!aside) return;
    if (!currentModuleId) {
        aside.innerHTML = renderModulesSidebar();
        return;
    }
    const mod = MODULES.find(m => m.id === currentModuleId);
    if (!mod) { aside.innerHTML = renderModulesSidebar(); return; }
    const lessonId = (currentPageId && currentPageId.indexOf('lesson-') === 0) ? currentPageId.slice(7) : null;
    aside.innerHTML = renderModuleSidebar(mod, lessonId);
}

function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('open');
    document.getElementById('sidebar-overlay')?.classList.toggle('open');
}
function closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('open');
}

function checkQuiz(quizName, resultId, progressKey) {
    const resultText = document.getElementById(resultId);
    const selected = document.querySelector(`input[name="${quizName}"]:checked`);
    if (!selected) {
        resultText.style.color = '#7f8c8d';
        resultText.innerText = 'Выберите вариант.';
        return;
    }
    if (selected.value === 'correct') {
        resultText.style.color = '#10b981';
        resultText.innerText = 'Правильно!';
        userProgress[progressKey] = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
        updateSidebar((location.hash || '#home').slice(1));
    } else {
        resultText.style.color = '#ef4444';
        resultText.innerText = 'Ошибка.';
    }
    resultText.style.display = 'block';
}

function resetProgress() {
    if (!confirm('Сбросить прогресс?')) return;
    userProgress = {};
    localStorage.removeItem(STORAGE_KEY);
    updateSidebar((location.hash || '#home').slice(1));
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    document.querySelectorAll('.quiz-status').forEach(el => el.innerText = '');
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', saved);
}
function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
}