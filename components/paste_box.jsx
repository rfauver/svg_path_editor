import { useEffect, useRef } from 'react';
import { COMMANDS, SEPARATOR } from '../utils/constants';
import withUuids from '../utils/withUuids';

import styles from '../styles/paste_box.module.scss';

export default function PasteBox({ setInstructions }) {
  const pasteBoxRef = useRef(null);

  useEffect(() => {
    if (pasteBoxRef.current) {
      pasteBoxRef.current.focus();
    }
  }, [pasteBoxRef]);

  const handlePasteChange = e => {
    const input = e.target.value;
    if (input.trim() === '') return;

    const commandChars = Object.keys(COMMANDS).join('');
    const parts = (input + ' ')
      .match(new RegExp(`[${commandChars}][^${commandChars}]+`, 'gi'))
      .map(part => {
        const letter = part[0];

        if (letter.toUpperCase() === 'Z') {
          return ['Z'];
        }
        const rest = part.slice(1).trim();
        const coords = rest.split(SEPARATOR);
        if (coords.some(coord => coord.trim() === '')) {
          return null;
        }
        const groupLength = COMMANDS[letter.toUpperCase()].partNames.length;
        const grouped = coords.reduce((groups, coord, i) => {
          i % groupLength !== 0
            ? groups[groups.length - 1].push(coord)
            : groups.push([coord]);
          return groups;
        }, []);
        if (grouped.some(group => group.length !== groupLength)) {
          return null;
        }
        return grouped.map(group => `${letter}${group.join(',')}`);
      })
      .flat(1);

    if (parts.length > 0 && parts.every(Boolean)) {
      setInstructions(withUuids(parts));
    }
  };

  return (
    <textarea
      className={styles.component}
      ref={pasteBoxRef}
      placeholder='Paste in an svg path (everything inside the d= attribute of a <path>)'
      onChange={handlePasteChange}
    />
  );
}
