const REACTIONS_KEY = 'numbers_reactions';
const DRAFTS_KEY    = 'numbers_drafts';
const FAVS_KEY      = 'numbers_favorites';
const MODERATOR_KEY = 'numbers_moderator';
const ALLOWED_MOD_EMAILS = ['31arseni@mail.ru'];

let REACTIONS = JSON.parse(localStorage.getItem(REACTIONS_KEY) || '{}');
let DRAFTS    = JSON.parse(localStorage.getItem(DRAFTS_KEY)    || '{"modules":[],"lessons":[],"tools":[]}');
let FAVS      = JSON.parse(localStorage.getItem(FAVS_KEY)      || '[]');
let USER_VOTES = {}; 
let USER_COMMENT_VOTES = {}; 
let isModerator = localStorage.getItem(MODERATOR_KEY) === 'on';
let fbReady = false;

window.addEventListener('firebase-ready', () => {
    fbReady = true;
    initFirestoreListeners();
    if (isModerator) renderModeratorUI();
});

function saveReactionsLocal() { localStorage.setItem(REACTIONS_KEY, JSON.stringify(REACTIONS)); }
function saveDraftsLocal()    { localStorage.setItem(DRAFTS_KEY,    JSON.stringify(DRAFTS));    }
function saveFavsLocal()      { localStorage.setItem(FAVS_KEY,      JSON.stringify(FAVS));      }

function isLessonDraft(id) { return DRAFTS.lessons.indexOf(id) !== -1; }
function isModuleDraft(id) { return DRAFTS.modules.indexOf(id) !== -1; }
function isVisibleModule(id) { return isModerator || !isModuleDraft(id); }
function isVisibleLesson(id) { return isModerator || !isLessonDraft(id); }
function isFavorite(modId) { return FAVS.includes(modId); }

function toggleFavorite(modId, event) {
    if (event) event.stopPropagation();
    if (!currentUser) return alert('Войдите, чтобы добавлять в избранное.');
    const i = FAVS.indexOf(modId);
    if (i === -1) FAVS.push(modId); else FAVS.splice(i, 1);
    saveFavsLocal();
    refreshUI();
}

/* --- ЛАЙКИ ЗАНЯТИЙ --- */
function renderLessonReactions(lessonId) {
    const r = REACTIONS[lessonId] || { likes: 0, dislikes: 0 };
    const userVote = USER_VOTES[lessonId];
    const likeA = userVote === 'like'    ? ' active' : '';
    const disA  = userVote === 'dislike' ? ' active' : '';
    
    let supportBtn = '';
    if (currentUser && (!ALLOWED_MOD_EMAILS.includes(currentUser.email) || !isModerator)) {
        supportBtn = `<button class="btn-support" onclick="contactSupport('${lessonId}')">🛠 Обратиться к модерации</button>`;
    }

    return `<section class="reactions-box" id="reactions-box-${lessonId}">
        <h4>Оцените занятие</h4>
        <div class="reactions-row">
            <button class="reaction-btn like${likeA}" onclick="voteLesson('${lessonId}','like')">👍 <span>${r.likes || 0}</span></button>
            <button class="reaction-btn dislike${disA}" onclick="voteLesson('${lessonId}','dislike')">👎 <span>${r.dislikes || 0}</span></button>
            ${supportBtn}
        </div>
    </section>`;
}

async function voteLesson(lessonId, type) {
    if (!currentUser) { alert('Войдите, чтобы оценивать.'); return; }
    const { db, doc, getDoc, setDoc, deleteDoc, updateDoc, increment } = window.FB;
    const voteId = currentUser.uid + '_' + lessonId;
    const voteRef = doc(db, "votes", voteId);
    const reactionRef = doc(db, "reactions", lessonId);
    
    const existingVoteSnap = await getDoc(voteRef);
    const existingVote = existingVoteSnap.exists() ? existingVoteSnap.data().type : null;

    if (existingVote === type) {
        await deleteDoc(voteRef);
        await updateDoc(reactionRef, { [type + 's']: increment(-1) }).catch(()=>{});
        USER_VOTES[lessonId] = null;
    } else {
        await setDoc(voteRef, { userId: currentUser.uid, lessonId, type });
        if (existingVote) {
            await updateDoc(reactionRef, { [existingVote + 's']: increment(-1) }).catch(()=>{});
        }
        await updateDoc(reactionRef, { [type + 's']: increment(1) }).catch(async () => {
            await setDoc(reactionRef, { likes: 0, dislikes: 0 });
            await updateDoc(reactionRef, { [type + 's']: increment(1) });
        });
        USER_VOTES[lessonId] = type;
    }
    
    const box = document.getElementById('reactions-box-' + lessonId);
    if (box) box.outerHTML = renderLessonReactions(lessonId);
}

