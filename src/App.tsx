import { useState, useEffect} from "react";
import styles from "./App.module.css";
import Header from "./components/Header/Header";
import GameBoard from "./components/GameBoard/GameBoard";
import GameModeSelector from "./components/GameModeSelector/GameModeSelector";
import GameTypeSelector from "./components/GameTypeSelector/GameTypeSelector";
import CardSetSelector from "./components/CardSetSelector/CardSetSelector";
import GameControls from "./components/GameControls/GameControls";
import GameStatus from "./components/GameStatus/GameStatus";
import GameInfo from "./components/GameInfo/GameInfo";
import Button from "./components/Button/Button";
import PlayerStats from "./components/PlayerStats/PlayerStats";
import { cardSets } from "./components/cardSets ";
import { CardData, GameType, GameStats } from "./types/types";

export default function App() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isClickable, setIsClickable] = useState(true);

  const [moves, setMoves] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [time, setTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false); //поздравление
  const [showTimeUpModal, setShowTimeUpModal] = useState(false); //время вышло

  const [gameMode, setGameMode] = useState<number | null>(null);
  const [gameType, setGameType] = useState<GameType>("normal");
  const [cardSet, setCardSet] = useState<keyof typeof cardSets>("classic");
  const [initialTime, setInitialTime] = useState(0);
  const [showTimerTypeSelector, setShowTimerTypeSelector] = useState(false); // выбор типа таймера

  const [playerName, setPlayerName] = useState<string>("");
  const [showNameInput, setShowNameInput] = useState<boolean>(true);
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [showStats, setShowStats] = useState<boolean>(false);

  const generateCards = (mode: number) => {
    const totalCards = mode * mode;
    const selectedImages = cardSets[cardSet].slice(0, totalCards / 2);
    const pairedImages = [...selectedImages, ...selectedImages];

    const shuffledCards = pairedImages
      .map((image, index) => ({
        id: index + 1,
        image,
        isFlipped: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
  };

const handleNameSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const name = playerName.trim();
  
  if (name) {
    setPlayerName(name);
    setShowNameInput(false);
    
    const savedStats = localStorage.getItem(`memoryGameStats_${name}`);
    setGameStats(savedStats ? JSON.parse(savedStats) : []);
  }
};
    
               
  const handleModeSelect = (mode: number) => {
    let timeForMode = 0;
    if (mode === 2) timeForMode = 5;
    else if (mode === 4) timeForMode = 60;
    else if (mode === 6) timeForMode = 90;
    
    setInitialTime(timeForMode);
    setGameMode(mode);
    setShowTimerTypeSelector(true);
  };

  const handleGameTypeSelect = (type: GameType) => {
    setGameType(type);
    setShowTimerTypeSelector(false);
    generateCards(gameMode!);
    setIsGameStarted(false);
    setMoves(0);
    setTime(0);
    setTimeLeft(type === "reverse" ? initialTime : 0);
    setShowCongratulations(false);
    setRounds(0);
    setIsGamePaused(false);
    setShowTimeUpModal(false);
    setIsClickable(true);
  };
const addGameStats = (stats: Omit<GameStats, 'date'>) => {
  const newStat = {
    ...stats,
    date: new Date().toLocaleString(),
  };

  const savedStats = localStorage.getItem(`memoryGameStats_${playerName}`);
  const currentStats = savedStats ? JSON.parse(savedStats) : [];

  let updatedStats: GameStats[];
  
  if (stats.type === "endless") {
    updatedStats = [
      ...currentStats.filter((s: { type: string; }) => s.type !== "endless"),
      newStat
    ];
  } else {
    updatedStats = [...currentStats, newStat];
  }

  // Сохраняем ОБЯЗАТЕЛЬНО с привязкой к playerName
  localStorage.setItem(`memoryGameStats_${playerName}`, JSON.stringify(updatedStats));
  setGameStats(updatedStats);
};

const handleCardClick = (id: number) => {
  // клик не должен работать
  if (
    !isClickable || 
    cards.find((card) => card.id === id)?.isFlipped || 
    isGamePaused ||
    selectedCards.length >= 2 
  ) return;

  if (gameType === "reverse" && timeLeft <= 0) return;

  if (!isGameStarted) {
    setIsGameStarted(true);
  }

  setIsClickable(false);

  setCards((prevCards) =>
    prevCards.map((card) =>
      card.id === id ? { ...card, isFlipped: true } : card
    )
  );

  setSelectedCards((prevSelected) => [...prevSelected, id]);

  //сравниваем если 2 карты
  if (selectedCards.length === 1) {
    setMoves((prevMoves) => prevMoves + 1);
    const [firstCardId] = selectedCards;
    const firstCard = cards.find((card) => card.id === firstCardId);
    const secondCard = cards.find((card) => card.id === id);

    if (firstCard?.image === secondCard?.image) {
      setSelectedCards([]);
      setIsClickable(true);

      if (gameType === "reverse") {
        setTimeLeft((prevTime) => prevTime + 5); 
      }
    } else {
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCardId || card.id === id
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setSelectedCards([]);
        setIsClickable(true);
      }, 1000);
    }
  } else {
    setIsClickable(true);
  }
};
  const handleCardSetSelect = (set: keyof typeof cardSets) => {
    setCardSet(set);
    if (gameMode) {
      generateCards(gameMode);
    }
  };

  const handleNewGame = () => {
    if (gameMode) {
      generateCards(gameMode);
    }
    setSelectedCards([]);
    setMoves(0);
    setTime(0);
    setTimeLeft(gameType === "reverse" ? initialTime : 0);
    setIsGameStarted(false);
    setShowCongratulations(false);
    setIsGamePaused(false);
    setShowTimeUpModal(false);
    setIsClickable(true);
    
    if (gameType === "endless" && rounds > 0) {
      addGameStats({
        mode: gameMode!,
        type: gameType,
        time: time,
        moves: moves,
        rounds: rounds,
        stopped: true
      });
    }
    
    setRounds(0);
  };

  const handlePauseContinueGame = () => {
    if (isGamePaused) {
      // продолжаем игру
      setIsGameStarted(true);
      setIsGamePaused(false);
      setShowCongratulations(false);
      setIsClickable(true);
    } else {
      // ставим на паузу
      setIsGameStarted(false);
      setIsGamePaused(true);
      setShowCongratulations(true);
      }
  };

