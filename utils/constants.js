const DIGIT = /(\+|-)?\d+/;
const LAST_DIGIT = /(\+|-)?\d*/;
const SEPARATOR = /\s*,?\s*/;

function buildParts(id, length) {
  return [...new Array(length)].map(
    (_, i) =>
      new RegExp(
        `^${id}\\s*${[...new Array(i + 1)]
          .map((_, j) => (i === j ? LAST_DIGIT.source : DIGIT.source))
          .join(SEPARATOR.source)}$`
      )
  );
}

export const COMMANDS = {
  M: {
    name: 'Move (absolute)',
    parts: buildParts('M', 2),
    partNames: ['x', 'y'],
  },
  m: {
    name: 'Move (relative)',
    parts: buildParts('m', 2),
    partNames: ['x', 'y'],
  },
  L: {
    name: 'Line (absolute)',
    parts: buildParts('L', 2),
    partNames: ['x', 'y'],
  },
  l: {
    name: 'Line (relative)',
    parts: buildParts('l', 2),
    partNames: ['x', 'y'],
  },
  H: {
    name: 'Horizontal Line (absolute)',
    parts: buildParts('H', 2),
    partNames: ['x'],
  },
  h: {
    name: 'Horizontal Line (relative)',
    parts: buildParts('h', 2),
    partNames: ['x'],
  },
  V: {
    name: 'Vertical Line (absolute)',
    parts: buildParts('V', 1),
    partNames: ['y'],
  },
  v: {
    name: 'Vertical Line (relative)',
    parts: buildParts('v', 1),
    partNames: ['y'],
  },
  C: {
    name: 'Cubic Bézier Curve (absolute)',
    parts: buildParts('C', 6),
    partNames: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
  },
  c: {
    name: 'Cubic Bézier Curve (relative)',
    parts: buildParts('c', 6),
    partNames: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
  },
  S: {
    name: 'Shortcut Bézier Curve (absolute)',
    parts: buildParts('S', 4),
    partNames: ['x2', 'y2', 'x', 'y'],
  },
  s: {
    name: 'Shortcut Bézier Curve (relative)',
    parts: buildParts('s', 4),
    partNames: ['x2', 'y2', 'x', 'y'],
  },
  Q: {
    name: 'Quadratic Curve (absolute)',
    parts: buildParts('Q', 4),
    partNames: ['x1', 'y1', 'x', 'y'],
  },
  q: {
    name: 'Quadratic Curve (relative)',
    parts: buildParts('q', 4),
    partNames: ['x1', 'y1', 'x', 'y'],
  },
  T: {
    name: 'Shortcut Quadratic Curve (absolute)',
    parts: buildParts('T', 2),
    partNames: ['x', 'y'],
  },
  t: {
    name: 'Shortcut Quadratic Curve (relative)',
    parts: buildParts('t', 2),
    partNames: ['x', 'y'],
  },
};
