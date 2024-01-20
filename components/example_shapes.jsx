import { SHAPES } from '../utils/constants';

import styles from '../styles/example_shapes.module.scss';

const withUuids = strings =>
  strings.map(str => ({ raw: str, uuid: crypto.randomUUID() }));

export default function ExampleShapes({ fillColor, setInstructions }) {
  return (
    <div className={styles.component}>
      {Object.entries(SHAPES).map(([name, shapeInstructions]) => {
        return (
          <button
            key={name}
            className={styles.shape}
            onClick={() => setInstructions(withUuids(shapeInstructions))}
          >
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
              <path fill={fillColor} d={shapeInstructions.join(' ')} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
