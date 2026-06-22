import { categoryMeta, categoryOrder, questions, type CategoryId, type Lang } from "@/lib/education-data";

export type AnswerMap = Partial<Record<string, "A" | "B" | "C" | "D">>;

export type CategoryResult = {
  category: CategoryId;
  correct: number;
  total: number;
  percent: number;
  confidence: Record<Lang, string>;
  summary: Record<Lang, string>;
};

export type ScreeningResult = {
  totalCorrect: number;
  totalQuestions: number;
  categoryResults: CategoryResult[];
  weakestCategories: CategoryId[];
  strongerCategories: CategoryId[];
};

export function scoreScreening(answers: AnswerMap): ScreeningResult {
  const categoryResults = categoryOrder.map((category) => {
    const categoryQuestions = questions.filter((question) => question.category === category);
    const correct = categoryQuestions.filter((question) => answers[question.id] === question.correctOptionId).length;
    const percent = Math.round((correct / categoryQuestions.length) * 100);

    return {
      category,
      correct,
      total: categoryQuestions.length,
      percent,
      confidence: getConfidence(correct),
      summary: getSummary(correct)
    };
  });

  const weakestCategories = [...categoryResults]
    .sort((a, b) => {
      if (a.correct !== b.correct) {
        return a.correct - b.correct;
      }

      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    })
    .slice(0, 2)
    .map((result) => result.category);

  return {
    totalCorrect: questions.filter((question) => answers[question.id] === question.correctOptionId).length,
    totalQuestions: questions.length,
    categoryResults,
    weakestCategories,
    strongerCategories: categoryResults.filter((result) => result.correct >= 1).map((result) => result.category)
  };
}

export function categoryLabel(category: CategoryId, lang: Lang) {
  return categoryMeta[category].label[lang];
}

function getConfidence(correct: number) {
  if (correct === 0) {
    return { en: "Strong gap signal", uk: "Сильний сигнал прогалини" };
  }

  if (correct === 1) {
    return { en: "Initial signal", uk: "Початковий сигнал" };
  }

  return { en: "Likely secure", uk: "Ймовірно засвоєно" };
}

function getSummary(correct: number) {
  if (correct === 0) {
    return {
      en: "Recommended as an immediate restart point.",
      uk: "Рекомендовано як негайну точку повернення."
    };
  }

  if (correct === 1) {
    return {
      en: "Some understanding is visible; review for fluency.",
      uk: "Є часткове розуміння; варто повторити для впевненості."
    };
  }

  return {
    en: "Basic competence shown in this quick screening.",
    uk: "У цьому швидкому скринінгу видно базове розуміння."
  };
}
