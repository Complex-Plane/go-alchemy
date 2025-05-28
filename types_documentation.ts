/**
 * Type Definitions Documentation
 * 
 * This file documents the core type definitions used throughout the
 * Go Alchemy application. These types ensure type safety and provide
 * clear contracts for Go board representation, problem data, and
 * coordinate systems.
 * 
 * @file types/index.ts (Documentation)
 * @author Go Alchemy Team
 * @version 0.1.2
 */

// ====================
// BOARD TYPES (board.ts)
// ====================

/**
 * Stone Representation
 * 
 * Fundamental type for representing stones on a Go board.
 * Uses numeric values for efficient storage and computation.
 */
export type Stone = 0 | 1 | -1;
// 0 = empty intersection
// 1 = black stone  
// -1 = white stone

/**
 * Board State Array
 * 
 * Represents the current state of all intersections on a Go board.
 * For a 19x19 board, this is an array of 361 Stone values.
 * Array indexing: index = y * 19 + x
 */
export type BoardState = Stone[];

/**
 * Coordinate Object
 * 
 * Represents a position on the Go board using x,y coordinates.
 * Origin (0,0) is typically at the top-left corner.
 */
export type Coordinate = { 
  x: number; // Horizontal position (0-18 for 19x19 board)
  y: number; // Vertical position (0-18 for 19x19 board)
};

/**
 * Board Range Definition
 * 
 * Defines a rectangular region on the Go board for focused viewing.
 * Used to display only relevant portions of the board for problems.
 */
export type BoardRange = {
  startX: number; // Left edge of the range
  startY: number; // Top edge of the range
  endX: number;   // Right edge of the range (inclusive)
  endY: number;   // Bottom edge of the range (inclusive)
};

/**
 * Screen Range Definition
 * 
 * Similar to BoardRange but for screen/pixel coordinates.
 * Used for converting between board logic and display rendering.
 */
export type ScreenRange = {
  startX: number; // Left screen coordinate
  startY: number; // Top screen coordinate
  endX: number;   // Right screen coordinate
  endY: number;   // Bottom screen coordinate
};

/**
 * Coordinate Tuple Types
 * 
 * Alternative coordinate representations using tuples.
 * More compact than Coordinate objects for certain use cases.
 */
export type BoardCoordinates = [number, number];    // [x, y] on board
export type SpatialCoordinates = [number, number];  // [x, y] in space
export type ScreenCoordinates = [number, number];   // [x, y] on screen

// ====================
// SGF TYPES (sgf.ts)
// ====================

/**
 * Problem Data Structure
 * 
 * Complete metadata for a single Go problem including
 * file references, display settings, and categorization.
 */
export type Problem = {
  id: number;       // Unique identifier within category
  uri: string;      // Path to SGF file (annotated version)
  name: string;     // Human-readable problem name
  boardSize: number; // Board dimensions (typically 19)
  range: BoardRange; // Focused viewing area for the problem
  color: number;    // Which player moves first (1=Black, -1=White)
  image: string;    // Path to problem thumbnail/preview image
};

/**
 * Problem Category Structure
 * 
 * Groups related problems together by type/theme.
 * Examples: tsumego, tesuji, joseki, shape, opening, sabaki
 */
export type SGFCategory = {
  problems: Problem[]; // Array of problems in this category
  // Future: Could add category metadata like description, difficulty, etc.
};

/**
 * Complete Problem Database
 * 
 * Top-level structure containing all problem categories.
 * Keys are category names, values are SGFCategory objects.
 */
export type SGFFiles = {
  [key: string]: SGFCategory;
  // Example structure:
  // {
  //   tsumego: { problems: [...] },
  //   tesuji: { problems: [...] },
  //   shape: { problems: [...] }
  // }
};

// ====================
// TRANSFORM TYPES (transforms.ts)
// ====================

/**
 * Board transformation operations for different viewing perspectives.
 * Useful for problems that can be viewed from multiple angles.
 */
export type TransformType = 
  | 'none'        // No transformation
  | 'rotate90'    // 90-degree clockwise rotation
  | 'rotate180'   // 180-degree rotation
  | 'rotate270'   // 270-degree clockwise rotation
  | 'flipHorizontal' // Mirror horizontally
  | 'flipVertical';  // Mirror vertically

export type TransformState = {
  current: TransformType;
  available: TransformType[];
};

// ====================
// USER TYPES (User.ts)
// ====================

