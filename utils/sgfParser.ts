type SGFNode = {
  data: { [key: string]: string[] };
  children: SGFNode[];
};

export function parseSGF(input: string): SGFNode[] {
  let index = 0;

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

      if (input[index] === '(') {
        index++;
        node.children.push(parseNode());
        continue;
      }

      if (input[index] === ')') {
        index++;
        break;
      }

      // Parse property
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
        index++;
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