const handleEndGame = () => {
  if (time > 0 || moves > 0 || rounds > 0) {
    addGameStats({
      mode: gameMode!,
      type: "endless",
      time: time,
      moves: moves,
      rounds: rounds,
      stopped: true, 
    });
  }
  setShowCongratulations(true);
  setIsGamePaused(true);
};

  const handleReturnToMainMenu = () => {
    setGameMode(null);
    setCards([]);
    setSelectedCards([]);
    setMoves(0);
    setTime(0);
    setTimeLeft(0);
    setIsGameStarted(false);
    setShowCongratulations(false);
    setIsGamePaused(false);
    setShowTimeUpModal(false);
  };

const handleLogout = () => {
  // Только сбрасываем состояние, НЕ удаляем из localStorage
  setPlayerName('');
  setShowNameInput(true);
  setCards([]);
  setMoves(0);
  setTime(0);
  setTimeLeft(0);
  setGameMode(null);
  setGameStats([]); // Сбрасываем локальную статистику, но не трогаем localStorage
};
 const allCardsFlipped = cards.length > 0 && cards.every(card => card.isFlipped);

  useEffect(() => {
    let interval: number | any
  
  if (isGameStarted && !isGamePaused && !allCardsFlipped) {
    if (gameType === "normal") {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else if (gameType === "reverse") {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            setIsGameStarted(false);
            setIsClickable(false);
            setShowTimeUpModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }

  return () => clearInterval(interval);
}, [isGameStarted, isGamePaused, gameType, cards]);


  useEffect(() => {
    if (allCardsFlipped) {
      if (gameType === "endless") {
        
        addGameStats({
          mode: gameMode!,
          type: gameType,
          time: time,
          moves: moves,
          rounds: rounds + 1,
          stopped: false 
        });
  
        setRounds(prev => prev + 1);
        setShowCongratulations(true);
        setTimeout(() => {
          generateCards(gameMode!);
          setSelectedCards([]);
          setMoves(0);
          setIsGameStarted(false);
          setShowCongratulations(false);
        }, 2000);
      } else {
        addGameStats({
          mode: gameMode!,
          type: gameType,
          time: gameType === "reverse" ? timeLeft : time,
          moves: moves,
          stopped: false
        });
        setIsGameStarted(false);
        setShowCongratulations(true);
      }
    }
  }, [cards, gameType, gameMode, initialTime]);

  if (showNameInput) {
    return (
      <div className={styles.nameInputContainer}>
        <h2 className={styles['auto_h1']}>Авторизация</h2>
        <form onSubmit={handleNameSubmit}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Введите Ваше имя"
            className={styles.nameInput}
            required
          />
          <Button>Начать игру</Button>
        </form>
      </div>
    );
  }
  

  return (
    <div className={styles.container}>
      
      <div className={styles.headerWithStats}>
        <Header />
      </div>

      <div className={styles.logoutButton}>
          <Button onClick={handleLogout}>
           <img src="exit.png" alt="exit" width={20} height={20} />
        </Button>
      </div>
      <div className={styles.statsButton}>

      <Button  onClick={() => setShowStats(!showStats)}>
          {showStats ? "Скрыть статистику" : "Показать статистику"}
        </Button>
      </div>
      
      {showStats ? (
        <PlayerStats playerName={playerName} stats={gameStats} />
      ) : (
        <>
          {!gameMode ? (
            <>
              <GameModeSelector onSelectMode={handleModeSelect} />
              <CardSetSelector onSelectCardSet={handleCardSetSelect} />
            </>
          ) : showTimerTypeSelector ? (
            <GameTypeSelector 
              onSelectGameType={handleGameTypeSelect} 
              onReturnToMainMenu={handleReturnToMainMenu}
            />
          ) : (
            <>
              <GameInfo
                time={time}
                timeLeft={timeLeft}
                timerType={gameType}
                moves={moves}
                rounds={rounds}
              />
              <GameStatus
                rounds={rounds}
                isGamePaused={isGamePaused}
                gameType={gameType}
                showCongratulations={showCongratulations}
                showTimeUpModal={showTimeUpModal}
              />
              <GameBoard
                cards={cards}
                onCardClick={handleCardClick}
                mode={gameMode}
                isClickable={isClickable && !isGamePaused}
              />
              <GameControls
                onNewGame={handleNewGame}
                onReturnToMainMenu={handleReturnToMainMenu}
                onPauseGame={handlePauseContinueGame}
                onEndGame={gameType === "endless" ? handleEndGame : undefined}
                isGamePaused={isGamePaused}
                gameType={gameType}
              />
            </>
          )}
        </>
      )}
    </div>
  );

}