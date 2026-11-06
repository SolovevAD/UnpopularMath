let currentUser = JSON.parse(localStorage.getItem('numbers_user') || 'null');

document.addEventListener('DOMContentLoaded', updateAuthUI);

window.addEventListener('firebase-ready', () => {
    const { auth, onAuthStateChanged, db, doc, setDoc } = window.FB;
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = { 
                email: user.email, 
                name: user.displayName || 'Пользователь', 
                picture: user.photoURL, 
                uid: user.uid 
            };
            localStorage.setItem('numbers_user', JSON.stringify(currentUser));
            
            // Сохраняем данные пользователя в БД для публичных профилей
            setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: user.displayName || 'Пользователь',
                picture: user.photoURL || '',
                email: user.email
            }, { merge: true }).catch(e => console.error("Ошибка сохранения профиля:", e));
            
        } else {
            currentUser = null;
            localStorage.removeItem('numbers_user');
            if (typeof isModerator !== 'undefined' && isModerator) {
                isModerator = false;
                document.getElementById('mod-panel')?.remove();
            }
        }
        updateAuthUI();
    });
});

function updateAuthUI() {
    const container = document.getElementById('auth-container');
    if (!container) return;

    const defaultAvatar = 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg';

    if (currentUser) {
        let adminBtn = '';
        if (typeof ALLOWED_MOD_EMAILS !== 'undefined' && ALLOWED_MOD_EMAILS.includes(currentUser.email)) {
            const isMod = typeof isModerator !== 'undefined' && isModerator;
            const btnColor = isMod ? '#10b981' : '#94a3b8';
            const btnIcon = isMod ? '🛠' : '🔒';
            adminBtn = `<button class="btn-logout" onclick="event.stopPropagation(); toggleModeratorAccess()" style="color: ${btnColor}; font-size: 18px; margin-right: 8px;" title="Панель модератора">${btnIcon}</button>`;
        }
        container.innerHTML = `
            <div class="user-profile" onclick="switchPage('profile')" title="Мой профиль">
                ${adminBtn}
                <img src="${currentUser.picture || defaultAvatar}" alt="Avatar" class="user-avatar" onerror="this.src='${defaultAvatar}'">
                <button class="btn-logout" onclick="event.stopPropagation(); logout()" title="Выйти">✕</button>
            </div>`;
    } else {
        container.innerHTML = `<button class="btn-login" onclick="loginWithGoogle()"><img src="${defaultAvatar}" style="width: 18px; height: 18px;"> Войти</button>`;
    }
}

async function loginWithGoogle() {
    if (!window.FB) return;
    const { auth, signInWithPopup, provider } = window.FB;
    try { await signInWithPopup(auth, provider); } catch (e) { console.error(e); }
}

function logout() {
    if (!window.FB) return;
    const { auth, signOut } = window.FB;
    signOut(auth);
}