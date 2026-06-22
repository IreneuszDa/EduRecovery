"use client";

import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Download,
  FileText,
  Gauge,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  Languages,
  MessageSquarePlus,
  NotebookPen,
  Printer,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  UserRound,
  Users,
  WifiOff
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  categoryMeta,
  demoAnswers,
  planBlueprint,
  questions,
  recoveryBlocks,
  studentProfile,
  type CategoryId,
  type Lang
} from "@/lib/education-data";
import { type AnswerMap, categoryLabel, scoreScreening } from "@/lib/scoring";

type Role = "teacher" | "student";
type View = "dashboard" | "screening" | "brief";

const copy = {
  en: {
    educatorAssistant: "Digital assistant for educators",
    teacher: "Teacher",
    student: "Student",
    welcomeTeacher: "Welcome, Olena",
    teacherLead: "Teacher-led recovery workspace for mixed-level Ukrainian classrooms.",
    dailyContext: "Grade 6 math | 20 min/day | disrupted learning | print-first",
    runScreening: "Run screening",
    openBrief: "Open brief",
    printBrief: "Print brief",
    classPulse: "Class pulse",
    activeStudents: "Active students",
    likelyGaps: "Likely gaps",
    taskStatus: "AI task status",
    briefReady: "Teacher brief",
    ready: "Ready",
    requested: "Requested",
    students: "Students",
    progress: "Progress",
    restartPoints: "Restart points",
    nextAction: "Next action",
    generateAiTasks: "Generate AI tasks",
    aiDrafted: "AI task set drafted from the recovery plan.",
    waitingForRequest: "Waiting for teacher request.",
    localOnly: "Local demo, no account",
    quickScreening: "10-question quick screening",
    dashboard: "Dashboard",
    studentViewTitle: "Maksym's recovery plan",
    studentViewLead: "Short daily math work selected by the teacher.",
    todayTasks: "Today",
    startScreening: "Start screening",
    continueScreening: "Continue screening",
    screeningTitle: "Math quick screening",
    screeningLead: "A short teacher-led screening to find practical restart points.",
    question: "Question",
    previous: "Previous",
    next: "Next",
    useDemo: "Use demo result",
    reset: "Reset",
    finish: "Open result",
    resultSnapshot: "Result snapshot",
    strongerAreas: "Stronger areas",
    recoveryPlan: "14-day recovery plan",
    printableExercises: "Printable exercises",
    teacherRecoveryBrief: "Teacher Recovery Brief",
    overallSnapshot: "Overall snapshot",
    recommendedRestart: "Recommended restart point",
    teacherRecommendations: "Teacher recommendations",
    disclaimer:
      "This is a 10-question quick screening designed to identify practical restart points for learning recovery. It is not a comprehensive diagnostic assessment. Teachers should use professional judgment and classroom observation.",
    lowTech: "Low-tech adaptation",
    curriculum: "Curriculum reference",
    viewAs: "View as",
    language: "Language",
    aiTasksForStudent: "Teacher-generated task set",
    noTasksYet: "No task set yet",
    noTasksLead: "The teacher can generate a focused task set from the recovery plan.",
    weekOne: "Week 1 foundation",
    weekTwo: "Week 2 integration",
    categoryScores: "Category scores",
    screeningPurpose:
      "Maksym completed a quick screening to identify a practical restart point after disrupted schooling.",
    restartCopy:
      "Start with focused work on the primary gap. Keep sessions short and practical, then integrate the second topic in week two.",
    parentSummary: "Optional parent summary",
    parentCopy:
      "Maksym completed a short math check-up. The goal is to find where support will help most. A 14-day plan will focus on the clearest restart points.",
    accountSwitch: "Account switch",
    setup: "Teacher setup"
  },
  uk: {
    educatorAssistant: "Цифровий асистент для педагогів",
    teacher: "Вчитель",
    student: "Учень",
    welcomeTeacher: "Вітаємо, Олено",
    teacherLead: "Робочий простір відновлення навчання для різнорівневих українських класів.",
    dailyContext: "Математика 6 клас | 20 хв/день | перерви в навчанні | матеріали для друку",
    runScreening: "Провести скринінг",
    openBrief: "Відкрити brief",
    printBrief: "Друк brief",
    classPulse: "Стан групи",
    activeStudents: "Активні учні",
    likelyGaps: "Ймовірні прогалини",
    taskStatus: "Статус AI-завдань",
    briefReady: "Brief для вчителя",
    ready: "Готово",
    requested: "Створено",
    students: "Учні",
    progress: "Прогрес",
    restartPoints: "Точки повернення",
    nextAction: "Наступна дія",
    generateAiTasks: "Згенерувати AI-завдання",
    aiDrafted: "Набір AI-завдань створено з плану відновлення.",
    waitingForRequest: "Очікує запиту вчителя.",
    localOnly: "Локальна демоверсія, без акаунта",
    quickScreening: "Швидкий скринінг із 10 питань",
    dashboard: "Панель",
    studentViewTitle: "План відновлення Максима",
    studentViewLead: "Короткі щоденні завдання з математики, обрані вчителем.",
    todayTasks: "Сьогодні",
    startScreening: "Почати скринінг",
    continueScreening: "Продовжити скринінг",
    screeningTitle: "Швидкий скринінг з математики",
    screeningLead: "Короткий скринінг під керівництвом учителя для визначення практичних точок повернення.",
    question: "Питання",
    previous: "Назад",
    next: "Далі",
    useDemo: "Використати демо",
    reset: "Скинути",
    finish: "Відкрити результат",
    resultSnapshot: "Короткий результат",
    strongerAreas: "Сильніші напрями",
    recoveryPlan: "14-денний план відновлення",
    printableExercises: "Вправи для друку",
    teacherRecoveryBrief: "Teacher Recovery Brief",
    overallSnapshot: "Загальний огляд",
    recommendedRestart: "Рекомендована точка повернення",
    teacherRecommendations: "Рекомендації для вчителя",
    disclaimer:
      "Це швидкий скринінг із 10 питань для визначення практичних точок повернення у відновленні навчання. Це не повна діагностична оцінка. Вчитель має використовувати професійне судження та спостереження в класі.",
    lowTech: "Низькотехнологічна адаптація",
    curriculum: "Навчальна програма",
    viewAs: "Режим",
    language: "Мова",
    aiTasksForStudent: "Набір завдань від учителя",
    noTasksYet: "Завдань ще немає",
    noTasksLead: "Учитель може створити цільовий набір завдань із плану відновлення.",
    weekOne: "Тиждень 1: основа",
    weekTwo: "Тиждень 2: інтеграція",
    categoryScores: "Результати за темами",
    screeningPurpose:
      "Максим пройшов швидкий скринінг, щоб визначити практичну точку повернення після перерв у навчанні.",
    restartCopy:
      "Почніть із цільової роботи над основною прогалиною. Нехай заняття будуть короткими й практичними, а другу тему інтегруйте на другому тижні.",
    parentSummary: "Коротко для батьків",
    parentCopy:
      "Максим пройшов коротку перевірку з математики. Мета - зрозуміти, де підтримка допоможе найбільше. 14-денний план зосередиться на найчіткіших точках повернення.",
    accountSwitch: "Перемикання акаунта",
    setup: "Налаштування вчителя"
  }
} satisfies Record<Lang, Record<string, string>>;

