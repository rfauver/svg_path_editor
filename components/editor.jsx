import ButtonRow from '../components/button_row';
import ColorPicker from '../components/color_picker';
import Command from '../components/command';
import { SURROUNDING_TEXT } from '../utils/constants';

import styles from '../styles/editor.module.scss';

export default function Editor({
  commands,
  fillColor,
  svgText,
  setFillColor,
  setCursorPosition,
  setInstructions,
  updateInstructions,
  addCommand,
  removeCommand,
}) {
  return (
    <div className={styles.component}>
      <div>{SURROUNDING_TEXT[0]}</div>
      <div className={styles.indented}>
        {SURROUNDING_TEXT[1]}
        <ColorPicker fillColor={fillColor} setFillColor={setFillColor} />
        {SURROUNDING_TEXT[2]}
      </div>
      {commands.map((command, index) => (
        <Command
          key={index}
          index={index}
          command={command}
          setCursorPosition={setCursorPosition}
          updateInstructions={updateInstructions}
          addCommand={addCommand}
          removeCommand={removeCommand}
        />
      ))}
      <div className={styles.indented}>{SURROUNDING_TEXT[3]}</div>
      <div>{SURROUNDING_TEXT[4]}</div>
      <ButtonRow
        svgText={svgText}
        commands={commands}
        setInstructions={setInstructions}
      />
    </div>
  );
}
