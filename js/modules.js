const MODULES = [
    {
        id: 'numeral-systems',
        icon: '🔢',
        title: 'Полный курс систем счисления',
        subtitle: '17 занятий: от позиционных систем до IEEE 754',
        description: 'Полный семестровый курс по системам счисления.',
        status: 'available',
        courseFile: 'courses/course.js',
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
        subtitle: '7 занятий: геометрия квантовых вычислений',
        description: 'Честная физика без магии: кубиты, суперпозиция, алгоритмы.',
        status: 'available',
        courseFile: 'courses/course-quantum.js',
        courseVar: 'COURSE_QUANTUM',
        lessonCount: 7,
        hasTools: true,
        toolsTitle: 'Тренажёр по гейтам',
        meta: { hours: 8, weeks: 2, level: 'средний' }
    },
    {
        id: 'boolean-algebra',
        icon: '⊕',
        title: 'Алгебра логики',
        subtitle: '9 занятий: от высказываний до сумматоров',
        description: 'Базовые операции, законы де Моргана, карты Карно.',
        status: 'available',
        courseFile: 'courses/course-logic.js',
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
        subtitle: '9 занятий: от мостов до алгоритмов',
        description: 'BFS, DFS, алгоритм Дейкстры, остовные деревья.',
        status: 'available',
        courseFile: 'courses/course-graphs.js',
        courseVar: 'COURSE_GRAPHS',
        lessonCount: 9,
        hasTools: true,
        toolsTitle: 'Тренажёр по графам',
        meta: { hours: 13, weeks: 3, level: 'средний' }
    }
];