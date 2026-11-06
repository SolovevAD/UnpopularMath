function renderBlock(sec) {
    switch (sec.type) {
        case 'p': return '<p>' + sec.text + '</p>';
        case 'h3': return '<h3>' + sec.text + '</h3>';
        case 'code': return '<p class="code-text">' + sec.text + '</p>';
        case 'info': return '<p class="info-text">' + sec.text + '</p>';
        case 'image': {
            const svg = (typeof QUANTUM_DIAGRAMS !== 'undefined' && QUANTUM_DIAGRAMS[sec.src]) ? QUANTUM_DIAGRAMS[sec.src] : '<p><em>[нет]</em></p>';
            return '<figure class="lesson-figure">' + svg + (sec.caption ? '<figcaption>' + sec.caption + '</figcaption>' : '') + '</figure>';
        }
        case 'list': return '<ul>' + sec.items.map(i => '<li>' + i + '</li>').join('') + '</ul>';
        case 'numlist': return '<ol>' + sec.items.map(i => '<li>' + i + '</li>').join('') + '</ol>';
        case 'example': return '<div class="info-text example"><strong>' + sec.title + '</strong><ol>' + sec.steps.map(s => '<li>' + s + '</li>').join('') + '</ol></div>';
        default: return '';
    }
}

function renderQuiz(lesson) {
    if (!lesson.quiz) return '';
    const questions = Array.isArray(lesson.quiz) ? lesson.quiz : [lesson.quiz];
    return '<section class="quiz-box"><h4>Контрольное задание занятия ' + lesson.num + ':</h4>' +
        questions.map((q, idx) => {
            const qname = 'quiz_' + lesson.id + '_' + idx;
            const rid = 'res_' + lesson.id + '_' + idx;
            const opts = q.options.map((opt, i) => `<input type="radio" id="${qname}_${i}" name="${qname}" value="${opt.correct?'correct':'wrong'}"> <label for="${qname}_${i}">${opt.text}</label><br>`).join('');
            return `<div class="quiz-question"><p><strong>Вопрос ${idx+1}:</strong> ${q.question}</p><p>${opts}</p>
                    <button class="btn" onclick="checkQuiz('${qname}', '${rid}', '${lesson.id}')">Проверить</button>
                    <p id="${rid}" class="quiz-status"></p>${q.hint ? `<details class="quiz-hint"><summary>Подсказка</summary><p>${q.hint}</p></details>` : ''}</div>`;
        }).join('<hr class="quiz-divider">') + '</section>';
}

function renderHomework(lesson) {
    if (!lesson.homework || !lesson.homework.length) return '';
    return '<h3>Домашнее задание</h3><ol class="homework-list">' + lesson.homework.map(h => '<li>' + h + '</li>').join('') + '</ol>';
}

function renderLessonNav(mod, lesson) {
    const adj = getAdjacentLessons(mod, lesson.id);
    return `<nav class="lesson-nav">
        ${adj.prev ? `<button class="btn btn-secondary" onclick="switchPage('lesson-${adj.prev.id}')">← ${adj.prev.num}. Предыдущее</button>` : '<span></span>'}
        <button class="btn" onclick="switchPage('module-${mod.id}')">↑ К модулю</button>
        ${adj.next ? `<button class="btn btn-secondary" onclick="switchPage('lesson-${adj.next.id}')">Следующее: ${adj.next.num}. →</button>` : '<span></span>'}
    </nav><p class="lesson-position">Занятие ${adj.index} из ${adj.total}</p>`;
}

function renderLesson(lesson, mod) {
    let html = `<p class="breadcrumbs"><a href="#home" onclick="switchPage('home'); return false;">Главная</a> › <a href="#module-${mod.id}" onclick="switchPage('module-${mod.id}'); return false;">${mod.title}</a></p>`;
    html += `<h2>Занятие ${lesson.num}. ${lesson.title}</h2>`;
    html += `<p class="lesson-meta"><em>${lesson.subtitle}</em> · <span class="lesson-minutes">${lesson.minutes} мин</span></p><hr>`;
    lesson.sections.forEach(sec => { html += renderBlock(sec); });
    html += renderQuiz(lesson);
    html += renderHomework(lesson);
    
    if (typeof renderLessonReactions === 'function') html += renderLessonReactions(lesson.id);
    html += renderLessonNav(mod, lesson);
    html += `<div id="lesson-comments-container-${lesson.id}"></div>`;
    return html;
}

function renderModuleCard(mod) {
    const isSoon = mod.status === 'soon';
    const badge = isSoon ? '<span class="module-badge soon">скоро</span>' : '<span class="module-badge">' + mod.lessonCount + ' занятий</span>';
    const action = isSoon ? '<button class="btn btn-disabled" disabled>В разработке</button>' : `<button class="btn" onclick="switchPage('module-${mod.id}')">Открыть модуль...</button>`;
    const meta = mod.meta ? `<p class="module-meta">${mod.meta.hours} ч · ${mod.meta.weeks} недель · ${mod.meta.level}</p>` : '';
    
    let favBtn = '';
    if (!isSoon && typeof isFavorite === 'function') {
        favBtn = `<button class="btn-fav ${isFavorite(mod.id) ? 'active' : ''}" onclick="toggleFavorite('${mod.id}', event)" title="В избранное">★</button>`;
    }

    return `<article class="module-card ${isSoon?'soon':''}">
        ${favBtn}
        <div class="module-icon">${mod.icon}</div>
        <div class="module-body"><h3>${mod.title} ${badge}</h3>
        <p class="module-subtitle"><em>${mod.subtitle}</em></p><p>${mod.description}</p>${meta}<p>${action}</p></div></article>`;
}

