import { useState } from 'react';
import Head from 'next/head';
import Command from '../components/command';
import { COMMANDS, SURROUNDING_TEXT } from '../utils/constants';
import classnames from 'classnames';

import styles from '../styles/home.module.scss';

export default function Home() {
  const [instructions, setInstructions] = useState([
    'M45,0',
    'L68,30',
    'C50,50,55,50,70,75',
    'L67,78',
    'C50,70,40,80,53,97',
    'L50,100',
    'C30,75,30,60,57,68',
    'L35,40',
    'Q60,25,38,0',
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
  const [fillColor, setFillColor] = useState('#0070f3');
  const onFillColorChange = e => {
    let input = e.target.value.trimStart();
    if (input[0] !== '#') {
      input = '#' + input;
    }
    setFillColor(input);
  };
  const onColorPickerChange = e => {
    setFillColor(e.target.value);
  };
  const svgText = () =>
    [
      SURROUNDING_TEXT[0],
      `${SURROUNDING_TEXT[1]}${fillColor}${SURROUNDING_TEXT[2]}`,
      '    ' + instructions.join(' '),
      ...SURROUNDING_TEXT.slice(3),
    ].join('\n');
  const onCopyClicked = () => navigator.clipboard.writeText(svgText());
  const onCopyPressed = e => {
    if ([' ', 'Enter'].includes(e.key)) {
      onCopyClicked();
    }
  };
  const onDownloadClicked = () => {
    const dataURI = `data:image/svg+xml,${encodeURIComponent(svgText())}`;
    const link = document.createElement('a');
    link.href = dataURI;
    link.download = 'filename.svg';
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
    <div className={styles.container}>
      <Head>
        <title>SVG Path Editor</title>
        <link
          rel='icon'
          href={`data:image/svg+xml,${encodeURIComponent(svgText())}`}
        />
      </Head>

      <h1 className={styles.heading}>SVG Path Editor</h1>
      <div className={styles.intro}>
        <p>
          SVG paths are specified as a list of commands. Each command describes
          a step along the path. This editor allows you to create an SVG by
          editing the individual commands that describe its shape.
        </p>
      </div>
      <main className={styles.main}>
        <div className={classnames(styles.section, styles.editor)}>
          <div>{SURROUNDING_TEXT[0]}</div>
          <div className={styles.indented}>
            {SURROUNDING_TEXT[1]}
            <input
              className={styles.fillColor}
              type='text'
              spellCheck='false'
              value={fillColor}
              onChange={onFillColorChange}
            />
            <span
              className={styles.colorPickerWrapper}
              style={{ background: fillColor }}
            >
              <input
                className={styles.colorPicker}
                type='color'
                onChange={onColorPickerChange}
                value={fillColor}
              />
            </span>
            {SURROUNDING_TEXT[2]}
          </div>
          {instructions.map((instruction, i) => {
            const {
              id,
              partNames,
              activePartIndex,
              relative,
              infoString,
            } = getCommandInfo(instruction, cursorPosition);
            return (
              <Command
                key={i}
                id={id}
                index={i}
                instruction={instruction}
                partNames={partNames}
                activePartIndex={activePartIndex}
                relative={relative}
                infoString={infoString}
                setCursorPosition={setCursorPosition}
                updateInstructions={updateInstructions}
                addCommand={addCommand}
                removeCommand={removeCommand}
              />
            );
          })}
          <div className={styles.indented}>{SURROUNDING_TEXT[3]}</div>
          <div>{SURROUNDING_TEXT[4]}</div>
          <div className={styles.buttonRow}>
            <button
              className={styles.copyButton}
              onMouseDown={onCopyClicked}
              onKeyDown={onCopyPressed}
            >
              Copy
            </button>
            <button
              className={styles.downloadButton}
              onMouseDown={onDownloadClicked}
              onKeyDown={onDownloadPressed}
            >
              Download
            </button>
          </div>
        </div>

        <div className={classnames(styles.section, styles.viewer)}>
          <div className={classnames(styles.coord, styles.coordXMin)}>0</div>
          <div className={classnames(styles.coord, styles.coordYMin)}>0</div>
          <div className={classnames(styles.coord, styles.coordXMax)}>100</div>
          <div className={classnames(styles.coord, styles.coordYMax)}>100</div>
          <svg
            className={styles.view}
            viewBox='0 0 100 100'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path fill={fillColor} d={instructions.join(' ')} />
          </svg>
        </div>
      </main>
      <div className={styles.learnMore}>
        <h2>Learn More</h2>
        <p>
          <a
            href='https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d'
            target='_blank'
          >
            MDN Docs on the d attribute
          </a>
        </p>
        <p>
          <a
            href='https://css-tricks.com/svg-path-syntax-illustrated-guide/'
            target='_blank'
          >
            The SVG `path` Syntax: An Illustrated Guide from CSS-Tricks
          </a>
        </p>
        <p>
          <a href='https://www.youtube.com/watch?v=9qen5CKjUe8' target='_blank'>
            Demystifyingish SVG paths from HTTP 203
          </a>
        </p>
        <p>
          <a href='https://svg-path-visualizer.netlify.app/' target='_blank'>
            SVG Path Visualizer
          </a>
        </p>
        <p>
          <a href='https://github.com/rfauver/svg_path_editor' target='_blank'>
            Source code on Github
          </a>
        </p>
      </div>
    </div>
  );
}

function getCommandInfo(string, cursorPosition) {
  const command = COMMANDS[string[0]?.toUpperCase()];
  if (!command) return {};
  const activePartIndex = (command.parts || []).findIndex(part =>
    (cursorPosition ? string.substring(0, cursorPosition) : '').match(part)
  );
  const relative = string[0]?.toLowerCase() === string[0];
  const infoString = relative ? command.infoRelative : command.infoAbsolute;
  return { ...command, id: string[0], activePartIndex, relative, infoString };
}