/* --- КОММЕНТАРИИ И ВЕТКИ --- */
async function renderCommentsBlock(targetId, targetType = 'module') {
    if (!fbReady) return '<section class="comments-block"><h4>💬 Комментарии</h4><p>Загрузка...</p></section>';
    try {
        const { db, collection, query, where, getDocs } = window.FB;
        const q = query(collection(db, "comments"), where("targetId", "==", targetId));
        const snap = await getDocs(q);
        
        let allComments = [];
        snap.forEach(doc => {
            const c = doc.data();
            c.id = doc.id;
            if (!c.parentId) c.parentId = null;
            if (!c.likes) c.likes = 0;
            if (!c.dislikes) c.dislikes = 0;
            allComments.push(c);
        });

        const visibleComments = isModerator ? allComments : allComments.filter(c => c.status === 'approved');
        const commentTree = buildCommentTree(visibleComments, null);

        let commentsHtml = commentTree.length ? renderCommentTreeWithContext(visibleComments, null, 0) : '<p style="color:#94a3b8; font-style:italic">Пока нет комментариев. Будьте первым!</p>';

        let formHtml = '';
        if (currentUser) {
            formHtml = `<div class="comment-form" style="margin-top:20px;">
                <textarea id="comment-input-${targetId}" placeholder="Оставьте комментарий..."></text` + `area>
                <button class="btn" onclick="submitComment('${targetId}', '${targetType}', null)">Отправить</button>
            </div>`;
        } else {
            formHtml = `<p style="color:#94a3b8; font-style:italic; margin-top:20px;">Войдите, чтобы оставить комментарий.</p>`;
        }

        const title = targetType === 'lesson' ? '💬 Комментарии к занятию' : '💬 Отзывы о модуле';
        return `<section class="comments-block" id="comments-block-${targetId}">
            <h4>${title}</h4>
            <div class="comments-list">${commentsHtml}</div>
            ${formHtml}
        </section>`;
    } catch (error) {
        console.error(error);
        return `<section class="comments-block"><h4>💬 Комментарии</h4><p style="color:#ef4444">Ошибка загрузки.</p></section>`;
    }
}

function buildCommentTree(comments, parentId) {
    return comments.filter(c => c.parentId === parentId).sort((a,b) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0));
}

function renderCommentTreeWithContext(comments, parentId, depth) {
    return comments.filter(c => c.parentId === parentId).sort((a,b) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)).map(c => {
        const vote = USER_COMMENT_VOTES[c.id] || null;
        const likeA = vote === 'like' ? ' active' : '';
        const disA = vote === 'dislike' ? ' active' : '';
        const marginStyle = depth > 0 ? `style="margin-left: 20px; border-left: 2px solid #cbd5e1; padding-left: 15px; margin-top: 10px;"` : `style="margin-top: 10px;"`;
        const replyBtn = currentUser ? `<button class="comment-action-btn" onclick="toggleReplyForm('${c.id}')">Ответить</button>` : '';
        const replyForm = `
            <div class="comment-reply-form" id="reply-form-${c.id}">
                <textarea id="reply-input-${c.id}" placeholder="Ваш ответ..."></text` + `area>
                <button class="btn" onclick="submitComment('${c.targetId}', '${c.targetType}', '${c.id}')">Ответить</button>
            </div>
        `;
        const statusBadge = (isModerator && c.status !== 'approved') ? `<span style="background:#ef4444; color:white; padding:2px 6px; border-radius:4px; font-size:0.7em; margin-left:10px;">${c.status}</span>` : '';
        
        // Кликабельное имя автора
        const authorLink = `<a href="#user-${c.uid}" onclick="event.stopPropagation()" style="color:var(--accent-color); text-decoration:none; font-weight:bold;">${c.author}</a>`;

        return `
            <div class="comment-item" ${marginStyle}>
                <div class="comment-header"><span>${authorLink}</span> <span>${new Date(c.createdAt?.toDate() || Date.now()).toLocaleDateString()}</span>${statusBadge}</div>
                <div class="comment-text">${c.text}</div>
                <div class="comment-actions">
                    <button class="comment-action-btn like ${likeA}" onclick="voteComment('${c.id}', 'like')">👍 <span>${c.likes || 0}</span></button>
                    <button class="comment-action-btn dislike ${disA}" onclick="voteComment('${c.id}', 'dislike')">👎 <span>${c.dislikes || 0}</span></button>
                    ${replyBtn}
                </div>
                ${replyForm}
                ${renderCommentTreeWithContext(comments, c.id, depth + 1)}
            </div>
        `;
    }).join('');
}

