import { FC, Fragment } from 'react';
import cn from 'classnames';
import styles from './FormattedText.module.css';

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

  // Using index as key is intentional here. Usually it's an anti-pattern but
  // in this case the data won't change in the component lifecycle and an unique 
  // id isn't available.
  return (
    <span className={cn({ [styles.smaller]: requiredChars > MAX_LARGE_CHARS })}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {line}
          <br />
        </Fragment>
      ))}
    </span>
  );
};

export default FormattedText;
