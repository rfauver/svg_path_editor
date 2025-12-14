import classnames from 'classnames';

import styles from '../styles/viewer.module.scss';

export default function Viewer({
  commands,
  fillColor,
  maxCoord,
  hoveredIndex,
  activeIndex,
}) {
  return (
    <div className={styles.component}>
      <div className={styles.yCoords}>
        <div className={styles.coord}>0</div>
        <div className={styles.coord}>{maxCoord}</div>
      </div>
      <div className={styles.rightWrapper}>
        <div className={styles.xCoords}>
          <div className={styles.coord}>0</div>
          <div className={styles.coord}>{maxCoord}</div>
        </div>

        <svg
          className={styles.view}
          viewBox={`0 0 ${maxCoord} ${maxCoord}`}
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fill={fillColor}
            d={commands.map(c => c.instruction).join(' ')}
          />
          {commands
            .map((command, i) =>
              [hoveredIndex, activeIndex].includes(i)
                ? getPathHighlight(command, i, maxCoord)
                : null
            )
            .filter(Boolean)}
        </svg>
      </div>
    </div>
  );
}

function getPathHighlight(command, index, maxCoord) {
  if (command.isA('M')) {
    const [x, y] = command.endPoint() || [0, 0];
    return (
      <circle
        className={`highlight-${index}`}
        cx={x}
        cy={y}
        r={maxCoord / 150}
        fill='red'
        key={index}
      />
    );
  }
  let pathString = '';
  if (command.previousEndPoint) {
    if (command.isA('Z')) {
      pathString = `M${command.previousEndPoint} L${
        command.previousMEndPoint || [0, 0]
      }`;
    } else {
      pathString = `M${command.previousEndPoint} ${command.instruction}`;
    }
  }

  if (
    ((command.isA('S') &&
      ['S', 'C'].includes(command.previousLetter?.toUpperCase())) ||
      (command.isA('T') &&
        ['T', 'Q'].includes(command.previousLetter?.toUpperCase()))) &&
    command.previousControlPoint &&
    command.previousEndPoint
  ) {
    const diffX = command.previousEndPoint[0] - command.previousControlPoint[0];
    const diffY = command.previousEndPoint[1] - command.previousControlPoint[1];
    const newControlPoint = [
      command.previousEndPoint[0] + diffX,
      command.previousEndPoint[1] + diffY,
    ];
    const curveType = { S: 'C', T: 'Q' }[command.letter.toUpperCase()];

    pathString = `M${command.previousEndPoint} ${curveType}${newControlPoint} ${command.absoluteInstruction().slice(1)}`;
  }
  return (
    <path
      className={`highlight-${index}`}
      stroke='red'
      fill='none'
      strokeWidth={maxCoord / 120}
      strokeDasharray={`${maxCoord / 50},${maxCoord / 80}`}
      d={pathString}
      key={index}
    />
  );
}