async function submitComment(targetId, targetType, parentId) {
    const input = parentId ? document.getElementById('reply-input-' + parentId) : document.getElementById('comment-input-' + targetId);
    const text = input.value.trim();
    if (!text) return alert('Напишите что-нибудь.');
    
    const { db, collection, addDoc, serverTimestamp } = window.FB;
    await addDoc(collection(db, "comments"), {
        targetId, targetType, parentId, text, 
        author: currentUser.name, email: currentUser.email, uid: currentUser.uid,
        createdAt: serverTimestamp(), status: 'pending',
        likes: 0, dislikes: 0
    });
    
    input.value = '';
    if (parentId) toggleReplyForm(parentId);
    alert('Комментарий отправлен на модерацию.');
    refreshUI();
}

function toggleReplyForm(id) {
    const form = document.getElementById('reply-form-' + id);
    if (form) form.classList.toggle('open');
}

async function voteComment(commentId, type) {
    if (!currentUser) return alert('Войдите, чтобы оценивать.');
    const { db, doc, getDoc, setDoc, deleteDoc, updateDoc, increment } = window.FB;
    const voteId = currentUser.uid + '_' + commentId;
    const voteRef = doc(db, "comment_votes", voteId);
    const commentRef = doc(db, "comments", commentId);
    
    const existingVoteSnap = await getDoc(voteRef);
    const existingVote = existingVoteSnap.exists() ? existingVoteSnap.data().type : null;

    if (existingVote === type) {
        await deleteDoc(voteRef);
        await updateDoc(commentRef, { [type + 's']: increment(-1) }).catch(()=>{});
        USER_COMMENT_VOTES[commentId] = null;
    } else {
        await setDoc(voteRef, { userId: currentUser.uid, commentId, type });
        if (existingVote) await updateDoc(commentRef, { [existingVote + 's']: increment(-1) }).catch(()=>{});
        await updateDoc(commentRef, { [type + 's']: increment(1) }).catch(()=>{});
        USER_COMMENT_VOTES[commentId] = type;
    }
    
    const btnLike = document.querySelector(`button[onclick="voteComment('${commentId}', 'like')"]`);
    if (btnLike) {
        const btnDislike = btnLike.nextElementSibling;
        if (USER_COMMENT_VOTES[commentId] === 'like') { btnLike.classList.add('active'); btnDislike.classList.remove('active'); }
        else if (USER_COMMENT_VOTES[commentId] === 'dislike') { btnDislike.classList.add('active'); btnLike.classList.remove('active'); }
        else { btnLike.classList.remove('active'); btnDislike.classList.remove('active'); }
    }
}

/* --- СИСТЕМА --- */
function initFirestoreListeners() {
    const { db, doc, onSnapshot, collection, query, where, auth, onAuthStateChanged } = window.FB;

    onSnapshot(doc(db, "config", "drafts"), (snap) => {
        if (snap.exists()) { DRAFTS = snap.data(); saveDraftsLocal(); refreshUI(); }
    });

    onSnapshot(collection(db, "reactions"), (snap) => {
        snap.forEach(doc => { REACTIONS[doc.id] = doc.data(); });
        saveReactionsLocal();
        const hash = (location.hash || '').slice(1);
        if (hash.startsWith('lesson-')) {
            const box = document.getElementById('reactions-box-' + hash.slice(7));
            if (box && typeof renderLessonReactions === 'function') box.outerHTML = renderLessonReactions(hash.slice(7));
        }
        if (typeof refreshModuleAggregates === 'function') refreshModuleAggregates();
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const qVotes = query(collection(db, "votes"), where("userId", "==", user.uid));
            onSnapshot(qVotes, (snap) => {
                USER_VOTES = {};
                snap.forEach(doc => { USER_VOTES[doc.data().lessonId] = doc.data().type; });
                const hash = (location.hash || '').slice(1);
                if (hash.startsWith('lesson-')) {
                    const box = document.getElementById('reactions-box-' + hash.slice(7));
                    if (box && typeof renderLessonReactions === 'function') box.outerHTML = renderLessonReactions(hash.slice(7));
                }
            });

            const qCVotes = query(collection(db, "comment_votes"), where("userId", "==", user.uid));
            onSnapshot(qCVotes, (snap) => {
                USER_COMMENT_VOTES = {};
                snap.forEach(doc => { USER_COMMENT_VOTES[doc.data().commentId] = doc.data().type; });
                if (location.hash.includes('module-') || location.hash.includes('lesson-')) {
                    refreshUI();
                }
            });
        } else { 
            USER_VOTES = {}; 
            USER_COMMENT_VOTES = {};
        }
    });
}

