/* ============================================================
   RENDERER.JS — превращает данные модулей и занятий в HTML
   ============================================================ */

function renderBlock(sec) {
    switch (sec.type) {
        case 'p': return '<p>' + sec.text + '</p>';
        case 'h3': return '<h3>' + sec.text + '</h3>';
        case 'code': return '<p class="code-text">' + sec.text + '</p>';
        case 'info': return '<p class="info-text">' + sec.text + '</p>';
        case 'image': {
            const svg = (typeof QUANTUM_DIAGRAMS !== 'undefined' && QUANTUM_DIAGRAMS[sec.src])
                ? QUANTUM_DIAGRAMS[sec.src]
                : '<p><em>[изображение недоступно: ' + (sec.src || '') + ']</em></p>';
            const caption = sec.caption ? '<figcaption>' + sec.caption + '</figcaption>' : '';
            return '<figure class="lesson-figure">' + svg + caption + '</figure>';
        }
        case 'list': return '<ul>' + sec.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
        case 'numlist': return '<ol>' + sec.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ol>';
        case 'example':
            return '<div class="info-text example"><strong>' + sec.title + '</strong>' +
                   '<ol>' + sec.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></div>';
        default: return '';
    }
}

function renderQuiz(lesson) {
    if (!lesson.quiz) return '';
    const questions = Array.isArray(lesson.quiz) ? lesson.quiz : [lesson.quiz];
    const blocks = questions.map(function (q, qIndex) {
        const qname = 'quiz_' + lesson.id + '_' + qIndex;
        const rid = 'res_' + lesson.id + '_' + qIndex;
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
            ? '<p><strong>Вопрос ' + (qIndex + 1) + ' из ' + questions.length + ':</strong></p>' : '';
        return '<div class="quiz-question">' + prefix +
               '<p>' + q.question + '</p><p>' + options + '</p>' +
               '<button class="btn" onclick="checkQuiz(\'' + qname + '\', \'' + rid + '\', \'' + lesson.id + '\')">Проверить ответ</button>' +
               '<p id="' + rid + '" class="quiz-status"></p>' + hint + '</div>';
    }).join('<hr class="quiz-divider">');
    return '<section class="quiz-box"><h4>Контрольное задание занятия ' + lesson.num + ':</h4>' + blocks + '</section>';
}

function renderHomework(lesson) {
    if (!lesson.homework || !lesson.homework.length) return '';
    return '<h3>Домашнее задание</h3><ol class="homework-list">' +
           lesson.homework.map(function (h) { return '<li>' + h + '</li>'; }).join('') + '</ol>';
}

function renderLessonNav(mod, lesson) {
    const adj = getAdjacentLessons(mod, lesson.id);
    const parts = ['<nav class="lesson-nav">'];

    if (adj.prev) {
        parts.push('<button class="btn btn-secondary" onclick="switchPage(\'lesson-' + adj.prev.id + '\')" title="' + adj.prev.title + '">← ' + adj.prev.num + '. Предыдущее</button>');
    } else {
        parts.push('<span></span>');
    }

    parts.push('<button class="btn" onclick="switchPage(\'module-' + mod.id + '\')">↑ К модулю</button>');

    if (adj.next) {
        parts.push('<button class="btn btn-secondary" onclick="switchPage(\'lesson-' + adj.next.id + '\')" title="' + adj.next.title + '">Следующее: ' + adj.next.num + '. →</button>');
    } else {
        parts.push('<span></span>');
    }

    parts.push('</nav>');
    parts.push('<p class="lesson-position">Занятие ' + adj.index + ' из ' + adj.total + '</p>');
    return parts.join('');
}

function renderLesson(lesson, mod) {
    const parts = [];
    parts.push('<p class="breadcrumbs"><a href="#home" onclick="switchPage(\'home\'); return false;">Главная</a> › ' +
               '<a href="#module-' + mod.id + '" onclick="switchPage(\'module-' + mod.id + '\'); return false;">' + mod.title + '</a></p>');
    parts.push('<h2>Занятие ' + lesson.num + '. ' + lesson.title + '</h2>');
    parts.push('<p class="lesson-meta"><em>' + lesson.subtitle + '</em>' +
               ' · <span class="lesson-minutes">' + lesson.minutes + ' мин</span>' +
               ' · <span class="lesson-module">' + lesson.module + '</span></p>');
    parts.push('<hr>');
    lesson.sections.forEach(function (sec) { parts.push(renderBlock(sec)); });
    parts.push(renderQuiz(lesson));
    parts.push(renderHomework(lesson));
    parts.push(renderLessonNav(mod, lesson));
    return parts.join('\n');
}

function renderModuleCard(mod) {
    const isSoon = mod.status === 'soon';
    const cardCls = 'module-card' + (isSoon ? ' soon' : '');
    const badge = isSoon
        ? '<span class="module-badge soon">скоро</span>'
        : '<span class="module-badge">' + mod.lessonCount + ' занятий</span>';
    const action = isSoon
        ? '<button class="btn btn-disabled" disabled>В разработке</button>'
        : '<button class="btn" onclick="switchPage(\'module-' + mod.id + '\')">Открыть модуль...</button>';
    const meta = mod.meta
        ? '<p class="module-meta">' + mod.meta.hours + ' ч · ' + mod.meta.weeks + ' недель · ' + mod.meta.level + '</p>'
        : '';
    return '<article class="' + cardCls + '"><div class="module-icon">' + mod.icon + '</div>' +
           '<div class="module-body"><h3>' + mod.title + ' ' + badge + '</h3>' +
           '<p class="module-subtitle"><em>' + mod.subtitle + '</em></p>' +
           '<p>' + mod.description + '</p>' + meta + '<p>' + action + '</p></div></article>';
}

