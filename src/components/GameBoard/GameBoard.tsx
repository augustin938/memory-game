import { GameBoardProps } from "../../types/types";
import Card from "../Card/Card";
import styles from "./GameBoard.module.css";


export default function GameBoard({ cards, onCardClick, mode, isClickable }: GameBoardProps) {
  return (
    <div className={styles.gameBoard} data-mode={mode}>
      {cards.map((card) => (
        <Card
          key={card.id}
          image={card.image}
          isFlipped={card.isFlipped}
          onClick={() => onCardClick(card.id)}
          isClickable={isClickable}
        />
      ))}
    </div>
  );
}