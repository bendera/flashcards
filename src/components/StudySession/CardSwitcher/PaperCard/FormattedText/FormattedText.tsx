import { FC } from 'react';
import cn from 'classnames';
import styles from './FormattedText.module.css';
import formatText from './formatText';

const MAX_LARGE_CHARS_PER_LINE = 17;
const MAX_LARGE_LINES = 7;
const MAX_LARGE_CHARS = MAX_LARGE_CHARS_PER_LINE * MAX_LARGE_LINES;

interface FormattedTextProps {
  text: string;
}

const FormattedText: FC<FormattedTextProps> = ({ text }) => {
  if (!text) {
    return null;
  }

  const lines = text.split('\n');
  let requiredChars = 0;

  lines.forEach((l) => {
    if (l === '') {
      requiredChars += MAX_LARGE_CHARS_PER_LINE;
    } else {
      requiredChars += l.length;
    }
  });

  return (
    <span
      className={cn(styles.root, {
        [styles.smaller]: requiredChars > MAX_LARGE_CHARS,
      })}
      dangerouslySetInnerHTML={{ __html: formatText(text) }}
    ></span>
  );
};

export default FormattedText;
