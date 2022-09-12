import formatText from './formatText';

describe('formatText', () => {
  it('HTML should be escaped', () => {
    const actual = formatText(
      '<a href="http://example.org?a=1&b=2">example</a>'
    );
    const expected =
      '&lt;a href=&quot;http://example.org?a=1&amp;b=2&quot;&gt;example&lt;/a&gt;';

    expect(actual).toBe(expected);
  });

  it('newlines should be converted to <br> tags', () => {
    const actual = formatText('line1\nline2');
    const expected = 'line1<br />line2';

    expect(actual).toBe(expected);
  });

  it('bold text format should be applied', () => {
    const actual = formatText('lorem *ipsum* dolor *sit* et *amur');
    const expected = 'lorem <b>ipsum</b> dolor <b>sit</b> et *amur';

    expect(actual).toBe(expected);
  });

  it('italic text format should be applied', () => {
    const actual = formatText('lorem _ipsum_ dolor _sit_ et _amur');
    const expected = 'lorem <i>ipsum</i> dolor <i>sit</i> et _amur';

    expect(actual).toBe(expected);
  });
});
