import { useState } from 'react';

import styles from '../styles/button_row.module.scss';

export default function ButtonRow({ svgText, commands, setInstructions }) {
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
    setInstructions(commands.map(command => command.absoluteInstruction()));
  };
  const onRelativeClicked = e => {
    if (e && e.button !== 0) return;
    setInstructions(commands.map(command => command.relativeInstruction()));
  };

  const onPress = clickHandler => e => {
    if ([' ', 'Enter'].includes(e.key)) {
      clickHandler();
    }
  };

  return (
    <div className={styles.component}>
      <button
        name='Convert to Absolute'
        onClick={onAbsoluteClicked}
        onKeyDown={onPress(onAbsoluteClicked)}
      >
        Convert to Absolute
      </button>
      <button
        name='Convert to Relative'
        onClick={onRelativeClicked}
        onKeyDown={onPress(onRelativeClicked)}
      >
        Convert to Relative
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
