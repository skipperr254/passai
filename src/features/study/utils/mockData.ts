import type { StudyPlan, StudyPlanTopic, StudyPlanTask } from "../types";

// Mock tasks for World War II topic
const wwiiTasks: StudyPlanTask[] = [
  {
    id: "task-1",
    topic_id: "topic-1",
    title: "Review causes of World War II",
    description:
      "Study the Treaty of Versailles, economic depression, and rise of totalitarian regimes",
    task_type: "review",
    estimated_time_minutes: 25,
    order_index: 1,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-2",
    topic_id: "topic-1",
    title: "Learn key Allied and Axis powers",
    description:
      "Memorize the major countries in each alliance and their leaders",
    task_type: "reading",
    estimated_time_minutes: 15,
    order_index: 2,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-3",
    topic_id: "topic-1",
    title: "Study major battles and turning points",
    description: "Focus on D-Day, Stalingrad, Midway, and Battle of Britain",
    task_type: "review",
    estimated_time_minutes: 30,
    order_index: 3,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-4",
    topic_id: "topic-1",
    title: "Watch documentary on WWII timeline",
    description: "Visual overview of the war's progression from 1939-1945",
    task_type: "video",
    estimated_time_minutes: 20,
    order_index: 4,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-5",
    topic_id: "topic-1",
    title: "Complete practice questions on WWII",
    description: "Test your knowledge with 15 multiple choice questions",
    task_type: "practice",
    estimated_time_minutes: 20,
    order_index: 5,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
];

// Mock tasks for Cold War topic
const coldWarTasks: StudyPlanTask[] = [
  {
    id: "task-6",
    topic_id: "topic-2",
    title: "Understand the Iron Curtain concept",
    description: "Study Churchill's speech and the division of Europe",
    task_type: "reading",
    estimated_time_minutes: 20,
    order_index: 1,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-7",
    topic_id: "topic-2",
    title: "Review the Berlin Wall construction and fall",
    description: "Timeline from 1961 construction to 1989 fall",
    task_type: "review",
    estimated_time_minutes: 25,
    order_index: 2,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-8",
    topic_id: "topic-2",
    title: "Study major proxy wars",
    description: "Focus on Korean War, Vietnam War, and Afghanistan",
    task_type: "review",
    estimated_time_minutes: 30,
    order_index: 3,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-9",
    topic_id: "topic-2",
    title: "Learn about the Cuban Missile Crisis",
    description: "13 days that brought the world to the brink of nuclear war",
    task_type: "reading",
    estimated_time_minutes: 20,
    order_index: 4,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-10",
    topic_id: "topic-2",
    title: "Compare US and Soviet ideologies",
    description: "Understand capitalism vs. communism and their global impact",
    task_type: "review",
    estimated_time_minutes: 25,
    order_index: 5,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-11",
    topic_id: "topic-2",
    title: "Practice Cold War essay questions",
    description: "Write short responses on key Cold War events",
    task_type: "exercise",
    estimated_time_minutes: 30,
    order_index: 6,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
];

// Mock tasks for Renaissance topic
const renaissanceTasks: StudyPlanTask[] = [
  {
    id: "task-12",
    topic_id: "topic-3",
    title: "Study Renaissance origins in Italy",
    description: "Florence, Venice, and Rome as centers of rebirth",
    task_type: "reading",
    estimated_time_minutes: 20,
    order_index: 1,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-13",
    topic_id: "topic-3",
    title: "Learn about key Renaissance artists",
    description: "Leonardo da Vinci, Michelangelo, Raphael, and Donatello",
    task_type: "review",
    estimated_time_minutes: 25,
    order_index: 2,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-14",
    topic_id: "topic-3",
    title: "Review humanism philosophy",
    description: "Shift from medieval to human-centered thinking",
    task_type: "review",
    estimated_time_minutes: 20,
    order_index: 3,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-15",
    topic_id: "topic-3",
    title: "Study the Medici family influence",
    description: "Understand patronage and its impact on arts and culture",
    task_type: "reading",
    estimated_time_minutes: 15,
    order_index: 4,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-16",
    topic_id: "topic-3",
    title: "Compare Renaissance art styles",
    description: "Analyze perspective, realism, and classical influences",
    task_type: "practice",
    estimated_time_minutes: 25,
    order_index: 5,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
];

// Mock tasks for Industrial Revolution topic
const industrialRevolutionTasks: StudyPlanTask[] = [
  {
    id: "task-17",
    topic_id: "topic-4",
    title: "Review key inventions and innovations",
    description: "Steam engine, spinning jenny, power loom, and telegraph",
    task_type: "review",
    estimated_time_minutes: 25,
    order_index: 1,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-18",
    topic_id: "topic-4",
    title: "Study urbanization and migration",
    description: "Movement from rural areas to industrial cities",
    task_type: "reading",
    estimated_time_minutes: 20,
    order_index: 2,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-19",
    topic_id: "topic-4",
    title: "Learn about working conditions",
    description: "Factory life, child labor, and labor movements",
    task_type: "review",
    estimated_time_minutes: 20,
    order_index: 3,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-20",
    topic_id: "topic-4",
    title: "Understand economic changes",
    description: "Capitalism, industrial capitalism, and new economic theories",
    task_type: "reading",
    estimated_time_minutes: 20,
    order_index: 4,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-21",
    topic_id: "topic-4",
    title: "Watch documentary on Industrial Revolution",
    description: "Visual overview of technological and social changes",
    task_type: "video",
    estimated_time_minutes: 25,
    order_index: 5,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-22",
    topic_id: "topic-4",
    title: "Complete practice quiz",
    description: "Test understanding of Industrial Revolution impacts",
    task_type: "practice",
    estimated_time_minutes: 20,
    order_index: 6,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
];

// Mock tasks for French Revolution topic
const frenchRevolutionTasks: StudyPlanTask[] = [
  {
    id: "task-23",
    topic_id: "topic-5",
    title: "Study causes of the French Revolution",
    description: "Financial crisis, Estates-General, and social inequality",
    task_type: "review",
    estimated_time_minutes: 25,
    order_index: 1,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-24",
    topic_id: "topic-5",
    title: "Learn about the Reign of Terror",
    description: "Robespierre, Committee of Public Safety, and the guillotine",
    task_type: "reading",
    estimated_time_minutes: 20,
    order_index: 2,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-25",
    topic_id: "topic-5",
    title: "Review Napoleon's rise to power",
    description: "From military general to Emperor of France",
    task_type: "review",
    estimated_time_minutes: 25,
    order_index: 3,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-26",
    topic_id: "topic-5",
    title: "Study the Declaration of Rights",
    description: "Enlightenment principles and revolutionary ideals",
    task_type: "reading",
    estimated_time_minutes: 15,
    order_index: 4,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-27",
    topic_id: "topic-5",
    title: "Analyze revolution's impact on Europe",
    description: "Spread of revolutionary ideas and Napoleonic Wars",
    task_type: "review",
    estimated_time_minutes: 20,
    order_index: 5,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-28",
    topic_id: "topic-5",
    title: "Practice timeline ordering",
    description: "Sequence major events from 1789-1815",
    task_type: "exercise",
    estimated_time_minutes: 15,
    order_index: 6,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
  {
    id: "task-29",
    topic_id: "topic-5",
    title: "Complete French Revolution quiz",
    description: "Comprehensive assessment of all topics covered",
    task_type: "practice",
    estimated_time_minutes: 25,
    order_index: 7,
    is_completed: false,
    completed_at: null,
    resource_links: null,
  },
];

// Mock topics
const mockTopics: StudyPlanTopic[] = [
  {
    id: "topic-1",
    title: "World War II Overview",
    description:
      "Comprehensive study of WWII causes, major events, and outcomes",
    order_index: 1,
    priority: "high",
    status: "not-started",
    total_tasks: wwiiTasks.length,
    completed_tasks: 0,
    total_time_minutes: wwiiTasks.reduce(
      (sum, task) => sum + task.estimated_time_minutes,
      0
    ),
    mastery_level: 0,
    tasks: wwiiTasks,
  },
  {
    id: "topic-2",
    title: "The Cold War Era",
    description: "Post-WWII tension between US and Soviet Union, 1947-1991",
    order_index: 2,
    priority: "high",
    status: "not-started",
    total_tasks: coldWarTasks.length,
    completed_tasks: 0,
    total_time_minutes: coldWarTasks.reduce(
      (sum, task) => sum + task.estimated_time_minutes,
      0
    ),
    mastery_level: 0,
    tasks: coldWarTasks,
  },
  {
    id: "topic-3",
    title: "Renaissance Period",
    description: "Cultural rebirth in Europe, 14th-17th century",
    order_index: 3,
    priority: "medium",
    status: "not-started",
    total_tasks: renaissanceTasks.length,
    completed_tasks: 0,
    total_time_minutes: renaissanceTasks.reduce(
      (sum, task) => sum + task.estimated_time_minutes,
      0
    ),
    mastery_level: 0,
    tasks: renaissanceTasks,
  },
  {
    id: "topic-4",
    title: "Industrial Revolution",
    description: "Technological and economic transformation, 18th-19th century",
    order_index: 4,
    priority: "medium",
    status: "not-started",
    total_tasks: industrialRevolutionTasks.length,
    completed_tasks: 0,
    total_time_minutes: industrialRevolutionTasks.reduce(
      (sum, task) => sum + task.estimated_time_minutes,
      0
    ),
    mastery_level: 0,
    tasks: industrialRevolutionTasks,
  },
  {
    id: "topic-5",
    title: "French Revolution",
    description: "Revolutionary period in France, 1789-1799",
    order_index: 5,
    priority: "medium",
    status: "not-started",
    total_tasks: frenchRevolutionTasks.length,
    completed_tasks: 0,
    total_time_minutes: frenchRevolutionTasks.reduce(
      (sum, task) => sum + task.estimated_time_minutes,
      0
    ),
    mastery_level: 0,
    tasks: frenchRevolutionTasks,
  },
];

// Calculate total time for the study plan
const totalMinutes = mockTopics.reduce(
  (sum, topic) => sum + topic.total_time_minutes,
  0
);

// Mock study plan
export const mockStudyPlan: StudyPlan = {
  id: "plan-1",
  subject_id: "history-101",
  title: "European History Final Exam Preparation",
  description: "Comprehensive review of major historical periods and events",
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  total_hours: Math.round((totalMinutes / 60) * 10) / 10, // Round to 1 decimal
  projected_pass_chance: 75,
  status: "active",
  topics: mockTopics,
};

// Helper function to calculate days until test date
export const calculateDaysUntilTest = (testDate: string | null): number => {
  if (!testDate) return 0;
  const test = new Date(testDate);
  const today = new Date();
  const diffTime = test.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Helper function to format time
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};
