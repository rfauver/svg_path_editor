import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Command from '../components/command';
import {
  COMMANDS,
  SURROUNDING_TEXT,
  DIGIT,
  SEPARATOR,
} from '../utils/constants';
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
  const [indexToFocus, setIndexToFocus] = useState(null);
  const updateInstructions = (i, instruction) => {
    const newInstructions = [...instructions];
    newInstructions[i] = instruction;
    setInstructions(newInstructions);
  };
  useEffect(() => {
    if (indexToFocus === null) return;

    const command = document.querySelectorAll('.instruction')[indexToFocus];
    command?.focus();

    setIndexToFocus(null);
  }, [indexToFocus]);
  const addCommand = index => {
    setInstructions([
      ...instructions.slice(0, index + 1),
      'L',
      ...instructions.slice(index + 1),
    ]);
    setIndexToFocus(index + 1);
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
  const [copyText, setCopyText] = useState('Copy');
  const onCopyClicked = () => {
    navigator.clipboard.writeText(svgText());
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Copy'), 2000);
  };
  const onCopyPressed = e => {
    if ([' ', 'Enter'].includes(e.key)) {
      onCopyClicked();
    }
  };
  const onDownloadClicked = () => {
    const dataURI = `data:image/svg+xml,${encodeURIComponent(svgText())}`;
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

  const pathEnds = getPathEnds(instructions);

  return (
    <div className={styles.container}>
      <Head>
        <title>SVG Path Editor</title>
        <meta
          name='description'
          content='Interactive tool to edit an SVG by editing the path commands that describe its shape'
        />
        <link
          rel='icon'
          href={`data:image/svg+xml,${encodeURIComponent(svgText())}`}
        />

        <style>
          {instructions
            .map(
              (_, i) =>
                `
                .highlight-${i} {
                  display: none;
                }

                .main:has(.command-${i}:focus-within) .highlight-${i},
                .main:has(.command-${i}:hover) .highlight-${i} {
                  display: inline;
                }
          `
            )
            .join('')}
        </style>
      </Head>
      {/* Fathom - simple website analytics */}
      {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
        <Script>
          {`(function(f, a, t, h, o, m){
            a[h]=a[h]||function(){
              (a[h].q=a[h].q||[]).push(arguments)
            };
            o=f.createElement('script'),
            m=f.getElementsByTagName('script')[0];
            o.async=1; o.src=t; o.id='fathom-script';
            m.parentNode.insertBefore(o,m)
          })(document, window, '//fathom-rfauver.herokuapp.com/tracker.js', 'fathom');
          fathom('set', 'siteId', 'RBTTM');
          fathom('trackPageview');`}
        </Script>
      )}
      {/* / Fathom */}

      <h1 className={styles.heading}>SVG Path Editor</h1>
      <div className={styles.intro}>
        <p>
          SVG paths are specified as a list of commands. Each command describes
          a step along the path. This editor allows you to create an SVG by
          editing the individual commands that describe its shape.
        </p>
      </div>
      <main className={classnames('main', styles.main)}>
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
              aria-label='hex color'
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
                aria-label='color picker'
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
            {instructions.map((_, i) =>
              getPathHighlight(instructions, pathEnds, i)
            )}
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

function getPathHighlight(instructions, pathEnds, index) {
  let pathString = '';
  if (instructions[index][0]?.toUpperCase() === 'M') {
    const end = getEndPoint(instructions[index]);
    if (end) {
      let x = end[0];
      let y = end[1];
      if (instructions[index][0]?.toLowerCase() === instructions[index][0]) {
        const previousEnd = pathEnds[index - 1] ? pathEnds[index - 1] : [0, 0];
        x += previousEnd[0];
        y += previousEnd[1];
      }
      return (
        <circle
          className={`highlight-${index}`}
          cx={x}
          cy={y}
          r='1'
          fill='red'
        />
      );
    }
  } else if (instructions[index - 1]) {
    const previousEndPoint = pathEnds[index - 1];
    if (previousEndPoint) {
      if (instructions[index][0]?.toUpperCase() === 'Z') {
        const previousMIndex = instructions
          .map(
            (instruction, i) =>
              instruction[0]?.toUpperCase() === 'M' && i < index
          )
          .lastIndexOf(true);
        pathString = `M${previousEndPoint} L${pathEnds[previousMIndex || 0]}`;
      } else {
        pathString = `M${previousEndPoint} ${instructions[index]}`;
      }
    }
  }
  return (
    <path
      className={`highlight-${index}`}
      stroke='red'
      fill='none'
      strokeWidth='1'
      strokeDasharray='2,1.2'
      d={pathString}
    />
  );
}

function getPathEnds(instructions) {
  const pathEnds = [];
  instructions.forEach((instruction, i) => {
    if (instruction[0]?.toUpperCase() === 'Z') {
      const previousMIndex = instructions
        .map((instruction, j) => instruction[0]?.toUpperCase() === 'M' && j < i)
        .lastIndexOf(true);
      pathEnds.push(pathEnds[previousMIndex]);
      return;
    }

    const end = getEndPoint(instruction);

    if (!end || instruction[0].toUpperCase() === instruction[0]) {
      pathEnds.push(end);
    } else {
      const previousEnd = pathEnds[i - 1] ? pathEnds[i - 1] : [0, 0];
      pathEnds.push([end[0] + previousEnd[0], end[1] + previousEnd[1]]);
    }
  });
  return pathEnds;
}

function getEndPoint(instruction) {
  const match = instruction.match(
    new RegExp(`(${DIGIT.source})${SEPARATOR.source}(${DIGIT.source})$`)
  );
  if (!match) return null;
  return match.slice(1, 3).map(point => parseFloat(point));
}
