import { Vertex } from '@sabaki/go-board';

/**
 * sgfUtils - Utility functions for SGF coordinate conversions
 *
 * SGF (Smart Game Format) uses a letter-based coordinate system where:
 * - 'a' represents 0, 'b' represents 1, etc.
 * - Coordinates are written as two letters, e.g., "dd" for (3,3)
 *
 * This module provides conversions between SGF notation and
 * the numeric vertex format used by the Go board engine.
 */

/**
 * Convert SGF coordinates to vertex format
 *
 * @param {string} sgfCoord - Two-letter SGF coordinate (e.g., "bc")
 * @returns {Vertex} Numeric vertex array [x, y]
 *
 * @example
 * sgfToVertex("aa") // returns [0, 0]
 * sgfToVertex("bc") // returns [1, 2]
 * sgfToVertex("ss") // returns [18, 18] (corner on 19x19 board)
 */
export const sgfToVertex = (sgfCoord: string) => {
  const vertex: Vertex = [
    sgfCoord.charCodeAt(0) - 97,
    sgfCoord.charCodeAt(1) - 97
  ];
  return vertex;
};

/**
 * Convert vertex to SGF coordinate format
 *
 * @param {Vertex} vertex - Numeric vertex array [x, y]
 * @returns {string} Two-letter SGF coordinate
 *
 * @example
 * vertexToSgf([0, 0]) // returns "aa"
 * vertexToSgf([1, 2]) // returns "bc"
 * vertexToSgf([18, 18]) // returns "ss"
 */
export const vertexToSgf = (vertex: Vertex) => {
  const sgfVertex =
    String.fromCharCode(97 + vertex[0]) + String.fromCharCode(97 + vertex[1]);
  return sgfVertex;
};
