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
  ListChecks,
  Menu,
  MessageSquarePlus,
  NotebookPen,
  Printer,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  UserRound,
  Users,
  WifiOff,
  X
} from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  categoryOrder,
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

const LowBandwidthContext = createContext<boolean>(false);

type Role = "teacher" | "student";
type View = "dashboard" | "screening" | "brief" | "setup" | "student-profile" | "manual-input";

const categoryVisuals: Record<
  CategoryId,
  {
    chip: string;
    dot: string;
    bar: string;
    track: string;
  }
> = {
  fractions: {
    chip: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
    track: "bg-blue-100"
  },
  percentages: {
    chip: "border-yellow-200 bg-yellow-50 text-yellow-700",
    dot: "bg-yellow-500",
    bar: "bg-yellow-500",
    track: "bg-yellow-100"
  },
  geometry: {
    chip: "border-green-200 bg-green-50 text-green-700",
    dot: "bg-green-500",
    bar: "bg-green-500",
    track: "bg-green-100"
  },
  equations: {
    chip: "border-indigo-200 bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
    bar: "bg-indigo-500",
    track: "bg-indigo-100"
  },
  "word-problems": {
    chip: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
    bar: "bg-red-500",
    track: "bg-red-100"
  }
};

const copy = {
  en: {
    educatorAssistant: "Digital assistant for educators",
    teacher: "Teacher",
    student: "Student",
    welcomeTeacher: "Welcome, Olena",
    teacherLead: "Teacher-led recovery workspace for mixed-level Ukrainian classrooms.",
    dailyContext: "Grade 6 math | 45 min/day | disrupted learning | print-first",
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
    parentSummary: "Teacher Action Brief",
    parentCopy:
      "Maksym completed a short math check-up. The goal is to find where support will help most. A 14-day plan will focus on the clearest restart points.",
    inputPaperResults: "Input paper results",
    groupingRecommendations: "Grouping Recommendations",
    groupA: "Group A (5 students): Needs fractions review. Generate worksheet.",
    groupB: "Group B (12 students): Can move forward.",
    lowBandwidth: "Low-bandwidth / Disrupted mode",
    accountSwitch: "Account switch",
    setup: "Teacher setup",
    setupTitle: "Set up the recovery context",
    setupLead: "Define the classroom constraints to adapt the screening and 14-day recovery plan.",
    gradeSelect: "Grade level",
    dailyTimeSelect: "Daily study time",
    classroomMode: "Classroom context",
    techMode: "Available resources",
    modeDisrupted: "Disrupted learning",
    modeNormal: "Normal attendance",
    techLow: "Low-tech / Print-first",
    techDigital: "Digital / Devices available",
    startRecovery: "Start recovery workspace",
    demoDataFill: "Use demo data"
  },
  uk: {
    educatorAssistant: "Цифровий асистент для педагогів",
    teacher: "Вчитель",
    student: "Учень",
    welcomeTeacher: "Вітаємо, Олено",
    teacherLead: "Робочий простір відновлення навчання для різнорівневих українських класів.",
    dailyContext: "Математика 6 клас | 45 хв/день | перерви в навчанні | матеріали для друку",
    runScreening: "Провести скринінг",
    openBrief: "Відкрити звіт",
    printBrief: "Друк звіту",
    classPulse: "Стан групи",
    activeStudents: "Активні учні",
    likelyGaps: "Ймовірні прогалини",
    taskStatus: "Статус AI-завдань",
    briefReady: "Звіт для вчителя",
    ready: "Готово",
    requested: "Запитано",
    students: "Учні",
    progress: "Прогрес",
    restartPoints: "Точки відновлення",
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
    screeningLead: "Короткий скринінг під керівництвом учителя для визначення практичних точок відновлення.",
    question: "Запитання",
    previous: "Назад",
    next: "Далі",
    useDemo: "Використати демо",
    reset: "Скинути",
    finish: "Відкрити результат",
    resultSnapshot: "Огляд результатів",
    strongerAreas: "Сильні сторони",
    recoveryPlan: "14-денний план відновлення",
    printableExercises: "Вправи для друку",
    teacherRecoveryBrief: "Звіт з відновлення для вчителя",
    overallSnapshot: "Загальний огляд",
    recommendedRestart: "Рекомендована точка відновлення",
    teacherRecommendations: "Рекомендації для вчителя",
    disclaimer:
      "Це швидкий скринінг із 10 питань для визначення практичних точок відновлення у відновленні навчання. Це не повна діагностична оцінка. Вчитель має використовувати професійне судження та спостереження в класі.",
    lowTech: "Низькотехнологічна адаптація",
    curriculum: "Навчальна програма",
    viewAs: "Переглядати як",
    language: "Мова",
    aiTasksForStudent: "Набір завдань від учителя",
    noTasksYet: "Завдань ще немає",
    noTasksLead: "Учитель може створити цільовий набір завдань із плану відновлення.",
    weekOne: "Тиждень 1: базові знання",
    weekTwo: "Тиждень 2: інтеграція",
    categoryScores: "Результати за темами",
    screeningPurpose:
      "Максим пройшов швидкий скринінг, щоб визначити практичну точку відновлення після перерв у навчанні.",
    restartCopy:
      "Почніть із цільової роботи над основною прогалиною. Нехай заняття будуть короткими й практичними, а другу тему інтегруйте на другому тижні.",
    parentSummary: "Витичні для вчителя",
    parentCopy:
      "Максим пройшов коротку перевірку з математики. Мета - зрозуміти, де підтримка допоможе найбільше. 14-денний план зосередиться на найчіткіших точках відновлення.",
    inputPaperResults: "Ввести результати з паперу",
    groupingRecommendations: "Рекомендації для груп",
    groupA: "Група А (5 учнів): Потребує повторення дробів. Згенеруйте завдання.",
    groupB: "Група Б (12 учнів): Може йти далі за матеріалом.",
    lowBandwidth: "Режим низького трафіку / без Інтернету",
    accountSwitch: "Зміна акаунта",
    setup: "Налаштування вчителя",
    setupTitle: "Налаштуйте контекст відновлення",
    setupLead: "Визначте умови в класі для адаптації скринінгу та 14-денного плану відновлення.",
    gradeSelect: "Клас",
    dailyTimeSelect: "Час на день",
    classroomMode: "Контекст навчання",
    techMode: "Доступні ресурси",
    modeDisrupted: "Перерви в навчанні",
    modeNormal: "Стабільне відвідування",
    techLow: "Обмежений інтернет / Друк",
    techDigital: "Є пристрої / Інтернет",
    startRecovery: "Почати роботу",
    demoDataFill: "Використати демо-дані"
  }
} satisfies Record<Lang, Record<string, string>>;

