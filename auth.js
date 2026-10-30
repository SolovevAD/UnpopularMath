/* ============================================================
   AUTH.JS — Авторизация через Firebase Authentication
   ============================================================ */

let currentUser = null;

// Ждем инициализации Firebase
window.addEventListener('firebase-ready', () => {
    const { auth, onAuthStateChanged, signInWithPopup, provider, signOut } = window.FB;

    // Слушаем изменения статуса авторизации
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = {
                email: user.email,
                name: user.displayName,
                picture: user.photoURL,
                uid: user.uid
            };
            localStorage.setItem('numbers_user', JSON.stringify(currentUser));
        } else {
            currentUser = null;
            localStorage.removeItem('numbers_user');
        }
        updateAuthUI();
    });

    // Первичная отрисовка
    setTimeout(updateAuthUI, 500);
});

function updateAuthUI() {
    const container = document.getElementById('auth-container');
    if (!container) return;

    if (currentUser) {
        container.innerHTML = `
            <div class="user-profile" title="${currentUser.email}">
                <img src="${currentUser.picture}" alt="${currentUser.name}" class="user-avatar" style="width: 32px; height: 32px; border-radius: 50%;">
                <button class="btn-logout" onclick="logout()" style="background: none; border: none; color: #fff; cursor: pointer; margin-left: 8px;">✕</button>
            </div>
        `;
    } else {
        container.innerHTML = `<button class="btn btn-secondary" onclick="loginWithGoogle()" style="background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.4); padding: 6px 12px; border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 8px;"><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style="width: 18px; height: 18px;"> Войти</button>`;
    }
}

async function loginWithGoogle() {
    const { auth, signInWithPopup, provider } = window.FB;
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Ошибка входа:", error);
        alert("Не удалось войти через Google. Проверьте настройки проекта.");
    }
}

function logout() {
    const { auth, signOut } = window.FB;
    signOut(auth).then(() => {
        // Если был активен режим модератора — выключаем
        if (typeof isModerator !== 'undefined' && isModerator) {
            isModerator = false;
            localStorage.setItem(MODERATOR_KEY, 'off');
            const panel = document.getElementById('mod-panel');
            if (panel) panel.remove();
            if (typeof buildHomeModules === 'function') buildHomeModules();
            if (typeof updateSidebar === 'function') updateSidebar((location.hash || '#home').slice(1));
        }
    });
}
