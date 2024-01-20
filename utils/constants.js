import {
  currentPositionString,
  relativeToString,
  relativeHorizontalToString,
  relativeVerticalToString,
  arcFlagString,
  sweepFlagString,
} from './infoStringHelpers';

export const DIGIT = /((?:\+|-)?\d+(?:\.\d+)?)/;
const LAST_DIGIT = /((?:\+|-)?(?:\d+\.)?\d*)/;
export const SEPARATOR = /\s*[ ,]\s*/;

function buildParts(letter, length) {
  return [...new Array(length)].map(
    (_, i) =>
      new RegExp(
        `^${letter}\\s*${[...new Array(i + 1)]
          .map((_, j) => (i === j ? LAST_DIGIT.source : DIGIT.source))
          .join(SEPARATOR.source)}$`,
        'i'
      )
  );
}

export const COMMANDS = {
  M: {
    name: 'Move',
    parts: buildParts('M', 2),
    partNames: ['x', 'y'],
    info: (absolute, v, prev) =>
      `Move the pen from its current position${currentPositionString(
        prev
      )} to ${absolute ? `${v[0]},${v[1]}` : relativeToString(v, prev)}`,
    link: 'https://svgwg.org/svg2-draft/paths.html#PathDataMovetoCommands',
  },
  L: {
    name: 'Line',
    parts: buildParts('L', 2),
    partNames: ['x', 'y'],
    info: (absolute, v, prev) =>
      `Draw a straight line from the current position${currentPositionString(
        prev
      )} to ${absolute ? `${v[0]},${v[1]}` : relativeToString(v, prev)}`,
    link: 'https://svgwg.org/svg2-draft/paths.html#PathDataLinetoCommands',
  },
  H: {
    name: 'Horizontal Line',
    parts: buildParts('H', 1),
    partNames: ['x'],
    info: (absolute, v, prev) =>
      `Draw a horizontal line from the current position${currentPositionString(
        prev
      )} to ${
        absolute ? `${v[0]},${prev[1]}` : relativeHorizontalToString(v, prev)
      }`,
    link: 'https://svgwg.org/svg2-draft/paths.html#PathDataLinetoCommands',
  },
  V: {
    name: 'Vertical Line',
    parts: buildParts('V', 1),
    partNames: ['y'],
    info: (absolute, v, prev) =>
      `Draw a vertical line from the current position${currentPositionString(
        prev
      )} to ${
        absolute ? `${v[0]},${prev[1]}` : relativeVerticalToString(v, prev)
      }`,
    link: 'https://svgwg.org/svg2-draft/paths.html#PathDataLinetoCommands',
  },
  C: {
    name: 'Cubic Bézier Curve',
    parts: buildParts('C', 6),
    partNames: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
    info: (absolute, v, prev) =>
      `Draw a bézier curve from the current position${currentPositionString(
        prev
      )} to ${
        absolute ? `${v[4]},${v[5]}` : relativeToString(v.slice(4, 6), prev)
      } with ${
        absolute ? `${v[0]},${v[1]}` : relativeToString(v, prev, ['x1', 'y1'])
      } as the start control point and ${
        absolute
          ? `${v[2]},${v[3]}`
          : relativeToString(v.slice(2, 4), prev, ['x2', 'y2'])
      } as the end control point`,
    link: 'https://svgwg.org/svg2-draft/paths.html#PathDataCubicBezierCommands',
  },
  S: {
    name: 'Shortcut Cubic Curve',
    parts: buildParts('S', 4),
    partNames: ['x2', 'y2', 'x', 'y'],
    info: (absolute, v, prev) =>
      `Draw a bézier curve from the current position${currentPositionString(
        prev
      )} to ${
        absolute ? `${v[2]},${v[3]}` : relativeToString(v.slice(2, 4), prev)
      } with ${
        absolute ? `${v[0]},${v[1]}` : relativeToString(v, prev, ['x2', 'y2'])
      } as the end control point and a reflection of the previous curve command's end control point as the start control point (if it exists)`,
    link: 'https://svgwg.org/svg2-draft/paths.html#PathDataCubicBezierCommands',
  },
  Q: {
    name: 'Quadratic Bézier Curve',
    parts: buildParts('Q', 4),
    partNames: ['x1', 'y1', 'x', 'y'],
    info: (absolute, v, prev) =>
      `Draw a bézier curve from the current position${currentPositionString(
        prev
      )} to ${
        absolute ? `${v[2]},${v[3]}` : relativeToString(v.slice(2, 4), prev)
      } with a single control point at ${
        absolute ? `${v[0]},${v[1]}` : relativeToString(v, prev, ['x1', 'y1'])
      }`,
    link:
      'https://svgwg.org/svg2-draft/paths.html#PathDataQuadraticBezierCommands',
  },
  T: {
    name: 'Shortcut Quadratic Curve',
    parts: buildParts('T', 2),
    partNames: ['x', 'y'],
    info: (absolute, v, prev) =>
      `Draw a bézier curve from the current position${currentPositionString(
        prev
      )} to ${
        absolute ? `${v[0]},${v[1]}` : relativeToString(v, prev)
      }, using a reflection of the previous curve command's control point as the single control point`,
    link:
      'https://svgwg.org/svg2-draft/paths.html#PathDataQuadraticBezierCommands',
  },
  A: {
    name: 'Elliptical Arc Curve',
    parts: buildParts('A', 7),
    partNames: ['rx', 'ry', 'angle', 'large-arc-flag', 'sweep-flag', 'x', 'y'],
    info: (absolute, v, prev) =>
      `Draw an arc from the current position${currentPositionString(prev)} to ${
        absolute ? `${v[5]},${v[6]}` : relativeToString(v.slice(5, 7), prev)
      }, with ${v[0]} and ${v[1]} as the radii of the ellipse, ${
        v[2]
      } as the angle of rotation of the ellipse, ${arcFlagString(
        v[3]
      )}, and ${sweepFlagString(v[4])}`,
    link:
      'https://svgwg.org/svg2-draft/paths.html#PathDataEllipticalArcCommands',
  },
  Z: {
    name: 'Close Path',
    info: (absolute, v, prev, prevM) =>
      `Draw a straight line from the current position${currentPositionString(
        prev
      )} back to the start of the path${currentPositionString(prevM)}`,
    link: 'https://svgwg.org/svg2-draft/paths.html#PathDataClosePathCommand',
  },
};

