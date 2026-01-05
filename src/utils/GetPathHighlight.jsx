import React from 'react';

export default class GetPathHighlight {
  static run(command, index, maxCoord) {
    return new GetPathHighlight(command, index, maxCoord).#run();
  }

  constructor(command, index, maxCoord) {
    this.command = command;
    this.previousEndPoint = this.command.previousEndPoint;
    this.partValues = this.command.partValues;
    this.index = index;
    this.maxCoord = maxCoord;
    this.pathString = '';
    this.reflectedControlPoint = null;
  }

  #run() {
    if (this.command.isA('M')) {
      const [x, y] = this.command.endPoint() || [0, 0];
      return (
        <circle
          className={`highlight-${this.index}`}
          cx={x}
          cy={y}
          r={this.maxCoord / 150}
          fill='red'
          key={this.index}
        />
      );
    }
    if (this.previousEndPoint) {
      if (this.command.isA('Z')) {
        this.pathString = `M${this.previousEndPoint} L${
          this.command.previousMEndPoint || [0, 0]
        }`;
      } else {
        this.pathString = `M${this.previousEndPoint} ${this.command.instruction}`;
      }
    }

    this.#getHighlightForReflectedControlPoints();
    const controlPoints = this.#getControlPoints();
    const controlPointDots = controlPoints.map(this.#getControlPointDot);
    const controlPointLines = controlPoints.map(this.#getControlPointLine);

    return (
      <React.Fragment key={this.index}>
        <path
          stroke='red'
          fill='none'
          strokeWidth={this.maxCoord / 120}
          strokeDasharray={`${this.maxCoord / 50},${this.maxCoord / 80}`}
          d={this.pathString}
        />
        {controlPointLines}
        {controlPointDots}
      </React.Fragment>
    );
  }

  #getHighlightForReflectedControlPoints = () => {
    const isValidShortcutCubic =
      this.command.isA('S') &&
      ['S', 'C'].includes(this.command.previousLetter?.toUpperCase());
    const isValidShortcutQuadratic =
      this.command.isA('T') &&
      ['T', 'Q'].includes(this.command.previousLetter?.toUpperCase());

    if (
      (isValidShortcutCubic || isValidShortcutQuadratic) &&
      this.command.previousControlPoint &&
      this.previousEndPoint
    ) {
      const diffX =
        this.previousEndPoint[0] - this.command.previousControlPoint[0];
      const diffY =
        this.previousEndPoint[1] - this.command.previousControlPoint[1];
      this.reflectedControlPoint = [
        this.previousEndPoint[0] + diffX,
        this.previousEndPoint[1] + diffY,
      ];
      const curveType = { S: 'C', T: 'Q' }[this.command.letter.toUpperCase()];

      console.log(this.reflectedControlPoint);
      this.pathString = `M${this.previousEndPoint} ${curveType}${this.reflectedControlPoint} ${this.command.absoluteInstruction().slice(1)}`;
    }
  };

  #getControlPoints() {
    const controlPoints = [];
    if (this.command.isA('C') && this.partValues) {
      controlPoints.push(this.partValues.slice(0, 2));
      controlPoints.push(this.partValues.slice(2, 4));
    } else if (this.command.isA('Q') && this.partValues) {
      controlPoints.push(this.partValues.slice(0, 2));
      controlPoints.push(this.partValues.slice(0, 2));
    } else if (this.command.isA('T') && this.reflectedControlPoint) {
      controlPoints.push(this.reflectedControlPoint);
      controlPoints.push(this.reflectedControlPoint);
    } else if (
      this.command.isA('S') &&
      this.reflectedControlPoint &&
      this.partValues
    ) {
      controlPoints.push(this.reflectedControlPoint);
      controlPoints.push(this.partValues.slice(0, 2));
    }
    return controlPoints;
  }

  #getControlPointDot = (point, i) => {
    const [x, y] =
      this.command.isRelative() &&
      !(this.command.isA('S') && i === 0) &&
      !this.command.isA('T')
        ? [
            this.previousEndPoint[0] + parseFloat(point[0]),
            this.previousEndPoint[1] + parseFloat(point[1]),
          ]
        : [parseFloat(point[0]), parseFloat(point[1])];

    return (
      <circle
        key={`control-point-${this.index}-${i}`}
        cx={x}
        cy={y}
        r={this.maxCoord / 180}
        fill='red'
      />
    );
  };

  #getControlPointLine = (point, i) => {
    const [lineEndX, lineEndY] =
      this.command.isRelative() &&
      !(this.command.isA('S') && i === 0) &&
      !this.command.isA('T')
        ? [
            this.previousEndPoint[0] + parseFloat(point[0]),
            this.previousEndPoint[1] + parseFloat(point[1]),
          ]
        : [parseFloat(point[0]), parseFloat(point[1])];

    const [startX, startY] = this.previousEndPoint || [0, 0];

    let lineStartX, lineStartY;
    if (i === 0) {
      // First control point (start control point)
      lineStartX = startX;
      lineStartY = startY;
    } else {
      // Second control point (end control point)
      const endPoint = this.command.endPoint() || [0, 0];
      lineStartX = endPoint[0];
      lineStartY = endPoint[1];
    }

    return (
      <path
        key={`control-point-line-${this.index}-${i}`}
        d={`M${lineStartX} ${lineStartY} L${lineEndX} ${lineEndY}`}
        stroke='grey'
        strokeWidth={this.maxCoord / 250}
        strokeDasharray={`${this.maxCoord / 200},${this.maxCoord / 250}`}
      />
    );
  };
}
