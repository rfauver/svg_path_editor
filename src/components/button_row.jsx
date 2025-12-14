import { useState } from 'react';
import { useWindowSize } from '../utils/hooks/useWindowSize';

import styles from '../styles/button_row.module.scss';

export default function ButtonRow({ svgText, commands, setInstructions }) {
  const windowSize = useWindowSize();
  const [copyText, setCopyText] = useState('Copy');
  const [copyTimeout, setCopyTimeout] = useState(null);
  const onCopyClicked = e => {
    if (e && e.button !== 0) return;
    navigator.clipboard.writeText(svgText);
    if (copyTimeout) clearTimeout(copyTimeout);
    setCopyText('Copied!');
    setCopyTimeout(setTimeout(() => setCopyText('Copy'), 2000));
  };
  const onDownloadClicked = e => {
    if (e && e.button !== 0) return;
    const dataURI = `data:image/svg+xml,${encodeURIComponent(svgText)}`;
    const link = document.createElement('a');
    link.href = dataURI;
    link.download = 'path_editor.svg';
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };
  const onAbsoluteClicked = e => {
    if (e && e.button !== 0) return;
    setInstructions(
      commands.map(command => ({
        raw: command.absoluteInstruction(),
        uuid: command.uuid,
      }))
    );
  };
  const onRelativeClicked = e => {
    if (e && e.button !== 0) return;
    setInstructions(
      commands.map(command => ({
        raw: command.relativeInstruction(),
        uuid: command.uuid,
      }))
    );
  };

  const onPress = clickHandler => e => {
    if ([' ', 'Enter'].includes(e.key)) {
      clickHandler();
    }
  };

  const convertText = str =>
    windowSize.width > 500 ? `Convert to ${str}` : str;

  return (
    <div className={styles.component}>
      <button
        className={styles.convert}
        name='Convert to Absolute'
        onClick={onAbsoluteClicked}
        onKeyDown={onPress(onAbsoluteClicked)}
      >
        {convertText('Absolute')}
      </button>
      <button
        className={styles.convert}
        name='Convert to Relative'
        onClick={onRelativeClicked}
        onKeyDown={onPress(onRelativeClicked)}
      >
        {convertText('Relative')}
      </button>

      <button
        name='Copy'
        onClick={onCopyClicked}
        onKeyDown={onPress(onCopyClicked)}
      >
        {copyText}
      </button>
      <button
        name='Download'
        onClick={onDownloadClicked}
        onKeyDown={onPress(onDownloadClicked)}
      >
        Download
      </button>
    </div>
  );
}
