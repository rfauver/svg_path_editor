import styles from '../styles/color_picker.module.scss';

export default function ColorPicker({ fillColor, setFillColor }) {
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

  return (
    <>
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
    </>
  );
}
