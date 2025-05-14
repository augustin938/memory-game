import { cardSets } from "../components/cardSets ";

export type GameType = "normal" | "reverse" | "endless";

export interface CardData {
  id: number;
  image: string;
  isFlipped: boolean;
}

export interface GameStats {
  mode: number;
  type: GameType;
  time: number;
  moves: number;
  rounds?: number;
  date: string;
  stopped?: boolean;
}

export interface TimerProps {
  time: number; 
  timeLeft?: number; 
  timerType: GameType;
}

export interface ScoreProps {
  moves: number;
}

export interface GameTypeSelectorProps {
  onReturnToMainMenu: () => void;
  onSelectGameType: (type: GameType) => void;
}

export interface GameStatusProps {
  isGamePaused: boolean;
  gameType: GameType;
  showCongratulations: boolean;
  showTimeUpModal: boolean;
  rounds: number;
  onEndGame?: () => void;
  onNewGame: () => void;
  onReturnToMainMenu: () => void;
}

export interface GameModeSelectorProps {
  onSelectMode: (mode: number) => void;
}

export interface GameInfoProps {
  time: number;
  timeLeft?: number;
  timerType: GameType;
  moves: number;
  rounds: number;
}

export interface GameControlsProps {
  onNewGame: () => void;
  onReturnToMainMenu: () => void;
  onPauseGame: () => void;
  onEndGame?: () => void;
  isGamePaused: boolean;
  gameType: GameType;
}


export interface GameBoardProps {
  cards: CardData[];
  onCardClick: (id: number) => void;
  mode: number;
  isClickable: boolean;
}

export interface CardSetSelectorProps {
  onSelectCardSet: (set: keyof typeof cardSets) => void;
}

export interface CardProps {
  image: string;
  isFlipped: boolean;
  onClick: () => void;
  isClickable: boolean;
}