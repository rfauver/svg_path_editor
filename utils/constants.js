export const DIGIT = /(?:\+|-)?\d+(?:\.\d+)?/;
const LAST_DIGIT = /(?:\+|-)?(?:\d+\.)?\d*/;
export const SEPARATOR = /\s*,?\s*/;

function buildParts(id, length) {
  return [...new Array(length)].map(
    (_, i) =>
      new RegExp(
        `^${id}\\s*${[...new Array(i + 1)]
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
    infoAbsolute: 'Move the pen from its current position to x,y',
    infoRelative:
      'Move the pen from its current position x units horizontally and y units vertically',
  },
  L: {
    name: 'Line',
    parts: buildParts('L', 2),
    partNames: ['x', 'y'],
    infoAbsolute: 'Draw a straight line from the current position to x,y',
    infoRelative:
      'Draw a straight line from the current position to a point x units away horizontally and y units away vertically',
  },
  H: {
    name: 'Horizontal Line',
    parts: buildParts('H', 2),
    partNames: ['x'],
    infoAbsolute:
      'Draw a horizontal line from the current position to coordinate x',
    infoRelative: 'Draw a line x units horizontally from the current position',
  },
  V: {
    name: 'Vertical Line',
    parts: buildParts('V', 1),
    partNames: ['y'],
    infoAbsolute:
      'Draw a horizontal line from the current position to coordinate x',
    infoRelative: 'Draw a line y units vertically from the current position',
  },
  C: {
    name: 'Cubic Bézier Curve',
    parts: buildParts('C', 6),
    partNames: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
    infoAbsolute:
      'Draw a bézier curve from the current position to x,y with x1,y1 as the start control point and x2,y2 as the end control point',
    infoRelative:
      'Draw a bézier curve from the current position to x units away horizontally and y units away vertically, with x1,y1 as the number of units away from the starting position for the start control point and x2,y2 as the number of units away from the starting position for the end control point',
  },
  S: {
    name: 'Shortcut Cubic Curve',
    parts: buildParts('S', 4),
    partNames: ['x2', 'y2', 'x', 'y'],
    infoAbsolute:
      "Draw a bézier curve from the current position to x,y with x2,y2 as the end control point and a reflection of the previous curve command's end control point as the start control point (if it exists)",
    infoRelative:
      "Draw a bézier curve from the current position to x units away horizontally and y units away vertically, with x2,y2 as the number of units away from the starting position for the end control point and a reflection of the previous curve command's end control point as the start control point (if it exists)",
  },
  Q: {
    name: 'Quadratic Bézier Curve',
    parts: buildParts('Q', 4),
    partNames: ['x1', 'y1', 'x', 'y'],
    infoAbsolute:
      'Draw a bézier curve from the current position to x,y with a single control point at x1,y1',
    infoRelative:
      'Draw a bézier curve from the current position to x units away horizontally and y units away vertically, with x1,y1 as the number of units away from the starting position for the single control point',
  },
  T: {
    name: 'Shortcut Quadratic Curve',
    parts: buildParts('T', 2),
    partNames: ['x', 'y'],
    infoAbsolute:
      "Draw a bézier curve from the current position to x,y, using a reflection of the previous curve command's control point as the single control point",
    infoRelative:
      "Draw a bézier curve from the current position to x units away horizontally and y units away vertically, using a reflection of the previous curve command's control point as the single control point",
  },
  A: {
    name: 'Elliptical Arc Curve',
    parts: buildParts('A', 7),
    partNames: ['rx', 'ry', 'angle', 'large-arc-flag', 'sweep-flag', 'x', 'y'],
    infoAbsolute:
      'Draw an arc from the current position to x,y, with rx and ry as the radii of the ellipse, angle as the angle of rotation of the ellipse, 0 or 1 for the large-arc-flag to chose between small arc or large arc, and 0 or 1 for the sweep-flag to chose between the couterclockwise or clockwise arc',
    infoRelative:
      'Draw an arc from the current position to x units away horizontally and y units away vertically, with rx and ry as the radii of the ellipse, angle as the angle of rotation of the ellipse, 0 or 1 for the large-arc-flag to chose between small arc or large arc, and 0 or 1 for the sweep-flag to chose between the couterclockwise or clockwise arc',
  },
  Z: {
    name: 'Close Path',
    infoAbsolute:
      'Draw a straight line from the current position back to the start of the path',
    infoRelative:
      'Draw a straight line from the current position back to the start of the path',
  },
};

export const SURROUNDING_TEXT = [
  '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">',
  '  <path fill="',
  '" d="',
  '  "></path>',
  '</svg>',
];
