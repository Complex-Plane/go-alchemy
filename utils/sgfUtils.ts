// Convert SGF coordinates (e.g. "bc") to vertex [x, y]
export const sgfToVertex = (sgfCoord: string) => {
  const x = sgfCoord.charCodeAt(0) - 97;
  const y = sgfCoord.charCodeAt(1) - 97;
  return [x, y];
};
