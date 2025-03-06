import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  image: string;
  isFlipped: boolean;
  onClick: () => void;
  isClickable: boolean;
}

const Card: React.FC<CardProps> = ({ image, isFlipped, onClick, isClickable }) => {
  return (
    <div
      className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className={styles.front}>
        <img src={image} alt="card" />
      </div>
      <div className={styles.back}></div>
    </div>
  );
};

export default Card;