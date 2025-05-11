import styles from "./GameTypeSelector.module.css";
import { GameType } from "../../App";
import Button from "../Button/Button";

interface GameTypeSelectorProps {
  onReturnToMainMenu: () => void;
  onSelectGameType: (type: GameType) => void;
}

export default function GameTypeSelector({ onSelectGameType, onReturnToMainMenu}: GameTypeSelectorProps) {
  return (
    <div className={styles.gameTypeSelector}>
      <h2>Выберите тип игры</h2>
      <Button onClick={() => onSelectGameType("normal")}>Обычный</Button>
      <Button onClick={() => onSelectGameType("reverse")}>Таймер наоборот</Button>
      <Button onClick={() => onSelectGameType("endless")}>Бесконечная игра</Button>
      <Button onClick={()=> onReturnToMainMenu()}>Назад</Button>
    </div>
  );
}