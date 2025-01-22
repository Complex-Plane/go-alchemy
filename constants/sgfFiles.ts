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
        uri: require('../assets/sgf/shape/problem10.sgf'),
        name: 'problem10',
        id: 1
      }, { 
        uri: require('../assets/sgf/shape/problem11.sgf'),
        name: 'problem11',
        id: 2
      }, { 
        uri: require('../assets/sgf/shape/problem12.sgf'),
        name: 'problem12',
        id: 3
      }, { 
        uri: require('../assets/sgf/shape/problem13.sgf'),
        name: 'problem13',
        id: 4
      }, { 
        uri: require('../assets/sgf/shape/problem14.sgf'),
        name: 'problem14',
        id: 5
      }, { 
        uri: require('../assets/sgf/shape/problem15.sgf'),
        name: 'problem15',
        id: 6
      }, { 
        uri: require('../assets/sgf/shape/problem16.sgf'),
        name: 'problem16',
        id: 7
      }, { 
        uri: require('../assets/sgf/shape/problem17.sgf'),
        name: 'problem17',
        id: 8
      }, { 
        uri: require('../assets/sgf/shape/problem18.sgf'),
        name: 'problem18',
        id: 9
      }, { 
        uri: require('../assets/sgf/shape/problem19.sgf'),
        name: 'problem19',
        id: 10
      }, { 
        uri: require('../assets/sgf/shape/problem2.sgf'),
        name: 'problem2',
        id: 11
      }, { 
        uri: require('../assets/sgf/shape/problem20.sgf'),
        name: 'problem20',
        id: 12
      }, { 
        uri: require('../assets/sgf/shape/problem21.sgf'),
        name: 'problem21',
        id: 13
      }, { 
        uri: require('../assets/sgf/shape/problem22.sgf'),
        name: 'problem22',
        id: 14
      }, { 
        uri: require('../assets/sgf/shape/problem3.sgf'),
        name: 'problem3',
        id: 15
      }, { 
        uri: require('../assets/sgf/shape/problem4.sgf'),
        name: 'problem4',
        id: 16
      }, { 
        uri: require('../assets/sgf/shape/problem5.sgf'),
        name: 'problem5',
        id: 17
      }, { 
        uri: require('../assets/sgf/shape/problem6.sgf'),
        name: 'problem6',
        id: 18
      }, { 
        uri: require('../assets/sgf/shape/problem7.sgf'),
        name: 'problem7',
        id: 19
      }, { 
        uri: require('../assets/sgf/shape/problem8.sgf'),
        name: 'problem8',
        id: 20
      }, { 
        uri: require('../assets/sgf/shape/problem9.sgf'),
        name: 'problem9',
        id: 21
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
  