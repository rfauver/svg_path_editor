import { useState } from 'react';
import PasteBox from '../components/paste_box';
import { SHAPES } from '../utils/constants';
import withUuids from '../utils/withUuids';
import classnames from 'classnames';

import styles from '../styles/example_shapes.module.scss';

export default function ExampleShapes({ fillColor, setInstructions }) {
  const [showPasteBox, setShowPasteBox] = useState(false);

  return (
    <>
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
        <button
          className={classnames(styles.shape, styles.paste)}
          onClick={() => setShowPasteBox(!showPasteBox)}
        >
          Paste
        </button>
      </div>
      {showPasteBox && <PasteBox setInstructions={setInstructions} />}
    </>
  );
}
