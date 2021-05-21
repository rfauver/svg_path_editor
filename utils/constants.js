const DIGIT = /(\+|-)?\d+/;
const LAST_DIGIT = /(\+|-)?\d*/;
const SEPARATOR = /\s*,?\s*/;

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
  },
  L: {
    name: 'Line',
    parts: buildParts('L', 2),
    partNames: ['x', 'y'],
  },
  H: {
    name: 'Horizontal Line',
    parts: buildParts('H', 2),
    partNames: ['x'],
  },
  V: {
    name: 'Vertical Line',
    parts: buildParts('V', 1),
    partNames: ['y'],
  },
  C: {
    name: 'Cubic Bézier Curve',
    parts: buildParts('C', 6),
    partNames: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
  },
  S: {
    name: 'Shortcut Bézier Curve',
    parts: buildParts('S', 4),
    partNames: ['x2', 'y2', 'x', 'y'],
  },
  Q: {
    name: 'Quadratic Curve',
    parts: buildParts('Q', 4),
    partNames: ['x1', 'y1', 'x', 'y'],
  },
  T: {
    name: 'Shortcut Quadratic Curve',
    parts: buildParts('T', 2),
    partNames: ['x', 'y'],
  },
};
