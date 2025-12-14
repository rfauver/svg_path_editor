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
  setHoveredIndex,
  setActiveIndex,
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

  const onFocus = () => setActiveIndex(index);
  const onBlur = () => setActiveIndex(null);
  const onInputFocus = e => {
    onCursorChange(e);
    onFocus();
  };

  const [infoOpen, setInfoOpen] = useState(false);
  return (
    <div
      className={classnames(`command-${index}`, styles.component, {
        [styles.highlighted]: infoOpen,
      })}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className={styles.commandLine}>
        <input
          className={classnames('instruction', styles.instruction)}
          value={command.instruction}
          onChange={onInputChange}
          onKeyUp={onKeyUp}
          onMouseUp={onCursorChange}
          onFocus={onInputFocus}
          onBlur={onBlur}
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
        <div className={styles.controls}>
          <select
            className={styles.dropdown}
            name='path'
            onChange={e => updateInstructions(index, e.target.value)}
            value={command.letter?.toUpperCase()}
            onFocus={onFocus}
            onBlur={onBlur}
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
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <div className={styles.toggleSwitch} />
          </label>
          <div className={styles.buttons}>
            <button
              className={classnames(styles.button, styles.addButton)}
              name='Add'
              onMouseDown={addCommandClicked}
              onKeyDown={addCommandPressed}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <button
              className={classnames(styles.button, styles.removeButton)}
              name='Remove'
              onMouseDown={removeCommandClicked}
              onKeyDown={removeCommandPressed}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          <span className={styles.info} onClick={() => setInfoOpen(!infoOpen)}>
            i
          </span>
        </div>
      </div>
      {infoOpen && (
        <div className={styles.infoBox}>
          <div className={styles.infoString}>{command.infoString() || ''}</div>
          <div>
            <a href={command.properties.link} target='_blank'>
              Learn more
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
