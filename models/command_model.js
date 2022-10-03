import { COMMANDS, DIGIT, SEPARATOR } from '../utils/constants';

export default class CommandModel {
  constructor(
    instruction,
    cursorPosition,
    previousEndPoint,
    previousMEndPoint
  ) {
    this.instruction = instruction;
    this.letter = instruction[0];
    this.cursorPosition = cursorPosition;
    this.previousEndPoint = previousEndPoint;
    this.previousMEndPoint = previousMEndPoint;
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

  infoString = () => {
    if (!this.properties) return '';
    return this.isRelative()
      ? this.properties.infoRelative
      : this.properties.infoAbsolute;
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
      match = this.instruction.match(new RegExp(`(${DIGIT.source})$`));
      if (!match) return null;
      return [
        parseFloat(match[1]) + relativeOffset[0],
        this.previousEndPoint?.[1] || 0,
      ];
    }
    if (this.isA('V')) {
      match = this.instruction.match(new RegExp(`(${DIGIT.source})$`));
      if (!match) return null;
      return [
        this.previousEndPoint?.[0] || 0,
        parseFloat(match[1]) + relativeOffset[1],
      ];
    }

    match = this.instruction.match(
      new RegExp(`(${DIGIT.source})${SEPARATOR.source}(${DIGIT.source})$`)
    );
    if (!match) return null;
    return match
      .slice(1, 3)
      .map((point, i) => parseFloat(point) + relativeOffset[i]);
  };
}
