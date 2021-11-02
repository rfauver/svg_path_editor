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
  addCommand,
  removeCommand,
}) {
  const onInputChange = e =>
    updateInstructions(index, e.target.value.trimStart());
  const onCursorChange = e => setCursorPosition(e.target.selectionStart);
  const addCommandClicked = () => addCommand(index);
  const removeCommandClicked = () => removeCommand(index);
  return (
    <div className={styles.component}>
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
          checked={instruction[0]?.toLowerCase() === instruction[0]}
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
      />
      <button
        className={classnames(styles.button, styles.removeButton)}
        name='Remove'
        onMouseDown={removeCommandClicked}
      />
    </div>
  );
}
