/* ============================================================
   SCRIPT.JS — платформа «Мир чисел», модульная версия
   ============================================================ */

const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const STORAGE_KEY = 'numbers_progress';
const THEME_KEY = 'site_theme';
const TRAINER_KEY = 'trainer_stats';

let userProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let currentModuleId = null;   // какой модуль сейчас открыт (null = главная)

/* ============================================================
   1. ИНИЦИАЛИЗАЦИЯ
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    buildModuleSections();
    buildLessonSections();
    buildHomeModules();
    updateSidebar();

    // Калькуляторы
    ['calc-number', 'calc-from', 'calc-to'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', runAdvCalc);
    });
    runAdvCalc();

    const tr = document.getElementById('trainer-input');
    if (tr) tr.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') checkTrainer();
    });

    const up = document.getElementById('back-to-top');
    if (up) {
        window.addEventListener('scroll', function () {
            up.classList.toggle('visible', window.scrollY > 400);
        });
    }

    // Открыть страницу из хеша (если есть)
    applyHash();
});

window.addEventListener('hashchange', applyHash);

function applyHash() {
    const hash = (location.hash || '#home').slice(1);
    showPage(hash);
}

/* ============================================================
   2. СТРОИТЕЛИ ДИНАМИЧЕСКИХ СЕКЦИЙ
   ============================================================ */

function buildHomeModules() {
    const grid = document.getElementById('modules-grid');
    if (!grid || typeof MODULES === 'undefined') return;
    grid.innerHTML = MODULES.map(renderModuleCard).join('');
}

function buildModuleSections() {
    const container = document.getElementById('modules-container');
    if (!container || typeof MODULES === 'undefined') return;
    container.innerHTML = '';
    MODULES.forEach(function (mod) {
        if (mod.status === 'soon') return;
        const sec = document.createElement('section');
        sec.id = 'page-module-' + mod.id;
        sec.className = 'page';
        sec.innerHTML = renderModuleLanding(mod);
        container.appendChild(sec);
    });
}

function buildLessonSections() {
    const container = document.getElementById('lessons-container');
    if (!container || typeof MODULES === 'undefined') return;
    container.innerHTML = '';
    MODULES.forEach(function (mod) {
        if (!mod.lessons) return;
        mod.lessons.forEach(function (lesson) {
            const sec = document.createElement('section');
            sec.id = 'page-lesson-' + lesson.id;
            sec.className = 'page';
            sec.innerHTML = renderLesson(lesson);
            container.appendChild(sec);
        });
    });
}

/* ============================================================
   3. SPA-РОУТИНГ
   ============================================================ */
function switchPage(pageId) {
    location.hash = pageId;
}

function showPage(pageId) {
    document.querySelectorAll('section.page').forEach(function (p) {
        p.classList.remove('active');
    });

    // Определяем контекст
    let moduleId = null;
    if (pageId.indexOf('module-') === 0) {
        moduleId = pageId.slice(7);
    } else if (pageId.indexOf('lesson-') === 0) {
        const lessonId = pageId.slice(7);
        moduleId = findModuleByLesson(lessonId);
    } else if (pageId.indexOf('tools-') === 0) {
        moduleId = pageId.slice(6);
    }
    currentModuleId = moduleId;

    // Fallback
    let target = document.getElementById('page-' + pageId);
    if (!target && pageId !== 'home') {
        target = document.getElementById('page-home');
    }
    if (target) target.classList.add('active');

    updateSidebar(pageId);
    window.scrollTo(0, 0);

    if (pageId === 'tools-numeral-systems') ensureTrainerReady();
}

function findModuleByLesson(lessonId) {
    if (typeof MODULES === 'undefined') return null;
    for (let i = 0; i < MODULES.length; i++) {
        const m = MODULES[i];
        if (m.lessons && m.lessons.some(function (l) { return l.id === lessonId; })) {
            return m.id;
        }
    }
    return null;
}

/* ============================================================
   4. САЙДБАР (динамический по контексту)
   ============================================================ */
function updateSidebar(currentPageId) {
    const aside = document.getElementById('sidebar');
    if (!aside || typeof MODULES === 'undefined') return;

    if (!currentModuleId) {
        aside.innerHTML = renderModulesSidebar();
        return;
    }

    const mod = MODULES.find(function (m) { return m.id === currentModuleId; });
    if (!mod) {
        aside.innerHTML = renderModulesSidebar();
        return;
    }

    const lessonId = (currentPageId && currentPageId.indexOf('lesson-') === 0)
        ? currentPageId.slice(7) : null;

    aside.innerHTML = renderModuleSidebar(mod, lessonId);
}

/* ============================================================
   5. ПРОГРЕСС И КВИЗЫ
   ============================================================ */
