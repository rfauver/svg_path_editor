import { useState } from 'react';
import { COMMANDS } from '../utils/constants';
import classnames from 'classnames';

import styles from '../styles/command.module.scss';

export default function Command({
  command,
  index,
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

  const [infoOpen, setInfoOpen] = useState(false);
  return (
    <div
      className={classnames(`command-${index}`, styles.component, {
        [styles.highlighted]: infoOpen,
      })}
    >
      <div className={styles.commandLine}>
        <input
          className={classnames('instruction', styles.instruction)}
          value={command.instruction}
          onChange={onInputChange}
          onKeyUp={onKeyUp}
          onMouseUp={onCursorChange}
          onFocus={onCursorChange}
          aria-label={`path command ${index + 1}`}
        />
        {command.properties?.partNames && (
          <div className={styles.annotation}>
            (
            {command.properties.partNames.map((partName, i) => (
              <span
                key={i}
                className={classnames(styles.partName, {
                  [styles.partNameActive]: i === command.activePartIndex(),
                })}
              >
                {partName}
                {i < command.properties.partNames.length - 1 ? ', ' : ''}
              </span>
            ))}
            )
          </div>
        )}
        <select
          className={styles.dropdown}
          name='path'
          onChange={e => updateInstructions(index, e.target.value)}
          value={command.letter?.toUpperCase()}
        >
          {Object.entries(COMMANDS).map(([commandLetter, command]) => (
            <option key={commandLetter} value={commandLetter}>
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
            checked={command.isRelative()}
            onChange={e =>
              updateInstructions(
                index,
                e.target.checked
                  ? command.instruction.toLowerCase()
                  : command.instruction.toUpperCase()
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
        <span className={styles.info} onClick={() => setInfoOpen(!infoOpen)}>
          i
        </span>
      </div>
      {infoOpen && (
        <div className={styles.infoBox}>{command.infoString() || ''}</div>
      )}
    </div>
  );
}
