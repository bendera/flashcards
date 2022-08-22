import { FC, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import NewlineToBr from './NewlineToBr';
import styles from './PaperCard.module.css';

interface PaperCardProps {
  frontSide: string;
  backSide: string;
  exitAnimationType: 'swipeLeft' | 'swipeRight';
  show: boolean;
  className?: string;
}

const PaperCard: FC<PaperCardProps> = ({
  frontSide,
  backSide,
  exitAnimationType = 'swipeLeft',
  show = false,
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
      in={show}
      timeout={0}
      classNames={{
        enter: styles.fadeInEnter,
        enterActive: styles.fadeInEnterActive,
        enterDone: styles.fadeInEnterDone,
        exit: styles[`${exitAnimationType}Enter`],
        exitActive: styles[`${exitAnimationType}EnterActive`],
        exitDone: styles[`${exitAnimationType}EnterDone`],
      }}
    >
      <div className={cn(styles.root, className)}>
        <div className={cn([styles.animation])}>
          <div
            className={cn(styles.card, { [styles.isFlipped]: flipped })}
            onClick={onCardClick}
            role="button"
            tabIndex={0}
          >
            <div className={styles.sides}>
              <div className={cn(styles.side, styles.front)}>
                <NewlineToBr text={frontSide} />
              </div>
              <div className={cn(styles.side, styles.back)}>
                <NewlineToBr text={backSide} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default PaperCard;
