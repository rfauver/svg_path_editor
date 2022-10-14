import { SHAPES } from '../utils/constants';

import styles from '../styles/example_shapes.module.scss';

export default function ExampleShapes({ fillColor, setInstructions }) {
  return (
    <div className={styles.component}>
      {Object.entries(SHAPES).map(([name, shapeInstructions]) => {
        return (
          <div
            className={styles.shape}
            onClick={() => setInstructions(shapeInstructions)}
          >
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
              <path fill={fillColor} d={shapeInstructions.join(' ')} />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
