/* ============================================================
   MODERATOR.JS — Реакции, комментарии и модератор (Firebase)
   ============================================================ */

const REACTIONS_KEY = 'numbers_reactions';
const DRAFTS_KEY    = 'numbers_drafts';
const MODERATOR_KEY = 'numbers_moderator';

/* ⚠️ УКАЖИТЕ СВОИ EMAIL ЗДЕСЬ */
const ALLOWED_MOD_EMAILS = [
    '31arseni@mail.ru',
    'admin@example.com'
];

let REACTIONS = JSON.parse(localStorage.getItem(REACTIONS_KEY) || '{}');
let DRAFTS    = JSON.parse(localStorage.getItem(DRAFTS_KEY)    || '{"modules":[],"lessons":[],"tools":[]}');
let USER_VOTES = {}; // Хранит голоса текущего пользователя { lessonId: 'like' | 'dislike' }
let isModerator = localStorage.getItem(MODERATOR_KEY) === 'on';
let fbReady = false;

// Ждем Firebase
window.addEventListener('firebase-ready', () => {
    fbReady = true;
    initFirestoreListeners();
    initModerator();
});

function saveReactionsLocal() { localStorage.setItem(REACTIONS_KEY, JSON.stringify(REACTIONS)); }
function saveDraftsLocal()    { localStorage.setItem(DRAFTS_KEY,    JSON.stringify(DRAFTS));    }

function isLessonDraft(id) { return DRAFTS.lessons.indexOf(id) !== -1; }
function isModuleDraft(id) { return DRAFTS.modules.indexOf(id) !== -1; }
function isToolsDraft(id)  { return DRAFTS.tools.indexOf(id)   !== -1; }

function isVisibleModule(id) { return isModerator || !isModuleDraft(id); }
function isVisibleLesson(id) { return isModerator || !isLessonDraft(id); }
function isVisibleTools(id)  { return isModerator || !isToolsDraft(id);  }

/* ============================================================
   СИНХРОНИЗАЦИЯ С FIRESTORE
   ============================================================ */
function initFirestoreListeners() {
    const { db, doc, onSnapshot, collection } = window.FB;

    // 1. Слушаем черновики
    onSnapshot(doc(db, "config", "drafts"), (snap) => {
        if (snap.exists()) {
            DRAFTS = snap.data();
            saveDraftsLocal();
            if (typeof buildHomeModules === 'function') buildHomeModules();
            if (typeof updateSidebar === 'function') updateSidebar((location.hash || '#home').slice(1));
        }
    });

    // 2. Слушаем реакции занятий
    onSnapshot(collection(db, "reactions"), (snap) => {
        snap.forEach(doc => {
            REACTIONS[doc.id] = doc.data();
        });
        saveReactionsLocal();
        
        // Обновляем UI, если открыто занятие
        const hash = (location.hash || '').slice(1);
        if (hash.startsWith('lesson-')) {
            const lessonId = hash.slice(7);
            const box = document.getElementById('reactions-box-' + lessonId);
            if (box) box.outerHTML = renderLessonReactions(lessonId);
        }
        refreshModuleAggregates();
    });

    // 3. Слушаем личные голоса пользователя (чтобы отображать активную кнопку)
    window.FB.onAuthStateChanged(window.FB.auth, (user) => {
        if (user) {
            const q = window.FB.query(window.FB.collection(db, "votes"), window.FB.where("userId", "==", user.uid));
            window.FB.onSnapshot(q, (snap) => {
                USER_VOTES = {};
                snap.forEach(doc => {
                    const data = doc.data();
                    USER_VOTES[data.lessonId] = data.type;
                });
                // Обновляем UI
                const hash = (location.hash || '').slice(1);
                if (hash.startsWith('lesson-')) {
                    const lessonId = hash.slice(7);
                    const box = document.getElementById('reactions-box-' + lessonId);
                    if (box) box.outerHTML = renderLessonReactions(lessonId);
                }
            });
        } else {
            USER_VOTES = {};
        }
    });
}

/* ============================================================
   РЕАКЦИИ НА ЗАНЯТИЯ
   ============================================================ */
function renderLessonReactions(lessonId) {
    const r = REACTIONS[lessonId] || { likes: 0, dislikes: 0 };
    const userVote = USER_VOTES[lessonId];
    const likeA = userVote === 'like'    ? ' active' : '';
    const disA  = userVote === 'dislike' ? ' active' : '';
    const draft = isLessonDraft(lessonId) ? '<span class="draft-mark">черновик</span>' : '';
    
    return '<section class="reactions-box" id="reactions-box-' + lessonId + '">' +
           '<h4>Оцените занятие ' + draft + '</h4>' +
           '<div class="reactions-row">' +
           '<button class="reaction-btn like' + likeA + '" onclick="voteLesson(\'' + lessonId + '\',\'like\')" title="Понравилось">👍 <span>' + (r.likes || 0) + '</span></button>' +
           '<button class="reaction-btn dislike' + disA + '" onclick="voteLesson(\'' + lessonId + '\',\'dislike\')" title="Не понравилось">👎 <span>' + (r.dislikes || 0) + '</span></button>' +
           '</div>' +
           '</section>';
}