const roster = [
  { name: "Maksym", grade: "6", progress: 62, status: "active", gaps: ["percentages", "word-problems"] as CategoryId[] },
  { name: "Iryna", grade: "6", progress: 76, status: "monitor", gaps: ["fractions"] as CategoryId[] },
  { name: "Sofia", grade: "7", progress: 84, status: "stable", gaps: ["geometry"] as CategoryId[] },
  { name: "Danylo", grade: "6", progress: 58, status: "active", gaps: ["equations", "word-problems"] as CategoryId[] }
];

export function EduRecoveryApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [role, setRole] = useState<Role>("teacher");
  const [view, setView] = useState<View>("dashboard");
  const [answers, setAnswers] = useState<AnswerMap>(demoAnswers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [tasksGenerated, setTasksGenerated] = useState(false);

  const text = copy[lang];
  const result = useMemo(() => scoreScreening(answers), [answers]);
  const primaryGap = result.weakestCategories[0];
  const secondaryGap = result.weakestCategories[1];
  const answeredCount = questions.filter((question) => answers[question.id]).length;
  const isComplete = answeredCount === questions.length;

  const switchRole = (nextRole: Role) => {
    setRole(nextRole);
    setView("dashboard");
  };
  const workspaceLabel = lang === "en" ? "workspace" : "простір";

  const content =
    view === "screening" ? (
      <ScreeningView
        lang={lang}
        answers={answers}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        onAnswer={(questionId, optionId) => setAnswers((current) => ({ ...current, [questionId]: optionId }))}
        onUseDemo={() => {
          setAnswers(demoAnswers);
          setCurrentQuestionIndex(questions.length - 1);
        }}
        onReset={() => {
          setAnswers({});
          setCurrentQuestionIndex(0);
        }}
        onFinish={() => setView("brief")}
      />
    ) : view === "brief" ? (
      <TeacherBriefView
        lang={lang}
        result={result}
        primaryGap={primaryGap}
        secondaryGap={secondaryGap}
        onBack={() => setView("dashboard")}
      />
    ) : role === "teacher" ? (
      <TeacherDashboard
        lang={lang}
        result={result}
        primaryGap={primaryGap}
        secondaryGap={secondaryGap}
        tasksGenerated={tasksGenerated}
        isComplete={isComplete}
        answeredCount={answeredCount}
        onGenerateTasks={() => setTasksGenerated(true)}
        onOpenScreening={() => setView("screening")}
        onOpenBrief={() => setView("brief")}
      />
    ) : (
      <StudentDashboard
        lang={lang}
        result={result}
        primaryGap={primaryGap}
        secondaryGap={secondaryGap}
        tasksGenerated={tasksGenerated}
        answeredCount={answeredCount}
        onOpenScreening={() => setView("screening")}
      />
    );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <WorkspaceSidebar
          lang={lang}
          role={role}
          view={view}
          tasksGenerated={tasksGenerated}
          onSetRole={switchRole}
          onSetView={setView}
          onGenerateTasks={() => setTasksGenerated(true)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200/90 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-blue-600">{role === "teacher" ? text.teacher : text.student} {workspaceLabel}</p>
              <h1 className="truncate text-xl font-semibold text-slate-950">
                {view === "brief" ? text.teacherRecoveryBrief : view === "screening" ? text.screeningTitle : role === "teacher" ? text.dashboard : text.studentViewTitle}
              </h1>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <SegmentedControl
                label={text.viewAs}
                icon={<UserRound className="h-4 w-4" aria-hidden />}
                value={role}
                options={[
                  { value: "teacher", label: text.teacher },
                  { value: "student", label: text.student }
                ]}
                onChange={(value) => switchRole(value as Role)}
              />
              <SegmentedControl
                label={text.language}
                icon={<Languages className="h-4 w-4" aria-hidden />}
                value={lang}
                options={[
                  { value: "en", label: "EN" },
                  { value: "uk", label: "UA" }
                ]}
                onChange={(value) => setLang(value as Lang)}
              />
            </div>
          </header>

          <div className="animate-fade-in-up mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 lg:px-8">{content}</div>
        </div>
      </div>
    </main>
  );
}

