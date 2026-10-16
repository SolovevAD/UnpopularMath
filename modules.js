/* ============================================================
   MODULES.JS — реестр модулей (без данных занятий — они
   подгружаются лениво из отдельных файлов).
   ============================================================ */

const MODULES = [
    {
        id: 'numeral-systems',
        icon: '🔢',
        title: 'Полный курс систем счисления',
        subtitle: '17 занятий: от позиционных систем до IEEE 754',
        description: 'Полный семестровый курс по системам счисления: теория, машинное представление, арифметика, экзотические системы и практические применения.',
        status: 'available',
        courseFile: 'course.js',
        courseVar: 'COURSE',
        lessonCount: 17,
        hasTools: true,
        toolsTitle: 'Калькуляторы и тренажёр',
        meta: { hours: 34, weeks: 17, level: 'базовый' }
    },
    {
        id: 'quantum-computer',
        icon: '⚛️',
        title: 'Квантовый компьютер',
        subtitle: 'Интенсив: геометрия квантовых вычислений за 9 занятий',
        description: 'Честная физика и геометрия без квантовой магии: кубиты как стрелки, суперпозиция, интерференция, алгоритмы Гровера и Шора, квантовые ошибки, гейты и тренажёр.',
        status: 'available',
        courseFile: 'course-quantum.js',
        courseVar: 'COURSE_QUANTUM',
        lessonCount: 9,
        hasTools: true,
        toolsTitle: 'Тренажёр по квантовым гейтам',
        meta: { hours: 10, weeks: 2, level: 'средний' }
    },
    {
        id: 'boolean-algebra',
        icon: '⊕',
        title: 'Алгебра логики',
        subtitle: '10 занятий: от высказываний до сумматоров',
        description: 'Полный курс алгебры логики: базовые операции, таблицы истинности, законы де Моргана, СДНФ и СКНФ, карты Карно, минимизация и синтез логических схем.',
        status: 'available',
        courseFile: 'course-logic.js',
        courseVar: 'COURSE_LOGIC',
        lessonCount: 10,
        hasTools: true,
        toolsTitle: 'Тренажёр по логике',
        meta: { hours: 12, weeks: 3, level: 'базовый' }
    },
    {
        id: 'graphs',
        icon: '🕸️',
        title: 'Теория графов',
        subtitle: '10 занятий: от степеней до алгоритмов на графах',
        description: 'Основы теории графов и алгоритмы на них: BFS, DFS, алгоритм Дейкстры, минимальное остовное дерево, эйлеровы и гамильтоновы пути.',
        status: 'available',
        courseFile: 'course-graphs.js',
        courseVar: 'COURSE_GRAPHS',
        lessonCount: 10,
        hasTools: true,
        toolsTitle: 'Тренажёр по графам',
        meta: { hours: 13, weeks: 3, level: 'средний' }
    },
    {
        id: 'finite-automata',
        icon: '⚙️',
        title: 'Конечные автоматы',
        subtitle: 'ДКА, НКА, регулярные языки',
        description: 'Как машины распознают языки. Детерминированные и недетерминированные автоматы, регулярные выражения, теорема Клини, минимизация состояний.',
        status: 'soon',
        meta: { hours: 24, weeks: 12, level: 'средний' }
    },
    {
        id: 'combinatorics',
        icon: '🎲',
        title: 'Комбинаторика и дискретная вероятность',
        subtitle: 'Перестановки, сочетания, вероятности',
        description: 'Правила суммы и произведения, перестановки и сочетания, бином Ньютона, принцип Дирихле, основы дискретной вероятности.',
        status: 'soon',
        meta: { hours: 20, weeks: 10, level: 'базовый' }
    },
    {
        id: 'coding-theory',
        icon: '📡',
        title: 'Теория кодирования',
        subtitle: 'Помехоустойчивые коды, Хэмминг',
        description: 'Как передавать данные без ошибок: коды с обнаружением и исправлением ошибок, код Хэмминга, коды Рида-Соломона, сжатие информации.',
        status: 'soon',
        meta: { hours: 26, weeks: 13, level: 'продвинутый' }
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MODULES };
}
