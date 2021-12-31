import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import './Flashcard.css';

interface FlashcardProps {
  frontSide: string;
  backSide: string;
}

const Flashcard: React.FC<FlashcardProps> = ({
  frontSide,
  backSide,
}) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [frontSide, backSide]);

  const onCardClick = () => {
    setFlipped(!flipped);
  };

  const classes = cn('Flashcard', { isFlipped: flipped });

  return (
    <div
      className={classes}
      onClick={onCardClick}
      role="button"
      tabIndex={0}
    >
      <div className="Flashcard__sides">
        <div className="Flashcard__side Flashcard__front">{frontSide}</div>
        <div className="Flashcard__side Flashcard__back">{backSide}</div>
      </div>
    </div>
  );
};

export default Flashcard;