function WorkspaceSidebar({
  lang,
  role,
  view,
  tasksGenerated,
  onSetRole,
  onSetView,
  onGenerateTasks
}: {
  lang: Lang;
  role: Role;
  view: View;
  tasksGenerated: boolean;
  onSetRole: (role: Role) => void;
  onSetView: (view: View) => void;
  onGenerateTasks: () => void;
}) {
  const text = copy[lang];
  const navItems = [
    { id: "dashboard" as View, label: text.dashboard, icon: LayoutDashboard },
    { id: "screening" as View, label: text.quickScreening, icon: ClipboardList },
    { id: "brief" as View, label: text.teacherRecoveryBrief, icon: FileText }
  ];

  return (
    <aside className="no-print hidden w-72 shrink-0 border-r border-slate-200/80 bg-white lg:flex">
      <div className="flex min-h-screen w-full flex-col p-5">
        <button type="button" onClick={() => onSetView("dashboard")} className="mb-7 flex items-center gap-3 text-left">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <img src="/logo.PNG" alt="EduRecovery UA logo" className="h-11 w-11 object-cover" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-2xl font-bold tracking-tight text-slate-900">EduRecovery UA</span>
            <span className="block truncate text-xs font-medium text-slate-500">{text.educatorAssistant}</span>
          </span>
        </button>

        <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-2">
          <div className="grid grid-cols-2 gap-1">
            {(["teacher", "student"] as Role[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSetRole(item)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  role === item ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item === "teacher" ? text.teacher : text.student}
              </button>
            ))}
          </div>
        </div>

        <nav className="mb-6 flex flex-col gap-1.5">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{lang === "en" ? "Tools" : "Інструменти"}</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSetView(item.id)}
                className="group relative flex items-center rounded-lg px-3.5 py-2.5 text-left text-sm transition-all duration-200"
              >
                {active && <span className="absolute inset-0 rounded-lg bg-slate-100" />}
                <span className="relative z-10 flex items-center">
                  <Icon className={`h-5 w-5 shrink-0 transition-colors ${active ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600"}`} strokeWidth={active ? 2.5 : 2} />
                  <span className={`ml-4 truncate ${active ? "font-semibold text-slate-950" : "font-medium text-slate-600 group-hover:text-slate-900"}`}>
                    {item.label}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mb-6">
          <button
            type="button"
            onClick={onGenerateTasks}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
          >
            <MessageSquarePlus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            {text.generateAiTasks}
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{lang === "en" ? "Recovery history" : "Історія відновлення"}</p>
          <div className="custom-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
            {[
              { title: lang === "en" ? "Maksym: percentages plan" : "Максим: план з відсотків", active: true },
              { title: lang === "en" ? "Iryna: fractions review" : "Ірина: повторення дробів", active: false },
              { title: lang === "en" ? "Danylo: equation steps" : "Данило: кроки рівнянь", active: false }
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => onSetView(item.active ? "brief" : "dashboard")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  item.active ? "bg-blue-50 font-semibold text-blue-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <NotebookPen className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-sm font-semibold text-slate-700 shadow-sm">
                {role === "teacher" ? "O" : "M"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{role === "teacher" ? "Olena" : "Maksym"}</p>
                <p className="truncate text-xs text-slate-500">{role === "teacher" ? text.teacher : text.student}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-950 px-3 py-2 text-xs font-medium text-white">
            <span>{tasksGenerated ? text.requested : text.ready}</span>
            <HelpCircle className="h-4 w-4 text-slate-300" aria-hidden />
          </div>
        </div>
      </div>
    </aside>
  );
}

function TeacherDashboard({
  lang,
  result,
  primaryGap,
  secondaryGap,
  tasksGenerated,
  isComplete,
  answeredCount,
  onGenerateTasks,
  onOpenScreening,
  onOpenBrief
}: {
  lang: Lang;
  result: ReturnType<typeof scoreScreening>;
  primaryGap: CategoryId;
  secondaryGap: CategoryId;
  tasksGenerated: boolean;
  isComplete: boolean;
  answeredCount: number;
  onGenerateTasks: () => void;
  onOpenScreening: () => void;
  onOpenBrief: () => void;
}) {
  const text = copy[lang];
  const primaryBlock = recoveryBlocks[primaryGap];
  const secondaryBlock = recoveryBlocks[secondaryGap];

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <BrainCircuit className="h-4 w-4" aria-hidden />
                {text.localOnly}
              </div>
              <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">{text.welcomeTeacher}</h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">{text.teacherLead}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                <InfoChip icon={<GraduationCap className="h-4 w-4" />} label={text.dailyContext} />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-52">
              <ActionButton icon={<ClipboardList className="h-4 w-4" />} label={text.runScreening} onClick={onOpenScreening} />
              <SecondaryButton icon={<FileText className="h-4 w-4" />} label={text.openBrief} onClick={onOpenBrief} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">{text.setup}</p>
          <div className="mt-4 grid gap-3">
            <SetupItem icon={<Gauge className="h-4 w-4" />} label={lang === "en" ? "20 min/day" : "20 хв/день"} />
            <SetupItem icon={<WifiOff className="h-4 w-4" />} label={lang === "en" ? "Low-bandwidth, print-first" : "Мало інтернету, друк насамперед"} />
            <SetupItem icon={<Users className="h-4 w-4" />} label={lang === "en" ? "Mixed-level support" : "Підтримка різних рівнів"} />
            <SetupItem icon={<Languages className="h-4 w-4" />} label={studentProfile.language[lang]} />
          </div>
          <AiComposer lang={lang} tasksGenerated={tasksGenerated} onGenerateTasks={onGenerateTasks} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<Users className="h-5 w-5" />} label={text.activeStudents} value="4" detail={text.classPulse} />
        <MetricCard
          icon={<BarChart3 className="h-5 w-5" />}
          label={text.likelyGaps}
          value={`${categoryLabel(primaryGap, lang)} + ${categoryLabel(secondaryGap, lang)}`}
          detail={`${result.totalCorrect}/${result.totalQuestions} ${text.quickScreening}`}
        />
        <MetricCard
          icon={<Sparkles className="h-5 w-5" />}
          label={text.taskStatus}
          value={tasksGenerated ? text.requested : text.ready}
          detail={tasksGenerated ? text.aiDrafted : text.waitingForRequest}
        />
        <MetricCard icon={<Printer className="h-5 w-5" />} label={text.briefReady} value={isComplete ? text.ready : `${answeredCount}/10`} detail={text.printBrief} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">{text.students}</h2>
              <p className="mt-1 text-sm text-slate-500">{lang === "en" ? "Demo cohort for a teacher-led recovery workflow." : "Демо-група для відновлення навчання під керівництвом учителя."}</p>
            </div>
            <button
              type="button"
              onClick={onGenerateTasks}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              {text.generateAiTasks}
            </button>
          </div>

          <div className="grid gap-3">
            {roster.map((student) => (
              <div key={student.name} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3 md:grid-cols-[0.9fr_1fr_0.9fr] md:items-center">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-semibold text-slate-700 shadow-hairline">
                    {student.name.slice(0, 1)}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">{student.name}</p>
                    <p className="text-sm text-slate-500">{lang === "en" ? "Grade" : "Клас"} {student.grade}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-500">{text.progress}</span>
                    <span className="font-medium text-slate-700">{student.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-lg bg-slate-200">
                    <div className="h-full rounded-lg bg-blue-600" style={{ width: `${student.progress}%` }} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {student.gaps.map((gap) => (
                    <CategoryChip key={gap} category={gap} lang={lang} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{text.categoryScores}</h2>
                <p className="mt-1 text-sm text-slate-500">{studentProfile.name} | {studentProfile.context[lang]}</p>
              </div>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                {result.totalCorrect}/10
              </span>
            </div>
            <div className="grid gap-3">
              {result.categoryResults.map((categoryResult) => (
                <ScoreRow key={categoryResult.category} result={categoryResult} lang={lang} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{text.nextAction}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">{text.restartCopy}</p>
              </div>
              <NotebookPen className="h-5 w-5 shrink-0 text-blue-600" aria-hidden />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <FocusBlock title={categoryLabel(primaryGap, lang)} block={primaryBlock} lang={lang} />
              <FocusBlock title={categoryLabel(secondaryGap, lang)} block={secondaryBlock} lang={lang} />
            </div>
          </div>
        </div>
      </section>

      <PlanPreview lang={lang} primaryGap={primaryGap} secondaryGap={secondaryGap} />
    </div>
  );
}

function StudentDashboard({
  lang,
  result,
  primaryGap,
  secondaryGap,
  tasksGenerated,
  answeredCount,
  onOpenScreening
}: {
  lang: Lang;
  result: ReturnType<typeof scoreScreening>;
  primaryGap: CategoryId;
  secondaryGap: CategoryId;
  tasksGenerated: boolean;
  answeredCount: number;
  onOpenScreening: () => void;
}) {
  const text = copy[lang];
  const primaryBlock = recoveryBlocks[primaryGap];
  const secondaryBlock = recoveryBlocks[secondaryGap];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-700">{text.accountSwitch}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">{text.studentViewTitle}</h1>
            <p className="mt-3 leading-7 text-slate-600">{text.studentViewLead}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <GraduationCap className="h-6 w-6" aria-hidden />
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          <MetricCard icon={<ClipboardCheck className="h-5 w-5" />} label={text.quickScreening} value={`${answeredCount}/10`} detail={`${result.totalCorrect}/10 ${text.resultSnapshot}`} />
          <MetricCard
            icon={<BookOpenCheck className="h-5 w-5" />}
            label={text.restartPoints}
            value={`${categoryLabel(primaryGap, lang)} + ${categoryLabel(secondaryGap, lang)}`}
            detail={text.recoveryPlan}
          />
        </div>

        <button
          type="button"
          onClick={onOpenScreening}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <ClipboardList className="h-4 w-4" aria-hidden />
          {answeredCount > 0 ? text.continueScreening : text.startScreening}
        </button>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{tasksGenerated ? text.aiTasksForStudent : text.noTasksYet}</h2>
            <p className="mt-1 text-sm text-slate-500">{tasksGenerated ? text.aiDrafted : text.noTasksLead}</p>
          </div>
          <Sparkles className="h-5 w-5 text-amber-500" aria-hidden />
        </div>

        {tasksGenerated ? (
          <div className="mt-5 grid gap-3">
            {[primaryBlock, secondaryBlock].map((block) => (
              <div key={block.category} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <CategoryChip category={block.category} lang={lang} />
                  <span className="text-sm font-medium text-slate-500">{text.todayTasks}</span>
                </div>
                <ul className="space-y-2 text-sm leading-6 text-slate-700">
                  {block.printableExercises[lang].slice(0, 2).map((exercise) => (
                    <li key={exercise} className="flex gap-2">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                      <span>{exercise}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <Send className="mx-auto h-6 w-6 text-slate-400" aria-hidden />
            <p className="mt-3 text-sm leading-6 text-slate-500">{text.waitingForRequest}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function AiComposer({
  lang,
  tasksGenerated,
  onGenerateTasks
}: {
  lang: Lang;
  tasksGenerated: boolean;
  onGenerateTasks: () => void;
}) {
  const text = copy[lang];
  const prompt =
    lang === "en"
      ? "Create 20-minute print-first recovery tasks for Maksym based on percentages and word problems."
      : "Створи 20-хвилинні завдання для друку для Максима на основі відсотків і текстових задач.";
  const chips = [
    { label: lang === "en" ? "Recovery plan" : "План відновлення", icon: Target, active: true, className: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200" },
    { label: lang === "en" ? "Worksheet" : "Аркуш вправ", icon: ClipboardCheck, active: false, className: "bg-amber-100 text-amber-800 ring-1 ring-amber-200" },
    { label: lang === "en" ? "Teacher brief" : "Brief вчителя", icon: FileText, active: false, className: "bg-blue-100 text-blue-800 ring-1 ring-blue-200" }
  ];

  return (
    <div className="mt-5 rounded-lg border border-slate-200/80 bg-white/80 p-3 shadow-lg shadow-slate-200/50 backdrop-blur">
      <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">{prompt}</div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-500">
            <Home className="h-4 w-4" aria-hidden />
          </span>
          {chips.map((chip) => {
            const Icon = chip.icon;

            return (
              <span key={chip.label} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${chip.className}`}>
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {chip.label}
              </span>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onGenerateTasks}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
          aria-label={text.generateAiTasks}
          title={text.generateAiTasks}
        >
          {tasksGenerated ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
        </button>
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">{tasksGenerated ? text.aiDrafted : text.waitingForRequest}</p>
    </div>
  );
}

function ScreeningView({
  lang,
  answers,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  onAnswer,
  onUseDemo,
  onReset,
  onFinish
}: {
  lang: Lang;
  answers: AnswerMap;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  onAnswer: (questionId: string, optionId: "A" | "B" | "C" | "D") => void;
  onUseDemo: () => void;
  onReset: () => void;
  onFinish: () => void;
}) {
  const text = copy[lang];
  const currentQuestion = questions[currentQuestionIndex] ?? questions[0];
  const answeredCount = questions.filter((question) => answers[question.id]).length;
  const selectedOption = answers[currentQuestion.id];
  const isLast = currentQuestionIndex === questions.length - 1;
  const canFinish = answeredCount === questions.length;

  return (
    <section className="mx-auto grid w-full max-w-4xl gap-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-700">{text.quickScreening}</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-950">{text.screeningTitle}</h1>
          <p className="mt-2 text-slate-600">{text.screeningLead}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SecondaryButton icon={<RotateCcw className="h-4 w-4" />} label={text.reset} onClick={onReset} />
          <SecondaryButton icon={<Download className="h-4 w-4" />} label={text.useDemo} onClick={onUseDemo} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-slate-950 px-3 py-1 text-sm font-semibold text-white">
              {text.question} {currentQuestionIndex + 1}/10
            </span>
            <CategoryChip category={currentQuestion.category} lang={lang} />
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium capitalize text-slate-600">
              {currentQuestion.difficulty}
            </span>
          </div>
          <span className="text-sm font-medium text-slate-500">{answeredCount}/10</span>
        </div>

        <div className="mb-6 h-2 overflow-hidden rounded-lg bg-slate-100">
          <div className="h-full rounded-lg bg-blue-600 transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>

        <h2 className="text-2xl font-semibold leading-tight text-slate-950">{currentQuestion.prompt[lang]}</h2>
        <div className="mt-6 grid gap-3">
          {currentQuestion.options.map((option) => {
            const active = selectedOption === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onAnswer(currentQuestion.id, option.id)}
                className={`flex min-h-14 items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                  active
                    ? "border-blue-600 bg-blue-50 text-blue-950 shadow-hairline"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                    active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {option.id}
                </span>
                <span className="font-medium">{option.text[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SecondaryButton
          icon={<ChevronLeft className="h-4 w-4" />}
          label={text.previous}
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          {!isLast ? (
            <ActionButton
              icon={<ChevronRight className="h-4 w-4" />}
              label={text.next}
              onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            />
          ) : (
            <ActionButton icon={<ArrowRight className="h-4 w-4" />} label={text.finish} onClick={onFinish} disabled={!canFinish} />
          )}
        </div>
      </div>
    </section>
  );
}

function TeacherBriefView({
  lang,
  result,
  primaryGap,
  secondaryGap,
  onBack
}: {
  lang: Lang;
  result: ReturnType<typeof scoreScreening>;
  primaryGap: CategoryId;
  secondaryGap: CategoryId;
  onBack: () => void;
}) {
  const text = copy[lang];
  const primaryBlock = recoveryBlocks[primaryGap];
  const secondaryBlock = recoveryBlocks[secondaryGap];
  const stronger = result.strongerCategories
    .filter((category) => category !== primaryGap && category !== secondaryGap)
    .map((category) => categoryLabel(category, lang))
    .join(", ");

  return (
    <section className="print-shell mx-auto grid w-full max-w-5xl gap-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {text.dashboard}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Printer className="h-4 w-4" aria-hidden />
          {text.printBrief}
        </button>
      </div>

      <article className="print-card rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">EduRecovery UA</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">{text.teacherRecoveryBrief}</h1>
            <p className="mt-2 text-slate-600">
              {studentProfile.name} | {lang === "en" ? "Grade" : "Клас"} {studentProfile.grade} | {studentProfile.age} | {studentProfile.language[lang]}
            </p>
          </div>
          <img src="/logo.PNG" alt="EduRecovery UA logo" className="h-16 w-16 rounded-lg object-cover" />
        </div>

        <div className="grid gap-5 py-6 md:grid-cols-3">
          <BriefStat label={text.resultSnapshot} value={`${result.totalCorrect}/${result.totalQuestions}`} />
          <BriefStat label={text.restartPoints} value={`${categoryLabel(primaryGap, lang)} + ${categoryLabel(secondaryGap, lang)}`} />
          <BriefStat label={text.setup} value={lang === "en" ? "20 min/day" : "20 хв/день"} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-lg border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-950">{text.overallSnapshot}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{text.screeningPurpose}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {text.strongerAreas}: <strong>{stronger || categoryLabel(primaryGap, lang)}</strong>
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-950">{text.recommendedRestart}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {categoryLabel(primaryGap, lang)}: {primaryBlock.learningGoal[lang]}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {categoryLabel(secondaryGap, lang)}: {secondaryBlock.learningGoal[lang]}
            </p>
          </section>
        </div>

        <section className="mt-5 rounded-lg border border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-950">{text.teacherRecommendations}</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {[primaryBlock, secondaryBlock].map((block) => (
              <div key={block.category} className="rounded-lg bg-slate-50 p-3">
                <CategoryChip category={block.category} lang={lang} />
                <p className="mt-3 text-sm leading-6 text-slate-600">{block.teacherExplanation[lang]}</p>
                <p className="mt-2 text-sm font-medium text-slate-700">{text.lowTech}: {block.lowTechAdaptation[lang]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="print-break mt-6">
          <h2 className="text-xl font-semibold text-slate-950">{text.recoveryPlan}</h2>
          <div className="mt-4 grid gap-3">
            {planBlueprint.map((day) => (
              <PlanDayRow key={day.day} day={day} lang={lang} primaryGap={primaryGap} secondaryGap={secondaryGap} />
            ))}
          </div>
        </section>

        <section className="print-break mt-6">
          <h2 className="text-xl font-semibold text-slate-950">{text.printableExercises}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[primaryBlock, secondaryBlock].map((block) => (
              <div key={block.category} className="rounded-lg border border-slate-200 p-4">
                <CategoryChip category={block.category} lang={lang} />
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
                  {block.printableExercises[lang].map((exercise) => (
                    <li key={exercise}>{exercise}</li>
                  ))}
                </ol>
                <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                  <strong>{lang === "en" ? "Mini-check" : "Міні-перевірка"}:</strong> {block.miniCheckQuestion[lang]}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-950">{text.parentSummary}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{text.parentCopy}</p>
        </section>

        <p className="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">{text.disclaimer}</p>
      </article>
    </section>
  );
}

function PlanPreview({ lang, primaryGap, secondaryGap }: { lang: Lang; primaryGap: CategoryId; secondaryGap: CategoryId }) {
  const text = copy[lang];
  const previewDays = planBlueprint.slice(0, 6);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{text.recoveryPlan}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {categoryLabel(primaryGap, lang)} to {categoryLabel(secondaryGap, lang)}
          </p>
        </div>
        <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">14 days</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {previewDays.map((day) => (
          <PlanDayRow key={day.day} day={day} lang={lang} primaryGap={primaryGap} secondaryGap={secondaryGap} compact />
        ))}
      </div>
    </section>
  );
}

function PlanDayRow({
  day,
  lang,
  primaryGap,
  secondaryGap,
  compact = false
}: {
  day: (typeof planBlueprint)[number];
  lang: Lang;
  primaryGap: CategoryId;
  secondaryGap: CategoryId;
  compact?: boolean;
}) {
  const focusLabel =
    day.focus === "primary"
      ? categoryLabel(primaryGap, lang)
      : day.focus === "secondary"
        ? categoryLabel(secondaryGap, lang)
        : day.focus === "both"
          ? `${categoryLabel(primaryGap, lang)} + ${categoryLabel(secondaryGap, lang)}`
          : copy[lang].resultSnapshot;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">{lang === "en" ? "Day" : "День"} {day.day}</p>
          <h3 className="mt-1 text-sm font-semibold text-slate-950">{day.title[lang]}</h3>
        </div>
        <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{day.time}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-blue-700">{focusLabel}</p>
      {!compact && (
        <div className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
          <p>{day.teacherAction[lang]}</p>
          <p>{day.studentTask[lang]}</p>
        </div>
      )}
      {compact && <p className="mt-2 text-sm leading-6 text-slate-600">{day.teacherAction[lang]}</p>}
    </div>
  );
}

function FocusBlock({ title, block, lang }: { title: string; block: { learningGoal: Record<Lang, string>; activities: Record<Lang, string[]> }; lang: Lang }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{block.learningGoal[lang]}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {block.activities[lang].slice(0, 2).map((activity) => (
          <li key={activity} className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>{activity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreRow({ result, lang }: { result: ReturnType<typeof scoreScreening>["categoryResults"][number]; lang: Lang }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip category={result.category} lang={lang} />
          <span className="text-sm font-medium text-slate-500">{result.confidence[lang]}</span>
        </div>
        <span className="text-sm font-semibold text-slate-700">
          {result.correct}/{result.total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-lg bg-slate-200">
        <div className={`h-full rounded-lg ${result.correct === 0 ? "bg-rose-500" : result.correct === 1 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${result.percent}%` }} />
      </div>
      <p className="mt-2 text-sm leading-5 text-slate-500">{result.summary[lang]}</p>
    </div>
  );
}

function MetricCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 break-words text-2xl font-semibold text-slate-950">{value}</p>
          <p className="mt-2 text-sm leading-5 text-slate-500">{detail}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">{icon}</span>
      </div>
    </div>
  );
}

function BriefStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function SetupItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
      <span className="text-blue-700">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-hairline">
      <span className="text-blue-700">{icon}</span>
      {label}
    </span>
  );
}

function CategoryChip({ category, lang }: { category: CategoryId; lang: Lang }) {
  return (
    <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${categoryMeta[category].tone}`}>
      {categoryMeta[category].shortLabel[lang]}
    </span>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {icon}
      {label}
    </button>
  );
}

function SecondaryButton({
  icon,
  label,
  onClick,
  disabled
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
    >
      {icon}
      {label}
    </button>
  );
}

function SegmentedControl({
  label,
  icon,
  value,
  options,
  onChange
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
      <span className="sr-only">{label}</span>
      <span className="hidden px-2 text-slate-500 sm:inline-flex">{icon}</span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            value === option.value ? "bg-white text-slate-950 shadow-hairline" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
