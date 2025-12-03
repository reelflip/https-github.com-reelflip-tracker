/**
 * Simulates AI responses for motivation and study tips.
 * In a real app, this would call the Google GenAI SDK.
 */

const MOTIVATIONS = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Believe you can and you're halfway there.",
  "Your time is limited, don't waste it living someone else's life."
];

const TIPS = [
  "Try the Feynman Technique: Teach a concept to a child to truly understand it.",
  "Active Recall is 50% more effective than passive re-reading.",
  "Don't forget to hydrate. Brain function drops with dehydration.",
  "Focus on your weak topics during the morning when willpower is highest."
];

export const generateMotivation = async (): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const randomIndex = Math.floor(Math.random() * MOTIVATIONS.length);
  return MOTIVATIONS[randomIndex];
};

export const generateStudyTip = async (topic: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const randomIndex = Math.floor(Math.random() * TIPS.length);
  return `Tip for ${topic}: ${TIPS[randomIndex]}`;
};

export const generateScheduleLogic = async (hoursAvailable: number, schoolType: 'REGULAR' | 'DUMMY'): Promise<string> => {
    // Logic to simulate AI schedule generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (schoolType === 'REGULAR') {
        return "Since you have school, prioritize 4 hours of self-study in the evening (6 PM - 10 PM) focusing on weak subjects.";
    } else {
        return "With a dummy school, aim for 10 hours: 4 hours Morning (Physics), 3 hours Afternoon (Math), 3 hours Evening (Chem).";
    }
}