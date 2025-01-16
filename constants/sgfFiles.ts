type Problem = {
  uri: string;
  name: string;
  id: number;
};

type SGFCategory = {
  problems: Problem[];
};

type SGFFiles = {
  [key: string]: SGFCategory;
};

export const SGF_FILES: SGFFiles = {
  joseki: {
    problems: [
      {
        uri: require('../assets/sgf/joseki/problem1.sgf'),
        name: 'problem1',
        id: 0
      }
    ]
  },
  opening: {
    problems: [
      {
        uri: require('../assets/sgf/opening/problem1.sgf'),
        name: 'problem1',
        id: 0
      }
    ]
  },
  sabaki: {
    problems: [
      {
        uri: require('../assets/sgf/sabaki/problem1.sgf'),
        name: 'problem1',
        id: 0
      }
    ]
  },
  shape: {
    problems: [
      {
        uri: require('../assets/sgf/shape/problem1.sgf'),
        name: 'problem1',
        id: 0
      }
    ]
  },
  tesuji: {
    problems: [
      {
        uri: require('../assets/sgf/tesuji/problem1.sgf'),
        name: 'problem1',
        id: 0
      },
      {
        uri: require('../assets/sgf/tesuji/problem2.sgf'),
        name: 'problem2',
        id: 1
      }
    ]
  },
  tsumego: {
    problems: [
      {
        uri: require('../assets/sgf/tsumego/problem1.sgf'),
        name: 'problem1',
        id: 0
      }
    ]
  }
};
