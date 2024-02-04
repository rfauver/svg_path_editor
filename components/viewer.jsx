import classnames from 'classnames';

import styles from '../styles/viewer.module.scss';

export default function Viewer({ commands, fillColor }) {
  const endPoints = commands.map(command => command.endPoint()).filter(Boolean);
  const maxCoord = Math.max(...endPoints.flat(), 100);

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
          {commands.map(getPathHighlight)}
        </svg>
      </div>
    </div>
  );
}

function getPathHighlight(command, index) {
  if (command.isA('M')) {
    const [x, y] = command.endPoint() || [0, 0];
    return (
      <circle
        className={`highlight-${index}`}
        cx={x}
        cy={y}
        r='1'
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
  return (
    <path
      className={`highlight-${index}`}
      stroke='red'
      fill='none'
      strokeWidth='1'
      strokeDasharray='2,1.2'
      d={pathString}
      key={index}
    />
  );
}
