import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import GameBoard from "./components/GameBoard/GameBoard";
import Timer from "./components/Timer/Timer";
import Score from "./components/Score/Score";
import Button from "./components/Button/Button";
import GameModeSelector from "./components/GameModeSelector/GameModeSelector";
import TimerTypeSelector from "./components/TimerTypeSelector/GameTypeSelector";
import CardSetSelector from "./components/CardSetSelector/CardSetSelector";
import styles from "./App.module.css";
import { cardSets } from "./components/cardSets ";

interface CardData {
  id: number;
  image: string;
  isFlipped: boolean;
}
export type GameType = "normal" | "reverse" | "endless";

export default function App() {
  const [cards, setCards] = useState<CardData[]>([]); // Состояние карточек на игровом поле
  const [selectedCards, setSelectedCards] = useState<number[]>([]); // Выбранные карточки (для сравнения)
  const [moves, setMoves] = useState(0); // Количество ходов
  const [time, setTime] = useState(0); // Время, прошедшее с начала игры (для обычного таймера)
  const [timeLeft, setTimeLeft] = useState(0); // Оставшееся время для таймера "наоборот"
  const [isGameStarted, setIsGameStarted] = useState(false); // Состояние игры: запущена или нет
  const [showCongratulations, setShowCongratulations] = useState(false); // Показывать ли сообщение о победе/остановке
  const [gameMode, setGameMode] = useState<number | null>(null); // Режим игры (2x2, 4x4, 6x6)
  const [gameType, setGameType] = useState<GameType>("normal"); // Тип игры: обычный, обратный, бесконечный
  const [showTimerTypeSelector, setShowTimerTypeSelector] = useState(false); // Показывать ли выбор типа таймера
  const [initialTime, setInitialTime] = useState(0); // Начальное время для таймера "наоборот"
  const [isClickable, setIsClickable] = useState(true); // Блокировка кликов (чтобы избежать множественных кликов)
  const [rounds, setRounds] = useState(0); // Количество завершенных раундов (для бесконечного режима)
  const [isGamePaused, setIsGamePaused] = useState(false); // Состояние паузы игры
  const [cardSet, setCardSet] = useState<keyof typeof cardSets>("classic"); // Выбранный набор карточек

  // Генерация карточек
  const generateCards = (mode: number) => {
    const totalCards = mode * mode;
    const selectedImages = cardSets[cardSet].slice(0, totalCards / 2); // Используем выбранный набор карточек
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

  // Обработчик выбора режима игры (2x2, 4x4, 6x6)
  const handleModeSelect = (mode: number) => {
    setGameMode(mode);
    setShowTimerTypeSelector(true); // Показываем выбор типа таймера
  };

  // Обработчик выбора типа игры (обычный, обратный, бесконечный)
  const handleGameTypeSelect = (type: GameType) => {
    setGameType(type);
    setShowTimerTypeSelector(false);
    generateCards(gameMode!);
    setIsGameStarted(false);
    setMoves(0);
    setTime(0);
    setTimeLeft(initialTime);
    setShowCongratulations(false);
    setRounds(0); // Сбрасываем счетчик раундов
    setIsGamePaused(false); // Сбрасываем состояние остановки игры
  };

  // Обработчик остановки игры
  const handleStopGame = () => {
    setIsGameStarted(false);
    setIsGamePaused(true); // Устанавливаем состояние остановки игры
    setShowCongratulations(true);
  };

  // Обработчик продолжения игры
  const handleContinueGame = () => {
    setIsGameStarted(true);
    setIsGamePaused(false); // Снимаем состояние остановки игры
    setShowCongratulations(false);
  };

  // Обработчик клика по карточке
  const handleCardClick = (id: number) => {
    if (!isClickable || cards.find((card) => card.id === id)?.isFlipped) return;

    if (!isGameStarted) {
      setIsGameStarted(true); // Запускаем игру и таймер
    }

    setIsClickable(false);

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    setSelectedCards((prevSelected) => [...prevSelected, id]);

    if (selectedCards.length === 1) {
      setMoves((prevMoves) => prevMoves + 1);
      const [firstCardId] = selectedCards;
      const firstCard = cards.find((card) => card.id === firstCardId);
      const secondCard = cards.find((card) => card.id === id);

      if (firstCard?.image === secondCard?.image) {
        setSelectedCards([]);
        setIsClickable(true);

        if (gameType === "reverse") {
          setTimeLeft((prevTime) => prevTime + 5); // Увеличиваем время на 5 секунд
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

  // Обработчик выбора набора карточек (животные, смайлики и т.д.)
  const handleCardSetSelect = (set: keyof typeof cardSets) => {
    setCardSet(set);
    if (gameMode) {
      generateCards(gameMode); // Перегенерируем карточки при выборе нового набора
    }
  };

  // Обработчик новой игры
  const handleNewGame = () => {
    if (gameMode) {
      generateCards(gameMode);
    }
    setSelectedCards([]);
    setMoves(0);
    setTime(0);
    setTimeLeft(initialTime);
    setIsGameStarted(false);
    setShowCongratulations(false);
    setIsGamePaused(false); // Сбрасываем состояние остановки игры
  };

  // Обработчик возврата в главное меню
  const handleReturnToMainMenu = () => {
    setGameMode(null);
    setCards([]);
    setSelectedCards([]);
    setMoves(0);
    setTime(0);
    setTimeLeft(0);
    setIsGameStarted(false);
    setShowCongratulations(false);
    setIsGamePaused(false); // Сбрасываем состояние остановки игры
  };
  // Установка начального времени для таймера "наоборот" в зависимости от режима игры
  useEffect(() => {
    if (gameMode === 2) {
      setInitialTime(5); // 2x2: 5 секунд
    } else if (gameMode === 4) {
      setInitialTime(60); // 4x4: 60 секунд
    } else if (gameMode === 6) {
      setInitialTime(90); // 6x6: 90 секунд
    }
  }, [gameMode]);

  // Управление таймером (обычный и обратный)
  useEffect(() => {
    let interval: number | undefined;

    if (isGameStarted) {
      if (gameType === "normal") {
        // Обычный таймер: увеличиваем время каждую секунду
        interval = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
      } else if (gameType === "reverse") {
        // Таймер наоборот: уменьшаем время каждую секунду
        interval = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(interval);
              setIsGameStarted(false);
              setShowCongratulations(false);
              alert("Время вышло! Попробуйте еще раз.");
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    }

    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, [isGameStarted, gameType]);

  // Запуск нового раунда или завершение игры
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isFlipped)) {
      if (gameType === "endless") {
        setRounds((prevRounds) => prevRounds + 1); // Увеличиваем счетчик раундов на 1
        setTimeout(() => {
          generateCards(gameMode!);
          setSelectedCards([]);
          setMoves(0);
          setTime(0);
          setTimeLeft(initialTime);
          setIsGameStarted(false);
          setShowCongratulations(false);
        }, 1000);
      } else {
        setIsGameStarted(false);
        setShowCongratulations(true);
      }
    }
  }, [cards, gameType, gameMode, initialTime]);

  // Проверка завершения игры (все карточки перевернуты)
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isFlipped)) {
      console.log("Все карточки перевернуты!");
      setIsGameStarted(false);
      setShowCongratulations(true);
    }
  }, [cards]);

  return (
    <div className={styles.container}>
      <Header />
      {!gameMode ? (
        <>
          <GameModeSelector onSelectMode={handleModeSelect} />
          <CardSetSelector onSelectCardSet={handleCardSetSelect} />{" "}
          {/* Добавляем выбор набора карточек */}
        </>
      ) : showTimerTypeSelector ? (
        <TimerTypeSelector onSelectGameType={handleGameTypeSelect} />
      ) : (
        <>
          <Timer time={time} timeLeft={timeLeft} timerType={gameType} />
          <Score moves={moves} />
          {showCongratulations ? (
            <div className={styles.gameFinished}>
              {isGamePaused ? (
                <h2>Игра остановлена</h2>
              ) : gameType === "endless" ? (
                <h2>Следующий раунд</h2>
              ) : (
                <h2>Поздравляем! Вы выиграли!</h2>
              )}
              <Button onClick={handleNewGame}>Новая игра</Button>
              {isGamePaused && (
                <Button onClick={handleContinueGame}>Продолжить игру</Button>
              )}
              <Button onClick={handleReturnToMainMenu}>
                Выйти в главное меню
              </Button>
            </div>
          ) : (
            <>
              <GameBoard
                cards={cards}
                onCardClick={handleCardClick}
                mode={gameMode}
                isClickable={isClickable}
              />
              {gameType === "endless" && (
                <div className={styles.rounds}>Раундов завершено: {rounds}</div>
              )}
              <div className={styles.buttonContainer}>
                <Button onClick={handleReturnToMainMenu}>
                  Выйти в главное меню
                </Button>
                <Button onClick={handleNewGame}>Новая игра</Button>
              </div>
              {gameType === "endless" && (
                <Button onClick={handleStopGame}>Остановить игру</Button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
