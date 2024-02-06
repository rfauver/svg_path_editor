import { useState, useEffect } from 'react';
import Editor from '../components/editor';
import ExampleShapes from '../components/example_shapes';
import Head from '../components/head';
import LearnMore from '../components/learn_more';
import Viewer from '../components/viewer';
import ButtonRow from '../components/button_row';
import CommandModel from '../models/command_model';
import { SURROUNDING_TEXT, SHAPES } from '../utils/constants';
import withUuids from '../utils/withUuids';
import classnames from 'classnames';

import styles from '../styles/home.module.scss';

const toRaw = instructions => instructions.map(instruction => instruction.raw);

export default function Home() {
  const [instructions, setInstructions] = useState(
    withUuids(SHAPES.QUARTER_NOTE)
  );
  const [fillColor, setFillColor] = useState('#0070f3');
  const [cursorPosition, setCursorPosition] = useState(null);
  const [indexToFocus, setIndexToFocus] = useState(null);
  useEffect(() => {
    if (indexToFocus === null) return;

    const command = document.querySelectorAll('.instruction')[indexToFocus];
    command?.focus();

    setIndexToFocus(null);
  }, [indexToFocus]);
  const updateInstructions = (i, instruction) => {
    const newInstructions = [...instructions];
    newInstructions[i] = { ...newInstructions[i], raw: instruction };
    setInstructions(newInstructions);
  };
  const addCommand = index => {
    setInstructions([
      ...instructions.slice(0, index + 1),
      { raw: 'L', uuid: crypto.randomUUID() },
      ...instructions.slice(index + 1),
    ]);
    setIndexToFocus(index + 1);
  };
  const removeCommand = index => {
    if (instructions.length <= 1) {
      setInstructions(['M']);
      setIndexToFocus(0);
      return;
    }
    setInstructions([
      ...instructions.slice(0, index),
      ...instructions.slice(index + 1),
    ]);
  };
  const svgText = [
    SURROUNDING_TEXT[0],
    `${SURROUNDING_TEXT[1]}${fillColor}${SURROUNDING_TEXT[2]}`,
    '    ' + toRaw(instructions).join(' '),
    ...SURROUNDING_TEXT.slice(3),
  ].join('\n');

  let previousEndPoint, previousMEndPoint;
  const commands = instructions.map(instruction => {
    const command = new CommandModel(
      instruction.uuid,
      instruction.raw,
      cursorPosition,
      previousEndPoint,
      previousMEndPoint
    );
    previousEndPoint = command.endPoint();
    if (command.isA('M')) previousMEndPoint = previousEndPoint;

    const match = command.instruction.match(
      command.properties?.parts?.[command.properties.parts.length - 1]
    );
    if (match) {
      command.setPartValues(match.slice(1));
    }

    return command;
  });

  return (
    <div className={styles.container}>
      <Head instructions={toRaw(instructions)} svgText={svgText} />

      <h1 className={styles.heading}>SVG Path Editor</h1>
      <div className={styles.intro}>
        <p>
          SVG paths are specified as a list of commands. Each command describes
          a step along the path. This editor allows you to create an SVG by
          editing the individual commands that describe its shape.
        </p>
      </div>
      <ExampleShapes fillColor={fillColor} setInstructions={setInstructions} />
      <main className={classnames('main', styles.main)}>
        <div className={styles.sectionWrapper}>
          <div className={styles.section}>
            <Editor
              commands={commands}
              fillColor={fillColor}
              setFillColor={setFillColor}
              setCursorPosition={setCursorPosition}
              updateInstructions={updateInstructions}
              addCommand={addCommand}
              removeCommand={removeCommand}
            />
          </div>
          <ButtonRow
            svgText={svgText}
            commands={commands}
            setInstructions={setInstructions}
          />
        </div>

        <div className={classnames(styles.section, styles.viewer)}>
          <Viewer commands={commands} fillColor={fillColor} />
        </div>
      </main>
      <div className={styles.learnMore}>
        <LearnMore />
      </div>
    </div>
  );
}
