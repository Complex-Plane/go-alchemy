import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProblemContextType {
  problemIds: number[];
  category?: string;
  setProblemContext: (ids: number[], cat?: string) => void;
  currentProblemIndex: number;
  setCurrentProblemIndex: (index: number) => void;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [problemIds, setProblemIds] = useState<number[]>([]);
  const [category, setCategory] = useState<string | undefined>();
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);

  const setProblemContext = (ids: number[], cat?: string) => {
    setProblemIds(ids);
    setCategory(cat);
    setCurrentProblemIndex(0);
  };

  return (
    <ProblemContext.Provider
      value={{
        problemIds,
        category,
        setProblemContext,
        currentProblemIndex,
        setCurrentProblemIndex
      }}
    >
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblemContext = () => {
  const context = useContext(ProblemContext);
  if (!context) {
    throw new Error('useProblemContext must be used within a ProblemProvider');
  }
  return context;
};
