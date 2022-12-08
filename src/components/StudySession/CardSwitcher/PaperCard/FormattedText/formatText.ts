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
    .replace(
      /(?<![/|<])\/(?!\/)([^/]+)(?<![/|<])\/(?!\/)/gm,
      '<span class="i">$1</span>'
    )
    .replace(
      /(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)/gm,
      '<span class="b">$1</span>'
    )
    .replace(/(?<!_)_(?!_)([^_]+)(?<!_)_(?!_)/gm, '<span class="u">$1</span>');

const formatText = (rawText: string) => {
  let formatted = '';

  formatted = htmlSpecialChars(rawText);
  formatted = format(formatted);
  formatted = nl2br(formatted);

  return formatted;
};

export default formatText;
