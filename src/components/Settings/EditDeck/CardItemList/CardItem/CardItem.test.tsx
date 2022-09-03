import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardItem from './CardItem';

describe('CardItem', () => {
  it('should render correctly with required props', () => {
    const { queryByTestId, container } = render(
      <CardItem
        card={{
          id: 'testId',
          frontSide: 'Test front',
          backSide: 'Test back',
          selected: true,
        }}
      />
    );

    const cb = queryByTestId('CardItem__checkbox') as HTMLInputElement;

    expect(cb?.checked).toBe(true);
    expect(container).toMatchSnapshot();
  });

  it('onChange should be called with proper params when checkbox is changed', () => {
    const changeHandler = jest.fn();

    const { queryByTestId } = render(
      <CardItem
        card={{
          id: 'testId',
          frontSide: 'Test front',
          backSide: 'Test back',
          selected: false,
        }}
        onChange={changeHandler}
      />
    );

    const cb = queryByTestId('CardItem__checkbox');
    cb!.click();

    expect(changeHandler).toHaveBeenCalledWith({
      backSide: 'Test back',
      frontSide: 'Test front',
      id: 'testId',
      selected: true,
    });
  });

  it('onChange should be called with proper params when sides are swapped', () => {
    const changeHandler = jest.fn();

    const { queryByTitle } = render(
      <CardItem
        card={{
          id: 'testId',
          frontSide: 'Test front',
          backSide: 'Test back',
          selected: false,
        }}
        onChange={changeHandler}
      />
    );

    const bt = queryByTitle('Swap sides');
    bt!.click();

    expect(changeHandler).toHaveBeenCalledWith({
      backSide: 'Test front',
      frontSide: 'Test back',
      id: 'testId',
      selected: false,
    });
  });

  it('onChange should be called with proper params when value of the front side textarea changed', async () => {
    const changeHandler = jest.fn();
    const user = userEvent.setup();
    const TYPED_TEXT = 'test';

    const { queryAllByRole } = render(
      <CardItem
        card={{
          id: 'testId',
          frontSide: '',
          backSide: 'Test back',
          selected: false,
        }}
        onChange={changeHandler}
      />
    );

    const ta = queryAllByRole('textbox')[0];
    await user.type(ta, TYPED_TEXT);

    expect(changeHandler).toHaveBeenCalledTimes(TYPED_TEXT.length);
    expect(changeHandler).toHaveBeenLastCalledWith({
      backSide: 'Test back',
      frontSide: 'test',
      id: 'testId',
      selected: false,
    });
  });

  it('onChange should be called with proper params when value of the back side textarea changed', async () => {
    const changeHandler = jest.fn();
    const user = userEvent.setup();
    const TYPED_TEXT = 'test';

    const { queryAllByRole } = render(
      <CardItem
        card={{
          id: 'testId',
          frontSide: 'Test front',
          backSide: '',
          selected: false,
        }}
        onChange={changeHandler}
      />
    );

    const textarea = queryAllByRole('textbox')[1];
    await user.type(textarea, TYPED_TEXT);

    expect(changeHandler).toHaveBeenCalledTimes(TYPED_TEXT.length);
    expect(changeHandler).toHaveBeenLastCalledWith({
      id: 'testId',
      frontSide: 'Test front',
      backSide: TYPED_TEXT,
      selected: false,
    });
  });

  it('onDelete should be called with proper params when card is removed', () => {
    const deleteHandler = jest.fn();

    const { queryByTitle } = render(
      <CardItem
        card={{
          id: 'testId',
          frontSide: 'Test front',
          backSide: 'Test back',
          selected: false,
        }}
        onDelete={deleteHandler}
      />
    );

    const bt = queryByTitle('Delete card');
    bt!.click();

    expect(deleteHandler).toHaveBeenCalledWith({
      backSide: 'Test back',
      frontSide: 'Test front',
      id: 'testId',
      selected: false,
    });
  });
});