function renderModuleLanding(mod) {
    const allLessons = getModuleLessons(mod);
    const lessons = allLessons.filter(l => typeof isVisibleLesson !== 'function' || isVisibleLesson(l.id));
    
    if (!lessons.length) return `<h2>${mod.title}</h2><p>Модуль в разработке или скрыт.</p>`;
    
    const lessonCards = lessons.map(l => `
        <article class="lesson-card">
            <h4>Занятие ${l.num}. ${l.title}</h4>
            <p class="lesson-subtitle"><em>${l.subtitle}</em></p>
            <p class="lesson-meta-inline"><span class="lesson-minutes">${l.minutes} мин</span></p>
            <p><button class="btn" onclick="switchPage('lesson-${l.id}')">Открыть</button></p>
        </article>`).join('');

    let continueBtn = '';
    if (currentUser) {
        const completedCount = lessons.filter(l => userProgress[l.id]).length;
        const nextLesson = lessons.find(l => !userProgress[l.id]);
        
        if (nextLesson) {
            const btnText = completedCount === 0 ? '▶ Начать обучение' : '▶ Продолжить обучение';
            continueBtn = `<div style="margin-bottom:20px;"><button class="btn" style="background:#10b981;" onclick="switchPage('lesson-${nextLesson.id}')">${btnText} (Занятие ${nextLesson.num})</button></div>`;
        } else {
            continueBtn = `<div style="margin-bottom:20px;"><button class="btn btn-disabled" disabled>🎉 Курс полностью пройден!</button></div>`;
        }
    }

    let favBtn = '';
    if (typeof isFavorite === 'function') {
        favBtn = `<button class="btn-fav ${isFavorite(mod.id) ? 'active' : ''}" onclick="toggleFavorite('${mod.id}', event)" title="В избранное">★</button>`;
    }

    const toolsBtn = mod.hasTools ? `<p><button class="btn" onclick="switchPage('tools-${mod.id}')">🧮 ${mod.toolsTitle || 'Инструменты'}</button></p>` : '';
    const meta = mod.meta ? `<p class="module-meta">📘 ${mod.meta.hours} ч · ${mod.meta.weeks} недель</p>` : '';
    
    const adjMod = getAdjacentModules(mod.id);
    const modNav = `<nav class="module-nav">
        ${adjMod.prev ? `<button class="btn btn-secondary" onclick="switchPage('module-${adjMod.prev.id}')">← ${adjMod.prev.title}</button>` : '<span></span>'}
        <button class="btn" onclick="switchPage('home')">Все модули</button>
        ${adjMod.next ? `<button class="btn btn-secondary" onclick="switchPage('module-${adjMod.next.id}')">${adjMod.next.title} →</button>` : '<span></span>'}
    </nav>`;

    let html = `<div class="module-landing" style="position:relative;">
        ${favBtn}
        <p class="breadcrumbs"><a href="#home" onclick="switchPage('home'); return false;">Главная</a> › ${mod.title}</p>
        <h2>${mod.icon} ${mod.title}</h2>
        <p class="module-subtitle"><em>${mod.subtitle}</em></p>
        <p>${mod.description}</p>${meta}${toolsBtn}
        <hr>
        ${continueBtn}
        <h3>Занятия модуля (${lessons.length})</h3>
        <div class="lessons-grid">${lessonCards}</div>
        
        ${(typeof renderModuleAggregate === 'function') ? renderModuleAggregate(mod.id) : ''}
        ${modNav}
        <div id="module-comments-container-${mod.id}"></div>
    </div>`;
    return html;
}

function renderModulesSidebar() {
    const visibleModules = MODULES.filter(m => typeof isVisibleModule !== 'function' || isVisibleModule(m.id));
    const publishedCount = visibleModules.filter(m => m.status === 'available').length;

    // Асинхронно подгружаем количество пользователей
    setTimeout(async () => {
        const el = document.getElementById('platform-stats');
        if (!el || !window.FB) return;
        try {
            const { db, collection, getDocs } = window.FB;
            const snap = await getDocs(collection(db, "users"));
            el.innerHTML = `<p>Доступно модулей: <strong>${publishedCount}</strong></p><p>Пользователей: <strong>${snap.size}</strong></p>`;
        } catch(e) {
            el.innerHTML = `<p>Доступно модулей: <strong>${publishedCount}</strong></p>`;
        }
    }, 100);

    return `<h3>Учебные модули</h3><nav>${visibleModules.map(mod => `
        <button class="aside-btn ${mod.status==='soon'?'soon':''}" ${mod.status==='soon'?'disabled':`onclick="switchPage('module-${mod.id}')"`}>
            ${mod.icon} ${mod.title} <span class="badge">${mod.status==='soon'?'скоро':mod.lessonCount+' занятий'}</span>
        </button>`).join('')}</nav>
        <section class="progress-box" id="platform-stats">
            <h4>Платформа:</h4>
            <p>Доступно модулей: <strong>${publishedCount}</strong></p>
        </section>`;
}

