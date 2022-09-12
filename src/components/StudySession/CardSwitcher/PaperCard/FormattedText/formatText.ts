const nl2br = (text: string) => text.replace(/\n/gm, '<br />');

const htmlSpecialChars = (text: string) =>
  text
    .replace(/&/gm, '&amp;')
    .replace(/</gm, '&lt;')
    .replace(/>/gm, '&gt;')
    .replace(/"/gm, '&quot;')
    .replace(/'/gm, '&apos;');

const format = (text: string) =>
  text
    .replace(/(\*\s?)([^\n*]+)\*/gm, '<b>$2</b>')
    .replace(/(_{1}\s?)([^\n_]+)_/gm, '<i>$2</i>');

const formatText = (rawText: string) => {
  let formatted = '';

  formatted = htmlSpecialChars(rawText);
  formatted = nl2br(formatted);
  formatted = format(formatted);

  return formatted;
};

export default formatText;