function renderModuleLanding(mod) {
    const lessons = getModuleLessons(mod);
    if (!lessons.length) {
        return '<h2>' + mod.title + '</h2><p>Модуль в разработке.</p>';
    }
    const lessonCards = lessons.map(function (lesson) {
        return '<article class="lesson-card"><h4>Занятие ' + lesson.num + '. ' + lesson.title + '</h4>' +
               '<p class="lesson-subtitle"><em>' + lesson.subtitle + '</em></p>' +
               '<p class="lesson-meta-inline"><span class="lesson-minutes">' + lesson.minutes + ' мин</span>' +
               (lesson.tags ? ' · ' + lesson.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join(' ') : '') +
               '</p><p><button class="btn" onclick="switchPage(\'lesson-' + lesson.id + '\')">Открыть</button></p></article>';
    }).join('');

    const toolsBtn = mod.hasTools
        ? '<p><button class="btn" onclick="switchPage(\'tools-' + mod.id + '\')">🧮 ' + (mod.toolsTitle || 'Инструменты') + '</button></p>'
        : '';
    const meta = mod.meta
        ? '<p class="module-meta">📘 ' + mod.meta.hours + ' ч · ' + mod.meta.weeks + ' недель · уровень: ' + mod.meta.level + '</p>'
        : '';

    const adjMod = getAdjacentModules(mod.id);
    const modNav = ['<nav class="module-nav">'];
    if (adjMod.prev) {
        modNav.push('<button class="btn btn-secondary" onclick="switchPage(\'module-' + adjMod.prev.id + '\')">← ' + adjMod.prev.icon + ' ' + adjMod.prev.title + '</button>');
    } else { modNav.push('<span></span>'); }
    modNav.push('<button class="btn" onclick="switchPage(\'home\')">Все модули</button>');
    if (adjMod.next) {
        modNav.push('<button class="btn btn-secondary" onclick="switchPage(\'module-' + adjMod.next.id + '\')">' + adjMod.next.icon + ' ' + adjMod.next.title + ' →</button>');
    } else { modNav.push('<span></span>'); }
    modNav.push('</nav>');

    return '<div class="module-landing">' +
           '<p class="breadcrumbs"><a href="#home" onclick="switchPage(\'home\'); return false;">Главная</a> › ' + mod.title + '</p>' +
           '<h2>' + mod.icon + ' ' + mod.title + '</h2>' +
           '<p class="module-subtitle"><em>' + mod.subtitle + '</em></p>' +
           '<p>' + mod.description + '</p>' + meta + toolsBtn + '<hr>' +
           '<h3>Занятия модуля (' + lessons.length + ')</h3>' +
           '<div class="lessons-grid">' + lessonCards + '</div>' +
           modNav.join('') + '</div>';
}

function renderModulesSidebar() {
    const cards = MODULES.map(function (mod) {
        const cls = 'aside-btn' + (mod.status === 'soon' ? ' soon' : '');
        const action = mod.status === 'soon' ? 'disabled' : 'onclick="switchPage(\'module-' + mod.id + '\')"';
        const count = mod.status === 'soon'
            ? ' <span class="badge">скоро</span>'
            : ' <span class="badge">' + mod.lessonCount + ' занятий</span>';
        return '<button class="' + cls + '" ' + action + '>' + mod.icon + ' ' + mod.title + count + '</button>';
    }).join('');
    return '<h3>Учебные модули</h3><nav>' + cards + '</nav>' +
           '<section class="progress-box"><h4>Платформа:</h4>' +
           '<p>' + MODULES.filter(function (m) { return m.status === 'available'; }).length +
           ' из ' + MODULES.length + ' модулей доступно</p></section>';
}

function renderModuleSidebar(mod, currentLessonId) {
    const back = '<p><button class="aside-btn" onclick="switchPage(\'home\')">← Все модули</button></p>';
    const lessons = getModuleLessons(mod);
    const lessonsHtml = lessons.length ? lessons.map(function (lesson) {
        const done = userProgress[lesson.id];
        const badgeCls = done ? 'badge success' : 'badge';
        const badgeTxt = done ? '[пройдено]' : '[не пройдено]';
        const active = (lesson.id === currentLessonId) ? ' active' : '';
        return '<button id="btn-progress-' + lesson.id + '" class="aside-btn' + active + '" ' +
               'onclick="switchPage(\'lesson-' + lesson.id + '\')">' +
               'Занятие ' + lesson.num + ': ' + lesson.title +
               ' <span class="' + badgeCls + '">' + badgeTxt + '</span></button>';
    }).join('') : '<p>Занятия в разработке.</p>';
    const tools = mod.hasTools
        ? '<p><button class="aside-btn" onclick="switchPage(\'tools-' + mod.id + '\')">🧮 ' + (mod.toolsTitle || 'Инструменты') + '</button></p>'
        : '';
    const done = lessons.filter(function (l) { return userProgress[l.id]; }).length;
    const total = lessons.length;
    return back + '<h3>' + mod.icon + ' ' + mod.title + '</h3><nav>' + lessonsHtml + '</nav>' + tools +
           '<section class="progress-box"><h4>Прогресс модуля:</h4>' +
           '<p>Пройдено: <strong id="progress-counter">' + done + ' из ' + total + '</strong></p>' +
           '<div class="progress-bar"><div class="progress-bar-fill" style="width:' +
           (total > 0 ? Math.round(done / total * 100) : 0) + '%"></div></div>' +
           '<button class="aside-btn reset" onclick="resetProgress()">Сбросить прогресс</button></section>';
}
