import { FC } from 'react';
import styles from './Gauge.module.css';

interface GaugeProps {
  className?: string;
  percent?: number;
  radius?: number;
}

const Gauge: FC<GaugeProps> = ({
  percent = 0,
  radius = 50,
  className = 'Gauge',
}) => {
  const strokeWidth = radius * 0.2;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = innerRadius * 2 * Math.PI;
  const arcVisible = 0.75;
  const arcRotation = 135;
  const arc = circumference * arcVisible;
  const dashArray = `${arc} ${circumference}`;
  const transform = `rotate(${arcRotation}, ${radius}, ${radius})`;
  const offset = arc - (percent / 100) * arc;

  return (
    <svg height={radius * 2} width={radius * 2} className={className}>
      <circle
        className={styles.total}
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        transform={transform}
      />
      <circle
        className={styles.current}
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        strokeDashoffset={offset}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        transform={transform}
      />
    </svg>
  );
};

export default Gauge;
