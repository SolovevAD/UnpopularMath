/* ============================================================
   RENDERER.JS — превращает данные модулей и занятий в HTML
   Зависит от: course.js, course-quantum.js, modules.js,
               quantum-diagrams.js (для SVG-диаграмм)
   ============================================================ */

/* ============================================================
   1. БЛОКИ КОНТЕНТА ЗАНЯТИЯ
   ============================================================ */

/** Отрисовка одного блока контента занятия. */
function renderBlock(sec) {
    switch (sec.type) {
        case 'p':
            return '<p>' + sec.text + '</p>';

        case 'h3':
            return '<h3>' + sec.text + '</h3>';

        case 'code':
            return '<p class="code-text">' + sec.text + '</p>';

        case 'info':
            return '<p class="info-text">' + sec.text + '</p>';

        case 'image': {
            const svg = (typeof QUANTUM_DIAGRAMS !== 'undefined' && QUANTUM_DIAGRAMS[sec.src])
                ? QUANTUM_DIAGRAMS[sec.src]
                : '<p><em>[изображение недоступно: ' + (sec.src || '') + ']</em></p>';
            const caption = sec.caption
                ? '<figcaption>' + sec.caption + '</figcaption>'
                : '';
            return '<figure class="lesson-figure">' + svg + caption + '</figure>';
        }

        case 'list':
            return '<ul>' + sec.items.map(function (i) {
                return '<li>' + i + '</li>';
            }).join('') + '</ul>';

        case 'numlist':
            return '<ol>' + sec.items.map(function (i) {
                return '<li>' + i + '</li>';
            }).join('') + '</ol>';

        case 'example':
            return '<div class="info-text example">' +
                   '<strong>' + sec.title + '</strong>' +
                   '<ol>' + sec.steps.map(function (s) {
                       return '<li>' + s + '</li>';
                   }).join('') + '</ol></div>';

        default:
            return '';
    }
}

/* ============================================================
   2. КВИЗ (поддерживает один вопрос или массив вопросов)
   ============================================================ */

function renderQuiz(lesson) {
    if (!lesson.quiz) return '';

    const questions = Array.isArray(lesson.quiz) ? lesson.quiz : [lesson.quiz];

    const blocks = questions.map(function (q, qIndex) {
        const qname = 'quiz_' + lesson.id + '_' + qIndex;
        const rid   = 'res_' + lesson.id + '_' + qIndex;

        const options = q.options.map(function (opt, i) {
            const oid = qname + '_' + i;
            const val = opt.correct ? 'correct' : 'wrong';
            return '<input type="radio" id="' + oid + '" name="' + qname + '" value="' + val + '"> ' +
                   '<label for="' + oid + '">' + opt.text + '</label><br>';
        }).join('');

        const hint = q.hint
            ? '<details class="quiz-hint"><summary>Показать подсказку</summary><p>' + q.hint + '</p></details>'
            : '';

        const prefix = questions.length > 1
            ? '<p><strong>Вопрос ' + (qIndex + 1) + ' из ' + questions.length + ':</strong></p>'
            : '';

        return '<div class="quiz-question">' +
               prefix +
               '<p>' + q.question + '</p>' +
               '<p>' + options + '</p>' +
               '<button class="btn" onclick="checkQuiz(\'' + qname + '\', \'' + rid + '\', \'' + lesson.id + '\')">Проверить ответ</button>' +
               '<p id="' + rid + '" class="quiz-status"></p>' +
               hint +
               '</div>';
    }).join('<hr class="quiz-divider">');

    return '<section class="quiz-box">' +
           '<h4>Контрольное задание занятия ' + lesson.num + ':</h4>' +
           blocks +
           '</section>';
}

/* ============================================================
   3. ДОМАШНЕЕ ЗАДАНИЕ
   ============================================================ */

function renderHomework(lesson) {
    if (!lesson.homework || !lesson.homework.length) return '';
    return '<h3>Домашнее задание</h3>' +
           '<ol class="homework-list">' +
           lesson.homework.map(function (h) {
               return '<li>' + h + '</li>';
           }).join('') +
           '</ol>';
}

/* ============================================================
   4. ПОЛНАЯ РАЗМЕТКА ЗАНЯТИЯ
   ============================================================ */

