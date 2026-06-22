export type Lang = "en" | "uk";

export type CategoryId = "fractions" | "percentages" | "geometry" | "equations" | "word-problems";

export type Difficulty = "easy" | "medium" | "hard";

export type Localized = Record<Lang, string>;

export type ScreeningQuestion = {
  id: string;
  category: CategoryId;
  curriculumReference: string;
  difficulty: Difficulty;
  prompt: Localized;
  options: Array<{
    id: "A" | "B" | "C" | "D";
    text: Localized;
  }>;
  correctOptionId: "A" | "B" | "C" | "D";
  explanation: Localized;
  teacherNote: Localized;
};

export type RecoveryBlock = {
  category: CategoryId;
  curriculumExpectation: string;
  learningGoal: Localized;
  teacherExplanation: Localized;
  activities: Record<Lang, string[]>;
  lowTechAdaptation: Localized;
  printableExercises: Record<Lang, string[]>;
  miniCheckQuestion: Localized;
};

export type StudentProfile = {
  name: string;
  grade: string;
  age: number;
  language: Localized;
  context: Localized;
};

export const categoryOrder: CategoryId[] = [
  "fractions",
  "percentages",
  "equations",
  "geometry",
  "word-problems"
];

export const categoryMeta: Record<
  CategoryId,
  {
    label: Localized;
    shortLabel: Localized;
    tone: string;
  }
> = {
  fractions: {
    label: { en: "Fractions", uk: "Дроби" },
    shortLabel: { en: "Fractions", uk: "Дроби" },
    tone: "bg-blue-50 text-blue-700 border-blue-100"
  },
  percentages: {
    label: { en: "Percentages", uk: "Відсотки" },
    shortLabel: { en: "Percentages", uk: "Відсотки" },
    tone: "bg-amber-50 text-amber-700 border-amber-100"
  },
  geometry: {
    label: { en: "Geometry", uk: "Геометрія" },
    shortLabel: { en: "Geometry", uk: "Геометрія" },
    tone: "bg-emerald-50 text-emerald-700 border-emerald-100"
  },
  equations: {
    label: { en: "Equations", uk: "Рівняння" },
    shortLabel: { en: "Equations", uk: "Рівняння" },
    tone: "bg-indigo-50 text-indigo-700 border-indigo-100"
  },
  "word-problems": {
    label: { en: "Word Problems", uk: "Текстові задачі" },
    shortLabel: { en: "Word Problems", uk: "Задачі" },
    tone: "bg-rose-50 text-rose-700 border-rose-100"
  }
};

export const studentProfile: StudentProfile = {
  name: "Maksym",
  grade: "6",
  age: 12,
  language: { en: "Ukrainian plus English", uk: "Українська та англійська" },
  context: {
    en: "Disrupted learning, displaced student, print-first resources",
    uk: "Перерви в навчанні, переміщений учень, матеріали для друку"
  }
};

export const demoAnswers: Record<string, "A" | "B" | "C" | "D"> = {
  "Q-FRAC-01": "A",
  "Q-FRAC-02": "B",
  "Q-PERC-01": "C",
  "Q-PERC-02": "A",
  "Q-GEOM-01": "C",
  "Q-GEOM-02": "B",
  "Q-EQ-01": "A",
  "Q-EQ-02": "D",
  "Q-WP-01": "A",
  "Q-WP-02": "C"
};

