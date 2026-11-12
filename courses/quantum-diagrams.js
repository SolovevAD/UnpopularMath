const QUANTUM_DIAGRAMS = {
    'complex-amplitude': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 350" role="img" aria-label="Комплексная амплитуда">
  <style>
    .axis { stroke: #64748b; stroke-width: 1.5; fill: none; }
    .label { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .vector { stroke: #0ea5e9; stroke-width: 3; fill: none; }
    .arrow { fill: #0ea5e9; }
    .proj { stroke: #14b8a6; stroke-width: 1.5; stroke-dasharray: 4 4; fill: none; }
    .angle { stroke: #f59e0b; stroke-width: 2; fill: none; }
  </style>
  <line x1="80" y1="280" x2="600" y2="280" class="axis" />
  <line x1="300" y1="320" x2="300" y2="40" class="axis" />
  <text x="600" y="300" class="label" text-anchor="end">Re (Действительная часть)</text>
  <text x="300" y="30" class="label" text-anchor="middle">Im (Мнимая часть)</text>
  <line x1="300" y1="280" x2="480" y2="100" class="vector" />
  <polygon points="480,100 465,110 475,125" class="arrow" />
  <line x1="480" y1="100" x2="480" y2="280" class="proj" />
  <line x1="480" y1="100" x2="300" y2="100" class="proj" />
  <text x="490" y="295" class="label" fill="#14b8a6">α = |α|·cos(φ)</text>
  <text x="290" y="100" class="label" text-anchor="end" fill="#14b8a6">β = |α|·sin(φ)</text>
  <path d="M 380 280 A 80 80 0 0 0 355 215" class="angle" />
  <text x="390" y="245" class="label" fill="#f59e0b">φ (фаза)</text>
  <text x="300" y="340" class="label" text-anchor="middle" font-weight="bold">Вероятность = |α|²</text>
</svg>`,

    'grover-amplitude': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420" role="img" aria-label="Амплитуды Гровера">
  <style>
    .axis { stroke: #64748b; stroke-width: 1.5; fill: none; }
    .axis-dash { stroke: #cbd5e1; stroke-width: 1; stroke-dasharray: 4 4; fill: none; }
    .bar-pos { fill: #0ea5e9; }
    .bar-neg { fill: #ef4444; }
    .mean { stroke: #f59e0b; stroke-width: 2; stroke-dasharray: 6 4; fill: none; }
    .label { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .title { font-family: sans-serif; font-size: 14px; font-weight: bold; fill: currentColor; }
    .bar-label { font-family: sans-serif; font-size: 11px; fill: #64748b; text-anchor: middle; }
  </style>
  <text x="130" y="30" class="title" text-anchor="middle">1. Старт (Равные амплитуды)</text>
  <line x1="20" y1="300" x2="240" y2="300" class="axis" />
  <rect x="50" y="200" width="25" height="100" class="bar-pos" />
  <rect x="100" y="200" width="25" height="100" class="bar-pos" />
  <rect x="150" y="200" width="25" height="100" class="bar-pos" />
  <rect x="200" y="200" width="25" height="100" class="bar-pos" />
  <line x1="20" y1="200" x2="240" y2="200" class="mean" />
  <text x="240" y="190" class="label" text-anchor="end" fill="#f59e0b">Среднее = 0.5</text>
  <text x="62" y="320" class="bar-label">Ошибка 1</text>
  <text x="112" y="320" class="bar-label">Ошибка 2</text>
  <text x="162" y="320" class="bar-label">Ошибка 3</text>
  <text x="212" y="320" class="bar-label">Ответ</text>
  <text x="400" y="30" class="title" text-anchor="middle">2. Оракул (Переворот ответа)</text>
  <line x1="290" y1="300" x2="510" y2="300" class="axis" />
  <line x1="332" y1="200" x2="332" y2="300" class="axis-dash" />
  <line x1="382" y1="200" x2="382" y2="300" class="axis-dash" />
  <line x1="432" y1="200" x2="432" y2="300" class="axis-dash" />
  <line x1="482" y1="200" x2="482" y2="400" class="axis-dash" />
  <rect x="320" y="200" width="25" height="100" class="bar-pos" />
  <rect x="370" y="200" width="25" height="100" class="bar-pos" />
  <rect x="420" y="200" width="25" height="100" class="bar-pos" />
  <rect x="470" y="300" width="25" height="100" class="bar-neg" />
  <line x1="290" y1="250" x2="510" y2="250" class="mean" />
  <text x="510" y="240" class="label" text-anchor="end" fill="#f59e0b">Среднее = 0.25</text>
  <text x="332" y="320" class="bar-label">Ошибка 1</text>
  <text x="382" y="320" class="bar-label">Ошибка 2</text>
  <text x="432" y="320" class="bar-label">Ошибка 3</text>
  <text x="482" y="415" class="bar-label" fill="#ef4444">-Ответ</text>
  <text x="670" y="30" class="title" text-anchor="middle">3. Диффузия (Отражение)</text>
  <line x1="560" y1="300" x2="780" y2="300" class="axis" />
  <rect x="590" y="300" width="25" height="0" class="bar-neg" />
  <rect x="640" y="300" width="25" height="0" class="bar-neg" />
  <rect x="690" y="300" width="25" height="0" class="bar-neg" />
  <rect x="740" y="100" width="25" height="200" class="bar-pos" />
  <text x="602" y="320" class="bar-label">Ошибка 1</text>
  <text x="652" y="320" class="bar-label">Ошибка 2</text>
  <text x="702" y="320" class="bar-label">Ошибка 3</text>
  <text x="752" y="320" class="bar-label" font-weight="bold" fill="#0ea5e9">Ответ</text>
  <text x="752" y="90" class="label" text-anchor="middle" fill="#0ea5e9">Вероятность 100%</text>
</svg>`,

    'grover-rotation': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" role="img" aria-label="Вращение Гровера">
  <style>
    .axis { stroke: #64748b; stroke-width: 1.5; fill: none; }
    .circle { stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4 4; fill: none; }
    .vector { stroke: #0ea5e9; stroke-width: 2.5; fill: none; }
    .vector-final { stroke: #10b981; stroke-width: 3; fill: none; }
    .arc { stroke: #f59e0b; stroke-width: 1.5; fill: none; }
    .label { font-family: sans-serif; font-size: 12px; fill: currentColor; }
  </style>
  <line x1="80" y1="300" x2="520" y2="300" class="axis" />
  <line x1="300" y1="430" x2="300" y2="60" class="axis" />
  <circle cx="300" cy="300" r="200" class="circle" />
  <text x="520" y="305" class="label" text-anchor="end">Ошибки</text>
  <text x="300" y="50" class="label" text-anchor="middle" font-weight="bold">Правильный ответ</text>
  <path d="M 400 300 A 100 100 0 0 0 397.4 277.5" class="arc" />
  <text x="420" y="290" class="label" fill="#f59e0b">θ (13°)</text>
  <path d="M 397.4 277.5 A 100 100 0 0 0 377.7 237.1" class="arc" />
  <text x="420" y="250" class="label" fill="#f59e0b">2θ (26°)</text>
  <path d="M 377.7 237.1 A 100 100 0 0 0 342.3 209.4" class="arc" />
  <text x="380" y="210" class="label" fill="#f59e0b">2θ (26°)</text>
  <line x1="300" y1="300" x2="494.8" y2="255" class="vector" />
  <circle cx="494.8" cy="255" r="4" fill="#0ea5e9" />
  <text x="505" y="250" class="label" fill="#0ea5e9">Старт</text>
  <line x1="300" y1="300" x2="455.4" y2="174.2" class="vector" />
  <circle cx="455.4" cy="174.2" r="4" fill="#0ea5e9" />
  <text x="465" y="170" class="label" fill="#0ea5e9">Шаг 1</text>
  <line x1="300" y1="300" x2="384.4" y2="118.8" class="vector" />
  <circle cx="384.4" cy="118.8" r="4" fill="#0ea5e9" />
  <text x="395" y="115" class="label" fill="#0ea5e9">Шаг 2</text>
  <line x1="300" y1="300" x2="296.6" y2="100.2" class="vector-final" />
  <circle cx="296.6" cy="100.2" r="5" fill="#10b981" />
  <text x="280" y="90" class="label" text-anchor="end" font-weight="bold" fill="#10b981">Шаг 3 (Пик)</text>
</svg>`,

    'platforms': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" role="img" aria-label="Платформы">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 14px; font-weight: bold; fill: currentColor; }
    .sh { font-family: sans-serif; font-size: 12px; font-weight: bold; fill: currentColor; }
    .l { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .a { stroke: #0ea5e9; fill: none; stroke-width: 2; }
    .af { fill: #0ea5e9; }
    .w { stroke: #ef4444; fill: none; stroke-width: 1.2; opacity: 0.7; }
  </style>
  <text x="380" y="26" class="h" text-anchor="middle">Три главные платформы кубитов</text>
  <rect x="20" y="50" width="230" height="230" class="l" rx="6"/>
  <text x="135" y="76" class="h" text-anchor="middle" fill="#0ea5e9">Сверхпроводники</text>
  <text x="135" y="94" class="t" text-anchor="middle">IBM, Google, Rigetti</text>
  <rect x="75" y="115" width="120" height="80" class="l" rx="3"/>
  <rect x="90" y="130" width="90" height="50" fill="#0ea5e9" opacity="0.15"/>
  <circle cx="135" cy="155" r="10" class="a"/>
  <circle cx="105" cy="155" r="4" class="af"/>
  <circle cx="165" cy="155" r="4" class="af"/>
  <text x="135" y="220" class="sh" text-anchor="middle">Плюсы</text>
  <text x="135" y="238" class="t" text-anchor="middle">Быстрые гейты</text>
  <text x="135" y="256" class="sh" text-anchor="middle">Минусы</text>
  <text x="135" y="274" class="t" text-anchor="middle">Нужны криостаты ~ −273 °C</text>
  <rect x="265" y="50" width="230" height="230" class="l" rx="6"/>
  <text x="380" y="76" class="h" text-anchor="middle" fill="#0ea5e9">Ионы в ловушках</text>
  <text x="380" y="94" class="t" text-anchor="middle">IonQ, Quantinuum</text>
  <line x1="300" y1="155" x2="460" y2="155" class="l"/>
  <circle cx="320" cy="155" r="9" class="a"/>
  <circle cx="380" cy="155" r="9" class="a"/>
  <circle cx="440" cy="155" r="9" class="a"/>
  <path d="M 320 135 Q 350 110 380 135 Q 410 110 440 135" class="w"/>
  <text x="380" y="125" class="t" text-anchor="middle">лазерные импульсы</text>
  <text x="380" y="220" class="sh" text-anchor="middle">Плюсы</text>
  <text x="380" y="238" class="t" text-anchor="middle">Высокая точность</text>
  <text x="380" y="256" class="sh" text-anchor="middle">Минусы</text>
  <text x="380" y="274" class="t" text-anchor="middle">Медленные гейты</text>
  <rect x="510" y="50" width="230" height="230" class="l" rx="6"/>
  <text x="625" y="76" class="h" text-anchor="middle" fill="#0ea5e9">Фотоника</text>
  <text x="625" y="94" class="t" text-anchor="middle">Xanadu, PsiQuantum</text>
  <path d="M 545 155 Q 565 130 585 155 T 625 155 T 665 155 T 705 155" class="a"/>
  <circle cx="585" cy="155" r="5" class="af"/>
  <circle cx="645" cy="155" r="5" class="af"/>
  <text x="625" y="220" class="sh" text-anchor="middle">Плюсы</text>
  <text x="625" y="238" class="t" text-anchor="middle">Комнатная температура</text>
  <text x="625" y="256" class="sh" text-anchor="middle">Минусы</text>
  <text x="625" y="274" class="t" text-anchor="middle">Сложно удержать фотон</text>
</svg>`,

    'quantum-gates': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" role="img" aria-label="Гейты">
  <style>
    .sphere { stroke: #94a3b8; stroke-width: 1.5; fill: none; }
    .axis { stroke: #64748b; stroke-width: 1.5; fill: none; }
    .vec { stroke: #0ea5e9; stroke-width: 2.5; fill: none; }
    .label { font-family: sans-serif; font-size: 12px; fill: currentColor; }
  </style>
  <text x="100" y="30" class="label" text-anchor="middle" font-weight="bold">Начало (|0⟩)</text>
  <circle cx="100" cy="150" r="80" class="sphere" />
  <line x1="20" y1="150" x2="180" y2="150" class="axis" />
  <line x1="100" y1="70" x2="100" y2="230" class="axis" />
  <line x1="100" y1="150" x2="100" y2="70" class="vec" />
  <text x="100" y="60" class="label" text-anchor="middle">|0⟩</text>
  <text x="300" y="30" class="label" text-anchor="middle" font-weight="bold">Гейт X (NOT)</text>
  <path d="M 230 150 L 270 150" stroke="#f59e0b" stroke-width="2" marker-end="url(#arr)"/>
  <circle cx="300" cy="150" r="80" class="sphere" />
  <line x1="220" y1="150" x2="380" y2="150" class="axis" />
  <line x1="300" y1="70" x2="300" y2="230" class="axis" />
  <line x1="300" y1="150" x2="300" y2="230" class="vec" />
  <text x="300" y="250" class="label" text-anchor="middle">|1⟩</text>
  <text x="500" y="30" class="label" text-anchor="middle" font-weight="bold">Гейт H</text>
  <path d="M 430 150 L 470 150" stroke="#f59e0b" stroke-width="2" marker-end="url(#arr)"/>
  <circle cx="500" cy="150" r="80" class="sphere" />
  <line x1="420" y1="150" x2="580" y2="150" class="axis" />
  <line x1="500" y1="70" x2="500" y2="230" class="axis" />
  <line x1="500" y1="150" x2="560" y2="150" class="vec" />
  <text x="560" y="160" class="label">(|0⟩+|1⟩)/√2</text>
</svg>`,

    'cnot-entanglement': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" role="img" aria-label="CNOT">
  <style>
    .line { stroke: currentColor; stroke-width: 1.5; fill: none; }
    .gate { fill: #0ea5e9; stroke: #0ea5e9; }
    .text { font-family: sans-serif; font-size: 14px; fill: currentColor; }
  </style>
  <text x="250" y="30" class="text" text-anchor="middle" font-weight="bold">Создание запутанности</text>
  <text x="50" y="100" class="text">Кубит 1</text>
  <line x1="120" y1="95" x2="400" y2="95" class="line" />
  <rect x="200" y="75" width="40" height="40" fill="#fff" stroke="#0ea5e9" stroke-width="2"/>
  <text x="220" y="100" class="text" text-anchor="middle" fill="#0ea5e9">H</text>
  <text x="50" y="200" class="text">Кубит 2</text>
  <line x1="120" y1="195" x2="400" y2="195" class="line" />
  <line x1="220" y1="115" x2="220" y2="175" class="line" />
  <circle cx="220" cy="195" r="15" class="line" />
  <line x1="205" y1="195" x2="235" y2="195" class="line" />
  <line x1="220" y1="180" x2="220" y2="210" class="line" />
  <text x="250" y="270" class="text" text-anchor="middle">Результат: (|00⟩ + |11⟩)/√2</text>
</svg>`,

    'decoherence': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 240" role="img" aria-label="Декогеренция">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 13px; font-weight: bold; fill: currentColor; }
    .l { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .a { stroke: #0ea5e9; fill: none; stroke-width: 2.5; }
    .af { fill: #0ea5e9; }
    .w { stroke: #ef4444; fill: none; stroke-width: 1.5; opacity: 0.6; }
    .ar { stroke: #ef4444; fill: none; stroke-width: 2.5; }
  </style>
  <text x="380" y="24" class="h" text-anchor="middle">Декогеренция: разрушение суперпозиции</text>
  <text x="120" y="56" class="h" text-anchor="middle">Чистое состояние</text>
  <circle cx="120" cy="140" r="60" class="l"/>
  <line x1="120" y1="200" x2="120" y2="80" class="l" opacity="0.3"/>
  <line x1="60" y1="140" x2="180" y2="140" class="l" opacity="0.3"/>
  <line x1="120" y1="140" x2="170" y2="100" class="a"/>
  <circle cx="170" cy="100" r="4" class="af"/>
  <text x="120" y="226" class="t" text-anchor="middle">Вектор в суперпозиции</text>
  <path d="M 200 140 L 260 140" class="a"/>
  <path d="M 255 135 L 260 140 L 255 145" class="a"/>
  <text x="230" y="130" class="t" text-anchor="middle">среда</text>
  <text x="380" y="56" class="h" text-anchor="middle">Шум</text>
  <circle cx="380" cy="140" r="60" class="l"/>
  <line x1="380" y1="200" x2="380" y2="80" class="l" opacity="0.3"/>
  <line x1="320" y1="140" x2="440" y2="140" class="l" opacity="0.3"/>
  <line x1="380" y1="140" x2="430" y2="100" class="a" opacity="0.4"/>
  <path d="M 340 100 Q 355 90 370 110 T 400 110 Q 415 90 430 100" class="w"/>
  <path d="M 340 180 Q 355 170 370 190 T 400 190 Q 415 170 430 180" class="w"/>
  <text x="380" y="226" class="t" text-anchor="middle">Фаза размывается</text>
  <path d="M 460 140 L 520 140" class="ar"/>
  <path d="M 515 135 L 520 140 L 515 145" class="ar"/>
  <text x="490" y="130" class="t" text-anchor="middle">сбой</text>
  <text x="640" y="56" class="h" text-anchor="middle">Коллапс</text>
  <circle cx="640" cy="140" r="60" class="l"/>
  <line x1="640" y1="200" x2="640" y2="80" class="l" opacity="0.3"/>
  <line x1="580" y1="140" x2="700" y2="140" class="l" opacity="0.3"/>
  <line x1="640" y1="140" x2="640" y2="100" class="ar"/>
  <circle cx="640" cy="100" r="4" fill="#ef4444"/>
  <text x="640" y="226" class="t" text-anchor="middle">Остался только |0⟩ или |1⟩</text>
</svg>`,

    'shor-qft': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 250" role="img" aria-label="Квантовое преобразование Фурье">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 14px; font-weight: bold; fill: currentColor; }
    .bar { fill: #0ea5e9; }
    .axis { stroke: #64748b; stroke-width: 1.5; fill: none; }
  </style>
  <text x="150" y="30" class="h" text-anchor="middle">До QFT (разброс)</text>
  <line x1="50" y1="150" x2="250" y2="150" class="axis"/>
  <rect x="60" y="130" width="10" height="20" class="bar"/>
  <rect x="90" y="110" width="10" height="40" class="bar"/>
  <rect x="120" y="140" width="10" height="10" class="bar"/>
  <rect x="150" y="120" width="10" height="30" class="bar"/>
  <rect x="180" y="110" width="10" height="40" class="bar"/>
  <rect x="210" y="140" width="10" height="10" class="bar"/>
  <path d="M 270 100 L 330 100" stroke="#f59e0b" stroke-width="2" marker-end="url(#arr)"/>
  <text x="300" y="90" class="t" text-anchor="middle" fill="#f59e0b">QFT</text>
  <text x="450" y="30" class="h" text-anchor="middle">После QFT (пик)</text>
  <line x1="350" y1="150" x2="550" y2="150" class="axis"/>
  <rect x="360" y="145" width="10" height="5" class="bar"/>
  <rect x="390" y="145" width="10" height="5" class="bar"/>
  <rect x="420" y="50" width="10" height="100" class="bar"/>
  <rect x="450" y="145" width="10" height="5" class="bar"/>
  <rect x="480" y="145" width="10" height="5" class="bar"/>
  <rect x="510" y="145" width="10" height="5" class="bar"/>
  <text x="425" y="40" class="t" text-anchor="middle" font-weight="bold">Период</text>
</svg>`,

    'euler-hamilton': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 300" role="img" aria-label="Эйлеров и Гамильтонов пути">
  <style>
    .node { fill: #0ea5e9; }
    .edge { stroke: #64748b; stroke-width: 2; fill: none; }
    .path { stroke: #10b981; stroke-width: 3; fill: none; }
    .label { font-family: sans-serif; font-size: 14px; fill: currentColor; text-anchor: middle; font-weight: bold; }
    .title { font-family: sans-serif; font-size: 16px; fill: currentColor; text-anchor: middle; font-weight: bold; }
  </style>
  <text x="175" y="30" class="title">Эйлеров путь (обход рёбер)</text>
  <g transform="translate(100, 50)">
    <circle cx="75" cy="50" r="12" class="node"/>
    <circle cx="75" cy="150" r="12" class="node"/>
    <circle cx="175" cy="50" r="12" class="node"/>
    <circle cx="175" cy="150" r="12" class="node"/>
    <line x1="75" y1="50" x2="75" y2="150" class="edge"/>
    <line x1="75" y1="50" x2="175" y2="50" class="edge"/>
    <line x1="75" y1="150" x2="175" y2="150" class="edge"/>
    <line x1="75" y1="50" x2="175" y2="150" class="edge"/>
    <line x1="175" y1="50" x2="75" y2="150" class="edge"/>
    <path d="M 75 50 L 175 50 L 175 150 L 75 150 L 75 50 L 175 150" class="path" stroke-dasharray="6 4"/>
    <text x="75" y="40" class="label">A</text>
    <text x="75" y="180" class="label">B</text>
    <text x="175" y="40" class="label">C</text>
    <text x="175" y="180" class="label">D</text>
  </g>
  <text x="525" y="30" class="title">Гамильтонов путь (обход вершин)</text>
  <g transform="translate(450, 50)">
    <circle cx="75" cy="50" r="12" class="node"/>
    <circle cx="75" cy="150" r="12" class="node"/>
    <circle cx="175" cy="50" r="12" class="node"/>
    <circle cx="175" cy="150" r="12" class="node"/>
    <line x1="75" y1="50" x2="75" y2="150" class="edge"/>
    <line x1="75" y1="50" x2="175" y2="50" class="edge"/>
    <line x1="75" y1="150" x2="175" y2="150" class="edge"/>
    <line x1="75" y1="50" x2="175" y2="150" class="edge"/>
    <line x1="175" y1="50" x2="75" y2="150" class="edge"/>
    <path d="M 75 50 L 175 50 L 75 150 L 175 150" class="path"/>
    <text x="75" y="40" class="label">A</text>
    <text x="75" y="180" class="label">B</text>
    <text x="175" y="40" class="label">C</text>
    <text x="175" y="180" class="label">D</text>
  </g>
</svg>`
};
