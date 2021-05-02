import { useState } from 'react';
import Head from 'next/head';
import Command from '../components/command';
import { COMMANDS } from '../utils/constants';
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
  const addCommand = () => {
    setInstructions([...instructions, '']);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <div className={classnames(styles.section, styles.editor)}>
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
              />
            );
          })}
          <button onMouseDown={addCommand}>Add</button>
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
  const command = COMMANDS[string[0]];
  if (!command) return {};
  const activePartIndex = (command.parts || []).findIndex(part =>
    (cursorPosition ? string.substring(0, cursorPosition) : '').match(part)
  );
  return { ...command, id: string[0], activePartIndex };
}