export const questions: ScreeningQuestion[] = [
  {
    id: "Q-FRAC-01",
    category: "fractions",
    curriculumReference: "MATH-5-FRAC",
    difficulty: "easy",
    prompt: {
      en: "Which of the following is equivalent to 3/4?",
      uk: "Який із наведених дробів дорівнює 3/4?"
    },
    options: [
      { id: "A", text: { en: "6/8", uk: "6/8" } },
      { id: "B", text: { en: "4/5", uk: "4/5" } },
      { id: "C", text: { en: "9/16", uk: "9/16" } },
      { id: "D", text: { en: "5/8", uk: "5/8" } }
    ],
    correctOptionId: "A",
    explanation: {
      en: "Multiplying both the numerator and denominator by 2 gives 6/8.",
      uk: "Якщо помножити чисельник і знаменник на 2, отримаємо 6/8."
    },
    teacherNote: {
      en: "A wrong answer may show that the student is changing numerator and denominator without preserving the same value.",
      uk: "Неправильна відповідь може свідчити, що учень змінює чисельник і знаменник, не зберігаючи значення дробу."
    }
  },
  {
    id: "Q-FRAC-02",
    category: "fractions",
    curriculumReference: "MATH-5-FRAC",
    difficulty: "medium",
    prompt: {
      en: "What is 1/2 + 1/3?",
      uk: "Скільки буде 1/2 + 1/3?"
    },
    options: [
      { id: "A", text: { en: "2/5", uk: "2/5" } },
      { id: "B", text: { en: "5/6", uk: "5/6" } },
      { id: "C", text: { en: "1/6", uk: "1/6" } },
      { id: "D", text: { en: "1/5", uk: "1/5" } }
    ],
    correctOptionId: "B",
    explanation: {
      en: "Use a common denominator of 6: 3/6 + 2/6 = 5/6.",
      uk: "Потрібен спільний знаменник 6: 3/6 + 2/6 = 5/6."
    },
    teacherNote: {
      en: "Answer A suggests the student may be adding numerators and denominators straight across.",
      uk: "Відповідь A може означати, що учень додає чисельники й знаменники напряму."
    }
  },
  {
    id: "Q-PERC-01",
    category: "percentages",
    curriculumReference: "MATH-5-PERC",
    difficulty: "medium",
    prompt: {
      en: "What is 20% of 50?",
      uk: "Скільки становить 20% від 50?"
    },
    options: [
      { id: "A", text: { en: "5", uk: "5" } },
      { id: "B", text: { en: "10", uk: "10" } },
      { id: "C", text: { en: "20", uk: "20" } },
      { id: "D", text: { en: "25", uk: "25" } }
    ],
    correctOptionId: "B",
    explanation: {
      en: "20% is 1/5. One fifth of 50 is 10.",
      uk: "20% - це 1/5. Одна п'ята від 50 дорівнює 10."
    },
    teacherNote: {
      en: "Answer C may mean the student is repeating the percentage number instead of finding the part.",
      uk: "Відповідь C може означати, що учень повторює число відсотків, а не знаходить частину."
    }
  },
  {
    id: "Q-PERC-02",
    category: "percentages",
    curriculumReference: "MATH-5-PERC",
    difficulty: "hard",
    prompt: {
      en: "A shirt originally costs 400 UAH. It is on sale for 25% off. What is the sale price?",
      uk: "Сорочка коштувала 400 грн. На неї діє знижка 25%. Яка ціна після знижки?"
    },
    options: [
      { id: "A", text: { en: "100 UAH", uk: "100 грн" } },
      { id: "B", text: { en: "300 UAH", uk: "300 грн" } },
      { id: "C", text: { en: "375 UAH", uk: "375 грн" } },
      { id: "D", text: { en: "500 UAH", uk: "500 грн" } }
    ],
    correctOptionId: "B",
    explanation: {
      en: "25% of 400 is 100. The sale price is 400 - 100 = 300 UAH.",
      uk: "25% від 400 - це 100. Ціна після знижки: 400 - 100 = 300 грн."
    },
    teacherNote: {
      en: "Answer A means the student found the discount amount but did not subtract it from the original price.",
      uk: "Відповідь A означає, що учень знайшов суму знижки, але не відняв її від початкової ціни."
    }
  },
  {
    id: "Q-GEOM-01",
    category: "geometry",
    curriculumReference: "MATH-5-GEOM",
    difficulty: "easy",
    prompt: {
      en: "What is the area of a rectangle with a length of 8 cm and a width of 5 cm?",
      uk: "Яка площа прямокутника довжиною 8 см і шириною 5 см?"
    },
    options: [
      { id: "A", text: { en: "13 cm²", uk: "13 см²" } },
      { id: "B", text: { en: "26 cm²", uk: "26 см²" } },
      { id: "C", text: { en: "40 cm²", uk: "40 см²" } },
      { id: "D", text: { en: "85 cm²", uk: "85 см²" } }
    ],
    correctOptionId: "C",
    explanation: {
      en: "Area of a rectangle is length multiplied by width: 8 x 5 = 40.",
      uk: "Площа прямокутника дорівнює довжині, помноженій на ширину: 8 x 5 = 40."
    },
    teacherNote: {
      en: "Answer B means the student calculated perimeter instead of area.",
      uk: "Відповідь B означає, що учень обчислив периметр замість площі."
    }
  },
  {
    id: "Q-GEOM-02",
    category: "geometry",
    curriculumReference: "MATH-5-GEOM",
    difficulty: "medium",
    prompt: {
      en: "The sum of the angles in a triangle is always:",
      uk: "Сума кутів трикутника завжди дорівнює:"
    },
    options: [
      { id: "A", text: { en: "90 degrees", uk: "90 градусів" } },
      { id: "B", text: { en: "180 degrees", uk: "180 градусів" } },
      { id: "C", text: { en: "270 degrees", uk: "270 градусів" } },
      { id: "D", text: { en: "360 degrees", uk: "360 градусів" } }
    ],
    correctOptionId: "B",
    explanation: {
      en: "The interior angles of any triangle always add up to 180 degrees.",
      uk: "Внутрішні кути будь-якого трикутника в сумі дорівнюють 180 градусів."
    },
    teacherNote: {
      en: "Answer D may show confusion between triangle and quadrilateral angle rules.",
      uk: "Відповідь D може свідчити про плутанину між правилами для трикутників і чотирикутників."
    }
  },
  {
    id: "Q-EQ-01",
    category: "equations",
    curriculumReference: "MATH-6-EQ",
    difficulty: "medium",
    prompt: {
      en: "Solve for x: 2x + 4 = 10",
      uk: "Знайдіть x: 2x + 4 = 10"
    },
    options: [
      { id: "A", text: { en: "x = 3", uk: "x = 3" } },
      { id: "B", text: { en: "x = 4", uk: "x = 4" } },
      { id: "C", text: { en: "x = 6", uk: "x = 6" } },
      { id: "D", text: { en: "x = 7", uk: "x = 7" } }
    ],
    correctOptionId: "A",
    explanation: {
      en: "Subtract 4 from both sides to get 2x = 6. Divide by 2 to get x = 3.",
      uk: "Відніміть 4 з обох частин: 2x = 6. Поділіть на 2: x = 3."
    },
    teacherNote: {
      en: "Answer C can mean the student stopped after subtracting 4 and did not divide by 2.",
      uk: "Відповідь C може означати, що учень зупинився після віднімання 4 і не поділив на 2."
    }
  },
  {
    id: "Q-EQ-02",
    category: "equations",
    curriculumReference: "MATH-6-EQ",
    difficulty: "hard",
    prompt: {
      en: "If y - 5 = 12, what is the value of y + 2?",
      uk: "Якщо y - 5 = 12, чому дорівнює y + 2?"
    },
    options: [
      { id: "A", text: { en: "7", uk: "7" } },
      { id: "B", text: { en: "14", uk: "14" } },
      { id: "C", text: { en: "17", uk: "17" } },
      { id: "D", text: { en: "19", uk: "19" } }
    ],
    correctOptionId: "D",
    explanation: {
      en: "First solve y = 17. Then y + 2 = 19.",
      uk: "Спочатку y = 17. Потім y + 2 = 19."
    },
    teacherNote: {
      en: "Answer C suggests the student solved for y but missed the second step.",
      uk: "Відповідь C означає, що учень знайшов y, але пропустив другий крок."
    }
  },
  {
    id: "Q-WP-01",
    category: "word-problems",
    curriculumReference: "MATH-56-WP",
    difficulty: "medium",
    prompt: {
      en: "Maria has 24 apples. She gives 1/3 of them to her friend. How many apples does Maria have left?",
      uk: "У Марії 24 яблука. Вона віддала 1/3 яблук подрузі. Скільки яблук залишилось у Марії?"
    },
    options: [
      { id: "A", text: { en: "8", uk: "8" } },
      { id: "B", text: { en: "12", uk: "12" } },
      { id: "C", text: { en: "16", uk: "16" } },
      { id: "D", text: { en: "21", uk: "21" } }
    ],
    correctOptionId: "C",
    explanation: {
      en: "One third of 24 is 8. Maria gave away 8, so 24 - 8 = 16.",
      uk: "Одна третина від 24 - це 8. Марія віддала 8, тому 24 - 8 = 16."
    },
    teacherNote: {
      en: "Answer A means the student found the amount given away but did not subtract it from the total.",
      uk: "Відповідь A означає, що учень знайшов кількість відданих яблук, але не відняв її від загальної кількості."
    }
  },
  {
    id: "Q-WP-02",
    category: "word-problems",
    curriculumReference: "MATH-56-WP",
    difficulty: "medium",
    prompt: {
      en: "A train travels 120 kilometers in 2 hours. At this speed, how far will it travel in 5 hours?",
      uk: "Потяг проїжджає 120 км за 2 години. Яку відстань він проїде за 5 годин із такою самою швидкістю?"
    },
    options: [
      { id: "A", text: { en: "240 km", uk: "240 км" } },
      { id: "B", text: { en: "300 km", uk: "300 км" } },
      { id: "C", text: { en: "600 km", uk: "600 км" } },
      { id: "D", text: { en: "120 km", uk: "120 км" } }
    ],
    correctOptionId: "B",
    explanation: {
      en: "The speed is 120 / 2 = 60 km per hour. In 5 hours: 60 x 5 = 300 km.",
      uk: "Швидкість: 120 / 2 = 60 км за годину. За 5 годин: 60 x 5 = 300 км."
    },
    teacherNote: {
      en: "Answer C suggests the student multiplied 120 by 5 without finding the unit rate first.",
      uk: "Відповідь C може означати, що учень помножив 120 на 5, не знайшовши швидкість за годину."
    }
  }
];

