import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import classnames from 'classnames';

export default function Home() {
  const [nodes, setNodes] = useState(['M0,0', 'L0,50', 'L50,50', 'Z']);
  const updateNodes = (i, command) => {
    const newNodes = [...nodes];
    newNodes[i] = command;
    setNodes(newNodes);
  };
  const addNode = () => {
    setNodes([...nodes, '']);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <div className={classnames(styles.section, styles.editor)}>
          {nodes.map((command, i) => {
            const { id, name, partNames, activePartIndex } = getCommandInfo(
              command
            );
            return (
              <div>
                <Dropdown
                  id={id}
                  onChange={e => updateNodes(i, e.target.value)}
                />
                <Node command={command} index={i} updateNodes={updateNodes} />
              </div>
            );
          })}
          <button onMouseDown={addNode}>Add</button>
        </div>

        <div className={classnames(styles.section, styles.viewer)}>
          <svg
            className={styles.view}
            viewBox='0 0 100 100'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
          >
            <path fill='#0070f3' d={nodes.join(' ')} />
          </svg>
        </div>
      </main>
    </div>
  );
}

function Node(props) {
  const onInputChange = e => {
    props.updateNodes(props.index, e.target.value);
  };
  return (
    <input
      className={styles.node}
      value={props.command}
      onChange={onInputChange}
    />
  );
}

function Dropdown(props) {
  return (
    <select className={styles.dropdown} name='path' onChange={props.onChange}>
      {Object.entries(commands).map(([id, command]) => (
        <option key={id} value={id} selected={props.id === id}>
          {command.name}
        </option>
      ))}
    </select>
  );
}

const commands = {
  M: {
    name: 'Abs Move to',
    parts: [/^M\s*\d*$/, /^M\s*\d+[, ]+\d*$/],
    partNames: ['move to X', 'move to Y'],
  },
  m: { name: 'Rel Move to' },
  L: { name: 'Abs Line' },
  l: { name: 'Rel Line' },
};
function getCommandInfo(string) {
  const command = commands[string[0]];
  if (!command) return {};
  const activePartIndex = (command.parts || []).findIndex(part =>
    string.match(part)
  );
  return { ...command, id: string[0], activePartIndex };
}