function refreshUI() {
    if (typeof buildHomeModules === 'function') buildHomeModules();
    if (typeof updateSidebar === 'function') updateSidebar((location.hash || '#home').slice(1));
    if (typeof showPage === 'function') showPage((location.hash || '#home').slice(1));
    if (isModerator) renderDraftsList();
}

async function contactSupport(targetId) {
    if (!currentUser) return alert('Войдите.');
    const text = prompt('Опишите проблему:');
    if (!text || !text.trim()) return;
    const { db, collection, addDoc, serverTimestamp } = window.FB;
    await addDoc(collection(db, "support_tickets"), { targetId, text, author: currentUser.name, email: currentUser.email, createdAt: serverTimestamp() });
    alert('Отправлено.');
}

/* --- МОДЕРАЦИЯ --- */
function toggleModeratorAccess() {
    if (isModerator) {
        if (confirm('Выйти из режима модератора?')) {
            isModerator = false; localStorage.setItem(MODERATOR_KEY, 'off');
            document.getElementById('mod-panel')?.remove();
            updateAuthUI(); refreshUI();
        }
    } else {
        if (!currentUser) return alert('Войдите.');
        if (ALLOWED_MOD_EMAILS.includes(currentUser.email)) {
            isModerator = true; localStorage.setItem(MODERATOR_KEY, 'on'); 
            renderModeratorUI(); updateAuthUI(); refreshUI();
        } else { alert('Доступ запрещен.'); }
    }
}

function renderModeratorUI() {
    document.getElementById('mod-panel')?.remove();
    const panel = document.createElement('div');
    panel.id = 'mod-panel'; panel.className = 'mod-panel';
    panel.innerHTML = `
        <div class="mod-header">
            <span>🛠 Модератор</span>
            <button class="mod-icon-btn" onclick="toggleModPanel()">—</button>
            <button class="mod-icon-btn" onclick="toggleModeratorAccess()">✕</button>
        </div>
        <div class="mod-body">
            <div class="mod-tabs">
                <button class="mod-tab active" onclick="switchModTab('comments', this)">Отзывы</button>
                <button class="mod-tab" onclick="switchModTab('drafts', this)">Черновики</button>
            </div>
            <div id="mod-content-comments" class="mod-content active">
                <p style="margin-bottom:10px;">На модерации:</p>
                <div id="mod-comments-list">Загрузка...</div>
            </div>
            <div id="mod-content-drafts" class="mod-content" style="display:none;">
                <div id="mod-drafts-list"></div>
            </div>
        </div>`;
    document.body.appendChild(panel);
    loadPendingComments(); renderDraftsList();
}

function toggleModPanel() { document.getElementById('mod-panel')?.classList.toggle('collapsed'); }
function switchModTab(tab, btn) {
    document.querySelectorAll('.mod-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.mod-content').forEach(c => c.style.display = 'none');
    btn.classList.add('active'); document.getElementById('mod-content-' + tab).style.display = 'block';
}

async function loadPendingComments() {
    const list = document.getElementById('mod-comments-list');
    if (!list) return;
    try {
        const { db, collection, query, where, getDocs } = window.FB;
        const snap = await getDocs(query(collection(db, "comments"), where("status", "==", "pending")));
        if (snap.empty) { list.innerHTML = '<p style="color:#94a3b8">Нет отзывов.</p>'; return; }
        list.innerHTML = snap.docs.map(d => {
            const c = d.data();
            const type = c.targetType === 'lesson' ? 'Занятие' : 'Модуль';
            return `<div class="mod-comment"><div style="font-size:11px; color:#94a3b8">${type}</div><strong>${c.author}</strong><p>${c.text}</p>
                <button class="btn-small green" onclick="approveComment('${d.id}')">✔</button>
                <button class="btn-small red" onclick="rejectComment('${d.id}')">✖</button></div>`;
        }).join('');
    } catch (e) {
        console.error(e);
        list.innerHTML = '<p style="color:#ef4444">Ошибка доступа.</p>';
    }
}