async function voteLesson(lessonId, type) {
    if (!currentUser) {
        alert('Пожалуйста, войдите через Google, чтобы оценивать занятия.');
        return;
    }
    
    const { db, doc, getDoc, setDoc, deleteDoc, updateDoc, increment, collection, query, where, getDocs } = window.FB;
    const voteId = currentUser.uid + '_' + lessonId;
    const voteRef = doc(db, "votes", voteId);
    const reactionRef = doc(db, "reactions", lessonId);
    
    const existingVoteSnap = await getDoc(voteRef);
    const existingVote = existingVoteSnap.exists() ? existingVoteSnap.data().type : null;

    // Если нажали на ту же кнопку — отменяем голос
    if (existingVote === type) {
        await deleteDoc(voteRef);
        await updateDoc(reactionRef, { [type + 's']: increment(-1) }).catch(async () => {
            // Если документа с реакциями еще нет
            await setDoc(reactionRef, { likes: type === 'like' ? 0 : 0, dislikes: type === 'dislike' ? 0 : 0 });
            await updateDoc(reactionRef, { [type + 's']: increment(-1) });
        });
    } else {
        // Меняем голос
        await setDoc(voteRef, { userId: currentUser.uid, lessonId, type });
        
        // Уменьшаем старый
        if (existingVote) {
            await updateDoc(reactionRef, { [existingVote + 's']: increment(-1) }).catch(() => {});
        }
        // Увеличиваем новый
        await updateDoc(reactionRef, { [type + 's']: increment(1) }).catch(async () => {
            await setDoc(reactionRef, { likes: 0, dislikes: 0 });
            await updateDoc(reactionRef, { [type + 's']: increment(1) });
        });
    }
}

/* ============================================================
   АГРЕГАТ РЕАКЦИЙ МОДУЛЯ
   ============================================================ */
function buildModuleAggregateInner(moduleId) {
    const prefixMap = { 'quantum-computer': 'q-', 'boolean-algebra': 'l-', 'graphs': 'g-' };
    const prefix = prefixMap[moduleId];
    let ids = [];
    if (!prefix) {
        if (typeof COURSE !== 'undefined' && Array.isArray(COURSE)) ids = COURSE.map(function(l) { return l.id; });
    } else {
        Object.keys(REACTIONS).forEach(function(k) { if (k.indexOf(prefix) === 0) ids.push(k); });
    }
    let likes = 0, dislikes = 0;
    ids.forEach(function(id) {
        const r = REACTIONS[id];
        if (r) { likes += r.likes || 0; dislikes += r.dislikes || 0; }
    });
    return '<div class="reactions-row"><span class="reaction-stat">👍 ' + likes + '</span><span class="reaction-stat">👎 ' + dislikes + '</span></div>' +
           '<p class="comments-stub">💬 Комментарии временно отключены — скоро появятся здесь.</p>';
}

function renderModuleAggregate(moduleId) {
    return '<section class="module-reactions" data-module-reactions="' + moduleId + '"><h4>Реакции модуля</h4>' + buildModuleAggregateInner(moduleId) + '</section>';
}

function refreshModuleAggregates() {
    document.querySelectorAll('[data-module-reactions]').forEach(function(el) {
        el.innerHTML = '<h4>Реакции модуля</h4>' + buildModuleAggregateInner(el.getAttribute('data-module-reactions'));
    });
}

function renderCommentsBlock(moduleId) {
    return '<section class="comments-block"><h4>💬 Комментарии</h4><div class="comments-stub"><p><strong>Комментарии временно отключены.</strong></p><p class="stub-note">В будущем здесь появится форма для отзывов.</p></div></section>';
}

/* ============================================================
   РЕЖИМ МОДЕРАТОРА
   ============================================================ */
const KONAMI = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
const MOD_PASSWORD = 'chisla2026';
let _konamiBuf = [];

function initModerator() {
    document.addEventListener('keydown', function(e) {
        let key = e.key.toLowerCase();
        _konamiBuf.push(key);
        if (_konamiBuf.length > KONAMI.length) _konamiBuf.shift();
        if (_konamiBuf.length === KONAMI.length) {
            let ok = true;
            for (let i = 0; i < KONAMI.length; i++) { if (_konamiBuf[i] !== KONAMI[i]) { ok = false; break; } }
            if (ok) { _konamiBuf = []; askModeratorPassword(); }
        }
    });
    if (isModerator) renderModeratorUI();
}

