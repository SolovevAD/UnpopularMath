/* ============================================================
   GRAPHS-TRAINER.JS — тренажёр по теории графов
   4 типа задач: степени вершин, число рёбер по матрице,
   двудольность, кратчайший путь.
   ============================================================ */

function _gShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}
function _gRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ---------- ТИП 1: сумма степеней ---------- */
function genDegreeTask() {
    const n = _gRandomInt(4, 6);
    const m = _gRandomInt(3, Math.min(8, n * (n - 1) / 2));
    const sum = 2 * m;
    const wrongs = [m, sum + 2, sum - 2, Math.round(sum / 2)];
    const uniq = [];
    wrongs.forEach(function (x) { if (x !== sum && uniq.indexOf(x) === -1 && x >= 0) uniq.push(x); });
    while (uniq.length < 3) {
        const x = sum + _gRandomInt(-4, 4);
        if (x !== sum && x >= 0 && uniq.indexOf(x) === -1) uniq.push(x);
    }
    return {
        prompt: 'В графе <strong>' + n + ' вершин</strong> и <strong>' + m + ' рёбер</strong>.<br>Чему равна сумма степеней всех вершин?',
        answer: String(sum),
        options: _gShuffle([String(sum), String(uniq[0]), String(uniq[1]), String(uniq[2])]),
        hint: 'Сумма степеней = 2 × (число рёбер). Каждое ребро учитывается дважды.'
    };
}

/* ---------- ТИП 2: число рёбер по матрице смежности ---------- */
function genMatrixTask() {
    const n = 4;
    const adj = Array.from({ length: n }, function () { return Array(n).fill(0); });
    const edges = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (Math.random() < 0.5) {
                adj[i][j] = 1; adj[j][i] = 1;
                edges.push([i, j]);
            }
        }
    }
    if (edges.length === 0) {
        adj[0][1] = 1; adj[1][0] = 1;
        edges.push([0, 1]);
    }
    const count = edges.length;
    let matrixText = '     ';
    for (let j = 0; j < n; j++) matrixText += String(j + 1) + '  ';
    matrixText += '\n';
    for (let i = 0; i < n; i++) {
        matrixText += String(i + 1) + '  [ ';
        for (let j = 0; j < n; j++) matrixText += adj[i][j] + '  ';
        matrixText += ']\n';
    }
    const wrongs = [count - 1, count + 1, count + 2, Math.round(count / 2)].filter(function (x) {
        return x >= 0 && x !== count;
    });
    const uniq = [];
    wrongs.forEach(function (x) { if (uniq.indexOf(x) === -1) uniq.push(x); });
    while (uniq.length < 3) {
        const x = count + _gRandomInt(-3, 3);
        if (x !== count && x >= 0 && uniq.indexOf(x) === -1) uniq.push(x);
    }
    return {
        prompt: 'Дана матрица смежности графа:<br><pre style="font-family: monospace; line-height:1.4;">' + matrixText + '</pre>Сколько рёбер в этом графе?',
        answer: String(count),
        options: _gShuffle([String(count), String(uniq[0]), String(uniq[1]), String(uniq[2])]),
        hint: 'Матрица смежности симметрична. Число рёбер = половина суммы всех единиц.'
    };
}

/* ---------- ТИП 3: двудольность ---------- */
function genBipartiteTask() {
    const cases = [
        { text: 'Полный двудольный граф K(3,4)', bipartite: true, why: 'по определению двудольный' },
        { text: 'Цикл C₄ (4 вершины в кольце)', bipartite: true, why: 'все циклы чётной длины' },
        { text: 'Цикл C₅ (5 вершин в кольце)', bipartite: false, why: 'цикл нечётной длины не может быть двудольным' },
        { text: 'Цикл C₆ (6 вершин в кольце)', bipartite: true, why: 'все циклы чётной длины' },
        { text: 'Полный граф K₃ (треугольник)', bipartite: false, why: 'содержит цикл нечётной длины — треугольник' },
        { text: 'Полный граф K₄', bipartite: false, why: 'содержит треугольники' },
        { text: 'Дерево с 7 вершинами', bipartite: true, why: 'любое дерево двудольное' },
        { text: 'Путь из 5 вершин', bipartite: true, why: 'нет циклов, значит все циклы чётные' },
        { text: 'Полный двудольный граф K(2,3)', bipartite: true, why: 'по определению двудольный' },
        { text: 'Граф-звезда (центр + 4 листа)', bipartite: true, why: 'центр в одном множестве, листья в другом' }
    ];
    const c = cases[Math.floor(Math.random() * cases.length)];
    const answer = c.bipartite ? 'Да' : 'Нет';
    return {
        prompt: 'Является ли двудольным граф: <strong>' + c.text + '</strong>?',
        answer: answer,
        options: ['Да', 'Нет'],
        hint: c.bipartite
            ? 'Проверьте: можно ли раскрасить вершины в два цвета так, чтобы каждое ребро соединяло разные цвета? ' + c.why + '.'
            : 'Помните: граф двудольный ⟺ все его циклы имеют чётную длину. ' + c.why + '.'
    };
}

