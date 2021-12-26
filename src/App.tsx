import { useEffect } from 'react';
import logo from './logo.svg';
import { useAppDispatch } from './app/hooks';
import { Counter } from './features/counter/Counter';
import { addCards, loadDeck, saveDeck } from './features/deck/deckSlice';
import './App.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const action = addCards([
      { frontSide: 'esernyő', backSide: 'umbrella' },
      { frontSide: 'osztályterem', backSide: 'classroom' },
      { frontSide: 'finom, ízletes', backSide: 'delicious' },
    ]);

    // dispatch(action);
    dispatch(loadDeck());
  }, [dispatch]);

  const onSaveDeckClick = () => {
    dispatch(saveDeck());
  };

  return (
    <div className="App">
      <header className="App-header">
        <button type="button" onClick={onSaveDeckClick}>
          Save deck
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}

export default App;
