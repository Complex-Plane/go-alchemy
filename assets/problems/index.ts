/**
 * SGF Problems Index - Central Problem Database
 *
 * This file serves as the central index for all Go problems in the application.
 * It defines the problem database structure, maps problem metadata to SGF files,
 * and provides the data source for all problem-related functionality.
 *
 * @file assets/problems/index.ts
 * @author Go Alchemy Team
 * @version 0.1.2
 */

import { SGFFiles } from '@/types/sgf';
import {
  FULL,
  TOP_RIGHT,
  TOP_LEFT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  LEFT,
  RIGHT,
  TOP,
  BOTTOM
} from '@/constants/boardRanges';

/**
 * Primary Problem Database
 *
 * This object contains all problem categories and their associated problems.
 * Each category follows the SGFFiles type structure and includes:
 * - Problem metadata (ID, name, board size, etc.)
 * - SGF file references for game data
 * - Board range specifications for focused viewing
 * - Color assignments for player perspective
 * - Image assets for problem previews
 *
 * Structure: {category: {problems: Problem[]}}
 */
export const SGF_FILES: SGFFiles = {
  /**
   * JOSEKI PROBLEMS
   *
   * Corner opening sequences and their variations.
   * Joseki problems focus on standard corner patterns and
   * teach proper responses to common opening moves.
   */
  joseki: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/joseki/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: FULL, // Full board view for opening context
        color: 1, // Black to play
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 1,
        uri: require('@/assets/problems/joseki/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: FULL,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  },

  /**
   * OPENING PROBLEMS (FUSEKI)
   *
   * Whole-board opening strategy and direction of play.
   * These problems teach strategic concepts like:
   * - Corner vs. side vs. center priorities
   * - Direction of play
   * - Balancing territory and influence
   */
  opening: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/opening/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: FULL, // Full board essential for opening problems
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 1,
        uri: require('@/assets/problems/opening/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: FULL,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  },

  /**
   * SABAKI PROBLEMS
   *
   * Light, flexible play in difficult situations.
   * Sabaki teaches how to:
   * - Make shape while under attack
   * - Avoid heavy, slow moves
   * - Maintain flexibility in hostile territory
   */
  sabaki: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/sabaki/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: FULL, // Context important for sabaki
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 1,
        uri: require('@/assets/problems/sabaki/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: RIGHT, // Focus on right side of board
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  },

  /**
   * SHAPE PROBLEMS
   *
   * Good and bad shapes, efficient stone placement.
   * Shape problems teach:
   * - Avoiding empty triangles and other bad shapes
   * - Creating eye-making potential
   * - Efficient connection patterns
   * - Tiger's mouth, bamboo joint, and other good shapes
   */
  shape: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/shape/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_RIGHT, // Corner focus for shape concepts
        color: 1,
        image: require('@/assets/problems/shape/001/problem001.jpg') // Custom problem image
      },
      {
        id: 1,
        uri: require('@/assets/problems/shape/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      // ... (continuing with all 22 shape problems)
      {
        id: 2,
        uri: require('@/assets/problems/shape/003/problem003_annotated.sgf'),
        name: 'problem003',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 3,
        uri: require('@/assets/problems/shape/004/problem004_annotated.sgf'),
        name: 'problem004',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 4,
        uri: require('@/assets/problems/shape/005/problem005_annotated.sgf'),
        name: 'problem005',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 5,
        uri: require('@/assets/problems/shape/006/problem006_annotated.sgf'),
        name: 'problem006',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 6,
        uri: require('@/assets/problems/shape/007/problem007_annotated.sgf'),
        name: 'problem007',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 7,
        uri: require('@/assets/problems/shape/008/problem008_annotated.sgf'),
        name: 'problem008',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 8,
        uri: require('@/assets/problems/shape/009/problem009_annotated.sgf'),
        name: 'problem009',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 9,
        uri: require('@/assets/problems/shape/010/problem010_annotated.sgf'),
        name: 'problem010',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 10,
        uri: require('@/assets/problems/shape/011/problem011_annotated.sgf'),
        name: 'problem011',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 11,
        uri: require('@/assets/problems/shape/012/problem012_annotated.sgf'),
        name: 'problem012',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 12,
        uri: require('@/assets/problems/shape/013/problem013_annotated.sgf'),
        name: 'problem013',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 13,
        uri: require('@/assets/problems/shape/014/problem014_annotated.sgf'),
        name: 'problem014',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 14,
        uri: require('@/assets/problems/shape/015/problem015_annotated.sgf'),
        name: 'problem015',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 15,
        uri: require('@/assets/problems/shape/016/problem016_annotated.sgf'),
        name: 'problem016',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 16,
        uri: require('@/assets/problems/shape/017/problem017_annotated.sgf'),
        name: 'problem017',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 17,
        uri: require('@/assets/problems/shape/018/problem018_annotated.sgf'),
        name: 'problem018',
        boardSize: 19,
        range: TOP_RIGHT,
        color: -1, // White to play (unusual for shape problems)
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 18,
        uri: require('@/assets/problems/shape/019/problem019_annotated.sgf'),
        name: 'problem019',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 19,
        uri: require('@/assets/problems/shape/020/problem020_annotated.sgf'),
        name: 'problem020',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 20,
        uri: require('@/assets/problems/shape/021/problem021_annotated.sgf'),
        name: 'problem021',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 21,
        uri: require('@/assets/problems/shape/022/problem022_annotated.sgf'),
        name: 'problem022',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  },

  /**
   * TESUJI PROBLEMS
   *
   * Tactical problems featuring clever moves and combinations.
   * Tesuji teaches:
   * - Reading sequences and forcing moves
   * - Sacrifice techniques
   * - Clever tactical combinations
   * - Finding the vital point in tactical situations
   */
  tesuji: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/tesuji/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_LEFT, // Corner/side focus for this tesuji
        color: 1,
        image: require('@/assets/problems/tesuji/001/problem001.jpg') // Custom problem image
      },
      {
        id: 1,
        uri: require('@/assets/problems/tesuji/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: FULL, // Full board context needed
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  },

  /**
   * TSUMEGO PROBLEMS
   *
   * Life and death problems focusing on capture/escape scenarios.
   * Tsumego is considered fundamental for Go improvement:
   * - Reading ability development
   * - Shape recognition
   * - Vital point identification
   * - Unconditional life/death assessment
   */
  tsumego: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/tsumego/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_LEFT, // Corner life and death
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 1,
        uri: require('@/assets/problems/tsumego/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: FULL, // Complex life and death requiring full context
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  }
};

/**
 * Problem Database Statistics:
 * - Total Categories: 6 (joseki, opening, sabaki, shape, tesuji, tsumego)
 * - Total Problems: 30+ individual problems
 * - Most Problems in Category: Shape (22 problems)
 * - Board Ranges Used: FULL, TOP_RIGHT, TOP_LEFT, RIGHT
 * - Color Distribution: Mostly Black to play (color: 1)
 *
 * File Organization:
 * Each problem follows the structure:
 * /assets/problems/{category}/{problemNumber}/{filename}
 *
 * Where:
 * - category: joseki, opening, sabaki, shape, tesuji, tsumego
 * - problemNumber: Zero-padded 3-digit number (001, 002, etc.)
 * - filename: problem###_annotated.sgf (SGF with solutions and comments)
 *
 * SGF File Types:
 * - problem###.sgf: Original problem file
 * - problem###_annotated.sgf: Problem with solutions, variations, and comments
 *
 * Image Assets:
 * - Custom problem images stored alongside SGF files
 * - Fallback to placeholder.png for problems without custom images
 * - Images used for problem previews and thumbnails
 *
 * Board Range Constants:
 * - FULL: Entire 19x19 board
 * - TOP_RIGHT: Upper-right corner region
 * - TOP_LEFT: Upper-left corner region
 * - BOTTOM_LEFT: Lower-left corner region
 * - BOTTOM_RIGHT: Lower-right corner region
 * - LEFT/RIGHT/TOP/BOTTOM: Side regions
 *
 * Color Coding:
 * - 1: Black to play
 * - -1: White to play
 *
 * Usage in Application:
 *
 * 1. Category Selection:
 * ```typescript
 * const categories = Object.keys(SGF_FILES); // ['joseki', 'opening', ...]
 * ```
 *
 * 2. Problem Loading:
 * ```typescript
 * const tsumegoProblems = SGF_FILES.tsumego.problems;
 * const firstProblem = tsumegoProblems[0];
 * ```
 *
 * 3. Daily Problem Generation:
 * ```typescript
 * const dailyProblems = Object.entries(SGF_FILES).map(([category, data]) => ({
 *   category,
 *   problems: selectRandomProblems(data.problems, 2)
 * }));
 * ```
 *
 * Extension Points:
 *
 * 1. Difficulty Ratings:
 * Add difficulty property to Problem type and individual problems
 *
 * 2. Tags/Keywords:
 * Add tags for filtering (e.g., "beginner", "corner", "capturing")
 *
 * 3. Completion Tracking:
 * Integrate with user progress system to track solved problems
 *
 * 4. Dynamic Loading:
 * For larger databases, consider loading problem metadata
 * separately from SGF content
 *
 * 5. User-Generated Content:
 * Structure supports adding user-created or imported problems
 */
