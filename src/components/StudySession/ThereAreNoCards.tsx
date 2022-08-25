import { FC } from 'react';
import { Button, Intent, NonIdealState } from '@blueprintjs/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { startNextSession } from 'features/deck/deckSlice';
import { selectSessionCounter } from 'features/deck/selectors';

const ThereAreNoCards: FC = () => {
  const dispatch = useAppDispatch();
  const sessionCounter = useAppSelector(selectSessionCounter);
  const sessionFinished = useAppSelector(
    (state) => state.deck.data.sessionFinished
  );

  const startNewSession = () => {
    dispatch(startNextSession());
  };

  return sessionFinished ? (
    <NonIdealState
      title="Cards are out"
      action={
        <Button
          intent={Intent.PRIMARY}
          large
          onClick={() => {
            startNewSession();
          }}
        >
          Start Session {sessionCounter + 1}
        </Button>
      }
    />
  ) : null;
};

export default ThereAreNoCards;
