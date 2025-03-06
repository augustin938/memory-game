import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import GameBoard from './components/GameBoard/GameBoard';
import Timer from './components/Timer/Timer';
import Score from './components/Score/Score';
import Button from './components/Button/Button';
import GameModeSelector from './components/GameModeSelector/GameModeSelector';
import TimerTypeSelector from './components/TimerTypeSelector/TimerTypeSelector';
import styles from './App.module.css';

interface CardData {
  id: number;
  image: string;
  isFlipped: boolean;
}

const App: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // Оставшееся время для таймера "наоборот"
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [gameMode, setGameMode] = useState<number | null>(null);
  const [timerType, setTimerType] = useState<'normal' | 'reverse'>('normal'); // Тип таймера
  const [showTimerTypeSelector, setShowTimerTypeSelector] = useState(false); // Показывать ли выбор типа таймера
  const [initialTime, setInitialTime] = useState(0); // Начальное время для таймера "наоборот"
  const [isClickable, setIsClickable] = useState(true); // Блокировка кликов

  // Генерация карточек
  const generateCards = (mode: number) => {
    const totalCards = mode * mode;
    const images = [
      '/src/assets/images/card1.png',
      '/src/assets/images/card2.png',
      '/src/assets/images/card3.png',
      '/src/assets/images/card4.png',
      '/src/assets/images/card5.png',
      '/src/assets/images/card6.png',
      '/src/assets/images/card7.png',
      '/src/assets/images/card8.png',
      '/src/assets/images/card9.png',
      '/src/assets/images/card10.png',
      '/src/assets/images/card11.png',
      '/src/assets/images/card12.png',
      '/src/assets/images/card13.png',
      '/src/assets/images/card14.png',
      '/src/assets/images/card15.png',
      '/src/assets/images/card16.png',
      '/src/assets/images/card17.png',
      '/src/assets/images/card18.png',
    ];

    const selectedImages = images.slice(0, totalCards / 2);
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

  // Обработчик выбора режима игры
  const handleModeSelect = (mode: number) => {
    setGameMode(mode);
    setShowTimerTypeSelector(true); // Показываем выбор типа таймера
  };

  // Обработчик выбора типа таймера
  const handleTimerTypeSelect = (type: 'normal' | 'reverse') => {
    setTimerType(type);
    setShowTimerTypeSelector(false);
    generateCards(gameMode!); // Генерация карточек
    setIsGameStarted(false);
    setIsGameFinished(false);
    setMoves(0);
    setTime(0);
    setTimeLeft(initialTime);
    setShowCongratulations(false); // Сбрасываем сообщение о победе
  };

  // Установка начального времени для таймера "наоборот"
  useEffect(() => {
    if (gameMode === 2) {
      setInitialTime(30); // 2x2: 30 секунд
    } else if (gameMode === 4) {
      setInitialTime(60); // 4x4: 60 секунд
    } else if (gameMode === 6) {
      setInitialTime(90); // 6x6: 90 секунд
    }
  }, [gameMode]);

  // Запуск таймера
  useEffect(() => {
    let interval: number | undefined;

    if (isGameStarted) {
      if (timerType === 'normal') {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
      } else if (timerType === 'reverse') {
        interval = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(interval);
              setIsGameStarted(false);
              setShowCongratulations(false);
              alert('Время вышло! Попробуйте еще раз.');
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    }

    return () => clearInterval(interval);
  }, [isGameStarted, timerType]);

  // Проверка завершения игры
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isFlipped)) {
      console.log('Все карточки перевернуты!');
      setIsGameStarted(false);
      setIsGameFinished(true);
      setShowCongratulations(true);
    }
  }, [cards]);

  // Обработчик клика по карточке
  const handleCardClick = (id: number) => {
    if (!isClickable || cards.find((card) => card.id === id)?.isFlipped) return;

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

    if (selectedCards.length === 1) {
      setMoves((prevMoves) => prevMoves + 1);
      const [firstCardId] = selectedCards;
      const firstCard = cards.find((card) => card.id === firstCardId);
      const secondCard = cards.find((card) => card.id === id);

      if (firstCard?.image === secondCard?.image) {
        setSelectedCards([]);
        setIsClickable(true);

        if (timerType === 'reverse') {
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
    setIsGameFinished(false);
    setShowCongratulations(false);
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
    setIsGameFinished(false);
    setShowCongratulations(false);
  };

  return (
    <div className={styles.container}>
      <Header />
      {!gameMode ? (
        <GameModeSelector onSelectMode={handleModeSelect} />
      ) : showTimerTypeSelector ? (
        <TimerTypeSelector onSelectTimerType={handleTimerTypeSelect} />
      ) : (
        <>
          <Timer time={time} timeLeft={timeLeft} timerType={timerType} />
          <Score moves={moves} />
          {showCongratulations ? (
            <div className={styles.gameFinished}>
              <h2>Поздравляем! Вы выиграли!</h2>
              <Button onClick={handleNewGame}>Новая игра</Button>
              <Button onClick={handleReturnToMainMenu}>Выйти в главное меню</Button>
            </div>
          ) : (
            <>
              <GameBoard
                cards={cards}
                onCardClick={handleCardClick}
                mode={gameMode}
                isClickable={isClickable}
              />
              <div className={styles.buttonContainer}>
                <Button onClick={handleReturnToMainMenu}>Выйти в главное меню</Button>
                <Button onClick={handleNewGame}>Новая игра</Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;