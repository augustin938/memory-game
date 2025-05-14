import styles from "./GameTypeSelector.module.css";
import Button from "../Button/Button";
import { GameTypeSelectorProps } from "../../types/types";

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