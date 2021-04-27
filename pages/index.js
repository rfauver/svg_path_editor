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
          {nodes.map((command, i) => <Node command={command} index={i} updateNodes={updateNodes}/>)}
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
    props.updateNodes(props.index, e.target.value.trim());
  };
  return (
    <input
      className={styles.node}
      value={props.command}
      onChange={onInputChange}
    />
  );
}
