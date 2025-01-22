import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import { BoardTransformation, Rotation, Reflection } from '@/types/transforms';
import { getRandomTransformation } from '@/helper/setupBoard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface TransformContextType {
  transformation: BoardTransformation;
  rotate: (direction: 'clockwise' | 'counterclockwise') => void;
  reflect: (type: Reflection) => void;
  toggleColorInversion: () => void;
  randomTransformation: () => void;
  transformComment: (comment: string) => string;
}

const TransformContext = createContext<TransformContextType | undefined>(
  undefined
);

export const useTransform = () => {
  const context = useContext(TransformContext);
  if (!context) {
    throw new Error('useTransform must be used within a TransformProvider');
  }
  return context;
};

export const TransformProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const randomizeBoard = useSelector(
    (state: RootState) => state.settings?.randomizeBoard ?? false
  );
  const [transformation, setTransformation] = useState<BoardTransformation>(
    randomizeBoard
      ? getRandomTransformation()
      : {
          rotation: 0,
          reflection: 'none',
          invertColors: false
        }
  );
  useEffect(() => console.log(transformation), [transformation]);

  const rotate = useCallback((direction: 'clockwise' | 'counterclockwise') => {
    setTransformation((prev) => {
      const change = direction === 'clockwise' ? 90 : -90;
      const newRotation = ((prev.rotation + change + 360) % 360) as Rotation;
      return { ...prev, rotation: newRotation };
    });
  }, []);

  const reflect = useCallback((type: Reflection) => {
    setTransformation((prev) => ({
      ...prev,
      reflection: prev.reflection === type ? 'none' : type
    }));
  }, []);

  const toggleColorInversion = useCallback(() => {
    setTransformation((prev) => ({
      ...prev,
      invertColors: !prev.invertColors
    }));
  }, []);

  const randomTransformation = useCallback(() => {
    setTransformation(getRandomTransformation());
  }, []);

  const transformComment = (comment: string): string => {
    if (!transformation.invertColors) return comment;

    return comment.replace(/[Bb]lack|[Ww]hite/g, (match) => {
      switch (match) {
        case 'Black':
          return 'White';
        case 'black':
          return 'white';
        case 'White':
          return 'Black';
        case 'white':
          return 'black';
        default:
          return match;
      }
    });
  };

  return (
    <TransformContext.Provider
      value={{
        transformation,
        rotate,
        reflect,
        toggleColorInversion,
        randomTransformation,
        transformComment
      }}
    >
      {children}
    </TransformContext.Provider>
  );
};