function askModeratorPassword() {
    if (isModerator) { toggleModPanel(); return; }

    if (currentUser) {
        if (ALLOWED_MOD_EMAILS.includes(currentUser.email)) {
            isModerator = true;
            localStorage.setItem(MODERATOR_KEY, 'on');
            renderModeratorUI();
            if (typeof buildHomeModules === 'function') buildHomeModules();
            if (typeof updateSidebar === 'function') updateSidebar((location.hash || '#home').slice(1));
            alert('Режим модератора активирован (Google).');
        } else {
            alert('Доступ запрещён. Ваш email (' + currentUser.email + ') не в списке.');
        }
        return;
    }

    const pass = prompt('Введите пароль модератора:');
    if (pass === MOD_PASSWORD) {
        isModerator = true;
        localStorage.setItem(MODERATOR_KEY, 'on');
        renderModeratorUI();
        if (typeof buildHomeModules === 'function') buildHomeModules();
        if (typeof updateSidebar === 'function') updateSidebar((location.hash || '#home').slice(1));
    } else if (pass !== null) {
        alert('Неверный пароль.');
    }
}

function exitModerator() {
    if (!confirm('Выйти из режима модератора?')) return;
    isModerator = false;
    localStorage.setItem(MODERATOR_KEY, 'off');
    const panel = document.getElementById('mod-panel');
    if (panel) panel.remove();
    if (typeof buildHomeModules === 'function') buildHomeModules();
    if (typeof updateSidebar === 'function') updateSidebar((location.hash || '#home').slice(1));
}

function toggleModPanel() {
    const panel = document.getElementById('mod-panel');
    if (!panel) { renderModeratorUI(); return; }
    panel.classList.toggle('collapsed');
}

function renderModeratorUI() {
    const existing = document.getElementById('mod-panel');
    if (existing) existing.remove();
    const panel = document.createElement('div');
    panel.id = 'mod-panel';
    panel.className = 'mod-panel';
    panel.innerHTML = buildModPanelHTML();
    document.body.appendChild(panel);
}

function buildModPanelHTML() {
    let h = '<div class="mod-header"><span>🛠 Модератор</span><button class="mod-icon-btn" onclick="toggleModPanel()" title="Свернуть">—</button><button class="mod-icon-btn mod-exit" onclick="exitModerator()" title="Выйти">✕</button></div><div class="mod-body"><p class="mod-hint">Снятая галочка скрывает элемент от обычных посетителей.</p>';
    MODULES.forEach(function(mod) {
        h += '<div class="mod-row"><label class="mod-toggle"><input type="checkbox" ' + (isModuleDraft(mod.id) ? '' : 'checked') + ' onchange="toggleModModule(\'' + mod.id + '\')"><span>' + mod.icon + ' ' + mod.title + '</span></label>';
        if (mod.hasTools) h += '<label class="mod-toggle small"><input type="checkbox" ' + (isToolsDraft(mod.id) ? '' : 'checked') + ' onchange="toggleModTools(\'' + mod.id + '\')"><span>🧮 тренажёр</span></label>';
        if (mod.status === 'available' && mod.lessonCount) h += '<button class="mod-expand" onclick="expandModLessons(\'' + mod.id + '\')">занятия ▾</button><div class="mod-lessons" id="mod-lessons-' + mod.id + '" style="display:none;"></div>';
        h += '</div>';
    });
    return h + '</div>';
}

function expandModLessons(moduleId) {
    const box = document.getElementById('mod-lessons-' + moduleId);
    if (!box) return;
    if (box.style.display === 'none') {
        const mod = MODULES.find(function(m) { return m.id === moduleId; });
        if (!mod) return;
        ensureModuleLoaded(mod).then(function() {
            const lessons = getModuleLessons(mod);
            box.innerHTML = lessons.length ? lessons.map(function(l) {
                return '<label class="mod-toggle small"><input type="checkbox" ' + (isLessonDraft(l.id) ? '' : 'checked') + ' onchange="toggleModLesson(\'' + l.id + '\')"><span>Занятие ' + l.num + ': ' + l.title + '</span></label>';
            }).join('') : '<p class="mod-hint">Нет данных.</p>';
            box.style.display = 'block';
        });
    } else { box.style.display = 'none'; }
}

async function updateDraftsDB() {
    if (!fbReady) return;
    const { db, doc, setDoc } = window.FB;
    await setDoc(doc(db, "config", "drafts"), DRAFTS);
}

function toggleModModule(id) {
    const i = DRAFTS.modules.indexOf(id);
    if (i === -1) DRAFTS.modules.push(id); else DRAFTS.modules.splice(i, 1);
    saveDraftsLocal(); updateDraftsDB(); afterDraftChange();
}
function toggleModLesson(id) {
    const i = DRAFTS.lessons.indexOf(id);
    if (i === -1) DRAFTS.lessons.push(id); else DRAFTS.lessons.splice(i, 1);
    saveDraftsLocal(); updateDraftsDB(); afterDraftChange();
}
function toggleModTools(id) {
    const i = DRAFTS.tools.indexOf(id);
    if (i === -1) DRAFTS.tools.push(id); else DRAFTS.tools.splice(i, 1);
    saveDraftsLocal(); updateDraftsDB(); afterDraftChange();
}
function afterDraftChange() {
    if (typeof buildHomeModules === 'function') buildHomeModules();
    if (typeof updateSidebar === 'function') updateSidebar((location.hash || '#home').slice(1));
}
