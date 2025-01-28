import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { SGF_FILES } from '@/assets/problems';
import { Problem } from '@/types/sgf';
import { ProblemCard } from '@/components/ProblemCard';
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

const PROBLEMS_PER_CATEGORY = 4;

interface DailyProblemSet {
  category: string;
  problems: Problem[];
}

export default function DailyProblems() {
  const router = useRouter();
  const [dailyProblems, setDailyProblems] = useState<DailyProblemSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRandomProblems = (problems: Problem[], count: number): Problem[] => {
    const shuffled = [...problems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const loadOrGenerateProblems = async () => {
    const needsNewDay = await checkIfNewDayNeeded();

    if (needsNewDay) {
      const problems: DailyProblemSet[] = Object.entries(SGF_FILES).map(
        ([category, { problems }]) => ({
          category,
          problems: getRandomProblems(problems, PROBLEMS_PER_CATEGORY)
        })
      );

      await AsyncStorage.setItem(LAST_REFRESH_KEY, new Date().toISOString());
      await AsyncStorage.setItem(DAILY_PROBLEMS_KEY, JSON.stringify(problems));
      setDailyProblems(problems);
    } else {
      const stored = await AsyncStorage.getItem(DAILY_PROBLEMS_KEY);
      if (stored) {
        setDailyProblems(JSON.parse(stored));
      }
    }
    setIsLoading(false);
  };

  const resetDay = async () => {
    await AsyncStorage.removeItem(LAST_REFRESH_KEY);
    await AsyncStorage.removeItem(DAILY_PROBLEMS_KEY);
  };

  // Update the useEffect to use this new function
  useEffect(() => {
    loadOrGenerateProblems();
  }, []);

  const handleProblemPress = (problem: Problem, category: string) => {
    const allProblemsInCategory = SGF_FILES[category].problems;
    router.push({
      pathname: '/problems/problem/[id]',
      params: {
        id: problem.id,
        count: allProblemsInCategory.length,
        category
      }
    });
  };

  if (isLoading) {
    return <ActivityIndicator size='large' />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text h4 style={styles.categoryTitle}>
        Daily Problems
      </Text>
      <Button onPress={resetDay} title='reset' />
      {dailyProblems.map((set) => (
        <View key={set.category} style={styles.categoryContainer}>
          <Text h4 style={styles.categoryTitle}>
            {set.category.charAt(0).toUpperCase() + set.category.slice(1)}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.problemsRow}
          >
            {set.problems.map((problem) => (
              <ProblemCard
                key={`${set.category}-${problem.id}`}
                problem={problem}
                onPress={() => handleProblemPress(problem, set.category)}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  categoryContainer: {
    marginBottom: 24
  },
  categoryTitle: {
    marginBottom: 12,
    paddingLeft: 4
  },
  problemsRow: {
    flexDirection: 'row',
    paddingHorizontal: 4
  }
});
