import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
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

    const cb = queryByTestId('CardItem__checkbox');

    expect(cb.checked).toBe(true);
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
    cb.click();

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
    bt.click();

    expect(changeHandler).toHaveBeenCalledWith({
      backSide: 'Test front',
      frontSide: 'Test back',
      id: 'testId',
      selected: false,
    })
  });

  it('onChange should be called with proper params when value of the front side textarea changed', () => {
    const changeHandler = jest.fn();

    const { queryAllByRole } = render(
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

    const ta = queryAllByRole('textbox')[0];
    userEvent.type(ta, 'Changed front');

    expect(changeHandler).toHaveBeenCalledTimes(13);
    expect(changeHandler).toHaveBeenLastCalledWith({
      backSide: 'Test back',
      frontSide: 'Changed front',
      id: 'testId',
      selected: false,
    })
  });

  it('onChange should be called with proper params when value of the back side textarea changed', () => {
    const changeHandler = jest.fn();

    const { queryAllByRole } = render(
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

    const ta = queryAllByRole('textbox')[1];
    userEvent.type(ta, 'Changed back');

    expect(changeHandler).toHaveBeenCalledTimes(12);
    expect(changeHandler).toHaveBeenLastCalledWith({
      backSide: 'Changed back',
      frontSide: 'Test front',
      id: 'testId',
      selected: false,
    })
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
    bt.click();

    expect(deleteHandler).toHaveBeenCalledWith({
      backSide: 'Test back',
      frontSide: 'Test front',
      id: 'testId',
      selected: false,
    })
  });
});
