export const currentPositionString = prev =>
  prev ? ` (${prev[0]},${prev[1]})` : '';

const optPlus = coord => (typeof coord === 'number' && coord < 0 ? '' : '+');

export const relativeToString = (v, prev, names = ['x', 'y']) => {
  if (v.every(coord => typeof coord === 'number') && prev) {
    return `${prev[0] + v[0]},${prev[1] + v[1]} (${prev[0]}${optPlus(v[0])}${
      v[0]
    }, ${prev[1]}${optPlus(v[1])}${v[1]})`;
  } else if (prev) {
    return `${prev[0]}${optPlus(v[0])}${v[0]}, ${prev[1]}${optPlus(v[1])}${
      v[1]
    }`;
  } else {
    return `(current ${names[0]}+${v[0]}, current ${names[1]}+${v[1]})`;
  }
};

export const relativeHorizontalToString = (v, prev) => {
  if (v.every(coord => typeof coord === 'number') && prev) {
    return `${prev[0] + v[0]},${prev[1]} (${prev[0]}${optPlus(v[0])}${v[0]}, ${
      prev[1]
    })`;
  } else if (prev) {
    return `${prev[0]}${optPlus(v[0])}${v[0]}, ${prev[1]}`;
  } else {
    return `(current x${optPlus(v[0])}${v[0]}, current y)`;
  }
};

export const relativeVerticalToString = (v, prev) => {
  if (v.every(coord => typeof coord === 'number') && prev) {
    return `${prev[0]},${prev[1] + v[0]} (${prev[0]},${optPlus(v[0])}${v[0]})`;
  } else if (prev) {
    return `${prev[0]}, ${prev[1]}${optPlus(v[0])}${v[0]}`;
  } else {
    return `(current x, current y${optPlus(v[0])}${v[0]})`;
  }
};

export const arcFlagString = largeArc => {
  if (typeof largeArc === 'number' && [0, 1].includes(largeArc)) {
    return `using the ${largeArc === 0 ? 'smaller' : 'larger'} of the two arcs`;
  } else {
    `with large-arc-flag (0 or 1) deciding between the smaller or larger arc`;
  }
};

export const sweepFlagString = sweep => {
  if (typeof sweep === 'number' && [0, 1].includes(sweep)) {
    return `using the ${sweep === 0 ? 'counterclockwise' : 'clockwise'} arc`;
  } else {
    `with sweep-flag (0 or 1) deciding between the counterclockwise or clockwise arc`;
  }
};
