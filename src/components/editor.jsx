import ColorPicker from '../components/color_picker';
import Command from '../components/command';
import { firstLine } from '../utils/constants';

import styles from '../styles/editor.module.scss';

export default function Editor({
  commands,
  fillColor,
  setFillColor,
  setCursorPosition,
  updateInstructions,
  addCommand,
  removeCommand,
  setHoveredIndex,
  setActiveIndex,
  maxCoord,
}) {
  return (
    <div className={styles.component}>
      <div>{firstLine(maxCoord)}</div>
      <div className={styles.indented}>
        {'<path fill="'}
        <ColorPicker fillColor={fillColor} setFillColor={setFillColor} />
        {'" d="'}
      </div>
      {commands.map((command, index) => (
        <Command
          key={command.uuid}
          index={index}
          command={command}
          setCursorPosition={setCursorPosition}
          updateInstructions={updateInstructions}
          addCommand={addCommand}
          removeCommand={removeCommand}
          setHoveredIndex={setHoveredIndex}
          setActiveIndex={setActiveIndex}
        />
      ))}
      <div className={styles.indented}>{'"></path>'}</div>
      <div>{'</svg>'}</div>
    </div>
  );
}
