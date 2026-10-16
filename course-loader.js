/* ============================================================
   COURSE-LOADER.JS — ленивая загрузка курсов
   Динамически подгружает course-*.js при первом обращении
   к модулю. Работает с top-level const через new Function.
   ============================================================ */

const COURSE_LOAD_CACHE = {};

/** Загружает скрипт по URL, возвращает Promise. Кеширует. */
function loadScriptOnce(src) {
    if (COURSE_LOAD_CACHE[src]) return COURSE_LOAD_CACHE[src];
    COURSE_LOAD_CACHE[src] = new Promise(function (resolve, reject) {
        const s = document.createElement('script');
        s.src = src;
        s.onload = function () { resolve(); };
        s.onerror = function () { reject(new Error('Не удалось загрузить ' + src)); };
        document.head.appendChild(s);
    });
    return COURSE_LOAD_CACHE[src];
}

/** Безопасно достаёт top-level const по имени.
 *  window[имя] не работает для const — только new Function. */
function getGlobalArray(name) {
    try {
        const value = (new Function('return ' + name + ';'))();
        return Array.isArray(value) ? value : [];
    } catch (e) {
        return [];
    }
}

/** Возвращает массив занятий модуля, если он уже загружен. */
function getModuleLessons(mod) {
    if (!mod || !mod.courseVar) return [];
    return getGlobalArray(mod.courseVar);
}

/** Гарантирует, что данные модуля загружены. */
async function ensureModuleLoaded(mod) {
    if (!mod || !mod.courseFile) return false;
    if (getModuleLessons(mod).length > 0) return true;
    try {
        await loadScriptOnce(mod.courseFile);
        return getModuleLessons(mod).length > 0;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/** Поиск модуля по ID занятия. При необходимости подгружает курсы. */
async function findModuleByLesson(lessonId) {
    for (let i = 0; i < MODULES.length; i++) {
        const mod = MODULES[i];
        if (mod.status !== 'available') continue;
        const lessons = getModuleLessons(mod);
        if (lessons.some(function (l) { return l.id === lessonId; })) return mod;
    }
    for (let i = 0; i < MODULES.length; i++) {
        const mod = MODULES[i];
        if (mod.status !== 'available' || !mod.courseFile) continue;
        await ensureModuleLoaded(mod);
        const lessons = getModuleLessons(mod);
        if (lessons.some(function (l) { return l.id === lessonId; })) return mod;
    }
    return null;
}

/** Возвращает соседние модули (доступные). */
function getAdjacentModules(modId) {
    const available = MODULES.filter(function (m) { return m.status === 'available'; });
    const idx = available.findIndex(function (m) { return m.id === modId; });
    return {
        prev: idx > 0 ? available[idx - 1] : null,
        next: idx >= 0 && idx < available.length - 1 ? available[idx + 1] : null
    };
}

/** Возвращает соседние занятия внутри модуля. */
function getAdjacentLessons(mod, lessonId) {
    const lessons = getModuleLessons(mod);
    const idx = lessons.findIndex(function (l) { return l.id === lessonId; });
    return {
        prev: idx > 0 ? lessons[idx - 1] : null,
        next: idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null,
        index: idx + 1,
        total: lessons.length
    };
}
