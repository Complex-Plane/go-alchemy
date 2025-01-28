import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_REFRESH_KEY = 'lastDailyProblemRefresh';
const DAILY_PROBLEMS_KEY = 'dailyProblems';

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
