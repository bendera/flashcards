import { FC, MouseEventHandler, SyntheticEvent, useState } from 'react';
import { ItemPredicate, ItemRenderer, Select } from '@blueprintjs/select';
import { Button, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { nanoid } from 'nanoid';

export interface SimpleSelectOption {
  label: string;
  value: string;
}

const BpSelect = Select.ofType<SimpleSelectOption>();

const escapeRegExpChars = (text: string) => {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
};

const highlightText = (text: string, query: string) => {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
};

const renderItem: ItemRenderer<SimpleSelectOption> = (
  item,
  { handleClick, modifiers, query }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      // label={item.label}
      key={item.value}
      onClick={handleClick}
      text={highlightText(item.label, query)}
    />
  );
};

const filterItem: ItemPredicate<SimpleSelectOption> = (
  query,
  item,
  _index,
  exactMatch
) => {
  const normalizedTitle = item.label.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return normalizedTitle.indexOf(normalizedQuery) >= 0;
  }
};

export const renderNewItem = (
  query: string,
  active: boolean,
  handleClick: MouseEventHandler<HTMLElement>
) => (
  <MenuItem
    icon={IconNames.ADD}
    text={`Create "${query}"`}
    active={active}
    onClick={handleClick}
    shouldDismissPopover={true}
  />
);

const createNewItemFromQuery = (label: string): SimpleSelectOption => {
  return {
    label,
    value: nanoid(),
  };
};

interface SimpleSelectProps {
  options: SimpleSelectOption[];
  onChange?: (
    item: SimpleSelectOption,
    event?: SyntheticEvent<HTMLElement, Event> | undefined
  ) => void;
}

const SimpleSelect: FC<SimpleSelectProps> = ({
  options,
  onChange = () => {
    return;
  },
}) => {
  const [label, setLabel] = useState(options[0].label);
  const [query, setQuery] = useState<string>();

  const handleChange = (
    item: SimpleSelectOption,
    event?: SyntheticEvent<HTMLElement, Event>
  ) => {
    console.log('handleChange');
    setQuery('');
    setLabel(item.label);
    onChange(item, event);
  };

  const handleActiveItemChange = (a: any) => {
    console.log('handleActiveItemChange')
    setQuery('');
  };

  return (
    <BpSelect
      resetOnQuery={true}
      items={options}
      itemRenderer={renderItem}
      itemPredicate={filterItem}
      createNewItemRenderer={renderNewItem}
      createNewItemFromQuery={createNewItemFromQuery}
      onItemSelect={handleChange}
      onActiveItemChange={handleActiveItemChange}
      noResults={<MenuItem disabled={true} text="No results." />}
      query={query}
    >
      <Button text={label} rightIcon={IconNames.DOUBLE_CARET_VERTICAL} />
    </BpSelect>
  );
};

export default SimpleSelect;
