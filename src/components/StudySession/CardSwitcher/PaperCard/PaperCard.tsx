import { FC, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import styles from './PaperCard.module.css';

interface PaperCardProps {
  frontSide: string;
  backSide: string;
  exitAnimationType?: 'fadeIn' | 'swipeLeft' | 'swipeRight';
  enter?: boolean;
  className?: string;
}

const PaperCard: FC<PaperCardProps> = ({
  frontSide,
  backSide,
  exitAnimationType = 'swipeLeft',
  enter = false,
  className = '',
}) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [frontSide, backSide]);

  const onCardClick = () => {
    setFlipped(!flipped);
  };

  return (
    <CSSTransition
      appear
      in={enter}
      timeout={0}
      classNames={{
        appear: styles.appear,
        appearActive: styles.appearActive,
        appearDone: styles.appearDone,
        enter: styles.fadeInEnter,
        enterActive: styles.fadeInEnterActive,
        enterDone: styles.fadeInEnterDone,
        exit: styles[`${exitAnimationType}Enter`],
        exitActive: styles[`${exitAnimationType}EnterActive`],
        exitDone: styles[`${exitAnimationType}EnterDone`],
      }}
      onEnter={(el: HTMLElement) => {
        console.log(el.className);
      }}
      onEntering={(el: HTMLElement) => {
        console.log(el.className);
      }}
      onEntered={(el: HTMLElement) => {
        console.log(el.className);
      }}
      onExit={(el: HTMLElement) => {
        console.log(el.className);
      }}
      onExiting={(el: HTMLElement) => {
        console.log(el.className);
      }}
      onExited={(el: HTMLElement) => {
        console.log(el.className);
      }}
    >
      <div
        className={cn(
          styles.root,
          className
        )}
      >
        <div className={cn([styles.animation])}>
          <div
            className={cn(styles.card, { [styles.isFlipped]: flipped })}
            onClick={onCardClick}
            role="button"
            tabIndex={0}
          >
            <div className={styles.sides}>
              <div className={cn(styles.side, styles.front)}>{frontSide}</div>
              <div className={cn(styles.side, styles.back)}>{backSide}</div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default PaperCard;
