/* ============================================================
   QUANTUM-DIAGRAMS.JS — SVG-схемы для модуля «Квантовый компьютер»
   Каждая диаграмма — самостоятельный SVG. Использовать через
   блок { type: 'image', src: 'ключ', caption: '...' } в занятиях.
   ============================================================ */

const QUANTUM_DIAGRAMS = {

    /* ----------------------------------------------------------
       ЗАНЯТИЕ 0. Карта всего интенсива
       ---------------------------------------------------------- */
    'course-overview': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 220" role="img" aria-label="Карта интенсива">
  <style>
    .t { font-family: sans-serif; font-size: 13px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 13px; font-weight: bold; fill: currentColor; }
    .l { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .a { stroke: #3498db; fill: none; stroke-width: 2; }
    .af { fill: #3498db; }
  </style>

  <!-- Этап 1 -->
  <rect x="20" y="60" width="120" height="70" class="l" rx="6"/>
  <text x="80" y="88" class="h" text-anchor="middle">Проблема</text>
  <text x="80" y="108" class="t" text-anchor="middle">N шагов</text>
  <text x="80" y="122" class="t" text-anchor="middle">последовательного</text>
  <text x="80" y="134" class="t" text-anchor="middle">перебора</text>

  <path d="M 145 95 L 175 95" class="a"/>
  <path d="M 170 90 L 175 95 L 170 100" class="a"/>

  <!-- Этап 2 -->
  <rect x="180" y="60" width="120" height="70" class="l" rx="6"/>
  <text x="240" y="88" class="h" text-anchor="middle">Кубит</text>
  <text x="240" y="108" class="t" text-anchor="middle">стрелка-вектор</text>
  <text x="240" y="122" class="t" text-anchor="middle">суперпозиция</text>
  <text x="240" y="134" class="t" text-anchor="middle">равных амплитуд</text>

  <path d="M 305 95 L 335 95" class="a"/>
  <path d="M 330 90 L 335 95 L 330 100" class="a"/>

  <!-- Этап 3 -->
  <rect x="340" y="60" width="120" height="70" class="l" rx="6"/>
  <text x="400" y="88" class="h" text-anchor="middle">Оракул</text>
  <text x="400" y="108" class="t" text-anchor="middle">переворот знака</text>
  <text x="400" y="122" class="t" text-anchor="middle">правильный ответ</text>
  <text x="400" y="134" class="t" text-anchor="middle">становится −</text>

  <path d="M 465 95 L 495 95" class="a"/>
  <path d="M 490 90 L 495 95 L 490 100" class="a"/>

  <!-- Этап 4 -->
  <rect x="500" y="60" width="120" height="70" class="l" rx="6"/>
  <text x="560" y="88" class="h" text-anchor="middle">Диффузия</text>
  <text x="560" y="108" class="t" text-anchor="middle">отражение</text>
  <text x="560" y="122" class="t" text-anchor="middle">относительно</text>
  <text x="560" y="134" class="t" text-anchor="middle">среднего</text>

  <path d="M 625 95 L 655 95" class="a"/>
  <path d="M 650 90 L 655 95 L 650 100" class="a"/>

  <!-- Этап 5 -->
  <rect x="660" y="60" width="90" height="70" class="af" rx="6"/>
  <text x="705" y="88" class="h" text-anchor="middle" fill="#fff">Ответ</text>
  <text x="705" y="108" class="t" text-anchor="middle" fill="#fff">√N шагов</text>
  <text x="705" y="128" class="t" text-anchor="middle" fill="#fff">вместо N</text>

  <text x="380" y="40" class="h" text-anchor="middle">Путь одного квантового вычисления</text>
  <text x="380" y="180" class="t" text-anchor="middle">Каждый следующий блок — поворот вектора состояния в сторону правильной оси.</text>
  <text x="380" y="200" class="t" text-anchor="middle">Итерация повторяется, пока стрелка не встанет вертикально.</text>
</svg>`.trim(),

    /* ----------------------------------------------------------
       ЗАНЯТИЕ 1. Классический перебор vs параллельный шум
       ---------------------------------------------------------- */
    'classical-vs-quantum': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 260" role="img" aria-label="Классический перебор и параллельный шум">
  <style>
    .t { font-family: sans-serif; font-size: 13px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 14px; font-weight: bold; fill: currentColor; }
    .l { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .e { stroke: #c0392b; fill: none; stroke-width: 1; opacity: 0.7; }
    .a { stroke: #3498db; fill: none; stroke-width: 2; }
    .ah { fill: #3498db; stroke: #3498db; stroke-width: 1.5; }
  </style>

  <text x="20" y="24" class="h">Классический перебор</text>
  <text x="400" y="24" class="h">Наивный параллелизм</text>

  <!-- Левая панель: последовательная проверка -->
  <rect x="20"  y="55" width="36" height="36" class="l"/>
  <line x1="24"  y1="59" x2="52"  y2="87" class="l"/>
  <line x1="52"  y1="59" x2="24"  y2="87" class="l"/>

  <rect x="64"  y="55" width="36" height="36" class="l"/>
  <line x1="68"  y1="59" x2="96"  y2="87" class="l"/>
  <line x1="96"  y1="59" x2="68"  y2="87" class="l"/>

  <rect x="108" y="55" width="36" height="36" class="l"/>
  <line x1="112" y1="59" x2="140" y2="87" class="l"/>
  <line x1="140" y1="59" x2="112" y2="87" class="l"/>

  <rect x="152" y="55" width="36" height="36" class="ah"/>
  <text x="170" y="80" font-family="sans-serif" font-size="18" font-weight="bold" fill="#fff" text-anchor="middle">★</text>

  <rect x="196" y="55" width="36" height="36" class="l"/>
  <rect x="240" y="55" width="36" height="36" class="l"/>

  <text x="20" y="135" class="t">Нашли приз за 4 шага из 6.</text>
  <text x="20" y="155" class="t">Миллион коробок → миллион шагов.</text>
  <text x="20" y="175" class="t">В среднем — 500 000 проверок.</text>

  <!-- Правая панель: параллельный шум -->
  <rect x="400" y="55" width="26" height="26" class="l"/>
  <path d="M 413 81 Q 420 105 480 140" class="e"/>

  <rect x="436" y="55" width="26" height="26" class="l"/>
  <path d="M 449 81 Q 458 105 490 140" class="e"/>

  <rect x="472" y="55" width="26" height="26" class="ah"/>
  <text x="485" y="73" font-family="sans-serif" font-size="13" fill="#fff" text-anchor="middle">★</text>
  <path d="M 485 81 L 500 140" class="a"/>

  <rect x="508" y="55" width="26" height="26" class="l"/>
  <path d="M 521 81 Q 515 105 510 140" class="e"/>

  <rect x="544" y="55" width="26" height="26" class="l"/>
  <path d="M 557 81 Q 550 105 520 140" class="e"/>

  <rect x="580" y="55" width="26" height="26" class="l"/>
  <path d="M 593 81 Q 590 105 530 140" class="e"/>

  <circle cx="500" cy="180" r="28" class="l"/>
  <text x="500" y="190" class="h" text-anchor="middle" font-size="22">?</text>

  <text x="400" y="235" class="t">Сигнал тонет в шуме пустых коробок.</text>
  <text x="400" y="252" class="t">Приёмник не различает ответ и гул.</text>
</svg>`.trim(),

    /* ----------------------------------------------------------
       ЗАНЯТИЕ 2. Вектор состояния в 3D
       ---------------------------------------------------------- */
        'vector-3d': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" role="img" aria-label="Вектор состояния с равными проекциями на три оси">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 13px; font-weight: bold; fill: currentColor; }
    .ax { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .axp { stroke: currentColor; fill: none; stroke-width: 1; stroke-dasharray: 4 4; opacity: 0.5; }
    .a { stroke: #3498db; fill: none; stroke-width: 2.5; }
    .af { fill: #3498db; }
    .proj { fill: #27ae60; }
    .lbl { fill: #27ae60; font-family: sans-serif; font-size: 11px; font-weight: bold; }
    .ctr { fill: currentColor; }
  </style>

  <!-- Оси -->
  <line x1="280" y1="240" x2="470" y2="273" class="ax"/>
  <path d="M 470 273 L 462 267 M 470 273 L 463 277" class="ax"/>
  <text x="478" y="282" class="h">X</text>
  <text x="478" y="298" class="t">Коробка 1 (★)</text>

  <line x1="280" y1="240" x2="310" y2="70" class="ax"/>
  <path d="M 310 70 L 304 78 M 310 70 L 315 78" class="ax"/>
  <text x="316" y="70" class="h">Y</text>
  <text x="316" y="86" class="t">Коробка 2</text>

  <line x1="280" y1="240" x2="170" y2="130" class="ax"/>
  <path d="M 170 130 L 178 132 M 170 130 L 176 137" class="ax"/>
  <text x="160" y="124" class="h" text-anchor="end">Z</text>
  <text x="160" y="140" class="t" text-anchor="end">Коробка 3</text>

  <!-- Точки проекций -->
  <circle cx="367" cy="257" r="5" class="proj"/>
  <text x="378" y="252" class="lbl">+0,58</text>

  <circle cx="297" cy="153" r="5" class="proj"/>
  <text x="308" y="150" class="lbl">+0,58</text>

  <circle cx="219" cy="179" r="5" class="proj"/>
  <text x="200" y="175" class="lbl" text-anchor="end">+0,58</text>

  <!-- Пунктиры от конца вектора к проекциям -->
  <line x1="323" y1="109" x2="367" y2="257" class="axp"/>
  <line x1="323" y1="109" x2="297" y2="153" class="axp"/>
  <line x1="323" y1="109" x2="219" y2="179" class="axp"/>

  <!-- Центр и вектор -->
  <circle cx="280" cy="240" r="4" class="ctr"/>
  <line x1="280" y1="240" x2="323" y2="109" class="a"/>
  <path d="M 323 109 L 313 115 M 323 109 L 317 118" fill="#3498db"/>

  <text x="330" y="100" class="h" fill="#3498db">Вектор состояния</text>
  <text x="330" y="118" class="t">Все проекции равны</text>

  <text x="320" y="360" class="h" text-anchor="middle">Стартовое состояние после гейта Адамара</text>
  <text x="320" y="380" class="t" text-anchor="middle">Все проекции +0,58 — все три коробки равновероятны</text>
  <text x="320" y="400" class="t" text-anchor="middle">(схематично: точные пропорции 3D на плоскости не передать)</text>
</svg>`.trim(),

    /* ----------------------------------------------------------
       ЗАНЯТИЕ 3. Оракул и диффузия
       ---------------------------------------------------------- */
    'oracle-diffusion': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 340" role="img" aria-label="Три состояния вектора: старт, после оракула, после диффузии">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 13px; font-weight: bold; fill: currentColor; }
    .axis { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .bar-plus { fill: #3498db; }
    .bar-minus { fill: #c0392b; }
    .lbl { font-family: sans-serif; font-size: 11px; fill: currentColor; text-anchor: middle; }
  </style>

  <text x="380" y="22" class="h" text-anchor="middle">Один цикл алгоритма Гровера: три состояния</text>

  <!-- Панель 1: старт -->
  <text x="130" y="52" class="h" text-anchor="middle">Старт</text>
  <line x1="40" y1="180" x2="220" y2="180" class="axis"/>
  <rect x="55"  y="100" width="40" height="80" class="bar-plus"/>
  <text x="75"  y="94" class="lbl">+0,58</text>
  <text x="75"  y="200" class="lbl">X</text>
  <rect x="115" y="100" width="40" height="80" class="bar-plus"/>
  <text x="135" y="94" class="lbl">+0,58</text>
  <text x="135" y="200" class="lbl">Y</text>
  <rect x="175" y="100" width="40" height="80" class="bar-plus"/>
  <text x="195" y="94" class="lbl">+0,58</text>
  <text x="195" y="200" class="lbl">Z</text>

  <text x="130" y="230" class="t" text-anchor="middle">Все амплитуды равны,</text>
  <text x="130" y="246" class="t" text-anchor="middle">все знаки «плюс».</text>

  <!-- Стрелка -->
  <path d="M 235 180 L 265 180" stroke="#3498db" fill="none" stroke-width="2"/>
  <path d="M 260 175 L 265 180 L 260 185" stroke="#3498db" fill="none" stroke-width="2"/>
  <text x="250" y="170" class="t" text-anchor="middle">Оракул</text>

  <!-- Панель 2: после оракула -->
  <text x="380" y="52" class="h" text-anchor="middle">После оракула</text>
  <line x1="290" y1="180" x2="470" y2="180" class="axis"/>
  <rect x="305" y="180" width="40" height="80" class="bar-minus"/>
  <text x="325" y="276" class="lbl">−0,58</text>
  <text x="325" y="200" class="lbl">X</text>
  <rect x="365" y="100" width="40" height="80" class="bar-plus"/>
  <text x="385" y="94" class="lbl">+0,58</text>
  <text x="385" y="200" class="lbl">Y</text>
  <rect x="425" y="100" width="40" height="80" class="bar-plus"/>
  <text x="445" y="94" class="lbl">+0,58</text>
  <text x="445" y="200" class="lbl">Z</text>

  <text x="380" y="300" class="t" text-anchor="middle">Оракул пометил минусом</text>
  <text x="380" y="316" class="t" text-anchor="middle">только правильную ось X.</text>

  <!-- Стрелка -->
  <path d="M 485 180 L 515 180" stroke="#3498db" fill="none" stroke-width="2"/>
  <path d="M 510 175 L 515 180 L 510 185" stroke="#3498db" fill="none" stroke-width="2"/>
  <text x="500" y="170" class="t" text-anchor="middle">Диффузия</text>

  <!-- Панель 3: после диффузии -->
  <text x="630" y="52" class="h" text-anchor="middle">После диффузии</text>
  <line x1="540" y1="180" x2="720" y2="180" class="axis"/>
  <!-- X: +0.96 → 132 px вверх -->
  <rect x="555" y="48" width="40" height="132" class="bar-plus"/>
  <text x="575" y="42" class="lbl">+0,96</text>
  <text x="575" y="200" class="lbl">X</text>
  <!-- Y: −0.20 → 28 px вниз -->
  <rect x="615" y="180" width="40" height="28" class="bar-minus"/>
  <text x="635" y="226" class="lbl">−0,20</text>
  <text x="635" y="200" class="lbl">Y</text>
  <!-- Z: −0.20 → 28 px вниз -->
  <rect x="675" y="180" width="40" height="28" class="bar-minus"/>
  <text x="695" y="226" class="lbl">−0,20</text>
  <text x="695" y="200" class="lbl">Z</text>

  <text x="630" y="270" class="t" text-anchor="middle">Правильная ось выросла,</text>
  <text x="630" y="286" class="t" text-anchor="middle">неправильные — погасли.</text>
</svg>`.trim(),

    /* ----------------------------------------------------------
       ЗАНЯТИЕ 4. Вращение вектора по окружности
       ---------------------------------------------------------- */
        'grover-rotation': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 480" role="img" aria-label="Вращение вектора состояния по окружности">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 13px; font-weight: bold; fill: currentColor; }
    .ax { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .circ { stroke: currentColor; fill: none; stroke-width: 1; opacity: 0.35; }
    .a { stroke: #3498db; fill: none; stroke-width: 2.5; }
    .af { fill: #3498db; }
    .am { stroke: #e67e22; fill: none; stroke-width: 2.5; }
    .amf { fill: #e67e22; }
    .ar { stroke: #c0392b; fill: none; stroke-width: 2.5; stroke-dasharray: 5 4; }
    .arc { stroke: #27ae60; fill: none; stroke-width: 1.5; }
    .ctr { fill: currentColor; }
  </style>

  <!-- Круг вращения -->
  <circle cx="300" cy="260" r="150" class="circ"/>
  <circle cx="300" cy="260" r="4" class="ctr"/>

  <!-- Оси -->
  <line x1="120" y1="260" x2="500" y2="260" class="ax"/>
  <path d="M 500 260 L 492 255 M 500 260 L 492 265" class="ax"/>
  <text x="510" y="264" class="t">ошибки</text>

  <line x1="300" y1="440" x2="300" y2="80" class="ax"/>
  <path d="M 300 80 L 295 88 M 300 80 L 305 88" class="ax"/>
  <text x="300" y="70" class="h" text-anchor="middle">правильный ответ</text>

  <!-- Дуги углов -->
  <path d="M 350 260 A 50 50 0 0 1 348 247" class="arc"/>
  <text x="358" y="250" class="t" fill="#27ae60">θ</text>

  <path d="M 348 247 A 50 50 0 0 1 335 224" class="arc"/>
  <text x="352" y="225" class="t" fill="#27ae60">2θ</text>

  <path d="M 335 224 A 50 50 0 0 1 313 212" class="arc"/>
  <text x="315" y="200" class="t" fill="#27ae60">2θ</text>

  <path d="M 313 212 A 50 50 0 0 1 288 212" class="arc"/>
  <text x="280" y="195" class="t" fill="#27ae60" text-anchor="end">2θ</text>

  <!-- Векторы (все длиной 150) -->
  <!-- Старт: 15° -->
  <line x1="300" y1="260" x2="445" y2="221" class="a"/>
  <circle cx="445" cy="221" r="4" class="af"/>
  <text x="450" y="220" class="t">Старт (θ)</text>

  <!-- После 1 итерации: 45° -->
  <line x1="300" y1="260" x2="406" y2="154" class="a"/>
  <circle cx="406" cy="154" r="4" class="af"/>
  <text x="412" y="150" class="t">Итерация 1 (3θ)</text>

  <!-- После 2 итераций: 75° -->
  <line x1="300" y1="260" x2="339" y2="115" class="am"/>
  <circle cx="339" cy="115" r="4" class="amf"/>
  <text x="345" y="112" class="t" fill="#e67e22">Итерация 2 (5θ)</text>

  <!-- Перелёт: 105° -->
  <line x1="300" y1="260" x2="261" y2="115" class="ar"/>
  <circle cx="261" cy="115" r="4" fill="#c0392b"/>
  <text x="255" y="112" class="t" fill="#c0392b" text-anchor="end">Перелёт (7θ)</text>

  <text x="300" y="460" class="t" text-anchor="middle">Все векторы одной длины — состояние вращается, не растягивается.</text>
  <text x="300" y="475" class="t" text-anchor="middle">Каждая итерация прибавляет угол 2θ. Пик — на вертикали.</text>
</svg>`.trim(),

    /* ----------------------------------------------------------
       ЗАНЯТИЕ 5. Физические платформы
       ---------------------------------------------------------- */
    'platforms': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" role="img" aria-label="Сравнение физических платформ кубитов">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 14px; font-weight: bold; fill: currentColor; }
    .sh { font-family: sans-serif; font-size: 12px; font-weight: bold; fill: currentColor; }
    .l { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .a { stroke: #3498db; fill: none; stroke-width: 2; }
    .af { fill: #3498db; }
    .w { stroke: #c0392b; fill: none; stroke-width: 1.2; opacity: 0.7; }
  </style>

  <text x="380" y="26" class="h" text-anchor="middle">Три главные платформы кубитов</text>

  <!-- Сверхпроводники -->
  <rect x="20" y="50" width="230" height="230" class="l" rx="8"/>
  <text x="135" y="76" class="h" text-anchor="middle" fill="#3498db">Сверхпроводники</text>
  <text x="135" y="94" class="t" text-anchor="middle">IBM, Google, Rigetti</text>

  <!-- Чип -->
  <rect x="75" y="115" width="120" height="80" class="l" rx="3"/>
  <rect x="90" y="130" width="90" height="50" fill="#3498db" opacity="0.15"/>
  <circle cx="135" cy="155" r="10" class="a"/>
  <circle cx="105" cy="155" r="4" class="af"/>
  <circle cx="165" cy="155" r="4" class="af"/>
  <line x1="75" y1="125" x2="65" y2="125" class="l"/>
  <line x1="75" y1="155" x2="65" y2="155" class="l"/>
  <line x1="75" y1="185" x2="65" y2="185" class="l"/>
  <line x1="195" y1="125" x2="205" y2="125" class="l"/>
  <line x1="195" y1="155" x2="205" y2="155" class="l"/>
  <line x1="195" y1="185" x2="205" y2="185" class="l"/>

  <text x="135" y="220" class="sh" text-anchor="middle">Плюсы</text>
  <text x="135" y="238" class="t" text-anchor="middle">Быстрые гейты, масштабируются</text>
  <text x="135" y="256" class="sh" text-anchor="middle">Минусы</text>
  <text x="135" y="274" class="t" text-anchor="middle">Нужны криостаты ~ −273 °C</text>

  <!-- Ионы в ловушках -->
  <rect x="265" y="50" width="230" height="230" class="l" rx="8"/>
  <text x="380" y="76" class="h" text-anchor="middle" fill="#3498db">Ионы в ловушках</text>
  <text x="380" y="94" class="t" text-anchor="middle">IonQ, Quantinuum</text>

  <!-- Ионы -->
  <line x1="300" y1="155" x2="460" y2="155" class="l"/>
  <circle cx="320" cy="155" r="9" class="a"/>
  <circle cx="380" cy="155" r="9" class="a"/>
  <circle cx="440" cy="155" r="9" class="a"/>
  <path d="M 320 135 Q 350 110 380 135 Q 410 110 440 135" class="w"/>
  <text x="380" y="125" class="t" text-anchor="middle">лазерные импульсы</text>

  <text x="380" y="220" class="sh" text-anchor="middle">Плюсы</text>
  <text x="380" y="238" class="t" text-anchor="middle">Высокая точность операций</text>
  <text x="380" y="256" class="sh" text-anchor="middle">Минусы</text>
  <text x="380" y="274" class="t" text-anchor="middle">Медленные гейты</text>

  <!-- Фотоника -->
  <rect x="510" y="50" width="230" height="230" class="l" rx="8"/>
  <text x="625" y="76" class="h" text-anchor="middle" fill="#3498db">Фотоника</text>
  <text x="625" y="94" class="t" text-anchor="middle">Xanadu, PsiQuantum</text>

  <!-- Фотоны -->
  <path d="M 545 155 Q 565 130 585 155 T 625 155 T 665 155 T 705 155" class="a"/>
  <circle cx="585" cy="155" r="5" class="af"/>
  <circle cx="645" cy="155" r="5" class="af"/>

  <text x="625" y="220" class="sh" text-anchor="middle">Плюсы</text>
  <text x="625" y="238" class="t" text-anchor="middle">Работа при комнатной t°</text>
  <text x="625" y="256" class="sh" text-anchor="middle">Минусы</text>
  <text x="625" y="274" class="t" text-anchor="middle">Сложно удержать фотон</text>
</svg>`.trim(),

    /* ----------------------------------------------------------
       ЗАНЯТИЕ 6. Сравнение сложностей N, √N, log N
       ---------------------------------------------------------- */
    'complexity-curves': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" role="img" aria-label="Сравнение сложностей алгоритмов">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 13px; font-weight: bold; fill: currentColor; }
    .ax { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .l { stroke: currentColor; fill: none; stroke-width: 1; opacity: 0.2; }
    .n { stroke: #c0392b; fill: none; stroke-width: 2.5; }
    .sq { stroke: #3498db; fill: none; stroke-width: 2.5; }
    .lg { stroke: #27ae60; fill: none; stroke-width: 2.5; }
  </style>

  <text x="360" y="24" class="h" text-anchor="middle">Сколько шагов нужно на поиск в базе из N элементов</text>

  <!-- Оси -->
  <line x1="70" y1="340" x2="680" y2="340" class="ax"/>
  <line x1="70" y1="340" x2="70" y2="50" class="ax"/>
  <text x="680" y="360" class="t" text-anchor="end">N (число элементов)</text>
  <text x="60" y="60" class="t" text-anchor="end">шагов</text>

  <!-- Сетка -->
  <line x1="70" y1="270" x2="680" y2="270" class="l"/>
  <line x1="70" y1="200" x2="680" y2="200" class="l"/>
  <line x1="70" y1="130" x2="680" y2="130" class="l"/>
  <line x1="70" y1="60"  x2="680" y2="60"  class="l"/>

  <!-- Кривая N (классика) -->
  <path d="M 70 340 L 680 60" class="n"/>
  <text x="600" y="90" class="t" fill="#c0392b">N — классический перебор</text>

  <!-- Кривая √N (Гровер) -->
  <path d="M 70 340 Q 250 200 680 180" class="sq"/>
  <text x="500" y="170" class="t" fill="#3498db">√N — алгоритм Гровера</text>

  <!-- Кривая log N (Шор) -->
  <path d="M 70 340 Q 250 320 680 300" class="lg"/>
  <text x="500" y="320" class="t" fill="#27ae60">log N — алгоритм Шора</text>

  <!-- Подписи X -->
  <text x="70"  y="358" class="t" text-anchor="middle">1</text>
  <text x="200" y="358" class="t" text-anchor="middle">100</text>
  <text x="350" y="358" class="t" text-anchor="middle">10 000</text>
  <text x="500" y="358" class="t" text-anchor="middle">10⁶</text>
  <text x="650" y="358" class="t" text-anchor="middle">10⁹</text>
  <text x="360" y="388" class="t" text-anchor="middle">Чем ниже кривая — тем быстрее алгоритм на больших N.</text>
  <text x="360" y="406" class="t" text-anchor="middle" font-style="italic" opacity="0.7">Шкала условная: на линейной оси log N был бы почти неотличим от нуля.</text>
</svg>`.trim(),

    /* ----------------------------------------------------------
       ЗАНЯТИЕ 7. Декогеренция
       ---------------------------------------------------------- */
    'decoherence': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 240" role="img" aria-label="Декогеренция: чистое состояние, шум, коллапс">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 13px; font-weight: bold; fill: currentColor; }
    .l { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .a { stroke: #3498db; fill: none; stroke-width: 2.5; }
    .af { fill: #3498db; }
    .w { stroke: #c0392b; fill: none; stroke-width: 1.5; opacity: 0.6; }
    .ar { stroke: #c0392b; fill: none; stroke-width: 2.5; }
  </style>

  <text x="380" y="24" class="h" text-anchor="middle">Декогеренция: как среда уничтожает суперпозицию</text>

  <!-- Состояние 1: чистое -->
  <text x="120" y="56" class="h" text-anchor="middle">Чистое состояние</text>
  <circle cx="120" cy="140" r="60" class="l"/>
  <line x1="120" y1="200" x2="120" y2="80" class="l" opacity="0.3"/>
  <line x1="60" y1="140" x2="180" y2="140" class="l" opacity="0.3"/>
  <line x1="120" y1="140" x2="170" y2="100" class="a"/>
  <circle cx="170" cy="100" r="4" class="af"/>
  <text x="120" y="226" class="t" text-anchor="middle">Стрелка в суперпозиции</text>

  <!-- Стрелка -->
  <path d="M 200 140 L 260 140" class="a"/>
  <path d="M 255 135 L 260 140 L 255 145" class="a"/>
  <text x="230" y="130" class="t" text-anchor="middle">среда</text>

  <!-- Состояние 2: шум -->
  <text x="380" y="56" class="h" text-anchor="middle">Взаимодействие со средой</text>
  <circle cx="380" cy="140" r="60" class="l"/>
  <line x1="380" y1="200" x2="380" y2="80" class="l" opacity="0.3"/>
  <line x1="320" y1="140" x2="440" y2="140" class="l" opacity="0.3"/>
  <line x1="380" y1="140" x2="430" y2="100" class="a" opacity="0.4"/>
  <path d="M 340 100 Q 355 90 370 110 T 400 110 Q 415 90 430 100" class="w"/>
  <path d="M 340 180 Q 355 170 370 190 T 400 190 Q 415 170 430 180" class="w"/>
  <text x="380" y="226" class="t" text-anchor="middle">Шум среды размывает фазу</text>

  <!-- Стрелка -->
  <path d="M 460 140 L 520 140" class="ar"/>
  <path d="M 515 135 L 520 140 L 515 145" class="ar"/>
  <text x="490" y="130" class="t" text-anchor="middle">сбой</text>

  <!-- Состояние 3: коллапс -->
  <text x="640" y="56" class="h" text-anchor="middle">Декогеренция</text>
  <circle cx="640" cy="140" r="60" class="l"/>
  <line x1="640" y1="200" x2="640" y2="80" class="l" opacity="0.3"/>
  <line x1="580" y1="140" x2="700" y2="140" class="l" opacity="0.3"/>
  <line x1="640" y1="140" x2="640" y2="100" class="ar"/>
  <circle cx="640" cy="100" r="4" fill="#c0392b"/>
  <text x="640" y="226" class="t" text-anchor="middle">Стрелка застряла на оси</text>
</svg>`.trim()

    ,

    /* ----------------------------------------------------------
       ЗАНЯТИЕ 7. Однокубитные гейты
       ---------------------------------------------------------- */
    'gates-single': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 380" role="img" aria-label="Однокубитные гейты">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 13px; font-weight: bold; fill: currentColor; }
    .ax { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .a { stroke: #3498db; fill: none; stroke-width: 2.5; }
    .af { fill: #3498db; }
    .g { stroke: #27ae60; fill: none; stroke-width: 2; }
    .gf { fill: #27ae60; }
  </style>

  <text x="360" y="24" class="h" text-anchor="middle">Как гейты меняют стрелку кубита</text>

  <!-- Гейт X -->
  <text x="120" y="56" class="h" text-anchor="middle">X — переворот</text>
  <circle cx="120" cy="140" r="55" class="ax" opacity="0.3"/>
  <line x1="65" y1="140" x2="175" y2="140" class="ax" opacity="0.3"/>
  <line x1="120" y1="85" x2="120" y2="195" class="ax" opacity="0.3"/>
  <line x1="120" y1="140" x2="120" y2="90" class="a"/>
  <circle cx="120" cy="90" r="4" class="af"/>
  <text x="120" y="225" class="t" text-anchor="middle">|0⟩ → |1⟩</text>

  <path d="M 195 140 L 235 140" class="g"/>
  <path d="M 230 135 L 235 140 L 230 145" class="g"/>

  <circle cx="300" cy="140" r="55" class="ax" opacity="0.3"/>
  <line x1="245" y1="140" x2="355" y2="140" class="ax" opacity="0.3"/>
  <line x1="300" y1="85" x2="300" y2="195" class="ax" opacity="0.3"/>
  <line x1="300" y1="140" x2="300" y2="190" class="a"/>
  <circle cx="300" cy="190" r="4" class="af"/>
  <text x="300" y="225" class="t" text-anchor="middle">Результат</text>

  <!-- Гейт H -->
  <text x="500" y="56" class="h" text-anchor="middle">H — суперпозиция</text>
  <circle cx="500" cy="140" r="55" class="ax" opacity="0.3"/>
  <line x1="445" y1="140" x2="555" y2="140" class="ax" opacity="0.3"/>
  <line x1="500" y1="85" x2="500" y2="195" class="ax" opacity="0.3"/>
  <line x1="500" y1="140" x2="500" y2="90" class="a"/>
  <circle cx="500" cy="90" r="4" class="af"/>
  <text x="500" y="225" class="t" text-anchor="middle">|0⟩</text>

  <path d="M 575 140 L 615 140" class="g"/>
  <path d="M 610 135 L 615 140 L 610 145" class="g"/>

  <circle cx="680" cy="140" r="55" class="ax" opacity="0.3"/>
  <line x1="625" y1="140" x2="735" y2="140" class="ax" opacity="0.3"/>
  <line x1="680" y1="85" x2="680" y2="195" class="ax" opacity="0.3"/>
  <line x1="680" y1="140" x2="720" y2="100" class="a"/>
  <circle cx="720" cy="100" r="4" class="af"/>
  <text x="680" y="225" class="t" text-anchor="middle">(|0⟩+|1⟩)/√2</text>

  <text x="360" y="290" class="h" text-anchor="middle">Таблица действий гейтов на базисные состояния</text>
  <text x="180" y="320" class="t" text-anchor="middle">X: |0⟩→|1⟩, |1⟩→|0⟩</text>
  <text x="540" y="320" class="t" text-anchor="middle">Z: |0⟩→|0⟩, |1⟩→−|1⟩</text>
  <text x="180" y="345" class="t" text-anchor="middle">H: |0⟩→(|0⟩+|1⟩)/√2</text>
  <text x="540" y="345" class="t" text-anchor="middle">S: |0⟩→|0⟩, |1⟩→i|1⟩</text>
</svg>`.trim(),

    /* ----------------------------------------------------------
       ЗАНЯТИЕ 8. Двухкубитные гейты
       ---------------------------------------------------------- */
    'gates-double': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" role="img" aria-label="Двухкубитные гейты">
  <style>
    .t { font-family: sans-serif; font-size: 12px; fill: currentColor; }
    .h { font-family: sans-serif; font-size: 13px; font-weight: bold; fill: currentColor; }
    .l { stroke: currentColor; fill: none; stroke-width: 1.5; }
    .c { stroke: #3498db; fill: none; stroke-width: 2.5; }
    .cf { fill: #3498db; }
    .g { stroke: #27ae60; fill: none; stroke-width: 2; }
    .gf { fill: #27ae60; }
  </style>

  <text x="360" y="24" class="h" text-anchor="middle">Двухкубитные гейты</text>

  <!-- CNOT схема -->
  <text x="180" y="60" class="h" text-anchor="middle">CNOT</text>
  <line x1="60" y1="110" x2="300" y2="110" class="l"/>
  <line x1="60" y1="170" x2="300" y2="170" class="l"/>
  <circle cx="180" cy="110" r="8" class="cf"/>
  <circle cx="180" cy="170" r="14" class="c"/>
  <line x1="180" y1="156" x2="180" y2="184" class="c"/>
  <line x1="166" y1="170" x2="194" y2="170" class="c"/>

  <text x="30" y="115" class="t">a</text>
  <text x="30" y="175" class="t">b</text>
  <text x="310" y="115" class="t">a</text>
  <text x="310" y="175" class="t">a⊕b</text>

  <text x="180" y="210" class="t" text-anchor="middle">управляющий → цель</text>

  <!-- CZ схема -->
  <text x="540" y="60" class="h" text-anchor="middle">CZ</text>
  <line x1="420" y1="110" x2="660" y2="110" class="l"/>
  <line x1="420" y1="170" x2="660" y2="170" class="l"/>
  <circle cx="540" cy="110" r="8" class="cf"/>
  <circle cx="540" cy="170" r="8" class="cf"/>
  <line x1="540" y1="118" x2="540" y2="162" class="c"/>

  <text x="390" y="115" class="t">a</text>
  <text x="390" y="175" class="t">b</text>
  <text x="670" y="115" class="t">a</text>
  <text x="670" y="175" class="t">b</text>

  <text x="540" y="210" class="t" text-anchor="middle">симметричный гейт</text>

  <!-- Таблица -->
  <text x="360" y="260" class="h" text-anchor="middle">Что делает CNOT</text>
  <text x="180" y="295" class="t" text-anchor="middle">|00⟩ → |00⟩</text>
  <text x="540" y="295" class="t" text-anchor="middle">|10⟩ → |11⟩</text>
  <text x="180" y="320" class="t" text-anchor="middle">|01⟩ → |01⟩</text>
  <text x="540" y="320" class="t" text-anchor="middle">|11⟩ → |10⟩</text>

  <text x="360" y="365" class="h" text-anchor="middle">H + CNOT = состояние Белла (|00⟩ + |11⟩)/√2</text>
  <text x="360" y="388" class="t" text-anchor="middle">Так рождается запутанность</text>
</svg>`.trim()

};