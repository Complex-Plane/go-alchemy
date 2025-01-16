import { Vertex } from '@sabaki/go-board';

// Convert SGF coordinates (e.g. "bc") to vertex [x, y]
export const sgfToVertex = (sgfCoord: string) => {
  const vertex: Vertex = [
    sgfCoord.charCodeAt(0) - 97,
    sgfCoord.charCodeAt(1) - 97
  ];
  return vertex;
};

export const vertexToSgf = (vertex: Vertex) => {
  const sgfVertex =
    String.fromCharCode(97 + vertex[0]) + String.fromCharCode(97 + vertex[1]);
  return sgfVertex;
};