export const recoveryBlocks: Record<CategoryId, RecoveryBlock> = {
  fractions: {
    category: "fractions",
    curriculumExpectation:
      "[MATH-5-FRAC] Учень/учениця розуміє сутність звичайного дробу; виконує додавання і віднімання дробів з однаковими знаменниками; розв'язує сюжетні задачі, що передбачають знаходження дробу від числа.",
    learningGoal: {
      en: "Understand fractions as parts of a whole, find equivalent fractions, and add fractions with common denominators.",
      uk: "Розуміти дріб як частину цілого, знаходити рівні дроби й додавати дроби зі спільним знаменником."
    },
    teacherExplanation: {
      en: "Fractions often break down when students memorize procedures without seeing the whole and its parts.",
      uk: "Труднощі з дробами часто з'являються, коли учні запам'ятовують правила, але не бачать ціле та його частини."
    },
    activities: {
      en: [
        "Fold paper strips to show equivalent fractions.",
        "Place fractions on a number line from 0 to 1.",
        "Scale a simple recipe by half or double."
      ],
      uk: [
        "Складіть паперові смужки, щоб показати рівні дроби.",
        "Розмістіть дроби на числовій прямій від 0 до 1.",
        "Змініть простий рецепт удвічі або наполовину."
      ]
    },
    lowTechAdaptation: {
      en: "Use sticks, chalk circles, or torn paper pieces to represent fractions.",
      uk: "Використовуйте палички, кола на дошці або шматочки паперу для моделювання дробів."
    },
    printableExercises: {
      en: [
        "Shade the shape to show the equivalent fraction.",
        "Place these 5 fractions on the number line.",
        "Add the shaded parts and write the new fraction."
      ],
      uk: [
        "Зафарбуй фігуру, щоб показати рівний дріб.",
        "Розмісти ці 5 дробів на числовій прямій.",
        "Додай зафарбовані частини й запиши новий дріб."
      ]
    },
    miniCheckQuestion: {
      en: "Draw a picture that proves 1/3 is the same as 2/6.",
      uk: "Намалюй рисунок, який доводить, що 1/3 дорівнює 2/6."
    }
  },
  percentages: {
    category: "percentages",
    curriculumExpectation:
      "[MATH-5-PERC] Учень/учениця розуміє відсоток як соту частину величини; перетворює відсотки у дроби і навпаки; знаходить відсоток від числа у задачах з реального життя.",
    learningGoal: {
      en: "Connect percentages to fractions out of 100 and solve simple real-world percentage problems.",
      uk: "Пов'язувати відсотки з дробами зі знаменником 100 і розв'язувати прості життєві задачі на відсотки."
    },
    teacherExplanation: {
      en: "Students need to see a percentage as a special fraction out of 100 before discounts and multi-step tasks feel natural.",
      uk: "Учням потрібно побачити відсоток як особливий дріб зі 100, перш ніж задачі зі знижками стануть зрозумілими."
    },
    activities: {
      en: [
        "Shade 10%, 25%, and 50% on a 10x10 grid.",
        "Practice finding 10% first, then 20% or 30%.",
        "Use a store flyer to calculate simple discounts."
      ],
      uk: [
        "Зафарбуйте 10%, 25% і 50% у сітці 10x10.",
        "Спочатку знаходьте 10%, потім 20% або 30%.",
        "Використайте рекламний буклет магазину для обчислення знижок."
      ]
    },
    lowTechAdaptation: {
      en: "Draw a battery bar on the board and ask students to estimate 25%, 50%, and 75%.",
      uk: "Намалюйте на дошці індикатор батареї та попросіть оцінити 25%, 50% і 75%."
    },
    printableExercises: {
      en: [
        "Match each percentage to a fraction.",
        "Calculate 10% and 20% of the numbers.",
        "Find the final price of an 80 UAH item with a 25% discount."
      ],
      uk: [
        "З'єднай відсоток із відповідним дробом.",
        "Обчисли 10% і 20% від поданих чисел.",
        "Знайди кінцеву ціну товару за 80 грн зі знижкою 25%."
      ]
    },
    miniCheckQuestion: {
      en: "If a phone is 50% charged and the battery holds 10 hours, how many hours are left?",
      uk: "Якщо телефон заряджений на 50%, а батарея тримає 10 годин, скільки годин залишилось?"
    }
  },
  geometry: {
    category: "geometry",
    curriculumExpectation:
      "[MATH-5-GEOM] Учень/учениця розрізняє периметр і площу; застосовує формули для обчислення площі прямокутника; знає, що сума кутів трикутника дорівнює 180°.",
    learningGoal: {
      en: "Distinguish perimeter from area and understand angle sums in basic shapes.",
      uk: "Розрізняти периметр і площу та розуміти суму кутів у базових фігурах."
    },
    teacherExplanation: {
      en: "Students often mix up border length and inside space, so physical measurement helps more than formulas alone.",
      uk: "Учні часто плутають довжину межі та внутрішню площу, тому практичні вимірювання допомагають більше, ніж самі формули."
    },
    activities: {
      en: [
        "Pace out classroom perimeter and estimate floor area.",
        "Use one string length to make rectangles with different areas.",
        "Tear off triangle corners and line them up to show 180 degrees."
      ],
      uk: [
        "Виміряйте кроками периметр класу й оцініть площу підлоги.",
        "Створіть різні прямокутники з мотузки однакової довжини.",
        "Відірвіть кути паперового трикутника й викладіть їх у пряму лінію."
      ]
    },
    lowTechAdaptation: {
      en: "Count the perimeter and area of a desk using hands or notebooks as units.",
      uk: "Порахуйте периметр і площу парти, використовуючи долоні або зошити як одиниці."
    },
    printableExercises: {
      en: [
        "Calculate perimeter and area of three rectangles.",
        "Draw two rectangles with an area of 12.",
        "Find the missing third angle of each triangle."
      ],
      uk: [
        "Обчисли периметр і площу трьох прямокутників.",
        "Намалюй два прямокутники з площею 12.",
        "Знайди третій кут у кожному трикутнику."
      ]
    },
    miniCheckQuestion: {
      en: "Explain the difference between perimeter and area using a fence and a garden.",
      uk: "Поясни різницю між периметром і площею на прикладі паркану та саду."
    }
  },
  equations: {
    category: "equations",
    curriculumExpectation:
      "[MATH-6-EQ] Учень/учениця розуміє рівняння як рівність двох виразів; застосовує основні властивості рівнянь для їх розв'язування.",
    learningGoal: {
      en: "Understand the equal sign as balance and isolate variables with inverse operations.",
      uk: "Розуміти знак рівності як баланс і знаходити змінну за допомогою обернених дій."
    },
    teacherExplanation: {
      en: "Many students see the equal sign as where the answer goes, not as a balance between two expressions.",
      uk: "Багато учнів сприймають знак рівності як місце для відповіді, а не як баланс двох виразів."
    },
    activities: {
      en: [
        "Draw equations as a balance scale.",
        "Play the inverse-operation undo game.",
        "Solve equations with colors marking each operation on both sides."
      ],
      uk: [
        "Зобразіть рівняння як терези.",
        "Пограйте в гру на обернені дії.",
        "Розв'язуйте рівняння, позначаючи однакові дії з обох боків різними кольорами."
      ]
    },
    lowTechAdaptation: {
      en: "Use small stones and two paper plates to physically balance simple equations.",
      uk: "Використайте камінці та дві паперові тарілки, щоб фізично збалансувати прості рівняння."
    },
    printableExercises: {
      en: [
        "Fill in the missing step to solve the equation.",
        "Solve five one-step equations.",
        "Solve three two-step equations."
      ],
      uk: [
        "Заповни пропущений крок у розв'язанні рівняння.",
        "Розв'яжи п'ять рівнянь в одну дію.",
        "Розв'яжи три рівняння у дві дії."
      ]
    },
    miniCheckQuestion: {
      en: "What is the first step to solve 3x - 4 = 11?",
      uk: "Який перший крок для розв'язання 3x - 4 = 11?"
    }
  },
  "word-problems": {
    category: "word-problems",
    curriculumExpectation:
      "[MATH-56-WP] Учень/учениця аналізує умову задачі, виокремлює відомі та невідомі величини; встановлює залежності між ними; розв'язує задачу в кілька дій або за допомогою рівняння.",
    learningGoal: {
      en: "Break down multi-step text problems, choose the operation, and check whether the answer makes sense.",
      uk: "Розбирати текстові задачі в кілька дій, обирати потрібну дію й перевіряти логічність відповіді."
    },
    teacherExplanation: {
      en: "Word problems test reading comprehension as much as math, so students should visualize the story before calculating.",
      uk: "Текстові задачі перевіряють розуміння тексту так само, як і математику, тому спершу варто уявити ситуацію."
    },
    activities: {
      en: [
        "Read a numberless word problem and discuss what is happening.",
        "Draw the story before solving the problem.",
        "Write a word problem for a given equation."
      ],
      uk: [
        "Прочитайте задачу без чисел і обговоріть, що в ній відбувається.",
        "Намалюйте історію перед розв'язанням.",
        "Складіть текстову задачу до поданого рівняння."
      ]
    },
    lowTechAdaptation: {
      en: "Tell the problem orally and let students act it out or draw it on the board.",
      uk: "Розкажіть задачу усно й дозвольте учням розіграти її або намалювати на дошці."
    },
    printableExercises: {
      en: [
        "Underline the question and circle important numbers.",
        "Match each word problem to the correct equation.",
        "Solve two multi-step problems and explain the reasoning."
      ],
      uk: [
        "Підкресли запитання й обведи важливі числа.",
        "З'єднай текстову задачу з правильним рівнянням.",
        "Розв'яжи дві задачі в кілька дій і поясни міркування."
      ]
    },
    miniCheckQuestion: {
      en: "Read the problem. Do not solve it yet: will the answer be bigger or smaller than the starting number?",
      uk: "Прочитай задачу. Не розв'язуй її: відповідь буде більшою чи меншою за початкове число?"
    }
  }
};

