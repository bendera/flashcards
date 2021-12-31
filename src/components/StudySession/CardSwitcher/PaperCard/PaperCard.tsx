import { FC, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import styles from './PaperCard.module.css';

interface PaperCardProps {
  frontSide: string;
  backSide: string;
  animationType?: 'fadeIn' | 'swipeLeft' | 'swipeRight';
  animate?: boolean;
  className?: string;
}

const PaperCard: FC<PaperCardProps> = ({
  frontSide,
  backSide,
  animationType = 'fadeIn',
  animate = false,
  className,
}) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [frontSide, backSide]);

  const onCardClick = () => {
    setFlipped(!flipped);
  };

  return (
    <div className={cn(styles.root, styles[animationType], className)}>
      <CSSTransition
        in={animate}
        timeout={0}
        classNames={{
          appear: 'appear',
          appearActive: 'appearActive',
          appearDone: 'appearDone',
          enter: styles[`${animationType}Enter`],
          enterActive: styles[`${animationType}EnterActive`],
          enterDone: styles[`${animationType}EnterDone`],
          exit: styles[`${animationType}Enter`],
          exitActive: styles[`${animationType}EnterActive`],
          exitDone: styles[`${animationType}EnterDone`],
        }}
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
      </CSSTransition>
    </div>
  );
};

export default PaperCard;
