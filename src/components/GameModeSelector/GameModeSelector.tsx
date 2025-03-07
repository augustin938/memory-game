import styles from "./GameModeSelector.module.css";

interface GameModeSelectorProps {
  onSelectMode: (mode: number) => void;
}

export default function GameModeSelector({
  onSelectMode,
}: GameModeSelectorProps) {
  return (
    <div className={styles.selector}>
      <h2>Выберите режим игры:</h2>
      <button onClick={() => onSelectMode(2)}>2x2</button>
      <button onClick={() => onSelectMode(4)}>4x4</button>
      <button onClick={() => onSelectMode(6)}>6x6</button>
    </div>
  );
}
