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
        uri: require('./joseki/problem001.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
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
        uri: require('./opening/problem001.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
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
        uri: require('./sabaki/problem001.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
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
        uri: require('./shape/problem001.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 0
      },
      {
        uri: require('./shape/problem002.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem002',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 1
      },
      {
        uri: require('./shape/problem003.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem003',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 2
      },
      {
        uri: require('./shape/problem004.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem004',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 3
      },
      {
        uri: require('./shape/problem005.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem005',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 4
      },
      {
        uri: require('./shape/problem006.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem006',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 5
      },
      {
        uri: require('./shape/problem007.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem007',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 6
      },
      {
        uri: require('./shape/problem008.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem008',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 7
      },
      {
        uri: require('./shape/problem009.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem009',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 8
      },
      {
        uri: require('./shape/problem010.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem010',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 9
      },
      {
        uri: require('./shape/problem011.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem011',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 10
      },
      {
        uri: require('./shape/problem012.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem012',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 11
      },
      {
        uri: require('./shape/problem013.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem013',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 12
      },
      {
        uri: require('./shape/problem014.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem014',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 13
      },
      {
        uri: require('./shape/problem015.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem015',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 14
      },
      {
        uri: require('./shape/problem016.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem016',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 15
      },
      {
        uri: require('./shape/problem017.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem017',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 16
      },
      {
        uri: require('./shape/problem018.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem018',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 17
      },
      {
        uri: require('./shape/problem019.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem019',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 18
      },
      {
        uri: require('./shape/problem020.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem020',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 19
      },
      {
        uri: require('./shape/problem021.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem021',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 20
      },
      {
        uri: require('./shape/problem022.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
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
        uri: require('./tesuji/problem001.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_LEFT,
        id: 0
      },
      {
        uri: require('./tesuji/problem002.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
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
        uri: require('./tsumego/problem001.sgf'),
        image: require('../images/tesuji_thumbnail.jpg'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_RIGHT,
        id: 0
      }
    ]
  }
};