/**
 * User profile and progress tracking
 */
export type User = {
  id: string;
  name: string;
  email?: string;
  level?: number;           // Estimated skill level
  problemsSolved: number;   // Total problems completed
  streakDays: number;       // Consecutive days of practice
  preferences: UserPreferences;
  progress: UserProgress;
};

export type UserPreferences = {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  showCoordinates: boolean;
  showHints: boolean;
  favoriteCategories: string[];
};

export type UserProgress = {
  categoriesCompleted: Record<string, number>; // Category -> problems solved
  dailyStreaks: DailyStreak[];
  achievements: Achievement[];
};

export type DailyStreak = {
  date: string;
  problemsCompleted: number;
  categories: string[];
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  unlockedDate: string;
  category?: string;
};

// ====================
// GAME STATE TYPES
// ====================

/**
 * Current game session state for problem solving
 */
export type GameState = {
  board: BoardState;
  currentPlayer: 1 | -1;     // 1 = Black, -1 = White
  moveHistory: Move[];
  isComplete: boolean;
  isCorrect?: boolean;       // Whether solution is correct (if known)
  hintsUsed: number;
};

/**
 * Individual move representation
 */
export type Move = {
  x: number;
  y: number;
  color: 1 | -1;
  timestamp: number;
  isCorrect?: boolean;       // Whether this move is correct
  comment?: string;          // Optional move comment from SGF
};

/**
 * SGF Game Tree Node
 * 
 * Represents a node in the SGF game tree structure
 */
export type GameTreeNode = {
  id: string;
  move?: Move;
  comment?: string;
  setup?: {                  // Board setup for this node
    black?: BoardCoordinates[];
    white?: BoardCoordinates[];
    empty?: BoardCoordinates[];
  };
  children: GameTreeNode[];
  parent?: GameTreeNode;
  properties: Record<string, string[]>; // Raw SGF properties
};

// ====================
// UI COMPONENT TYPES
// ====================

/**
 * Component prop types for consistent interfaces
 */
export type ProblemCardProps = {
  problem: Problem;
  onPress: () => void;
  style?: any;
  size?: 'small' | 'medium' | 'large';
};

export type GoBoardProps = {
  availableWidth: number;
  availableHeight: number;
  range?: BoardRange;
  interactive?: boolean;
  showCoordinates?: boolean;
  onIntersectionPress?: (x: number, y: number) => void;
};

export type ControlPanelProps = {
  onReset?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onHint?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showHintButton: boolean;
};

// ====================
// UTILITY TYPES
// ====================

/**
 * Common utility types used throughout the application
 */

// API Response wrapper
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
};

// Async operation state
export type AsyncState<T> = {
  loading: boolean;
  data?: T;
  error?: string;
};

// Navigation parameters for different routes
export type RouteParams = {
  '/problems/[category]': { category: string };
  '/problems/problem/[id]': { id: string; category: string };
  '/daily/problem/[id]': { id: string; category: string };
};

// Theme definition
export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
};

/**
 * Type Usage Examples:
 * 
 * 1. Creating a new problem:
 * ```typescript
 * const newProblem: Problem = {
 *   id: 23,
 *   uri: require('./problem023_annotated.sgf'),
 *   name: 'problem023',
 *   boardSize: 19,
 *   range: TOP_RIGHT,
 *   color: 1,
 *   image: require('./problem023.jpg')
 * };
 * ```
 * 
 * 2. Board state manipulation:
 * ```typescript
 * const board: BoardState = new Array(361).fill(0);
 * board[0] = 1; // Place black stone at top-left
 * ```
 * 
 * 3. Coordinate conversion:
 * ```typescript
 * const coord: Coordinate = { x: 3, y: 3 };
 * const index = coord.y * 19 + coord.x; // Convert to array index
 * ```
 * 
 * 4. Range definition:
 * ```typescript
 * const cornerRange: BoardRange = {
 *   startX: 0, startY: 0, endX: 9, endY: 9
 * }; // Top-left corner view
 * ```
 * 
 * Type Safety Benefits:
 * - Compile-time error detection
 * - IntelliSense support in IDEs
 * - Clear API contracts between components
 * - Refactoring safety
 * - Documentation through types
 * 
 * Future Type Enhancements:
 * - Generic types for different board sizes
 * - Branded types for coordinate validation
 * - Union types for specific game states
 * - Conditional types for advanced patterns
 */
