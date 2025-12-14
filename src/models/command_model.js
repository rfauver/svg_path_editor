import { COMMANDS, DIGIT, SEPARATOR } from '../utils/constants';

export default class CommandModel {
  constructor(
    uuid,
    instruction,
    cursorPosition,
    previousEndPoint,
    previousMEndPoint,
    previousControlPoint,
    previousLetter
  ) {
    this.uuid = uuid;
    this.instruction = instruction;
    this.letter = instruction[0];
    this.cursorPosition = cursorPosition;
    this.previousEndPoint = previousEndPoint;
    this.previousMEndPoint = previousMEndPoint;
    this.previousControlPoint = previousControlPoint;
    this.previousLetter = previousLetter;
    this.properties = COMMANDS[this.letter?.toUpperCase()];
  }

  isRelative = () => this.letter && this.letter.toLowerCase() === this.letter;

  isA = commandLetter =>
    this.letter && this.letter.toUpperCase() === commandLetter.toUpperCase();

  activePartIndex = () => {
    return (this.properties?.parts || []).findIndex(part =>
      (this.cursorPosition
        ? this.instruction.substring(0, this.cursorPosition)
        : ''
      ).match(part)
    );
  };

  setPartValues = values => {
    this.partValues = values;
  };

  infoString = () => {
    if (!this.properties) return '';

    const values = this.properties.partNames?.map((partName, i) =>
      this.partValues?.[i] ? parseFloat(this.partValues[i]) : partName
    );

    return this.properties.info(
      !this.isRelative(),
      values,
      this.previousEndPoint?.map(v => parseFloat(v)),
      this.previousMEndPoint?.map(v => parseFloat(v))
    );
  };

  endPoint = () => {
    if (this.isA('Z')) {
      return this.previousMEndPoint;
    }

    const relativeOffset =
      this.isRelative() && this.previousEndPoint
        ? this.previousEndPoint
        : [0, 0];

    let match;
    if (this.isA('H')) {
      match = this.instruction.match(new RegExp(`${DIGIT.source}$`));
      if (!match) return null;
      return [
        parseFloat(match[1]) + relativeOffset[0],
        this.previousEndPoint?.[1] || 0,
      ];
    }
    if (this.isA('V')) {
      match = this.instruction.match(new RegExp(`${DIGIT.source}$`));
      if (!match) return null;
      return [
        this.previousEndPoint?.[0] || 0,
        parseFloat(match[1]) + relativeOffset[1],
      ];
    }

    match = this.instruction.match(
      new RegExp(`${DIGIT.source}${SEPARATOR.source}${DIGIT.source}$`)
    );
    if (!match) return null;
    return match
      .slice(1, 3)
      .map((point, i) => parseFloat(point) + relativeOffset[i]);
  };

  lastControlPoint = () => {
    if (
      ['M', 'L', 'H', 'V', 'A', 'Z'].some(letter => this.isA(letter)) ||
      !this.partValues
    ) {
      return null;
    }

    const relativeOffset =
      this.isRelative() && this.previousEndPoint
        ? this.previousEndPoint
        : [0, 0];

    if (this.isA('C')) {
      return [
        parseFloat(this.partValues[2]) + relativeOffset[0],
        parseFloat(this.partValues[3]) + relativeOffset[1],
      ];
    }
    if (this.isA('Q') || this.isA('S')) {
      return [
        parseFloat(this.partValues[0]) + relativeOffset[0],
        parseFloat(this.partValues[1]) + relativeOffset[1],
      ];
    }
    if (this.isA('T') && this.previousEndPoint) {
      if (
        this.previousControlPoint &&
        !['S', 'C'].includes(this.previousLetter?.toUpperCase())
      ) {
        const diffX = this.previousEndPoint[0] - this.previousControlPoint[0];
        const diffY = this.previousEndPoint[1] - this.previousControlPoint[1];
        return [
          this.previousEndPoint[0] + diffX,
          this.previousEndPoint[1] + diffY,
        ];
      } else {
        return this.previousEndPoint;
      }
    }
  };

  #toRelativeX = x =>
    +(parseFloat(x) - (this.previousEndPoint?.[0] || 0)).toFixed(2);
  #toRelativeY = y =>
    +(parseFloat(y) - (this.previousEndPoint?.[1] || 0)).toFixed(2);
  #toAbsoluteX = x =>
    +(parseFloat(x) + (this.previousEndPoint?.[0] || 0)).toFixed(2);
  #toAbsoluteY = y =>
    +(parseFloat(y) + (this.previousEndPoint?.[1] || 0)).toFixed(2);

  relativeInstruction = () => {
    if (this.isRelative()) return this.instruction;

    let newInstruction = `${this.letter.toLowerCase()}${this.instruction.substring(
      1
    )}`;

    switch (this.letter) {
      case 'H':
        return newInstruction.replace(DIGIT, x => this.#toRelativeX(x));
      case 'V':
        return newInstruction.replace(DIGIT, y => this.#toRelativeY(y));
      case 'A':
        return newInstruction
          .trim()
          .replace(
            new RegExp(`${DIGIT.source}(${SEPARATOR.source})${DIGIT.source}$`),
            (_, x, separator, y) =>
              `${this.#toRelativeX(x)}${separator}${this.#toRelativeY(y)}`
          );
      default:
        return newInstruction.replace(
          new RegExp(
            `${DIGIT.source}(${SEPARATOR.source})${DIGIT.source}`,
            'g'
          ),
          (_, x, separator, y) =>
            `${this.#toRelativeX(x)}${separator}${this.#toRelativeY(y)}`
        );
    }
  };

  absoluteInstruction = () => {
    if (!this.letter || !this.isRelative()) return this.instruction;

    let newInstruction = `${this.letter.toUpperCase()}${this.instruction.substring(
      1
    )}`;

    switch (this.letter) {
      case 'h':
        return newInstruction.replace(DIGIT, x => this.#toAbsoluteX(x));
      case 'v':
        return newInstruction.replace(DIGIT, y => this.#toAbsoluteY(y));
      case 'a':
        return newInstruction
          .trim()
          .replace(
            new RegExp(`${DIGIT.source}(${SEPARATOR.source})${DIGIT.source}$`),
            (_, x, separator, y) =>
              `${this.#toAbsoluteX(x)}${separator}${this.#toAbsoluteY(y)}`
          );
      default:
        return newInstruction.replace(
          new RegExp(
            `${DIGIT.source}(${SEPARATOR.source})${DIGIT.source}`,
            'g'
          ),
          (_, x, separator, y) =>
            `${this.#toAbsoluteX(x)}${separator}${this.#toAbsoluteY(y)}`
        );
    }
  };
}
