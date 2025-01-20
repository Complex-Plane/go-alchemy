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
    problems: [{ 
        uri: require('../assets/sgf/joseki/problem1.sgf'),
        name: 'problem1',
        id: 0
      }]
  },
  opening: {
    problems: [{ 
        uri: require('../assets/sgf/opening/problem1.sgf'),
        name: 'problem1',
        id: 0
      }]
  },
  sabaki: {
    problems: [{ 
        uri: require('../assets/sgf/sabaki/problem1.sgf'),
        name: 'problem1',
        id: 0
      }]
  },
  shape: {
    problems: [{ 
        uri: require('../assets/sgf/shape/problem1.sgf'),
        name: 'problem1',
        id: 0
      }, { 
        uri: require('../assets/sgf/shape/problem2.sgf'),
        name: 'problem2',
        id: 1
      }, { 
        uri: require('../assets/sgf/shape/problem3.sgf'),
        name: 'problem3',
        id: 2
      }, { 
        uri: require('../assets/sgf/shape/problem4.sgf'),
        name: 'problem4',
        id: 3
      }, { 
        uri: require('../assets/sgf/shape/problem5.sgf'),
        name: 'problem5',
        id: 4
      }, { 
        uri: require('../assets/sgf/shape/problem6.sgf'),
        name: 'problem6',
        id: 5
      }, { 
        uri: require('../assets/sgf/shape/problem7.sgf'),
        name: 'problem7',
        id: 6
      }, { 
        uri: require('../assets/sgf/shape/problem8.sgf'),
        name: 'problem8',
        id: 7
      }, { 
        uri: require('../assets/sgf/shape/problem9.sgf'),
        name: 'problem9',
        id: 8
      }]
  },
  tesuji: {
    problems: [{ 
        uri: require('../assets/sgf/tesuji/problem1.sgf'),
        name: 'problem1',
        id: 0
      }, { 
        uri: require('../assets/sgf/tesuji/problem2.sgf'),
        name: 'problem2',
        id: 1
      }]
  },
  tsumego: {
    problems: [{ 
        uri: require('../assets/sgf/tsumego/problem1.sgf'),
        name: 'problem1',
        id: 0
      }]
  }
    };
  