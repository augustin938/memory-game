import { GameControlsProps } from "../../types/types";
import Button from "../Button/Button";
import styles from "./GameControls.module.css";

export default function GameControls({
  onNewGame,
  onReturnToMainMenu,
  onPauseGame,
  onEndGame,
  isGamePaused,
  gameType,
}: GameControlsProps) {
  return (
    <div className={styles.gameControls}>
      <Button onClick={onReturnToMainMenu}>Главное меню</Button>
      <Button onClick={onNewGame}>Новая игра</Button>
      
      {(gameType === "reverse" || gameType === "normal") && (
        <Button 
          onClick={onPauseGame}
        >
          {isGamePaused ? "Продолжить" : "Пауза"}
        </Button>
      )}
      
      {gameType === "endless" && (
        <Button 
          onClick={onEndGame}
        >
          Завершить игру
        </Button>
        
      )}
    </div>
  );
}