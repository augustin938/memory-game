import Button from "../Button/Button";
import styles from "./GameControls.module.css";

interface GameControlsProps {
  onNewGame: () => void;
  onReturnToMainMenu: () => void;
  onPauseGame: () => void;
  onEndGame?: () => void;
  isGamePaused: boolean;
  gameType: "normal" | "reverse" | "endless";
}

export default function GameControls({
  onNewGame,
  onReturnToMainMenu,
  onPauseGame,
  onEndGame,
  isGamePaused,
  gameType,
}: GameControlsProps) {
  return (
    <div className={styles.buttonContainer}>
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