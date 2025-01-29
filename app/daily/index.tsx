import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { Problem } from '@/types/sgf';
import { ProblemCard } from '@/components/ProblemCard';
import { useProblemContext } from '@/contexts/ProblemContext';
import { getDailyProblems, resetDailyProblems } from '@/utils/checkNewDay';

const PROBLEMS_PER_CATEGORY = 2;

interface DailyProblemSet {
  category: string;
  problems: Problem[];
}

export default function DailyProblems() {
  const router = useRouter();
  const [dailyProblems, setDailyProblems] = useState<DailyProblemSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setProblemContext } = useProblemContext();

  const updateProblems = async () => {
    const problems = await getDailyProblems(PROBLEMS_PER_CATEGORY);

    // Set problem context with all daily problem IDs
    const problemIds = problems.flatMap((set) => set.problems.map((p) => p.id));
    setProblemContext(problemIds);
    setDailyProblems(problems);
    setIsLoading(false);
  };

  // Update the useEffect to use this new function
  useEffect(() => {
    updateProblems();
  }, []);

  const handleProblemPress = (problem: Problem, category: string) => {
    router.push({
      pathname: '/daily/problem/[id]',
      params: { id: problem.id, category }
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
      <Button onPress={resetDailyProblems} title='reset' />
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