async function approveComment(id) {
    const { db, doc, updateDoc } = window.FB;
    await updateDoc(doc(db, "comments", id), { status: 'approved' });
    loadPendingComments(); refreshUI();
}
async function rejectComment(id) {
    const { db, doc, updateDoc } = window.FB;
    await updateDoc(doc(db, "comments", id), { status: 'rejected' });
    loadPendingComments(); refreshUI();
}

function renderDraftsList() {
    const list = document.getElementById('mod-drafts-list');
    if (!list) return;
    let html = '';
    MODULES.forEach(mod => {
        html += `<div class="mod-row">
            <label class="mod-toggle">
                <input type="checkbox" ${isModuleDraft(mod.id)?'':'checked'} onchange="toggleModModule('${mod.id}')">
                <span>${mod.icon} ${mod.title}</span>
            </label>`;
        if (mod.status === 'available' && mod.lessonCount) {
            html += `<button class="mod-expand" onclick="expandModLessons('${mod.id}')">занятия ▾</button>
                     <div class="mod-lessons" id="mod-lessons-${mod.id}" style="display:none;"></div>`;
        }
        html += '</div>';
    });
    list.innerHTML = html;
}

window.expandModLessons = function(moduleId) {
    const box = document.getElementById('mod-lessons-' + moduleId);
    if (!box) return;
    if (box.style.display === 'none') {
        const mod = MODULES.find(m => m.id === moduleId);
        if (!mod) return;
        ensureModuleLoaded(mod).then(() => {
            const lessons = getModuleLessons(mod);
            box.innerHTML = lessons.length ? lessons.map(l => `
                <label class="mod-toggle small">
                    <input type="checkbox" ${isLessonDraft(l.id) ? '' : 'checked'} onchange="toggleModLesson('${l.id}')">
                    <span>${l.num}. ${l.title}</span>
                </label>`).join('') : '<p style="color:#94a3b8">Нет данных.</p>';
            box.style.display = 'block';
        });
    } else { box.style.display = 'none'; }
};

async function updateDraftsDB() {
    if (!fbReady) return;
    const { db, doc, setDoc } = window.FB;
    await setDoc(doc(db, "config", "drafts"), DRAFTS);
}

window.toggleModModule = function(id) {
    const i = DRAFTS.modules.indexOf(id);
    if (i === -1) DRAFTS.modules.push(id); else DRAFTS.modules.splice(i, 1);
    saveDraftsLocal(); updateDraftsDB(); refreshUI();
};

window.toggleModLesson = function(id) {
    const i = DRAFTS.lessons.indexOf(id);
    if (i === -1) DRAFTS.lessons.push(id); else DRAFTS.lessons.splice(i, 1);
    saveDraftsLocal(); updateDraftsDB(); refreshUI();
};

/* --- ПРОФИЛЬ И КАРМА --- */
async function getUserProfileData(targetUid) {
    const { db, collection, query, where, getDocs, doc, getDoc } = window.FB;
    
    let karma = 0;
    let userComments = [];
    let userObj = { name: 'Пользователь', picture: '', email: '' };

    try {
        const uSnap = await getDoc(doc(db, "users", targetUid));
        if (uSnap.exists()) userObj = uSnap.data();
    } catch(e) { console.error("No user doc", e); }

    const votesQ = query(collection(db, "votes"), where("userId", "==", targetUid), where("type", "==", "like"));
    const votesSnap = await getDocs(votesQ);
    karma += votesSnap.size * 0.1;

    const cVotesQ = query(collection(db, "comment_votes"), where("userId", "==", targetUid), where("type", "==", "like"));
    const cVotesSnap = await getDocs(cVotesQ);
    karma += cVotesSnap.size * 0.1;

    const commentsQ = query(collection(db, "comments"), where("uid", "==", targetUid));
    const commentsSnap = await getDocs(commentsQ);
    
    commentsSnap.forEach(d => {
        const c = d.data();
        c.id = d.id;
        userComments.push(c);
        
        if (c.status === 'approved') {
            karma += (c.targetType === 'module' ? 5 : 2);
        } else if (c.status === 'rejected') {
            karma -= 1;
        }
        
        karma += (c.likes || 0) - (c.dislikes || 0);
    });

    userComments.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));

    return { karma: Math.round(karma), userComments, userObj };
}