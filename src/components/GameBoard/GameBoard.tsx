import React from 'react';
import Card from '../Card/Card';
import styles from './GameBoard.module.css';

interface CardData {
  id: number;
  image: string;
  isFlipped: boolean;
}

interface GameBoardProps {
    cards: CardData[];
    onCardClick: (id: number) => void;
    mode: number;
  }
  
  const GameBoard: React.FC<GameBoardProps> = ({ cards, onCardClick, mode }) => {
    return (
      <div className={styles.gameBoard} data-mode={mode}>
        {cards.map((card) => (
          <Card
            key={card.id}
            image={card.image}
            isFlipped={card.isFlipped}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>
    );
  };

export default GameBoard;