function checkQuiz(quizName, resultId, progressKey) {
    const resultText = document.getElementById(resultId);
    const selected = document.querySelector('input[name="' + quizName + '"]:checked');

    if (!selected) {
        resultText.style.color = '#7f8c8d';
        resultText.innerText = 'Выберите вариант ответа.';
        return;
    }

    if (selected.value === 'correct') {
        resultText.style.color = '#27ae60';
        resultText.innerText = 'Правильно! Занятие успешно освоено.';
        userProgress[progressKey] = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
        updateSidebar((location.hash || '#home').slice(1));
    } else {
        resultText.style.color = '#c0392b';
        resultText.innerText = 'Ошибка. Прочитайте материал занятия повторно.';
    }
    resultText.style.display = 'block';
}

function resetProgress() {
    if (!confirm('Сбросить весь прогресс обучения и статистику тренажёра?')) return;
    userProgress = {};
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TRAINER_KEY);
    updateSidebar((location.hash || '#home').slice(1));

    document.querySelectorAll('input[type="radio"]').forEach(function (r) { r.checked = false; });
    document.querySelectorAll('.quiz-status').forEach(function (el) { el.innerText = ''; });

    trainerScore = 0;
    trainerTotal = 0;
    trainerReady = false;
    updateTrainerScore();
}

/* ============================================================
   6. ТЕМА
   ============================================================ */
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

/* ============================================================
   7. КАЛЬКУЛЯТОРЫ (те же, что были)
   ============================================================ */
function calculateSystems() {
    const inputVal = document.getElementById('dec-input').value;
    const resBin = document.getElementById('res-bin');
    const resOct = document.getElementById('res-oct');
    const resHex = document.getElementById('res-hex');
    if (!resBin) return;
    if (!inputVal || inputVal < 0) {
        resBin.innerText = resOct.innerText = resHex.innerText = '0';
        return;
    }
    const dec = parseInt(inputVal, 10);
    resBin.innerText = dec.toString(2);
    resOct.innerText = dec.toString(8);
    resHex.innerText = dec.toString(16).toUpperCase();
}

function parseInBase(str, base) {
    str = String(str).trim().toUpperCase().replace(',', '.');
    if (!str) throw new Error('Введите число');
    if (base < 2 || base > 36) throw new Error('Основание 2–36');
    const parts = str.split('.');
    if (parts.length > 2) throw new Error('Слишком много точек');
    const intPart = parts[0] || '0';
    const fracPart = parts[1] || '';
    let value = 0;
    for (let i = 0; i < intPart.length; i++) {
        const d = DIGITS.indexOf(intPart[i]);
        if (d < 0 || d >= base) throw new Error('Цифра «' + intPart[i] + '» недопустима');
        value = value * base + d;
    }
    for (let i = 0; i < fracPart.length; i++) {
        const d = DIGITS.indexOf(fracPart[i]);
        if (d < 0 || d >= base) throw new Error('Цифра «' + fracPart[i] + '» недопустима');
        value += d / Math.pow(base, i + 1);
    }
    return value;
}

function intToBaseWithSteps(n, base) {
    const steps = [];
    if (n === 0) return { result: '0', steps: ['Целая часть = 0 → «0»'] };
    let x = n, out = '';
    while (x > 0) {
        const rem = x % base, q = Math.floor(x / base);
        steps.push(x + ' ÷ ' + base + ' = ' + q + ', остаток ' + DIGITS[rem]);
        out = DIGITS[rem] + out;
        x = q;
    }
    steps.push('Результат: ' + out);
    return { result: out, steps: steps };
}

function fracToBaseWithSteps(frac, base, precision) {
    precision = precision || 10;
    const steps = [];
    if (frac === 0) return { result: '', steps: steps };
    let x = frac, out = '';
    for (let i = 0; i < precision && x > 0; i++) {
        const y = x * base, d = Math.floor(y);
        steps.push('Дробь ' + x.toFixed(8) + ' × ' + base + ' = ' + y.toFixed(8) + ' → ' + DIGITS[d]);
        out += DIGITS[d];
        x = y - d;
    }
    if (x > 0) steps.push('(остановлено после ' + precision + ' знаков)');
    return { result: out, steps: steps };
}

function expandedForm(str, base) {
    str = String(str).toUpperCase();
    const p = str.split('.');
    const ip = p[0] || '0', fp = p[1] || '';
    const terms = [];
    for (let i = 0; i < ip.length; i++) {
        terms.push(DIGITS.indexOf(ip[i]) + '·' + base + '<sup>' + (ip.length - 1 - i) + '</sup>');
    }
    for (let i = 0; i < fp.length; i++) {
        terms.push(DIGITS.indexOf(fp[i]) + '·' + base + '<sup>−' + (i + 1) + '</sup>');
    }
    return terms.join(' + ');
}

