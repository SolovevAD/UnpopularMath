/* ============================================================
   LOGIC-TRAINER.JS — тренажёр по алгебре логики
   4 типа задач: вычисление выражения, закон де Моргана,
   подсчёт единиц в таблице истинности, упрощение.
   ============================================================ */

/* ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---------- */
function _randBool() { return Math.random() < 0.5; }
function _shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}
function _toVal(b) { return b ? 1 : 0; }
function _valStr(b) { return b ? '1' : '0'; }

/* ---------- ГЕНЕРАТОРЫ ЗАДАЧ ---------- */

/* Тип 1: вычислить логическое выражение при заданных значениях переменных. */
function genEvaluateTask() {
    const expressions = [
        { text: 'A AND (B OR NOT C)',  fn: function (a, b, c) { return a && (b || !c); } },
        { text: '(A OR B) AND C',      fn: function (a, b, c) { return (a || b) && c; } },
        { text: 'NOT A OR (B AND C)',  fn: function (a, b, c) { return !a || (b && c); } },
        { text: '(A AND B) OR NOT C',  fn: function (a, b, c) { return (a && b) || !c; } },
        { text: 'A XOR (B AND C)',     fn: function (a, b, c) { return (a !== (b && c)); } },
        { text: 'NOT (A OR B) AND C',  fn: function (a, b, c) { return !(a || b) && c; } },
        { text: '(A OR NOT B) AND (B OR C)', fn: function (a, b, c) { return (a || !b) && (b || c); } },
        { text: 'A AND B AND (NOT A OR C)', fn: function (a, b, c) { return a && b && (!a || c); } }
    ];
    const ex = expressions[Math.floor(Math.random() * expressions.length)];
    const a = _randBool(), b = _randBool(), c = _randBool();
    const result = ex.fn(a, b, c);
    return {
        prompt: 'Дано: A = ' + _valStr(a) + ', B = ' + _valStr(b) + ', C = ' + _valStr(c) + '.<br>Найдите значение выражения: <strong>' + ex.text + '</strong>',
        answer: _valStr(result),
        options: _shuffle(['0', '1']),
        hint: 'Подставьте значения вместо переменных и последовательно вычислите по приоритетам: скобки → NOT → AND → OR.'
    };
}

/* Тип 2: закон де Моргана — эквивалентное выражение. */
function genDeMorganTask() {
    const cases = [
        {
            given: 'NOT (A AND B)',
            correct: 'NOT A OR NOT B',
            wrong: ['NOT A AND NOT B', 'A OR B', 'A AND B']
        },
        {
            given: 'NOT (A OR B)',
            correct: 'NOT A AND NOT B',
            wrong: ['NOT A OR NOT B', 'A AND B', 'A OR B']
        },
        {
            given: 'NOT (A AND NOT B)',
            correct: 'NOT A OR B',
            wrong: ['NOT A AND B', 'A OR NOT B', 'A AND NOT B']
        },
        {
            given: 'NOT (NOT A OR B)',
            correct: 'A AND NOT B',
            wrong: ['A OR NOT B', 'NOT A AND NOT B', 'NOT A OR B']
        },
        {
            given: 'NOT (A OR NOT B)',
            correct: 'NOT A AND B',
            wrong: ['NOT A OR B', 'A AND NOT B', 'A OR B']
        }
    ];
    const c = cases[Math.floor(Math.random() * cases.length)];
    return {
        prompt: 'По закону де Моргана выражение <strong>' + c.given + '</strong> эквивалентно:',
        answer: c.correct,
        options: _shuffle([c.correct].concat(c.wrong)),
        hint: 'NOT (X AND Y) = NOT X OR NOT Y; NOT (X OR Y) = NOT X AND NOT Y. Отрицание «переворачивает» операцию.'
    };
}

/* Тип 3: количество единиц в таблице истинности. */
function genCountOnesTask() {
    const functions = [
        { text: 'A AND B',                    count: 1, vars: 'AB' },
        { text: 'A OR B',                     count: 3, vars: 'AB' },
        { text: 'A XOR B',                    count: 2, vars: 'AB' },
        { text: 'A AND B AND C',              count: 1, vars: 'ABC' },
        { text: 'A OR B OR C',                count: 7, vars: 'ABC' },
        { text: 'A AND (B OR C)',             count: 3, vars: 'ABC' },
        { text: '(A OR B) AND C',             count: 3, vars: 'ABC' },
        { text: 'NOT A AND B',                count: 1, vars: 'AB' },
        { text: 'A AND NOT B',                count: 1, vars: 'AB' },
        { text: 'NOT (A AND B)',              count: 3, vars: 'AB' },
        { text: 'NOT (A OR B)',               count: 1, vars: 'AB' },
        { text: 'A OR (B AND C)',             count: 5, vars: 'ABC' }
    ];
    const f = functions[Math.floor(Math.random() * functions.length)];
    const totalRows = Math.pow(2, f.vars.length);
    const others = [f.count - 1, f.count + 1, totalRows - f.count].filter(function (x) {
        return x >= 0 && x <= totalRows && x !== f.count;
    });
    const unique = [];
    others.forEach(function (x) { if (unique.indexOf(x) === -1) unique.push(x); });
    while (unique.length < 3) {
        const x = Math.floor(Math.random() * (totalRows + 1));
        if (x !== f.count && unique.indexOf(x) === -1) unique.push(x);
    }
    return {
        prompt: 'Переменных: ' + f.vars.length + ' (' + f.vars.split('').join(', ') + '), всего строк в таблице: ' + totalRows + '.<br>Сколько единиц в столбце результата для функции <strong>' + f.text + '</strong>?',
        answer: String(f.count),
        options: _shuffle([String(f.count), String(unique[0]), String(unique[1]), String(unique[2])]),
        hint: 'Переберите все комбинации переменных и посчитайте, сколько раз функция равна 1.'
    };
}

