/**
 * Represents a node in an SGF (Smart Game Format) tree.
 * Each node contains a set of properties (data) and may have child nodes (variations).
 */
type SGFNode = {
  /** A mapping of SGF property identifiers to their list of values. */
  data: { [key: string]: string[] };
  /** An array of child SGF nodes, representing game tree branches or variations. */
  children: SGFNode[];
};

/**
 * Parses an SGF (Smart Game Format) string and returns an array of SGFNode trees.
 * This basic parser handles simple SGF trees with variations and properties.
 *
 * @param {string} input - The SGF formatted string to parse.
 * @returns {SGFNode[]} An array of parsed SGF trees. Returns an empty array if parsing fails.
 *
 * @example
 * const sgf = "(;FF[4]C[root]SZ[19];B[aa];W[bb])";
 * const result = parseSGF(sgf);
 * console.log(result);
 */
export function parseSGF(input: string): SGFNode[] {
  let index = 0;

  /**
   * Recursively parses a single SGF node and its children from the input string.
   *
   * @returns {SGFNode} The parsed SGF node.
   */
  function parseNode(): SGFNode {
    const node: SGFNode = { data: {}, children: [] };

    while (index < input.length) {
      // Skip whitespace
      while (index < input.length && /\s/.test(input[index])) {
        index++;
      }

      if (index >= input.length) break;

      // Parse property identifier
      if (input[index] === ';') {
        index++;
        continue;
      }

      // Handle start of a child node (variation)
      if (input[index] === '(') {
        index++;
        node.children.push(parseNode());
        continue;
      }

      // Handle end of a node/variation
      if (input[index] === ')') {
        index++;
        break;
      }

      // Parse property identifier (e.g., "FF", "C", "SZ")
      let identifier = '';
      while (index < input.length && /[A-Z]/.test(input[index])) {
        identifier += input[index];
        index++;
      }

      // Parse property values
      const values: string[] = [];
      while (index < input.length && input[index] === '[') {
        index++;
        let value = '';
        while (index < input.length && input[index] !== ']') {
          if (input[index] === '\\') {
            index++;
            if (index < input.length) {
              value += input[index];
            }
          } else {
            value += input[index];
          }
          index++;
        }
        values.push(value);
        index++; // Skip closing ']'
      }

      if (identifier) {
        node.data[identifier] = values;
      }
    }

    console.log(`Node: ${node}`);
    return node;
  }

  try {
    const firstNode = parseNode();
    return [firstNode];
  } catch (error) {
    console.error('Error parsing SGF:', error);
    return [];
  }
}