function runAdvCalc() {
    const numEl = document.getElementById('calc-number');
    const fromEl = document.getElementById('calc-from');
    const toEl = document.getElementById('calc-to');
    const resEl = document.getElementById('calc-result');
    const errEl = document.getElementById('calc-error');
    const stepsEl = document.getElementById('calc-steps');
    if (!numEl || !fromEl || !toEl || !resEl || !errEl || !stepsEl) return;

    errEl.innerText = '';
    resEl.innerText = '—';
    stepsEl.innerHTML = '';

    const raw = numEl.value.trim();
    const from = parseInt(fromEl.value, 10);
    const to = parseInt(toEl.value, 10);
    if (!raw) return;

    try {
        const dec = parseInBase(raw, from);
        const normalized = String(raw).replace(',', '.');
        const intDec = Math.floor(dec);
        const fracDec = dec - intDec;

        const iRes = intToBaseWithSteps(intDec, to);
        const fRes = fracToBaseWithSteps(fracDec, to);
        const out = fRes.result ? (iRes.result + '.' + fRes.result) : iRes.result;
        resEl.innerText = out;

        const lines = [];
        lines.push('<strong>1. Развёрнутая форма (основание ' + from + '):</strong>');
        lines.push('&nbsp;&nbsp;' + normalized + '<sub>' + from + '</sub> = ' +
                   expandedForm(normalized, from) + ' = ' + dec + '<sub>10</sub>');
        lines.push('');
        lines.push('<strong>2. Перевод целой части:</strong>');
        iRes.steps.forEach(function (s) { lines.push('&nbsp;&nbsp;' + s); });
        if (fRes.steps.length) {
            lines.push('');
            lines.push('<strong>3. Перевод дробной части:</strong>');
            fRes.steps.forEach(function (s) { lines.push('&nbsp;&nbsp;' + s); });
        }
        lines.push('');
        lines.push('<strong>Итог:</strong> ' + normalized + '<sub>' + from + '</sub> = ' +
                   out + '<sub>' + to + '</sub>');
        stepsEl.innerHTML = lines.join('<br>');
    } catch (e) {
        errEl.style.color = '#c0392b';
        errEl.innerText = '⚠ ' + e.message;
    }
}

/* ============================================================
   8. ТРЕНАЖЁР
   ============================================================ */
let trainerScore = 0;
let trainerTotal = 0;
let trainerAnswer = '';
let trainerReady = false;

function ensureTrainerReady() {
    if (!trainerReady) {
        const stats = JSON.parse(localStorage.getItem(TRAINER_KEY) || 'null');
        if (stats) { trainerScore = stats.score; trainerTotal = stats.total; }
        updateTrainerScore();
        newTrainerTask();
        trainerReady = true;
    }
}

function updateTrainerScore() {
    const s = document.getElementById('trainer-score');
    const t = document.getElementById('trainer-total');
    if (s) s.innerText = trainerScore;
    if (t) t.innerText = trainerTotal;
}

function newTrainerTask() {
    const bases = [2, 8, 16];
    const from = bases[Math.floor(Math.random() * bases.length)];
    let to = bases[Math.floor(Math.random() * bases.length)];
    while (to === from) to = bases[Math.floor(Math.random() * bases.length)];

    const num = Math.floor(Math.random() * 255) + 1;
    const numInFrom = num.toString(from).toUpperCase();
    trainerAnswer = num.toString(to).toUpperCase();

    const taskEl = document.getElementById('trainer-task');
    if (taskEl) {
        taskEl.innerHTML = 'Переведите <strong>' + numInFrom + '<sub>' + from + '</sub></strong> в систему с основанием <strong>' + to + '</strong>.';
    }
    const input = document.getElementById('trainer-input');
    if (input) { input.value = ''; input.focus(); }
    const fb = document.getElementById('trainer-feedback');
    if (fb) { fb.innerText = ''; fb.style.color = ''; }
}

function checkTrainer() {
    const input = document.getElementById('trainer-input');
    const fb = document.getElementById('trainer-feedback');
    if (!input || !fb) return;

    const val = input.value.trim().toUpperCase();
    if (!val) { fb.style.color = '#7f8c8d'; fb.innerText = 'Введите ответ'; return; }

    trainerTotal++;
    const ok = val === trainerAnswer;
    if (ok) trainerScore++;
    fb.style.color = ok ? '#27ae60' : '#c0392b';
    fb.innerText = ok ? '✅ Верно!' : '❌ Неверно. Правильный ответ: ' + trainerAnswer;

    updateTrainerScore();
    localStorage.setItem(TRAINER_KEY, JSON.stringify({ score: trainerScore, total: trainerTotal }));

    if (ok) {
        setTimeout(function () {
            const page = document.getElementById('page-tools-numeral-systems');
            if (page && page.classList.contains('active')) newTrainerTask();
        }, 900);
    }
}