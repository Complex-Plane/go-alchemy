import { SGF_FILES } from '@/assets/problems';
import { Problem } from '@/types/sgf';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_REFRESH_KEY = 'lastDailyProblemRefresh';
const DAILY_PROBLEMS_KEY = 'dailyProblems';

interface DailyProblemSet {
  category: string;
  problems: Problem[];
}

// Add these functions to the DailyProblems component
export const checkIfNewDayNeeded = async () => {
  const lastRefresh = await AsyncStorage.getItem(LAST_REFRESH_KEY);
  if (!lastRefresh) return true;

  const lastDate = new Date(lastRefresh);
  const currentDate = new Date();

  return (
    lastDate.getDate() !== currentDate.getDate() ||
    lastDate.getMonth() !== currentDate.getMonth() ||
    lastDate.getFullYear() !== currentDate.getFullYear()
  );
};

const getRandomProblems = (problems: Problem[], count: number): Problem[] => {
  const shuffled = [...problems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getDailyProblems = async (
  numProblems: number
): Promise<DailyProblemSet[]> => {
  const needsNewDay = await checkIfNewDayNeeded();

  if (needsNewDay) {
    const problems: DailyProblemSet[] = Object.entries(SGF_FILES).map(
      ([category, { problems }]) => ({
        category,
        problems: getRandomProblems(problems, numProblems)
      })
    );
    await AsyncStorage.setItem(LAST_REFRESH_KEY, new Date().toISOString());
    await AsyncStorage.setItem(DAILY_PROBLEMS_KEY, JSON.stringify(problems));
    return problems;
  } else {
    const stored = await AsyncStorage.getItem(DAILY_PROBLEMS_KEY);
    if (stored) {
      return JSON.parse(stored) as DailyProblemSet[];
    }
  }
  return [];
};

export const resetDailyProblems = async () => {
  await AsyncStorage.removeItem(LAST_REFRESH_KEY);
  await AsyncStorage.removeItem(DAILY_PROBLEMS_KEY);
};
