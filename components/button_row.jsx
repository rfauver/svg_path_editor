import { useState } from 'react';

import styles from '../styles/button_row.module.scss';

export default function ButtonRow({ svgText }) {
  const [copyText, setCopyText] = useState('Copy');
  const [copyTimeout, setCopyTimeout] = useState(null);
  const onCopyClicked = e => {
    if (e && e.button !== 0) return;
    navigator.clipboard.writeText(svgText);
    if (copyTimeout) clearTimeout(copyTimeout);
    setCopyText('Copied!');
    setCopyTimeout(setTimeout(() => setCopyText('Copy'), 2000));
  };
  const onCopyPressed = e => {
    if ([' ', 'Enter'].includes(e.key)) {
      onCopyClicked();
    }
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
  const onDownloadPressed = e => {
    if ([' ', 'Enter'].includes(e.key)) {
      onDownloadClicked();
    }
  };

  return (
    <div className={styles.component}>
      <button
        className={styles.copyButton}
        onMouseDown={onCopyClicked}
        onKeyDown={onCopyPressed}
      >
        {copyText}
      </button>
      <button
        className={styles.downloadButton}
        onMouseDown={onDownloadClicked}
        onKeyDown={onDownloadPressed}
      >
        Download
      </button>
    </div>
  );
}