const roster = [
  { name: "Maksym", grade: "6", progress: 62, status: "active", avatar: "/student-avatars/maksym.jpg", gaps: ["percentages", "word-problems"] as CategoryId[] },
  { name: "Iryna", grade: "6", progress: 76, status: "monitor", avatar: "/student-avatars/iryna.jpg", gaps: ["fractions", "geometry"] as CategoryId[] },
  { name: "Sofia", grade: "7", progress: 88, status: "stable", avatar: "/student-avatars/sofia.jpg", gaps: ["geometry"] as CategoryId[] },
  { name: "Danylo", grade: "6", progress: 45, status: "at-risk", avatar: "/student-avatars/danylo.jpg", gaps: ["equations", "word-problems", "fractions"] as CategoryId[] },
  { name: "Kateryna", grade: "5", progress: 92, status: "stable", avatar: "/student-avatars/kateryna.jpg", gaps: [] as CategoryId[] },
  { name: "Artem", grade: "7", progress: 55, status: "active", avatar: "/student-avatars/artem.jpg", gaps: ["percentages", "equations"] as CategoryId[] },
  { name: "Veronika", grade: "5", progress: 71, status: "monitor", avatar: "/student-avatars/veronika.jpg", gaps: ["word-problems"] as CategoryId[] },
  { name: "Bohdan", grade: "6", progress: 38, status: "at-risk", avatar: "/student-avatars/bohdan.jpg", gaps: ["fractions", "percentages", "word-problems"] as CategoryId[] },
  { name: "Polina", grade: "7", progress: 81, status: "stable", avatar: "/student-avatars/polina.jpg", gaps: ["equations"] as CategoryId[] },
  { name: "Matviy", grade: "5", progress: 65, status: "monitor", avatar: "/student-avatars/matviy.jpg", gaps: ["geometry", "fractions"] as CategoryId[] }
];

