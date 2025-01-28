import { SGFFiles } from '@/types/sgf';
import {
  FULL,
  TOP_RIGHT,
  TOP_LEFT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  LEFT,
  RIGHT,
  TOP,
  BOTTOM
} from '@/constants/boardRanges';

export const SGF_FILES: SGFFiles = {
  joseki: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/joseki/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: FULL,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 1,
        uri: require('@/assets/problems/joseki/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: FULL,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  },
  opening: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/opening/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: FULL,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 1,
        uri: require('@/assets/problems/opening/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: FULL,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  },
  sabaki: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/sabaki/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: FULL,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 1,
        uri: require('@/assets/problems/sabaki/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  },
  shape: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/shape/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/problems/shape/001/problem001.jpg')
      },
      {
        id: 1,
        uri: require('@/assets/problems/shape/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 2,
        uri: require('@/assets/problems/shape/003/problem003_annotated.sgf'),
        name: 'problem003',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 3,
        uri: require('@/assets/problems/shape/004/problem004_annotated.sgf'),
        name: 'problem004',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 4,
        uri: require('@/assets/problems/shape/005/problem005_annotated.sgf'),
        name: 'problem005',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 5,
        uri: require('@/assets/problems/shape/006/problem006_annotated.sgf'),
        name: 'problem006',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 6,
        uri: require('@/assets/problems/shape/007/problem007_annotated.sgf'),
        name: 'problem007',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 7,
        uri: require('@/assets/problems/shape/008/problem008_annotated.sgf'),
        name: 'problem008',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 8,
        uri: require('@/assets/problems/shape/009/problem009_annotated.sgf'),
        name: 'problem009',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 9,
        uri: require('@/assets/problems/shape/010/problem010_annotated.sgf'),
        name: 'problem010',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 10,
        uri: require('@/assets/problems/shape/011/problem011_annotated.sgf'),
        name: 'problem011',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 11,
        uri: require('@/assets/problems/shape/012/problem012_annotated.sgf'),
        name: 'problem012',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 12,
        uri: require('@/assets/problems/shape/013/problem013_annotated.sgf'),
        name: 'problem013',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 13,
        uri: require('@/assets/problems/shape/014/problem014_annotated.sgf'),
        name: 'problem014',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 14,
        uri: require('@/assets/problems/shape/015/problem015_annotated.sgf'),
        name: 'problem015',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 15,
        uri: require('@/assets/problems/shape/016/problem016_annotated.sgf'),
        name: 'problem016',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 16,
        uri: require('@/assets/problems/shape/017/problem017_annotated.sgf'),
        name: 'problem017',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 17,
        uri: require('@/assets/problems/shape/018/problem018_annotated.sgf'),
        name: 'problem018',
        boardSize: 19,
        range: TOP_RIGHT,
        color: -1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 18,
        uri: require('@/assets/problems/shape/019/problem019_annotated.sgf'),
        name: 'problem019',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 19,
        uri: require('@/assets/problems/shape/020/problem020_annotated.sgf'),
        name: 'problem020',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 20,
        uri: require('@/assets/problems/shape/021/problem021_annotated.sgf'),
        name: 'problem021',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 21,
        uri: require('@/assets/problems/shape/022/problem022_annotated.sgf'),
        name: 'problem022',
        boardSize: 19,
        range: TOP_RIGHT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  },
  tesuji: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/tesuji/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_LEFT,
        color: 1,
        image: require('@/assets/problems/tesuji/001/problem001.jpg')
      },
      {
        id: 1,
        uri: require('@/assets/problems/tesuji/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: FULL,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  },
  tsumego: {
    problems: [
      {
        id: 0,
        uri: require('@/assets/problems/tsumego/001/problem001_annotated.sgf'),
        name: 'problem001',
        boardSize: 19,
        range: TOP_LEFT,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      },
      {
        id: 1,
        uri: require('@/assets/problems/tsumego/002/problem002_annotated.sgf'),
        name: 'problem002',
        boardSize: 19,
        range: FULL,
        color: 1,
        image: require('@/assets/images/placeholder.png')
      }
    ]
  }
};