export const SURROUNDING_TEXT = [
  '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">',
  '  <path fill="',
  '" d="',
  '  "></path>',
  '</svg>',
];

export const SHAPES = {
  QUARTER_NOTE: [
    'M45,0',
    'L68,30',
    'C50,50,55,50,70,75',
    'L67,78',
    'C50,70,40,80,53,97',
    'L50,100',
    'C30,75,30,60,57,68',
    'L35,40',
    'Q60,25,38,0',
    'Z',
  ],
  STAR: [
    'M50,0',
    'L58.82,37.86',
    'L97.55,34.55',
    'L64.27,54.64',
    'L78.39,90.45',
    'L50,65',
    'L21.61,90.45',
    'L35.73,54.64',
    'L2.45,34.55',
    'L41.18,37.86',
    'Z',
  ],
  SMILEY: [
    'm50,0',
    'a50,50,0,0,0,0,100',
    'a-50,-50,0,0,0,0,-100',
    'z',
    'm-8,32',
    'a8,8,0,0,1,-16,0',
    'a8,8,0,0,1,16,0',
    'z',
    'm32,0',
    'a8,8,0,0,1,-16,0',
    'a8,8,0,0,1,16,0',
    'z',
    'm-54,30',
    'h60',
    'c-5,26,-55,26,-60,0',
    'z',
  ],
  PLUS: [
    'm35,0',
    'v35',
    'h-35',
    'v30',
    'h35',
    'v35',
    'h30',
    'v-35',
    'h35',
    'v-30',
    'h-35',
    'v-35',
    'z',
  ],
  HEART: [
    'M50,25',
    'C35,0,-14,25,20,60',
    'L50,90',
    'L80,60',
    'C114,20,65,0,50,25',
  ],
  SPARKLES: [
    'M70,16',
    'c0,20,-10,30,-20,30',
    'c10,0,20,10,20,30',
    'c0,-20,10,-30,20,-30',
    'c-10,0,-20,-10,-20,-30',
    'z',
    'M30,0',
    'c0,20,-10,30,-20,30',
    'c10,0,20,10,20,30',
    'c0,-20,10,-30,20,-30',
    'c-10,0,-20,-10,-20,-30',
    'z',
    'M43,42',
    'c0,20,-10,30,-20,30',
    'c10,0,20,10,20,30',
    'c0,-20,10,-30,20,-30',
    'c-10,0,-20,-10,-20,-30',
    'z',
  ],
};