function renderLesson(lesson) {
    const parts = [];
    parts.push('<h2>Занятие ' + lesson.num + '. ' + lesson.title + '</h2>');
    parts.push('<p class="lesson-meta"><em>' + lesson.subtitle + '</em>' +
               ' · <span class="lesson-minutes">' + lesson.minutes + ' мин</span>' +
               ' · <span class="lesson-module">' + lesson.module + '</span></p>');
    parts.push('<hr>');

    lesson.sections.forEach(function (sec) {
        parts.push(renderBlock(sec));
    });

    parts.push(renderQuiz(lesson));
    parts.push(renderHomework(lesson));

    parts.push('<p><br><button class="btn" onclick="switchPage(\'home\')">Назад на главную</button></p>');

    return parts.join('\n');
}

/* ============================================================
   5. КАРТОЧКА ЗАНЯТИЯ ДЛЯ ГЛАВНОЙ
   ============================================================ */

function renderHomeCard(lesson) {
    const shortDesc = lesson.sections.find(function (s) { return s.type === 'p'; });
    const desc = shortDesc ? shortDesc.text : '';
    return '<article>' +
           '<h3>' + lesson.num + '. ' + lesson.title + '</h3>' +
           '<p class="lesson-meta"><em>' + lesson.subtitle + '</em></p>' +
           '<p>' + desc + '</p>' +
           '<p><button class="btn" onclick="switchPage(\'' + lesson.id + '\')">Открыть занятие...</button></p>' +
           '</article>';
}

/* ============================================================
   6. ПЛИТКА МОДУЛЯ НА ГЛАВНОЙ
   ============================================================ */

function renderModuleCard(mod) {
    const isSoon = mod.status === 'soon';
    const cardCls = 'module-card' + (isSoon ? ' soon' : '');
    const badge = isSoon
        ? '<span class="module-badge soon">скоро</span>'
        : '<span class="module-badge">' + (mod.lessons ? mod.lessons.length : 0) + ' занятий</span>';

    const action = isSoon
        ? '<button class="btn btn-disabled" disabled>В разработке</button>'
        : '<button class="btn" onclick="switchPage(\'module-' + mod.id + '\')">Открыть модуль...</button>';

    const meta = mod.meta
        ? '<p class="module-meta">' + mod.meta.hours + ' ч · ' + mod.meta.weeks + ' недель · ' + mod.meta.level + '</p>'
        : '';

    return '<article class="' + cardCls + '">' +
           '<div class="module-icon">' + mod.icon + '</div>' +
           '<div class="module-body">' +
           '<h3>' + mod.title + ' ' + badge + '</h3>' +
           '<p class="module-subtitle"><em>' + mod.subtitle + '</em></p>' +
           '<p>' + mod.description + '</p>' +
           meta +
           '<p>' + action + '</p>' +
           '</div>' +
           '</article>';
}

/* ============================================================
   7. ЛЕНДИНГ МОДУЛЯ: обзор + сетка занятий
   ============================================================ */

function renderModuleLanding(mod) {
    if (!mod.lessons || !mod.lessons.length) {
        return '<h2>' + mod.title + '</h2>' +
               '<p>Этот модуль находится в разработке. Занятия появятся позже.</p>' +
               '<p><button class="btn" onclick="switchPage(\'home\')">← Все модули</button></p>';
    }

    const lessonCards = mod.lessons.map(function (lesson) {
        return '<article class="lesson-card">' +
               '<h4>Занятие ' + lesson.num + '. ' + lesson.title + '</h4>' +
               '<p class="lesson-subtitle"><em>' + lesson.subtitle + '</em></p>' +
               '<p class="lesson-meta-inline">' +
               '<span class="lesson-minutes">' + lesson.minutes + ' мин</span>' +
               (lesson.tags ? ' · ' + lesson.tags.map(function (t) {
                   return '<span class="tag">' + t + '</span>';
               }).join(' ') : '') +
               '</p>' +
               '<p><button class="btn" onclick="switchPage(\'lesson-' + lesson.id + '\')">Открыть</button></p>' +
               '</article>';
    }).join('');

    const toolsBtn = mod.hasTools
        ? '<p><button class="btn" onclick="switchPage(\'tools-' + mod.id + '\')">🧮 ' + (mod.toolsTitle || 'Инструменты') + '</button></p>'
        : '';

    const meta = mod.meta
        ? '<p class="module-meta">📘 ' + mod.meta.hours + ' ч · ' + mod.meta.weeks + ' недель · уровень: ' + mod.meta.level + '</p>'
        : '';

    return '<div class="module-landing">' +
           '<p><button class="btn btn-secondary" onclick="switchPage(\'home\')">← Все модули</button></p>' +
           '<h2>' + mod.icon + ' ' + mod.title + '</h2>' +
           '<p class="module-subtitle"><em>' + mod.subtitle + '</em></p>' +
           '<p>' + mod.description + '</p>' +
           meta +
           toolsBtn +
           '<hr>' +
           '<h3>Занятия модуля (' + mod.lessons.length + ')</h3>' +
           '<div class="lessons-grid">' + lessonCards + '</div>' +
           '</div>';
}