function renderModuleSidebar(mod, currentLessonId) {
    const allLessons = getModuleLessons(mod);
    const lessons = allLessons.filter(l => typeof isVisibleLesson !== 'function' || isVisibleLesson(l.id));
    
    const lessonsHtml = lessons.map(l => `
        <button class="aside-btn ${l.id===currentLessonId?'active':''}" onclick="switchPage('lesson-${l.id}')">
            Занятие ${l.num}: ${l.title} <span class="badge ${userProgress[l.id]?'success':''}">${userProgress[l.id]?'[пройдено]':'[не пройдено]'}</span>
        </button>`).join('');
    
    const done = lessons.filter(l => userProgress[l.id]).length;
    const total = lessons.length;
    
    return `<p><button class="aside-btn" onclick="switchPage('home')">← Все модули</button></p>
        <h3>${mod.icon} ${mod.title}</h3><nav>${lessonsHtml}</nav>
        ${mod.hasTools ? `<p><button class="aside-btn" onclick="switchPage('tools-${mod.id}')">🧮 Инструменты</button></p>` : ''}
        <section class="progress-box"><h4>Прогресс:</h4><p>Пройдено: <strong>${done} из ${total}</strong></p>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${total>0?Math.round(done/total*100):0}%"></div></div>
        <button class="aside-btn reset" onclick="resetProgress()">Сбросить</button></section>`;
}

async function renderProfilePage(targetUid, isOwnProfile) {
    const data = await getUserProfileData(targetUid);
    const user = data.userObj;
    
    let completedCourses = 0;
    MODULES.forEach(mod => {
        if (mod.status === 'available' && mod.lessons) {
            const allDone = mod.lessons.every(l => userProgress[l.id]);
            if (allDone) completedCourses++;
        }
    });

    let favoritesHtml = '<p style="color:#64748b;">Пока нет избранных курсов.</p>';
    if (isOwnProfile && data.favorites && data.favorites.length > 0) {
        favoritesHtml = '<div class="favorites-grid">';
        data.favorites.forEach(modId => {
            const mod = MODULES.find(m => m.id === modId);
            if (mod) {
                favoritesHtml += `
                    <div class="favorite-card">
                        <h4>${mod.icon} ${mod.title}</h4>
                        <button class="btn btn-secondary" style="margin-top:10px; font-size:12px; padding: 5px 10px;" onclick="switchPage('module-${mod.id}')">Перейти</button>
                    </div>
                `;
            }
        });
        favoritesHtml += '</div>';
    }

    let commentsHtml = '';
    if (data.userComments.length > 0) {
        commentsHtml = '<div class="profile-comments-list">';
        data.userComments.forEach(c => {
            const type = c.targetType === 'module' ? 'Отзыв на модуль' : 'Комментарий';
            const status = c.status === 'approved' ? '✅ Одобрено' : (c.status === 'rejected' ? '❌ Отклонено' : '⏳ На модерации');
            const link = c.targetType === 'module' ? `module-${c.targetId}` : `lesson-${c.targetId}`;
            
            commentsHtml += `
                <div class="profile-comment-item" onclick="switchPage('${link}')">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="font-weight:bold; color:var(--accent-color);">${type}</span>
                        <span style="font-size:0.85em; color:#64748b;">${status}</span>
                    </div>
                    <div class="comment-text">${c.text}</div>
                </div>
            `;
        });
        commentsHtml += '</div>';
    } else {
        commentsHtml = '<p style="color:#64748b;">Пока нет отзывов или комментариев.</p>';
    }

    const defaultAvatar = 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg';
    const emailHtml = isOwnProfile ? `<p style="color:#64748b;">${user.email || ''}</p>` : '';

    return `
        <div class="profile-header">
            <img src="${user.picture || defaultAvatar}" alt="Avatar" class="profile-avatar" onerror="this.src='${defaultAvatar}'">
            <div>
                <h2 style="margin-bottom:5px;">${user.name || 'Пользователь'}</h2>
                ${emailHtml}
                <div class="profile-karma">🌟 Карма: ${data.karma}</div>
            </div>
        </div>
        
        <div class="profile-stats-grid">
            <div class="stat-card">
                <div class="stat-number">${completedCourses}</div>
                <div class="stat-label">Курсов пройдено</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.userComments.length}</div>
                <div class="stat-label">Всего отзывов</div>
            </div>
        </div>

        <div class="profile-section">
            <h3>⭐ Избранные курсы</h3>
            ${favoritesHtml}
        </div>

        <div class="profile-section">
            <h3>📝 Отзывы и комментарии</h3>
            ${commentsHtml}
        </div>
    `;
}