import styles from "./GameStatus.module.css";

interface GameStatusProps {
  isGamePaused: boolean;
  gameType: "normal" | "reverse" | "endless";
  showCongratulations: boolean;
  showTimeUpModal: boolean;
  rounds: number;
  
  onEndGame?: () => void;
  onNewGame: () => void;
  onReturnToMainMenu: () => void;
}


export default function GameStatus({
  isGamePaused,
  gameType,
  showCongratulations,
  showTimeUpModal,
  rounds,
}: GameStatusProps) {
  if (showCongratulations) {
    return (
      <div className={styles.gameFinished} data-testid="game-status">
        {isGamePaused ? (
          gameType === "endless" ? (
            <>
              <h2>Игра завершена! Раундов: {rounds}</h2>
            </>
          ) : (
            <h2>Игра на паузе</h2>
          )
        ) : gameType === "endless" ? (
          
          <h2>Раунд {rounds} завершен!</h2>
        ) : (
          <h2>Поздравляем! Вы выиграли!</h2>
        )}
      </div>
    );
  }


  if (showTimeUpModal) {
    return (
      <div className={styles.gameFinished}>
        <h2>Время вышло!</h2>
      </div>
    );
  }

  return null;
}