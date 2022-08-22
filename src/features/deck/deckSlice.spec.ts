import deckReducer, { DeckState, draw } from './deckSlice';

jest.mock('idb/with-async-ittr');

const createExampleState = (): DeckState => ({
  data: {
    cards: [
      { id: 'card1', frontSide: 'card1 front', backSide: 'card1 back' },
      { id: 'card2', frontSide: 'card2 front', backSide: 'card2 back' },
      { id: 'card3', frontSide: 'card3 front', backSide: 'card3 back' },
      { id: 'card4', frontSide: 'card4 front', backSide: 'card4 back' },
      { id: 'card5', frontSide: 'card5 front', backSide: 'card5 back' },
    ],
    cardsByBoxes: {
      card1: 1,
      card2: 1,
      card3: 1,
      card4: 1,
      card5: 1,
    },
    drawCounter: 0,
    id: 'deck1',
    lastCard: '',
    sessionCounter: 0,
    sessionFinished: false,
    numberOfSessionCards: 0,
    title: 'Test deck',
  },
  loadStatus: 'idle',
  saveStatus: 'idle',
});

describe('deckSlice reducer', () => {
  it('state should not be changed by draw() action when session counter is zero', () => {
    const state = createExampleState();
    expect(deckReducer(state, draw())).toStrictEqual(state);
  });

  describe('learning session - first iteration', () => {
    let state: DeckState;

    beforeEach(() => {
      state = createExampleState();
      state.data.sessionCounter = 1;
    });

    it('first draw', () => {
      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(1);
      expect(state.data.lastCard).toBe('card1');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('second draw', () => {
      state.data.drawCounter = 1;
      state.data.lastCard = 'card1';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(2);
      expect(state.data.lastCard).toBe('card2');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('sixth draw', () => {
      state.data.drawCounter = 5;
      state.data.lastCard = 'card5';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(5);
      expect(state.data.lastCard).toBe('');
      expect(state.data.sessionFinished).toBe(true);
    });
  });

  describe('learning session - second iteration', () => {
    let state: DeckState;

    beforeEach(() => {
      state = createExampleState();
      state.data.sessionCounter = 2;
      state.data.cardsByBoxes = {
        card1: 1,
        card2: 2,
        card3: 1,
        card4: 1,
        card5: 1,
      }
    });

    it('first draw', () => {
      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(1);
      expect(state.data.lastCard).toBe('card1');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('second draw', () => {
      state.data.drawCounter = 1;
      state.data.lastCard = 'card1';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(2);
      expect(state.data.lastCard).toBe('card2');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('sixth draw', () => {
      state.data.drawCounter = 5;
      state.data.lastCard = 'card5';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(5);
      expect(state.data.lastCard).toBe('');
      expect(state.data.sessionFinished).toBe(true);
    });
  });

  describe('learning session - third iteration', () => {
    let state: DeckState;

    beforeEach(() => {
      state = createExampleState();
      state.data.sessionCounter = 3;
      state.data.cardsByBoxes = {
        card1: 1,
        card2: 2,
        card3: 1,
        card4: 1,
        card5: 1,
      }
    });

    it('first draw', () => {
      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(1);
      expect(state.data.lastCard).toBe('card1');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('second draw', () => {
      state.data.drawCounter = 1;
      state.data.lastCard = 'card1';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(2);
      expect(state.data.lastCard).toBe('card3');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('sixth draw', () => {
      state.data.drawCounter = 5;
      state.data.lastCard = 'card5';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(5);
      expect(state.data.lastCard).toBe('');
      expect(state.data.sessionFinished).toBe(true);
    });
  });

  describe('learning session - fourth iteration', () => {
    let state: DeckState;

    beforeEach(() => {
      state = createExampleState();
      state.data.sessionCounter = 4;
      state.data.cardsByBoxes = {
        card1: 1,
        card2: 2,
        card3: 3,
        card4: 1,
        card5: 2,
      }
    });

    it('first draw', () => {
      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(1);
      expect(state.data.lastCard).toBe('card1');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('second draw', () => {
      state.data.drawCounter = 1;
      state.data.lastCard = 'card1';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(2);
      expect(state.data.lastCard).toBe('card2');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('third draw', () => {
      state.data.drawCounter = 2;
      state.data.lastCard = 'card2';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(3);
      expect(state.data.lastCard).toBe('card3');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('sixth draw', () => {
      state.data.drawCounter = 5;
      state.data.lastCard = 'card5';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(5);
      expect(state.data.lastCard).toBe('');
      expect(state.data.sessionFinished).toBe(true);
    });
  });

  describe('learning session - fifth iteration', () => {
    let state: DeckState;

    beforeEach(() => {
      state = createExampleState();
      state.data.sessionCounter = 5;
      state.data.cardsByBoxes = {
        card1: 1,
        card2: 2,
        card3: 3,
        card4: 1,
        card5: 2,
      }
    });

    it('first draw', () => {
      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(1);
      expect(state.data.lastCard).toBe('card1');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('second draw', () => {
      state.data.drawCounter = 1;
      state.data.lastCard = 'card1';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(2);
      expect(state.data.lastCard).toBe('card4');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('third draw', () => {
      state.data.drawCounter = 2;
      state.data.lastCard = 'card4';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(2);
      expect(state.data.lastCard).toBe('');
      expect(state.data.sessionFinished).toBe(true);
    });
  });

  describe('learning session - ninth iteration', () => {
    let state: DeckState;

    beforeEach(() => {
      state = createExampleState();
      state.data.sessionCounter = 9;
      state.data.cardsByBoxes = {
        card1: 1,
        card2: 2,
        card3: 4,
        card4: 1,
        card5: 2,
      }
    });

    it('first draw', () => {
      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(1);
      expect(state.data.lastCard).toBe('card1');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('second draw', () => {
      state.data.drawCounter = 1;
      state.data.lastCard = 'card1';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(2);
      expect(state.data.lastCard).toBe('card3');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('third draw', () => {
      state.data.drawCounter = 2;
      state.data.lastCard = 'card3';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(3);
      expect(state.data.lastCard).toBe('card4');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('fourth draw', () => {
      state.data.drawCounter = 3;
      state.data.lastCard = 'card4';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(3);
      expect(state.data.lastCard).toBe('');
      expect(state.data.sessionFinished).toBe(true);
    });
  });

  describe('learning session - fourteenth iteration', () => {
    let state: DeckState;

    beforeEach(() => {
      state = createExampleState();
      state.data.sessionCounter = 14;
      state.data.cardsByBoxes = {
        card1: 1,
        card2: 4,
        card3: 5,
        card4: 1,
        card5: 2,
      }
    });

    it('first draw', () => {
      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(1);
      expect(state.data.lastCard).toBe('card1');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('second draw', () => {
      state.data.drawCounter = 1;
      state.data.lastCard = 'card1';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(2);
      expect(state.data.lastCard).toBe('card3');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('third draw', () => {
      state.data.drawCounter = 2;
      state.data.lastCard = 'card3';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(3);
      expect(state.data.lastCard).toBe('card4');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('fourth draw', () => {
      state.data.drawCounter = 3;
      state.data.lastCard = 'card4';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(4);
      expect(state.data.lastCard).toBe('card5');
      expect(state.data.sessionFinished).toBe(false);
    });

    it('fifth draw', () => {
      state.data.drawCounter = 4;
      state.data.lastCard = 'card5';

      state = deckReducer(state, draw());
      expect(state.data.drawCounter).toBe(4);
      expect(state.data.lastCard).toBe('');
      expect(state.data.sessionFinished).toBe(true);
    });
  });
});