export const planBlueprint = [
  {
    day: 1,
    focus: "primary",
    title: { en: "Concept restart", uk: "Повернення до основи" },
    teacherAction: {
      en: "Name the restart point supportively and introduce the concept with a visual or hands-on activity.",
      uk: "Поясніть точку повернення підтримувально й покажіть поняття через візуальну або практичну дію."
    },
    studentTask: {
      en: "Join the guided activity without grading.",
      uk: "Візьміть участь у спільній вправі без оцінювання."
    },
    time: "20 min"
  },
  {
    day: 2,
    focus: "primary",
    title: { en: "Guided practice", uk: "Практика з підтримкою" },
    teacherAction: {
      en: "Work through two examples on the board.",
      uk: "Розберіть два приклади на дошці."
    },
    studentTask: {
      en: "Complete the first printable exercise.",
      uk: "Виконайте першу вправу для друку."
    },
    time: "15 min"
  },
  {
    day: 3,
    focus: "primary",
    title: { en: "Alternative representation", uk: "Інший спосіб подання" },
    teacherAction: {
      en: "Teach the same idea with a drawing, object, or story.",
      uk: "Поясніть ту саму ідею через рисунок, предмет або історію."
    },
    studentTask: {
      en: "Explain the idea back to the teacher or a peer.",
      uk: "Поясніть ідею вчителю або однокласнику."
    },
    time: "15 min"
  },
  {
    day: 4,
    focus: "primary",
    title: { en: "Independent practice", uk: "Самостійна практика" },
    teacherAction: {
      en: "Monitor for common misconceptions while the student works.",
      uk: "Спостерігайте за типовими помилками під час роботи учня."
    },
    studentTask: {
      en: "Complete the second printable exercise independently.",
      uk: "Самостійно виконайте другу вправу для друку."
    },
    time: "20 min"
  },
  {
    day: 5,
    focus: "primary",
    title: { en: "Mini-check", uk: "Міні-перевірка" },
    teacherAction: {
      en: "Use the mini-check question and correct mistakes together.",
      uk: "Використайте міні-питання й разом виправте помилки."
    },
    studentTask: {
      en: "Answer the mini-check and explain the reasoning.",
      uk: "Дайте відповідь на міні-питання й поясніть міркування."
    },
    time: "15 min"
  },
  {
    day: 6,
    focus: "secondary",
    title: { en: "Second restart point", uk: "Друга точка повернення" },
    teacherAction: {
      en: "Introduce the second topic with a low-tech activity.",
      uk: "Почніть другу тему з низькотехнологічної вправи."
    },
    studentTask: {
      en: "Participate in the hands-on activity.",
      uk: "Візьміть участь у практичній вправі."
    },
    time: "20 min"
  },
  {
    day: 7,
    focus: "secondary",
    title: { en: "Guided practice", uk: "Практика з підтримкою" },
    teacherAction: {
      en: "Walk through examples connected to the second topic.",
      uk: "Розберіть приклади з другої теми."
    },
    studentTask: {
      en: "Complete the first printable exercise for the second topic.",
      uk: "Виконайте першу вправу для друку з другої теми."
    },
    time: "15 min"
  },
  {
    day: 8,
    focus: "primary",
    title: { en: "Fluency review", uk: "Повторення для впевненості" },
    teacherAction: {
      en: "Review the first topic with short oral questions.",
      uk: "Повторіть першу тему через короткі усні запитання."
    },
    studentTask: {
      en: "Complete a quick review activity.",
      uk: "Виконайте коротку вправу на повторення."
    },
    time: "15 min"
  },
  {
    day: 9,
    focus: "secondary",
    title: { en: "Independent practice", uk: "Самостійна практика" },
    teacherAction: {
      en: "Give independent work and note where support is needed.",
      uk: "Дайте самостійну роботу й позначте, де потрібна підтримка."
    },
    studentTask: {
      en: "Complete the second printable exercise.",
      uk: "Виконайте другу вправу для друку."
    },
    time: "20 min"
  },
  {
    day: 10,
    focus: "both",
    title: { en: "Mixed application", uk: "Змішане застосування" },
    teacherAction: {
      en: "Present alternating problems using both topics.",
      uk: "Запропонуйте задачі, що чергують обидві теми."
    },
    studentTask: {
      en: "Complete a mixed practice sheet.",
      uk: "Виконайте змішаний аркуш практики."
    },
    time: "20 min"
  },
  {
    day: 11,
    focus: "secondary",
    title: { en: "Real-world connection", uk: "Зв'язок із життям" },
    teacherAction: {
      en: "Connect the second topic to shopping, travel, cooking, or classroom objects.",
      uk: "Пов'яжіть другу тему з покупками, подорожами, приготуванням їжі або предметами в класі."
    },
    studentTask: {
      en: "Solve or write one real-world problem.",
      uk: "Розв'яжіть або складіть одну життєву задачу."
    },
    time: "15 min"
  },
  {
    day: 12,
    focus: "secondary",
    title: { en: "Mini-check", uk: "Міні-перевірка" },
    teacherAction: {
      en: "Use the mini-check for the second topic.",
      uk: "Проведіть міні-перевірку з другої теми."
    },
    studentTask: {
      en: "Answer and explain the mini-check.",
      uk: "Дайте відповідь і поясніть міркування."
    },
    time: "15 min"
  },
  {
    day: 13,
    focus: "both",
    title: { en: "Confidence builder", uk: "Впевненість у знаннях" },
    teacherAction: {
      en: "Pair the student with a peer to explain one recovered idea.",
      uk: "Об'єднайте учня з партнером, щоб пояснити одну відновлену ідею."
    },
    studentTask: {
      en: "Teach one example or solve collaboratively.",
      uk: "Поясніть один приклад або розв'яжіть задачу разом."
    },
    time: "20 min"
  },
  {
    day: 14,
    focus: "review",
    title: { en: "Next steps", uk: "Наступні кроки" },
    teacherAction: {
      en: "Review progress and decide whether to continue support or return to regular instruction with monitoring.",
      uk: "Оцініть прогрес і вирішіть, чи продовжувати підтримку, чи повернутись до звичайного навчання з наглядом."
    },
    studentTask: {
      en: "Write one thing that feels easier now.",
      uk: "Запишіть одну річ, яка тепер здається легшою."
    },
    time: "15 min"
  }
];
