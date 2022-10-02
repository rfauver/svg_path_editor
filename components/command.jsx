import { COMMANDS } from '../utils/constants';
import classnames from 'classnames';

import styles from '../styles/command.module.scss';

export default function Command({
  id,
  index,
  instruction,
  partNames,
  activePartIndex,
  relative,
  infoString,
  setCursorPosition,
  updateInstructions,
  addCommand,
  removeCommand,
}) {
  const onInputChange = e =>
    updateInstructions(index, e.target.value.trimStart());
  const onKeyUp = e => {
    if (e.key === 'Enter') {
      addCommand(index);
    }
    onCursorChange(e);
  };
  const onCursorChange = e => setCursorPosition(e.target.selectionStart);
  const addCommandPressed = e => {
    if ([' ', 'Enter'].includes(e.key)) {
      addCommand(index);
    }
  };
  const removeCommandPressed = e => {
    if ([' ', 'Enter', 'Backspace', 'Delete'].includes(e.key)) {
      removeCommand(index);
    }
  };
  const addCommandClicked = () => addCommand(index);
  const removeCommandClicked = () => removeCommand(index);
  return (
    <div className={classnames(`command-${index}`, styles.component)}>
      <input
        className={classnames('instruction', styles.instruction)}
        value={instruction}
        onChange={onInputChange}
        onKeyUp={onKeyUp}
        onMouseUp={onCursorChange}
        onFocus={onCursorChange}
        aria-label={`path command ${index + 1}`}
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
      <select
        className={styles.dropdown}
        name='path'
        onChange={e => updateInstructions(index, e.target.value)}
        value={id?.toUpperCase()}
      >
        {Object.entries(COMMANDS).map(([commandId, command]) => (
          <option key={commandId} value={commandId}>
            {command.name}
          </option>
        ))}
      </select>
      <label className={styles.relativeToggle} htmlFor={`toggle-${index}`}>
        Rel
        <input
          type='checkbox'
          id={`toggle-${index}`}
          className={styles.toggleCheckbox}
          checked={relative}
          onChange={e =>
            updateInstructions(
              index,
              e.target.checked
                ? instruction.toLowerCase()
                : instruction.toUpperCase()
            )
          }
        />
        <div className={styles.toggleSwitch} />
      </label>
      <button
        className={classnames(styles.button, styles.addButton)}
        name='Add'
        onMouseDown={addCommandClicked}
        onKeyDown={addCommandPressed}
      />
      <button
        className={classnames(styles.button, styles.removeButton)}
        name='Remove'
        onMouseDown={removeCommandClicked}
        onKeyDown={removeCommandPressed}
      />
      <span className={styles.info}>i</span>
      <div className={styles.infoBox}>{infoString || ''}</div>
    </div>
  );
}
