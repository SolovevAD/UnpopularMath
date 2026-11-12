/* ============================================================
   MODULES.JS — реестр модулей (поддержка нескольких файлов)
   ============================================================ */

const MODULES = [
    {
        id: 'numeral-systems',
        icon: '🔢',
        title: 'Полный курс систем счисления',
        subtitle: '17 занятий: от позиционных систем до IEEE 754',
        description: 'Полный семестровый курс по системам счисления: теория, машинное представление, арифметика, экзотические системы и практические применения.',
        status: 'available',
        courseFiles: ['courses/course.js'], // Теперь массив
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
        subtitle: 'Интенсив: геометрия квантовых вычислений за 7 занятий',
        description: 'Честная физика и геометрия без квантовой магии: кубиты как стрелки, суперпозиция, интерференция, алгоритмы Гровера и Шора, квантовые ошибки, гейты и тренажёр.',
        status: 'available',
        courseFiles: ['courses/course-quantum.js'], // Теперь массив
        courseVar: 'COURSE_QUANTUM',
        lessonCount: 7,
        hasTools: true,
        toolsTitle: 'Тренажёр по квантовым гейтам',
        meta: { hours: 8, weeks: 2, level: 'средний' }
    },
    {
        id: 'boolean-algebra',
        icon: '⊕',
        title: 'Алгебра логики',
        subtitle: '9 занятий: от высказываний до сумматоров',
        description: 'Полный курс алгебры логики: базовые операции, таблицы истинности, законы де Моргана, СДНФ и СКНФ, карты Карно, минимизация и синтез логических схем.',
        status: 'available',
        courseFiles: ['courses/course-logic.js'], // Теперь массив
        courseVar: 'COURSE_LOGIC',
        lessonCount: 9,
        hasTools: true,
        toolsTitle: 'Тренажёр по логике',
        meta: { hours: 11, weeks: 3, level: 'базовый' }
    },
    {
        id: 'graphs',
        icon: '🕸️',
        title: 'Теория графов',
        subtitle: '9 занятий: от Кёнигсбергских мостов до алгоритмов',
        description: 'Основы теории графов и алгоритмы на них: BFS, DFS, алгоритм Дейкстры, минимальное остовное дерево, эйлеровы и гамильтоновы пути.',
        status: 'available',
        courseFiles: [
            'courses/course-graphs-1.js',
            'courses/course-graphs-2.js'
        ], // Массив из двух файлов!
        courseVar: 'COURSE_GRAPHS',
        lessonCount: 9,
        hasTools: true,
        toolsTitle: 'Тренажёр по графам',
        meta: { hours: 13, weeks: 3, level: 'средний' }
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MODULES };
}