/* ---------- ТИП 4: кратчайший путь ---------- */
function genShortestPathTask() {
    /* Небольшой взвешенный граф с фиксированной топологией, но случайными весами. */
    const config = {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        /* Рёбра: [from, to, weight]. Веса 1..9. */
        edges: [
            ['A', 'B', 0], ['A', 'C', 0],
            ['B', 'C', 0], ['B', 'D', 0],
            ['C', 'D', 0], ['C', 'E', 0],
            ['D', 'E', 0]
        ]
    };
    /* Случайные веса */
    const edges = config.edges.map(function (e) {
        return [e[0], e[1], _gRandomInt(1, 9)];
    });
    /* Дейкстра от A до E */
    const dist = { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity };
    const visited = {};
    while (true) {
        let u = null, best = Infinity;
        Object.keys(dist).forEach(function (k) {
            if (!visited[k] && dist[k] < best) { best = dist[k]; u = k; }
        });
        if (u === null) break;
        visited[u] = true;
        edges.forEach(function (e) {
            if (e[0] === u || e[1] === u) {
                const v = e[0] === u ? e[1] : e[0];
                const w = e[2];
                if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
            }
        });
    }
    const answer = dist.E;
    /* Построим текст графа */
    let graphText = 'Вершины: A, B, C, D, E.\nРёбра (с весами):\n';
    edges.forEach(function (e) {
        graphText += '  ' + e[0] + ' — ' + e[1] + ' : ' + e[2] + '\n';
    });
    graphText += '\nВсе рёбра двунаправленные.';
    /* Варианты ответа — соседние значения */
    const wrongs = [answer - 1, answer + 1, answer + 2, answer - 2].filter(function (x) {
        return x > 0 && x !== answer;
    });
    const uniq = [];
    wrongs.forEach(function (x) { if (uniq.indexOf(x) === -1) uniq.push(x); });
    while (uniq.length < 3) {
        const x = answer + _gRandomInt(-3, 3);
        if (x > 0 && x !== answer && uniq.indexOf(x) === -1) uniq.push(x);
    }
    return {
        prompt: 'Дан взвешенный граф:<br><pre style="font-family: monospace; line-height:1.4;">' + graphText + '</pre>Какова длина кратчайшего пути от A до E?',
        answer: String(answer),
        options: _gShuffle([String(answer), String(uniq[0]), String(uniq[1]), String(uniq[2])]),
        hint: 'Примените алгоритм Дейкстры: последовательно находите ближайшую непосещённую вершину и обновляйте расстояния до её соседей.'
    };
}

/* ---------- ФАБРИКА ---------- */
function generateGraphTask() {
    const gens = [genDegreeTask, genMatrixTask, genBipartiteTask, genShortestPathTask];
    return gens[Math.floor(Math.random() * gens.length)]();
}

/* ---------- ЛОГИКА ТРЕНАЖЁРА ---------- */
let graphScore = 0, graphTotal = 0, graphCurrent = null, graphReady = false;

function ensureGraphTrainerReady() {
    const taskEl = document.getElementById('graph-task');
    if (!taskEl) return;
    if (!graphReady) {
        const stats = JSON.parse(localStorage.getItem('graph_stats') || 'null');
        if (stats) { graphScore = stats.score; graphTotal = stats.total; }
        updateGraphScore();
        newGraphTask();
        graphReady = true;
    }
}

function updateGraphScore() {
    const s = document.getElementById('graph-score');
    const t = document.getElementById('graph-total');
    if (s) s.innerText = graphScore;
    if (t) t.innerText = graphTotal;
}

function newGraphTask() {
    const task = generateGraphTask();
    graphCurrent = task;
    const taskEl = document.getElementById('graph-task');
    if (taskEl) taskEl.innerHTML = task.prompt;
    const box = document.getElementById('graph-options');
    if (box) box.innerHTML = task.options.map(function (opt) {
        return '<p><button class="btn btn-secondary gate-option" ' +
               'data-value="' + opt.replace(/"/g, '&quot;') + '" ' +
               'onclick="checkGraphAnswer(this)">' + opt + '</button></p>';
    }).join('');
    const fb = document.getElementById('graph-feedback');
    if (fb) { fb.innerText = ''; fb.style.color = ''; }
    const hintEl = document.getElementById('graph-hint-text');
    if (hintEl) hintEl.innerText = task.hint || '';
    const hintBox = document.getElementById('graph-hint');
    if (hintBox) hintBox.open = false;
}

function checkGraphAnswer(btn) {
    const fb = document.getElementById('graph-feedback');
    if (!fb || !graphCurrent) return;
    const val = btn.getAttribute('data-value');
    const ok = val === graphCurrent.answer;
    graphTotal++;
    if (ok) graphScore++;
    fb.style.color = ok ? '#27ae60' : '#c0392b';
    fb.innerText = ok ? '✅ Верно!' : '❌ Неверно. Правильный ответ: ' + graphCurrent.answer;
    updateGraphScore();
    localStorage.setItem('graph_stats', JSON.stringify({ score: graphScore, total: graphTotal }));
    if (ok) setTimeout(function () {
        const page = document.getElementById('page-tools-graphs');
        if (page && page.classList.contains('active')) newGraphTask();
    }, 900);
}
