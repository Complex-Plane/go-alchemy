import {
  SGFFiles,
  FULL,
  TOP_RIGHT,
  TOP_LEFT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT
} from '@/types/sgf';

export const SGF_FILES: SGFFiles = {
  joseki: {
    problems: [
      {
        uri: require('../assets/sgf/joseki/problem001.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 0
      }
    ]
  },
  opening: {
    problems: [
      {
        uri: require('../assets/sgf/opening/problem001.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 0
      }
    ]
  },
  sabaki: {
    problems: [
      {
        uri: require('../assets/sgf/sabaki/problem001.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 0
      }
    ]
  },
  shape: {
    problems: [
      {
        uri: require('../assets/sgf/shape/problem001.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 0
      },
      {
        uri: require('../assets/sgf/shape/problem002.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 1
      },
      {
        uri: require('../assets/sgf/shape/problem003.sgf'),
        name: 'problem003',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 2
      },
      {
        uri: require('../assets/sgf/shape/problem004.sgf'),
        name: 'problem004',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 3
      },
      {
        uri: require('../assets/sgf/shape/problem005.sgf'),
        name: 'problem005',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 4
      },
      {
        uri: require('../assets/sgf/shape/problem006.sgf'),
        name: 'problem006',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 5
      },
      {
        uri: require('../assets/sgf/shape/problem007.sgf'),
        name: 'problem007',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 6
      },
      {
        uri: require('../assets/sgf/shape/problem008.sgf'),
        name: 'problem008',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 7
      },
      {
        uri: require('../assets/sgf/shape/problem009.sgf'),
        name: 'problem009',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 8
      },
      {
        uri: require('../assets/sgf/shape/problem010.sgf'),
        name: 'problem010',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 9
      },
      {
        uri: require('../assets/sgf/shape/problem011.sgf'),
        name: 'problem011',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 10
      },
      {
        uri: require('../assets/sgf/shape/problem012.sgf'),
        name: 'problem012',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 11
      },
      {
        uri: require('../assets/sgf/shape/problem013.sgf'),
        name: 'problem013',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 12
      },
      {
        uri: require('../assets/sgf/shape/problem014.sgf'),
        name: 'problem014',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 13
      },
      {
        uri: require('../assets/sgf/shape/problem015.sgf'),
        name: 'problem015',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 14
      },
      {
        uri: require('../assets/sgf/shape/problem016.sgf'),
        name: 'problem016',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 15
      },
      {
        uri: require('../assets/sgf/shape/problem017.sgf'),
        name: 'problem017',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 16
      },
      {
        uri: require('../assets/sgf/shape/problem018.sgf'),
        name: 'problem018',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 17
      },
      {
        uri: require('../assets/sgf/shape/problem019.sgf'),
        name: 'problem019',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 18
      },
      {
        uri: require('../assets/sgf/shape/problem020.sgf'),
        name: 'problem020',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 19
      },
      {
        uri: require('../assets/sgf/shape/problem021.sgf'),
        name: 'problem021',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 20
      },
      {
        uri: require('../assets/sgf/shape/problem022.sgf'),
        name: 'problem022',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 21
      }
    ]
  },
  tesuji: {
    problems: [
      {
        uri: require('../assets/sgf/tesuji/problem001.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_LEFT,
        id: 0
      },
      {
        uri: require('../assets/sgf/tesuji/problem002.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: FULL,
        id: 1
      }
    ]
  },
  tsumego: {
    problems: [
      {
        uri: require('../assets/sgf/tsumego/problem001.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 0
      }
    ]
  }
};
