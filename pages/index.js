import { useState } from 'react';
import Head from 'next/head';
import Command from '../components/command';
import { COMMANDS, SURROUNDING_TEXT } from '../utils/constants';
import classnames from 'classnames';

import styles from '../styles/home.module.scss';

export default function Home() {
  const [instructions, setInstructions] = useState([
    'M0,0',
    'L0,50',
    'L50,50',
    'Z',
  ]);
  const [cursorPosition, setCursorPosition] = useState(null);
  const updateInstructions = (i, instruction) => {
    const newInstructions = [...instructions];
    newInstructions[i] = instruction;
    setInstructions(newInstructions);
  };
  const addCommand = index => {
    setInstructions([
      ...instructions.slice(0, index + 1),
      'L',
      ...instructions.slice(index + 1),
    ]);
  };
  const removeCommand = index => {
    setInstructions([
      ...instructions.slice(0, index),
      ...instructions.slice(index + 1),
    ]);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <div className={classnames(styles.section, styles.editor)}>
          <div>{SURROUNDING_TEXT[0]}</div>
          <div className={styles.indented}>{SURROUNDING_TEXT[1]}</div>
          {instructions.map((instruction, i) => {
            const { id, partNames, activePartIndex } = getCommandInfo(
              instruction,
              cursorPosition
            );
            return (
              <Command
                key={i}
                id={id}
                index={i}
                instruction={instruction}
                partNames={partNames}
                activePartIndex={activePartIndex}
                setCursorPosition={setCursorPosition}
                updateInstructions={updateInstructions}
                addCommand={addCommand}
                removeCommand={removeCommand}
              />
            );
          })}
          <div className={styles.indented}>{SURROUNDING_TEXT[2]}</div>
          <div>{SURROUNDING_TEXT[3]}</div>
          <button
            onMouseDown={() =>
              navigator.clipboard.writeText(
                [
                  ...SURROUNDING_TEXT.slice(0, 2),
                  '    ' + instructions.join(' '),
                  ...SURROUNDING_TEXT.slice(2),
                ].join('\n')
              )
            }
          >
            Copy
          </button>
        </div>

        <div className={classnames(styles.section, styles.viewer)}>
          <svg
            className={styles.view}
            viewBox='0 0 100 100'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
          >
            <path fill='#0070f3' d={instructions.join(' ')} />
          </svg>
        </div>
      </main>
    </div>
  );
}

function getCommandInfo(string, cursorPosition) {
  const command = COMMANDS[string[0]?.toUpperCase()];
  if (!command) return {};
  const activePartIndex = (command.parts || []).findIndex(part =>
    (cursorPosition ? string.substring(0, cursorPosition) : '').match(part)
  );
  return { ...command, id: string[0], activePartIndex };
}
