/* ============================================================
   QUANTUM-GATES-TRAINER.JS — тренажёр по квантовым гейтам
   Генерирует случайные задачи на X, Z, H, CNOT, CZ.
   ============================================================ */

const GATE_TASKS = [
    // Однокубитные
    { gate: 'X', input: '|0⟩', answer: '|1⟩', options: ['|1⟩', '|0⟩', '(|0⟩+|1⟩)/√2', '−|1⟩'] },
    { gate: 'X', input: '|1⟩', answer: '|0⟩', options: ['|0⟩', '|1⟩', '(|0⟩−|1⟩)/√2', '−|0⟩'] },
    { gate: 'Z', input: '|0⟩', answer: '|0⟩', options: ['|0⟩', '|1⟩', '−|0⟩', '(|0⟩+|1⟩)/√2'] },
    { gate: 'Z', input: '|1⟩', answer: '−|1⟩', options: ['−|1⟩', '|1⟩', '|0⟩', '(|0⟩−|1⟩)/√2'] },
    { gate: 'H', input: '|0⟩', answer: '(|0⟩+|1⟩)/√2', options: ['(|0⟩+|1⟩)/√2', '(|0⟩−|1⟩)/√2', '|1⟩', '|0⟩'] },
    { gate: 'H', input: '|1⟩', answer: '(|0⟩−|1⟩)/√2', options: ['(|0⟩−|1⟩)/√2', '(|0⟩+|1⟩)/√2', '|1⟩', '−|0⟩'] },
    { gate: 'H', input: '(|0⟩+|1⟩)/√2', answer: '|0⟩', options: ['|0⟩', '|1⟩', '(|0⟩+|1⟩)/√2', '−|1⟩'] },

    // Двухкубитные
    { gate: 'CNOT', input: '|00⟩', answer: '|00⟩', options: ['|00⟩', '|01⟩', '|10⟩', '|11⟩'] },
    { gate: 'CNOT', input: '|01⟩', answer: '|01⟩', options: ['|01⟩', '|00⟩', '|11⟩', '|10⟩'] },
    { gate: 'CNOT', input: '|10⟩', answer: '|11⟩', options: ['|11⟩', '|10⟩', '|00⟩', '|01⟩'] },
    { gate: 'CNOT', input: '|11⟩', answer: '|10⟩', options: ['|10⟩', '|11⟩', '|01⟩', '|00⟩'] },

    { gate: 'CZ', input: '|00⟩', answer: '|00⟩', options: ['|00⟩', '|11⟩', '−|11⟩', '|01⟩'] },
    { gate: 'CZ', input: '|01⟩', answer: '|01⟩', options: ['|01⟩', '|10⟩', '−|11⟩', '|00⟩'] },
    { gate: 'CZ', input: '|10⟩', answer: '|10⟩', options: ['|10⟩', '|01⟩', '−|00⟩', '|11⟩'] },
    { gate: 'CZ', input: '|11⟩', answer: '−|11⟩', options: ['−|11⟩', '|11⟩', '|00⟩', '|01⟩'] }
];

let gateScore = 0;
let gateTotal = 0;
let gateCurrent = null;
let gateReady = false;

function ensureGateTrainerReady() {
    if (!gateReady) {
        const stats = JSON.parse(localStorage.getItem('gate_stats') || 'null');
        if (stats) { gateScore = stats.score; gateTotal = stats.total; }
        updateGateScore();
        newGateTask();
        gateReady = true;
    }
}

function updateGateScore() {
    const s = document.getElementById('gate-score');
    const t = document.getElementById('gate-total');
    if (s) s.innerText = gateScore;
    if (t) t.innerText = gateTotal;
}

function newGateTask() {
    const task = GATE_TASKS[Math.floor(Math.random() * GATE_TASKS.length)];
    gateCurrent = task;

    const taskEl = document.getElementById('gate-task');
    if (taskEl) {
        taskEl.innerHTML = 'Гейт <strong>' + task.gate + '</strong> применяется к состоянию <strong>' + task.input + '</strong>. Что получится?';
    }

    // Перемешиваем варианты
    const shuffled = task.options.slice().sort(function () { return Math.random() - 0.5; });
    const box = document.getElementById('gate-options');
    if (box) {
        box.innerHTML = shuffled.map(function (opt, i) {
            return '<p><button class="btn btn-secondary gate-option" ' +
                   'data-value="' + opt.replace(/"/g, '&quot;') + '" ' +
                   'onclick="checkGateAnswer(this)">' + opt + '</button></p>';
        }).join('');
    }

    const fb = document.getElementById('gate-feedback');
    if (fb) { fb.innerText = ''; fb.style.color = ''; }
}

function checkGateAnswer(btn) {
    const fb = document.getElementById('gate-feedback');
    if (!fb || !gateCurrent) return;

    const val = btn.getAttribute('data-value');
    const ok = val === gateCurrent.answer;

    gateTotal++;
    if (ok) gateScore++;

    fb.style.color = ok ? '#27ae60' : '#c0392b';
    fb.innerText = ok
        ? '✅ Верно!'
        : '❌ Неверно. Правильный ответ: ' + gateCurrent.answer;

    updateGateScore();
    localStorage.setItem('gate_stats', JSON.stringify({ score: gateScore, total: gateTotal }));

    if (ok) {
        setTimeout(function () {
            const page = document.getElementById('page-tools-quantum-computer');
            if (page && page.classList.contains('active')) newGateTask();
        }, 900);
    }
}