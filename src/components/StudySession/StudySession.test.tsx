import { renderWithProviders, createInitialState } from 'utils/test-utils';
import StudySession from './StudySession';

describe('StudySession', () => {
  it('info text should be visible if there is no any deck', () => {
    const state = createInitialState();
    state.deckCatalog.loaded = true;
    state.deck.loaded = true;

    const { queryByText } = renderWithProviders(<StudySession />, {
      preloadedState: state,
    });

    expect(queryByText('There are no decks')).toBeInTheDocument();
    expect(
      queryByText('It seems you have not created any deck yet.')
    ).toBeInTheDocument();
    expect(queryByText('Create one')).toBeInTheDocument();
  });

  it('info text should be visible if there is no active deck', () => {
    const state = createInitialState();
    state.deckCatalog.loaded = true;
    state.deckCatalog.entities = {
      allIds: ['test'],
      byId: {
        test: {
          id: 'test',
          title: 'Test title',
          active: 0,
        },
      },
    };
    state.deck.loaded = true;

    const { queryByText } = renderWithProviders(<StudySession />, {
      preloadedState: state,
    });

    expect(queryByText('There is no active deck')).toBeInTheDocument();
    expect(
      queryByText('You should select a deck to start practicing.')
    ).toBeInTheDocument();
    expect(queryByText('Select one')).toBeInTheDocument();
  });

  it('info text should be visible if cards are out', () => {
    const state = createInitialState();
    state.deck.data.sessionFinished = true;
    state.deck.data.sessionCounter = 1;

    const { queryByText } = renderWithProviders(<StudySession />, {
      preloadedState: state,
    });

    expect(queryByText('Cards are out')).toBeInTheDocument();
    expect(queryByText('Start Session 2')).toBeInTheDocument();
  });

  it('first card should be visible when a new session is started', async () => {
    const state = createInitialState();
    state.deck.loaded = true;
    state.deck.data = {
      cards: [
        {
          backSide: 'card 1 back',
          frontSide: 'card 1 front',
          id: 'card1',
        },
        {
          backSide: 'card 2 back',
          frontSide: 'card 2 front',
          id: 'card2',
        },
      ],
      cardsByBoxes: {
        card1: 1,
        card2: 1,
      },
      drawCounter: 1,
      id: 'test1',
      lastCard: '',
      numberOfSessionCards: 2,
      sessionCounter: 0,
      sessionFinished: false,
      title: 'Test deck',
    };
    state.deckCatalog.loaded = true;
    state.deckCatalog.entities = {
      byId: {
        test1: {
          active: 1,
          id: 'test1',
          title: 'Test deck',
        },
      },
      allIds: ['test1'],
    };

    const { queryByText } = renderWithProviders(
      <StudySession />,
      {
        preloadedState: state,
      }
    );

    expect(queryByText('card 1 front')).toBeInTheDocument();
  });
});