/* ============================================================
   8. САЙДБАР: список модулей (на главной)
   ============================================================ */

function renderModulesSidebar() {
    const cards = MODULES.map(function (mod) {
        const cls = 'aside-btn' + (mod.status === 'soon' ? ' soon' : '');
        const action = mod.status === 'soon'
            ? 'disabled'
            : 'onclick="switchPage(\'module-' + mod.id + '\')"';
        const count = mod.lessons
            ? ' <span class="badge">' + mod.lessons.length + ' занятий</span>'
            : ' <span class="badge">скоро</span>';
        return '<button class="' + cls + '" ' + action + '>' +
               mod.icon + ' ' + mod.title + count + '</button>';
    }).join('');

    return '<h3>Учебные модули</h3>' +
           '<nav>' + cards + '</nav>' +
           '<section class="progress-box">' +
           '<h4>Платформа:</h4>' +
           '<p>' + MODULES.filter(function (m) { return m.status === 'available'; }).length +
           ' из ' + MODULES.length + ' модулей доступно</p>' +
           '</section>';
}

/* ============================================================
   9. САЙДБАР: навигация внутри модуля
   ============================================================ */

function renderModuleSidebar(mod, currentLessonId) {
    const back = '<p><button class="aside-btn" onclick="switchPage(\'home\')">← Все модули</button></p>';

    const lessons = mod.lessons ? mod.lessons.map(function (lesson) {
        const done = userProgress[lesson.id];
        const badgeCls = done ? 'badge success' : 'badge';
        const badgeTxt = done ? '[пройдено]' : '[не пройдено]';
        const active = (lesson.id === currentLessonId) ? ' active' : '';
        return '<button id="btn-progress-' + lesson.id + '" class="aside-btn' + active + '" ' +
               'onclick="switchPage(\'lesson-' + lesson.id + '\')">' +
               'Занятие ' + lesson.num + ': ' + lesson.title +
               ' <span class="' + badgeCls + '">' + badgeTxt + '</span>' +
               '</button>';
    }).join('') : '<p>Занятия в разработке.</p>';

    const tools = mod.hasTools
        ? '<p><button class="aside-btn" onclick="switchPage(\'tools-' + mod.id + '\')">🧮 ' + (mod.toolsTitle || 'Инструменты') + '</button></p>'
        : '';

    const done = mod.lessons
        ? mod.lessons.filter(function (l) { return userProgress[l.id]; }).length
        : 0;
    const total = mod.lessons ? mod.lessons.length : 0;

    return back +
           '<h3>' + mod.icon + ' ' + mod.title + '</h3>' +
           '<nav>' + lessons + '</nav>' +
           tools +
           '<section class="progress-box">' +
           '<h4>Прогресс модуля:</h4>' +
           '<p>Пройдено: <strong id="progress-counter">' + done + ' из ' + total + '</strong></p>' +
           '<div class="progress-bar"><div class="progress-bar-fill" style="width:' +
           (total > 0 ? Math.round(done / total * 100) : 0) + '%"></div></div>' +
           '<button class="aside-btn reset" onclick="resetProgress()">Сбросить прогресс</button>' +
           '</section>';
}