export function EduRecoveryApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [role, setRole] = useState<Role>("teacher");
  const [view, setView] = useState<View>("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [tasksGenerated, setTasksGenerated] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lowBandwidthMode");
    if (saved !== null) {
      setIsLowBandwidth(saved === "true");
    }
  }, []);

  const handleLowBandwidthChange = (checked: boolean) => {
    setIsLowBandwidth(checked);
    localStorage.setItem("lowBandwidthMode", checked ? "true" : "false");
  };

  const [setupData, setSetupData] = useState({
    grade: "6",
    dailyTime: "45 min/day",
    classroomMode: "disrupted",
    techMode: "low-tech"
  });

  const text = copy[lang];
  const result = useMemo(() => scoreScreening(answers), [answers]);
  const primaryGap = result.weakestCategories[0] || "percentages";
  const secondaryGap = result.weakestCategories[1] || "word-problems";
  const answeredCount = questions.filter((question) => answers[question.id]).length;
  const isComplete = answeredCount === questions.length;

  const switchRole = (nextRole: Role) => {
    setRole(nextRole);
    setView("dashboard");
  };

  const handleGenerateTasks = () => {
    setIsGeneratingTasks(true);
    setTimeout(() => {
      setIsGeneratingTasks(false);
      setTasksGenerated(true);
    }, 2000);
  };

  const workspaceLabel = lang === "en" ? "workspace" : "простір";

  const content =
    view === "manual-input" ? (
      <ManualInputView
        lang={lang}
        onBack={() => setView("dashboard")}
        onGenerate={() => {
          setAnswers(demoAnswers);
          setView("brief");
        }}
      />
    ) : view === "setup" ? (
      <TeacherSetupView
        lang={lang}
        setupData={setupData}
        setSetupData={setSetupData}
        onComplete={() => setView("dashboard")}
        onDemoFill={() => {
          setSetupData({ grade: "6", dailyTime: "45 min/day", classroomMode: "disrupted", techMode: "low-tech" });
          setAnswers(demoAnswers);
          setView("dashboard");
        }}
      />
    ) : view === "screening" ? (
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
        setupData={setupData}
        onBack={() => setView("dashboard")}
      />
    ) : view === "student-profile" && selectedStudent ? (
      <StudentProfileView
        lang={lang}
        studentName={selectedStudent}
        result={result}
        primaryGap={primaryGap}
        secondaryGap={secondaryGap}
        onBack={() => setView("dashboard")}
        onOpenScreening={() => setView("screening")}
        onOpenBrief={() => setView("brief")}
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
        setupData={setupData}
        isGeneratingTasks={isGeneratingTasks}
        onGenerateTasks={handleGenerateTasks}
        onOpenScreening={() => setView("screening")}
        onOpenManualInput={() => setView("manual-input")}
        onOpenBrief={() => setView("brief")}
        onSelectStudent={(name) => {
          setSelectedStudent(name);
          setView("student-profile");
        }}
      />
    ) : (
      <StudentDashboard
        lang={lang}
        answeredCount={answeredCount}
        onOpenScreening={() => setView("screening")}
      />
    );

  return (
    <LowBandwidthContext.Provider value={isLowBandwidth}>
      <main className={`min-h-screen bg-slate-50 text-slate-950 ${isLowBandwidth ? "low-bandwidth-mode" : ""}`}>
      <div className="flex min-h-screen">
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}
        <WorkspaceSidebar
          lang={lang}
          role={role}
          view={view}
          selectedStudent={selectedStudent}
          tasksGenerated={tasksGenerated}
          isMobileMenuOpen={isMobileMenuOpen}
          onSetRole={(newRole) => {
            switchRole(newRole);
            setIsMobileMenuOpen(false);
          }}
          onSetView={(newView) => {
            setView(newView);
            setIsMobileMenuOpen(false);
          }}
          isGeneratingTasks={isGeneratingTasks}
          onGenerateTasks={() => {
            handleGenerateTasks();
            setIsMobileMenuOpen(false);
          }}
          onSelectStudent={(student) => {
            setSelectedStudent(student);
            setIsMobileMenuOpen(false);
          }}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200/90 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none lg:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
              {isLowBandwidth ? (
                <span className="text-lg font-bold text-blue-700 lg:hidden shrink-0">EduRecovery</span>
              ) : (
                <img src="/logosm.png" alt="EduRecovery UA logo" className="h-10 w-auto shrink-0 lg:hidden" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-blue-600">{role === "teacher" ? text.teacher : text.student} {workspaceLabel}</p>
                <h1 className="truncate text-xl font-semibold text-slate-950">
                  {view === "setup" ? text.setup : view === "brief" ? text.teacherRecoveryBrief : view === "screening" ? text.screeningTitle : view === "student-profile" ? `${selectedStudent} - ${text.student}` : role === "teacher" ? text.dashboard : text.studentViewTitle}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <div className="flex items-center gap-2 px-2 border-r border-slate-200">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLowBandwidth}
                    onChange={(e) => handleLowBandwidthChange(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {text.lowBandwidth}
                </label>
              </div>
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
          
          <footer className="no-print mt-auto border-t border-slate-200/80 bg-white/50 px-4 py-5 text-center text-sm text-slate-500 backdrop-blur-sm sm:px-6 lg:px-8">
            <p>
              &copy; {new Date().getFullYear()} EduRecovery UA.{" "}
              {lang === "en" ? "All rights reserved." : "Всі права захищені."}
            </p>
          </footer>
        </div>
      </div>
    </main>
    </LowBandwidthContext.Provider>
  );
}

function WorkspaceSidebar({
  lang,
  role,
  view,
  selectedStudent,
  tasksGenerated,
  isGeneratingTasks,
  isMobileMenuOpen,
  onSetRole,
  onSetView,
  onGenerateTasks,
  onSelectStudent
}: {
  lang: Lang;
  role: Role;
  view: View;
  selectedStudent: string | null;
  tasksGenerated: boolean;
  isGeneratingTasks: boolean;
  isMobileMenuOpen: boolean;
  onSetRole: (role: Role) => void;
  onSetView: (view: View) => void;
  onGenerateTasks: () => void;
  onSelectStudent: (name: string | null) => void;
}) {
  const text = copy[lang];
  const isLowBandwidth = useContext(LowBandwidthContext);
  const studentNavItems = [
    { id: "dashboard" as View, label: text.dashboard, icon: LayoutDashboard },
    { id: "screening" as View, label: text.quickScreening, icon: ClipboardList }
  ];

  const teacherStudentItems = [
    { id: "student-profile" as View, label: text.dashboard, icon: LayoutDashboard },
    { id: "screening" as View, label: text.quickScreening, icon: ClipboardList },
    { id: "brief" as View, label: text.teacherRecoveryBrief, icon: FileText }
  ];

  return (
    <aside className={`no-print fixed inset-y-0 left-0 z-50 w-72 shrink-0 overflow-y-auto border-r border-slate-200/80 bg-white transition-transform duration-300 lg:static lg:flex lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} lg:sticky lg:top-0 lg:h-screen lg:shadow-none`}>
      <div className="flex h-full w-full flex-col p-5">
        <a href="/" className="mb-7 flex items-center justify-center text-left hover:opacity-80 transition-opacity cursor-pointer">
          <span className="flex h-24 w-48 shrink-0 items-center justify-center overflow-hidden bg-transparent">
            {isLowBandwidth ? (
              <span className="text-xl font-bold text-blue-700 tracking-wider">EduRecovery</span>
            ) : (
              <img src="/logosm.png" alt="EduRecovery UA logo" className="h-full w-full object-contain" />
            )}
          </span>
        </a>

        <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-2">
          <div className="grid grid-cols-2 gap-1">
            {(["teacher", "student"] as Role[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSetRole(item)}
                disabled={view === "setup" && item === "student"}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  role === item ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {item === "teacher" ? text.teacher : text.student}
              </button>
            ))}
          </div>
        </div>

        {role === "teacher" ? (
          <nav className="mb-6 flex flex-col gap-3">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{lang === "en" ? "Students" : "Учні"}</p>
            <div className="flex flex-col gap-1 mb-2">
              <button
                type="button"
                onClick={() => {
                  onSelectStudent(null);
                  onSetView("dashboard");
                }}
                className={`group flex items-center gap-3 rounded-lg px-3.5 py-2 text-left text-sm transition-all duration-200 ${
                  view === "dashboard" && !selectedStudent ? "bg-blue-50 font-semibold text-blue-700" : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard className={`h-5 w-5 shrink-0 transition-colors ${view === "dashboard" && !selectedStudent ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} strokeWidth={view === "dashboard" && !selectedStudent ? 2.5 : 2} />
                <span className="truncate">{text.dashboard}</span>
              </button>
            </div>

            {roster.map((student) => {
              const isSelected = selectedStudent === student.name;
              return (
                <div key={student.name} className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStudent(student.name);
                      onSetView("student-profile");
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3.5 py-2 text-left text-sm transition-all duration-200 ${
                      isSelected ? "bg-slate-100 font-semibold text-slate-950" : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <StudentAvatar student={student} size="sm" selected={isSelected} />
                    <span className="truncate">{student.name}</span>
                  </button>

                  {isSelected && (
                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-slate-100 pl-3">
                      {teacherStudentItems.map((item) => {
                        const Icon = item.icon;
                        const active = view === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => onSetView(item.id)}
                            className={`group flex items-center gap-3 rounded-lg px-3 py-1.5 text-left text-sm transition-all duration-200 ${
                              active ? "font-semibold text-blue-600" : "text-slate-500 hover:text-slate-900"
                            }`}
                          >
                            <Icon className={`h-4 w-4 shrink-0 transition-colors ${active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} strokeWidth={active ? 2.5 : 2} />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        ) : (
          <nav className="mb-6 flex flex-col gap-1.5">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{lang === "en" ? "Tools" : "Інструменти"}</p>
            {studentNavItems.map((item) => {
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
        )}

        {role === "teacher" && (
          <div className="flex min-h-0 flex-1 flex-col justify-end">
            <div className="mb-6">
              <button
                type="button"
                onClick={onGenerateTasks}
                disabled={isGeneratingTasks}
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingTasks ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-700" aria-hidden />
                ) : (
                  <MessageSquarePlus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                )}
                {isGeneratingTasks ? (lang === "en" ? "Generating..." : "Створення...") : text.generateAiTasks}
              </button>
            </div>
          </div>
        )}

        <div className="mt-auto border-t border-slate-200 pt-4">
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
          {role === "teacher" && (
            <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
              <span>{tasksGenerated ? text.requested : text.ready}</span>
              <HelpCircle className="h-4 w-4 text-blue-500" aria-hidden />
            </div>
          )}
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
  isGeneratingTasks,
  isComplete,
  answeredCount,
  setupData,
  onGenerateTasks,
  onOpenScreening,
  onOpenManualInput,
  onOpenBrief,
  onSelectStudent
}: {
  lang: Lang;
  result: ReturnType<typeof scoreScreening>;
  primaryGap: CategoryId;
  secondaryGap: CategoryId;
  tasksGenerated: boolean;
  isGeneratingTasks: boolean;
  isComplete: boolean;
  answeredCount: number;
  setupData: { grade: string; dailyTime: string; classroomMode: string; techMode: string };
  onGenerateTasks: () => void;
  onOpenScreening: () => void;
  onOpenManualInput: () => void;
  onOpenBrief: () => void;
  onSelectStudent: (name: string) => void;
}) {
  const text = copy[lang];
  const classAverage = Math.round(roster.reduce((acc, student) => acc + student.progress, 0) / roster.length);
  const studentsNeedingSupport = roster.filter((student) => student.status === "active" || student.progress < 65);
  const gapCounts = categoryOrder
    .map((category) => ({
      category,
      count: roster.filter((student) => student.gaps.includes(category)).length
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
  const screeningStatus = isComplete
    ? lang === "en"
      ? "Maksym screening complete"
      : "Скринінг Максима завершено"
    : lang === "en"
      ? `${answeredCount}/10 screening answers`
      : `${answeredCount}/10 відповідей скринінгу`;

  return (
    <div className="grid gap-6">
      <section className="grid items-start gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  <BrainCircuit className="h-4 w-4" aria-hidden />
                  {lang === "en" ? "Today’s recovery board" : "План відновлення на сьогодні"}
                </span>
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
                  {text.localOnly}
                </span>
              </div>
              <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                {lang === "en" ? "Teach the class, then target the gaps." : "Працюйте з класом і точково закривайте прогалини."}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                {lang === "en"
                  ? "Olena sees the whole group first: who needs a screening, which gaps repeat across students, and what to print for the next recovery block."
                  : "Олена спершу бачить всю групу: кому потрібен скринінг, які прогалини повторюються і що друкувати для наступного блоку."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
                <InfoChip icon={<Users className="h-4 w-4" />} label={`${roster.length} ${lang === "en" ? "students" : "учні"}`} />
                <InfoChip icon={<GraduationCap className="h-4 w-4" />} label={`${lang === "en" ? "Grade" : "Клас"} ${setupData.grade}`} />
                <InfoChip icon={<Gauge className="h-4 w-4" />} label={setupData.dailyTime} />
                <InfoChip icon={<WifiOff className="h-4 w-4" />} label={setupData.techMode === "low-tech" ? text.techLow : text.techDigital} />
              </div>
            </div>
            <div className="grid min-w-56 gap-2">
              <ActionButton icon={<ClipboardList className="h-4 w-4" />} label={text.runScreening} onClick={onOpenScreening} />
              <SecondaryButton icon={<FileText className="h-4 w-4" />} label={text.inputPaperResults} onClick={onOpenManualInput} />
              <SecondaryButton icon={<FileText className="h-4 w-4" />} label={text.openBrief} onClick={onOpenBrief} disabled={!isComplete} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-700">{lang === "en" ? "Next 45 minutes" : "Наступні 45 хвилин"}</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {lang === "en" ? "Print one shared block, then split support." : "Один друкований блок, потім групи підтримки."}
              </h2>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-600 shadow-hairline">
              <NotebookPen className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <div className="mt-5 grid gap-3">
            <TeachingStep
              step="1"
              title={lang === "en" ? "Whole-class warm-up" : "Розминка для всього класу"}
              detail={`${categoryLabel(primaryGap, lang)} + ${categoryLabel(secondaryGap, lang)}`}
            />
            <TeachingStep
              step="2"
              title={lang === "en" ? "Small-group pullout" : "Мала група підтримки"}
              detail={studentsNeedingSupport.map((student) => student.name).join(", ")}
            />
            <TeachingStep
              step="3"
              title={lang === "en" ? "Printable evidence" : "Матеріали для друку"}
              detail={tasksGenerated ? text.aiDrafted : text.waitingForRequest}
            />
          </div>
          <button
            type="button"
            onClick={onGenerateTasks}
            disabled={isGeneratingTasks}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingTasks ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-700" aria-hidden />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden />
            )}
            {isGeneratingTasks ? (lang === "en" ? "Generating..." : "Створення...") : text.generateAiTasks}
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard tone="blue" icon={<Users className="h-5 w-5" />} label={text.activeStudents} value={roster.length.toString()} detail={text.classPulse} />
        <MetricCard
          tone="red"
          icon={<BarChart3 className="h-5 w-5" />}
          label={text.likelyGaps}
          value={`${categoryLabel(primaryGap, lang)} + ${categoryLabel(secondaryGap, lang)}`}
          detail={lang === "en" ? "Class-wide trends" : "Загальні тенденції класу"}
        />
        <MetricCard
          tone="green"
          icon={<Gauge className="h-5 w-5" />}
          label={text.progress}
          value={`${classAverage}%`}
          detail={lang === "en" ? "Average completion" : "Середній рівень виконання"}
        />
        <MetricCard
          tone="yellow"
          icon={<ClipboardCheck className="h-5 w-5" />}
          label={lang === "en" ? "Screening status" : "Статус скринінгу"}
          value={screeningStatus}
          detail={lang === "en" ? "Use demo result to unlock the brief" : "Демо-результат відкриває brief"}
        />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">{lang === "en" ? "Attention queue" : "Черга уваги"}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {lang === "en" ? "Start with students where the same gap blocks tomorrow’s class." : "Почніть з учнів, де одна прогалина заважає наступному уроку."}
              </p>
            </div>
            <ListChecks className="h-5 w-5 text-blue-600" aria-hidden />
          </div>
          <div className="grid gap-3">
            {studentsNeedingSupport.map((student) => (
              <PriorityStudentRow key={student.name} student={student} lang={lang} onSelectStudent={onSelectStudent} />
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-indigo-900">{text.groupingRecommendations}</h3>
            </div>
            <div className="space-y-2 text-sm text-indigo-800">
              <div className="rounded border border-indigo-200 bg-white p-3 shadow-hairline">
                <span className="font-semibold block mb-1 text-indigo-900">Group A</span>
                {text.groupA}
              </div>
              <div className="rounded border border-indigo-200 bg-white p-3 shadow-hairline">
                <span className="font-semibold block mb-1 text-indigo-900">Group B</span>
                {text.groupB}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
          <div className="mb-5 grid gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">{text.students}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {lang === "en" ? "Class roster with recovery topics and next actions." : "Список учнів з темами відновлення та наступними діями."}
              </p>
            </div>
            <div className="w-full rounded-lg border border-blue-100 bg-blue-50/60 p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase text-blue-700">{lang === "en" ? "Gap pattern" : "Патерн прогалин"}</p>
                <p className="text-xs font-medium text-slate-500">{lang === "en" ? "Students affected" : "Учнів у групі"}</p>
              </div>
              <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(8.25rem,1fr))] gap-3">
                {gapCounts.map((item) => (
                  <ClassGapStrip key={item.category} category={item.category} count={item.count} lang={lang} />
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            {roster.map((student) => (
              <button
                key={student.name}
                type="button"
                onClick={() => onSelectStudent(student.name)}
                className="grid w-full gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-hairline transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md lg:grid-cols-[minmax(10rem,0.95fr)_minmax(8.5rem,0.75fr)_minmax(10rem,1fr)_auto] lg:items-center"
              >
                <div className="flex items-center gap-3">
                  <StudentAvatar student={student} size="md" />
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
                    <div className="h-full rounded-lg bg-blue-300" style={{ width: `${student.progress}%` }} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {student.gaps.map((gap) => (
                    <CategoryChip key={gap} category={gap} lang={lang} />
                  ))}
                </div>
                <span className="inline-flex items-center justify-start gap-1 text-sm font-semibold text-blue-700 md:justify-end">
                  {lang === "en" ? "Open" : "Відкрити"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StudentProfileView({
  lang,
  studentName,
  result,
  primaryGap,
  secondaryGap,
  onBack,
  onOpenScreening,
  onOpenBrief
}: {
  lang: Lang;
  studentName: string;
  result: ReturnType<typeof scoreScreening>;
  primaryGap: CategoryId;
  secondaryGap: CategoryId;
  onBack: () => void;
  onOpenScreening: () => void;
  onOpenBrief: () => void;
}) {
  const text = copy[lang];
  const primaryBlock = recoveryBlocks[primaryGap];
  const secondaryBlock = recoveryBlocks[secondaryGap];
  const student = roster.find(s => s.name === studentName) || roster[0];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {text.dashboard}
        </button>
        <div className="flex gap-2">
          <ActionButton icon={<ClipboardList className="h-4 w-4" />} label={text.runScreening} onClick={onOpenScreening} />
          <SecondaryButton icon={<FileText className="h-4 w-4" />} label={text.openBrief} onClick={onOpenBrief} />
          <SecondaryButton icon={<Printer className="h-4 w-4" />} label={lang === "en" ? "Print" : "Друк"} onClick={() => window.print()} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <StudentAvatar student={student} size="lg" />
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-slate-950">{text.categoryScores}</h2>
                <p className="mt-1 truncate text-sm text-slate-500">{student.name} | {studentProfile.context[lang]}</p>
              </div>
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

      <PlanPreview lang={lang} primaryGap={primaryGap} secondaryGap={secondaryGap} />
    </div>
  );
}

function StudentDashboard({
  lang,
  answeredCount,
  onOpenScreening
}: {
  lang: Lang;
  answeredCount: number;
  onOpenScreening: () => void;
}) {
  const text = copy[lang];

  return (
    <div className="mx-auto max-w-3xl pt-8">
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-soft sm:px-12 sm:py-16">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
          <ClipboardCheck className="h-10 w-10" aria-hidden />
        </span>
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {lang === "en" ? "You have a new assignment" : "У вас нове завдання"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
          {lang === "en"
            ? "Your teacher Olena has assigned a short math onboarding quiz. Please complete it to help us find the best restart point for your learning."
            : "Ваш вчитель Олена призначила короткий вступний тест з математики. Будь ласка, пройдіть його, щоб допомогти нам знайти найкращу точку для продовження навчання."}
        </p>

        <div className="mx-auto mt-10 max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-slate-900">{text.quickScreening}</span>
            <span className="text-sm font-medium text-slate-500">{answeredCount}/10</span>
          </div>
          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1">
              <UserRound className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              <span>{lang === "en" ? "Teacher Olena" : "Вчитель Олена"}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1">
              <BookOpenCheck className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              <span>{lang === "en" ? "Math" : "Математика"}</span>
            </div>
          </div>
          <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-300 transition-all duration-500" style={{ width: `${(answeredCount / 10) * 100}%` }} />
          </div>
          <button
            type="button"
            onClick={onOpenScreening}
            className="group flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3.5 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
          >
            <ClipboardList className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden />
            {answeredCount > 0 && answeredCount < 10
              ? text.continueScreening
              : answeredCount === 10
                ? (lang === "en" ? "Review Answers" : "Переглянути відповіді")
                : text.startScreening}
          </button>
        </div>
      </section>
    </div>
  );
}

function AiComposer({
  lang,
  tasksGenerated,
  isGeneratingTasks = false,
  onGenerateTasks
}: {
  lang: Lang;
  tasksGenerated: boolean;
  isGeneratingTasks?: boolean;
  onGenerateTasks: () => void;
}) {
  const text = copy[lang];
  const prompt =
    lang === "en"
      ? "Create 45-minute print-first recovery tasks for Maksym based on percentages and word problems."
      : "Створи 45-хвилинні завдання для друку для Максима на основі відсотків і текстових задач.";
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
          disabled={isGeneratingTasks}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={text.generateAiTasks}
          title={text.generateAiTasks}
        >
          {isGeneratingTasks ? (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-700" aria-hidden />
          ) : tasksGenerated ? (
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          ) : (
            <Send className="h-5 w-5" aria-hidden />
          )}
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
          <SecondaryButton icon={<Printer className="h-4 w-4" />} label={lang === "en" ? "Print" : "Друк"} onClick={() => window.print()} />
          <SecondaryButton icon={<RotateCcw className="h-4 w-4" />} label={text.reset} onClick={onReset} />
          <SecondaryButton icon={<Download className="h-4 w-4" />} label={text.useDemo} onClick={onUseDemo} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
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
          <div className="h-full rounded-lg bg-blue-300 transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
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
                    active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
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
  setupData,
  onBack
}: {
  lang: Lang;
  result: ReturnType<typeof scoreScreening>;
  primaryGap: CategoryId;
  secondaryGap: CategoryId;
  setupData: { grade: string; dailyTime: string; classroomMode: string; techMode: string };
  onBack: () => void;
}) {
  const text = copy[lang];
  const isLowBandwidth = useContext(LowBandwidthContext);
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
          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
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
              {studentProfile.name} | {lang === "en" ? "Grade" : "Клас"} {setupData.grade} | {studentProfile.age} | {studentProfile.language[lang]}
            </p>
          </div>
          {isLowBandwidth ? (
            <span className="text-2xl font-bold text-blue-700 tracking-wider">EduRecovery UA</span>
          ) : (
            <img src="/logosm.png" alt="EduRecovery UA logo" className="h-16 w-32 object-contain" />
          )}
        </div>

        <div className="grid gap-5 py-6 md:grid-cols-3">
          <BriefStat label={text.resultSnapshot} value={`${result.totalCorrect}/${result.totalQuestions}`} />
          <BriefStat label={text.restartPoints} value={`${categoryLabel(primaryGap, lang)} + ${categoryLabel(secondaryGap, lang)}`} />
          <BriefStat label={text.setup} value={`${setupData.dailyTime} | ${setupData.classroomMode === "disrupted" ? text.modeDisrupted : text.modeNormal}`} />
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
            {[primaryBlock, secondaryBlock].map((block) => {
              const res = result.categoryResults.find((r) => r.category === block.category);
              const confidenceStyle = res?.correct === 0 ? "border-red-200 bg-red-50 text-red-700" : "border-yellow-200 bg-yellow-50 text-yellow-700";

              return (
                <div key={block.category} className="rounded-lg bg-slate-50 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryChip category={block.category} lang={lang} />
                    {res && (
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${confidenceStyle}`}>
                        {res.confidence[lang]}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{block.teacherExplanation[lang]}</p>
                  <p className="mt-2 text-sm font-medium text-slate-700">{text.lowTech}: {block.lowTechAdaptation[lang]}</p>
                </div>
              );
            })}
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
  const planDays = planBlueprint;

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
        {planDays.map((day) => (
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

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "red" | "yellow" | "green";
}) {
  const tones = {
    blue: { badge: "border-blue-100 bg-blue-50 text-blue-700", bar: "bg-blue-500" },
    red: { badge: "border-red-100 bg-red-50 text-red-700", bar: "bg-red-500" },
    yellow: { badge: "border-yellow-100 bg-yellow-50 text-yellow-700", bar: "bg-yellow-500" },
    green: { badge: "border-green-100 bg-green-50 text-green-700", bar: "bg-green-500" }
  };

  return (
    <div className="relative min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`absolute inset-x-0 top-0 h-1 ${tones[tone].bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">{value}</p>
          <p className="mt-2 text-sm leading-5 text-slate-500">{detail}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${tones[tone].badge}`}>{icon}</span>
      </div>
    </div>
  );
}

function TeachingStep({ step, title, detail }: { step: string; title: string; detail: string }) {
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-3 rounded-lg border border-blue-100 bg-white p-3 shadow-hairline">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">{step}</span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="mt-1 block break-words text-sm leading-5 text-slate-600">{detail}</span>
      </span>
    </div>
  );
}

function PriorityStudentRow({
  student,
  lang,
  onSelectStudent
}: {
  student: (typeof roster)[number];
  lang: Lang;
  onSelectStudent: (name: string) => void;
}) {
  const supportLabel =
    student.progress < 60
      ? lang === "en"
        ? "Needs teacher pullout"
        : "Потрібна мала група"
      : lang === "en"
        ? "Check during practice"
        : "Перевірити під час практики";

  return (
    <button
      type="button"
      onClick={() => onSelectStudent(student.name)}
      className="grid w-full gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-hairline transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md"
    >
      <span className="flex min-w-0 items-center gap-3">
        <StudentAvatar student={student} size="md" />
        <span className="min-w-0">
          <span className="block font-semibold text-slate-950">{student.name}</span>
          <span className="mt-1 flex flex-wrap gap-2">
            {student.gaps.map((gap) => (
              <CategoryChip key={gap} category={gap} lang={lang} />
            ))}
          </span>
        </span>
      </span>
      <span className="inline-flex w-full items-center justify-center rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
        {supportLabel}
      </span>
    </button>
  );
}

function ClassGapStrip({ category, count, lang }: { category: CategoryId; count: number; lang: Lang }) {
  const percent = Math.round((count / roster.length) * 100);
  const visual = categoryVisuals[category];

  return (
    <div className="min-w-0 rounded-lg border border-white/80 bg-white p-3 shadow-hairline">
      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
        <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-800">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${visual.dot}`} />
          <span className="truncate">{categoryLabel(category, lang)}</span>
        </span>
        <span className="shrink-0 font-semibold text-slate-600">{count}/{roster.length}</span>
      </div>
      <div className={`mt-2 h-2.5 overflow-hidden rounded-lg ${visual.track}`}>
        <div className={`h-full rounded-lg ${visual.bar}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function StudentAvatar({
  student,
  size = "md",
  selected = false
}: {
  student: (typeof roster)[number];
  size?: "sm" | "md" | "lg";
  selected?: boolean;
}) {
  const sizeClass = {
    sm: "h-6 w-6 rounded-full",
    md: "h-10 w-10 rounded-lg",
    lg: "h-12 w-12 rounded-lg"
  }[size];
  const isLowBandwidth = useContext(LowBandwidthContext);

  return (
    <span
      className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden border bg-white text-sm font-semibold text-slate-700 shadow-hairline ${
        selected ? "border-blue-200 ring-2 ring-blue-100" : "border-slate-100"
      }`}
      aria-hidden="true"
    >
      {isLowBandwidth ? (
        student.name[0]
      ) : (
        <img
          src={student.avatar}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.parentElement?.append(student.name[0]);
          }}
        />
      )}
    </span>
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

function ManualInputView({ lang, onBack, onGenerate }: { lang: Lang; onBack: () => void; onGenerate: () => void }) {
  const text = copy[lang];
  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="no-print mb-4 flex">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {text.dashboard}
        </button>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">{text.inputPaperResults}</h1>
          <p className="mt-2 text-slate-600">
            {lang === "en" ? "Select the questions the student answered incorrectly on their paper test. We'll generate a recovery plan based on these gaps." : "Виберіть питання, на які учень відповів неправильно в паперовому тесті. Ми згенеруємо план на основі цих прогалин."}
          </p>
        </div>
        <div className="grid gap-3 mb-6">
          {questions.map((q, i) => (
            <label key={q.id} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer transition">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <div>
                <div className="font-medium text-slate-900">{lang === "en" ? "Question" : "Питання"} {i + 1}</div>
                <div className="text-sm text-slate-500">{q.category}</div>
              </div>
            </label>
          ))}
        </div>
        <button
          onClick={onGenerate}
          className="w-full rounded-lg border border-blue-200 bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          {lang === "en" ? "Generate Recovery Plan" : "Згенерувати план відновлення"}
        </button>
      </div>
    </section>
  );
}

function CategoryChip({ category, lang }: { category: CategoryId; lang: Lang }) {
  return (
    <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${categoryVisuals[category].chip}`}>
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
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
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

function TeacherSetupView({
  lang,
  setupData,
  setSetupData,
  onComplete,
  onDemoFill
}: {
  lang: Lang;
  setupData: { grade: string; dailyTime: string; classroomMode: string; techMode: string };
  setSetupData: (data: { grade: string; dailyTime: string; classroomMode: string; techMode: string }) => void;
  onComplete: () => void;
  onDemoFill: () => void;
}) {
  const text = copy[lang];
  const isLowBandwidth = useContext(LowBandwidthContext);

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-20 w-40 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {isLowBandwidth ? (
              <span className="text-xl font-bold text-blue-700 tracking-wider">EduRecovery</span>
            ) : (
              <img src="/logosm.png" alt="EduRecovery UA logo" className="h-full w-full object-contain" />
            )}
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-950">{text.setupTitle}</h1>
          <p className="mt-2 text-slate-600">{text.setupLead}</p>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900">{text.gradeSelect}</label>
            <div className="flex flex-wrap gap-2">
              {["5", "6", "7", "8"].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setSetupData({ ...setupData, grade })}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    setupData.grade === grade ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900">{text.dailyTimeSelect}</label>
            <div className="flex flex-wrap gap-2">
              {["45 min", "60 min", "90 min"].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSetupData({ ...setupData, dailyTime: `${time}/day` })}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    setupData.dailyTime === `${time}/day` ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900">{text.classroomMode}</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSetupData({ ...setupData, classroomMode: "disrupted" })}
                className={`flex-1 rounded-lg border px-4 py-3 text-center text-sm font-medium transition ${
                  setupData.classroomMode === "disrupted" ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {text.modeDisrupted}
              </button>
              <button
                type="button"
                onClick={() => setSetupData({ ...setupData, classroomMode: "normal" })}
                className={`flex-1 rounded-lg border px-4 py-3 text-center text-sm font-medium transition ${
                  setupData.classroomMode === "normal" ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {text.modeNormal}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900">{text.techMode}</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSetupData({ ...setupData, techMode: "low-tech" })}
                className={`flex-1 rounded-lg border px-4 py-3 text-center text-sm font-medium transition ${
                  setupData.techMode === "low-tech" ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {text.techLow}
              </button>
              <button
                type="button"
                onClick={() => setSetupData({ ...setupData, techMode: "digital" })}
                className={`flex-1 rounded-lg border px-4 py-3 text-center text-sm font-medium transition ${
                  setupData.techMode === "digital" ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {text.techDigital}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={onComplete}
              className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-base font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
            >
              {text.startRecovery}
            </button>
            <button
              type="button"
              onClick={onDemoFill}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {text.demoDataFill}
            </button>
          </div>
        </div>
      </div>
    </section>
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