/* Тип 4: упростить выражение. */
function genSimplifyTask() {
    const cases = [
        { given: 'A OR (A AND B)',           correct: 'A',        wrong: ['B', 'A AND B', 'A OR B'] },
        { given: 'A AND (A OR B)',           correct: 'A',        wrong: ['B', 'A AND B', 'A OR B'] },
        { given: '(A AND B) OR (A AND NOT B)', correct: 'A',      wrong: ['B', 'A AND B', 'A OR B'] },
        { given: '(A OR B) AND (A OR NOT B)', correct: 'A',       wrong: ['B', 'A AND B', 'A OR B'] },
        { given: 'A AND NOT A',              correct: '0',        wrong: ['1', 'A', 'NOT A'] },
        { given: 'A OR NOT A',               correct: '1',        wrong: ['0', 'A', 'NOT A'] },
        { given: 'A AND (B OR NOT B)',       correct: 'A',        wrong: ['B', 'A AND B', 'A OR B'] },
        { given: 'A OR (B AND NOT B)',       correct: 'A',        wrong: ['B', 'A AND B', 'A OR B'] },
        { given: 'NOT (NOT A)',              correct: 'A',        wrong: ['NOT A', '0', '1'] },
        { given: '(A OR B) AND NOT A',       correct: 'NOT A AND B', wrong: ['A', 'B', 'A OR B'] },
        { given: 'A AND (NOT A OR B)',       correct: 'A AND B',  wrong: ['A', 'B', 'A OR B'] },
        { given: 'A OR (NOT A AND B)',       correct: 'A OR B',   wrong: ['A', 'B', 'A AND B'] }
    ];
    const c = cases[Math.floor(Math.random() * cases.length)];
    return {
        prompt: 'Упростите выражение: <strong>' + c.given + '</strong>',
        answer: c.correct,
        options: _shuffle([c.correct].concat(c.wrong)),
        hint: 'Используйте законы поглощения: A OR (A AND B) = A; A AND (A OR B) = A. И законы с константами: X OR NOT X = 1, X AND NOT X = 0.'
    };
}

/* ---------- ГЕНЕРАЦИЯ СЛУЧАЙНОЙ ЗАДАЧИ ---------- */
function generateLogicTask() {
    const generators = [
        genEvaluateTask,
        genDeMorganTask,
        genCountOnesTask,
        genSimplifyTask
    ];
    const gen = generators[Math.floor(Math.random() * generators.length)];
    return gen();
}

/* ---------- СОСТОЯНИЕ И ЛОГИКА ТРЕНАЖЁРА ---------- */
let logicScore = 0, logicTotal = 0, logicCurrent = null, logicReady = false;

function ensureLogicTrainerReady() {
    const taskEl = document.getElementById('logic-task');
    if (!taskEl) return;
    if (!logicReady) {
        const stats = JSON.parse(localStorage.getItem('logic_stats') || 'null');
        if (stats) { logicScore = stats.score; logicTotal = stats.total; }
        updateLogicScore();
        newLogicTask();
        logicReady = true;
    }
}

function updateLogicScore() {
    const s = document.getElementById('logic-score');
    const t = document.getElementById('logic-total');
    if (s) s.innerText = logicScore;
    if (t) t.innerText = logicTotal;
}

function newLogicTask() {
    const task = generateLogicTask();
    logicCurrent = task;
    const taskEl = document.getElementById('logic-task');
    if (taskEl) taskEl.innerHTML = task.prompt;
    const shuffled = task.options.slice();
    const box = document.getElementById('logic-options');
    if (box) box.innerHTML = shuffled.map(function (opt) {
        return '<p><button class="btn btn-secondary gate-option" ' +
               'data-value="' + opt.replace(/"/g, '&quot;') + '" ' +
               'onclick="checkLogicAnswer(this)">' + opt + '</button></p>';
    }).join('');
    const fb = document.getElementById('logic-feedback');
    if (fb) { fb.innerText = ''; fb.style.color = ''; }
    const hintEl = document.getElementById('logic-hint-text');
    if (hintEl) hintEl.innerText = task.hint || '';
    const hintBox = document.getElementById('logic-hint');
    if (hintBox) hintBox.open = false;
}

function checkLogicAnswer(btn) {
    const fb = document.getElementById('logic-feedback');
    if (!fb || !logicCurrent) return;
    const val = btn.getAttribute('data-value');
    const ok = val === logicCurrent.answer;
    logicTotal++;
    if (ok) logicScore++;
    fb.style.color = ok ? '#27ae60' : '#c0392b';
    fb.innerText = ok ? '✅ Верно!' : '❌ Неверно. Правильный ответ: ' + logicCurrent.answer;
    updateLogicScore();
    localStorage.setItem('logic_stats', JSON.stringify({ score: logicScore, total: logicTotal }));
    if (ok) setTimeout(function () {
        const page = document.getElementById('page-tools-boolean-algebra');
        if (page && page.classList.contains('active')) newLogicTask();
    }, 900);
}
