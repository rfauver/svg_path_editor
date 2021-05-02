import { COMMANDS } from '../utils/constants';
import classnames from 'classnames';

import styles from '../styles/command.module.scss';

export default function Command({
  id,
  index,
  instruction,
  partNames,
  activePartIndex,
  setCursorPosition,
  updateInstructions,
}) {
  const onInputChange = e => {
    updateInstructions(index, e.target.value.trimStart());
  };
  const onCursorChange = e => {
    setCursorPosition(e.target.selectionStart);
  };
  return (
    <div>
      <select
        className={styles.dropdown}
        name='path'
        onChange={e => updateInstructions(index, e.target.value)}
        value={id}
      >
        {Object.entries(COMMANDS).map(([commandId, command]) => (
          <option key={commandId} value={commandId}>
            {command.name}
          </option>
        ))}
      </select>
      <input
        className={styles.instruction}
        value={instruction}
        onChange={onInputChange}
        onKeyUp={onCursorChange}
        onMouseUp={onCursorChange}
        onFocus={onCursorChange}
      />
      {partNames && (
        <div className={styles.annotation}>
          (
          {partNames.map((partName, i) => (
            <span
              key={i}
              className={classnames(styles.partName, {
                [styles.partNameActive]: i === activePartIndex,
              })}
            >
              {partName}
              {i < partNames.length - 1 ? ', ' : ''}
            </span>
          ))}
          )
        </div>
      )}
    </div>
  );
}
