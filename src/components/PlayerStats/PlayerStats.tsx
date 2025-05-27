import styles from "./PlayerStats.module.css";

interface GameStats {
  mode: number;
  type: string;
  time: number;
  moves: number;
  rounds?: number;
  date: string;
  stopped?: boolean;
}

interface PlayerStatsProps {
  playerName: string;
  stats: GameStats[];
}

export default function PlayerStats({ playerName, stats }: PlayerStatsProps) {
  const getBestResults = () => {
    const bestResults: Record<string, GameStats> = {};
  
    stats
      .filter(stat => {
        return stat.type !== "endless" || stat.stopped === true;
      })
      .forEach((stat) => {
        const key = `${stat.mode}x${stat.mode}-${stat.type}`;
        if (!bestResults[key] || stat.time < bestResults[key].time) {
          bestResults[key] = stat;
        }
      });
  
    return Object.values(bestResults);
  };

  const getRecentGames = () => {
    return stats
      .filter(stat => stat.type !== "endless" || stat.stopped !== false)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const bestResults = getBestResults();
  const recentGames = getRecentGames();


  return (
    
    <div className={styles.playerStats}>
      
      <h2>Статистика игрока: {playerName}</h2>
      
      <div className={styles.statsSection}>
        <h3>Последние игры</h3>
        <div className={styles.statsTable}>
          <div className={styles.tableHeader}>
            <span>Режим</span>
            <span>Тип</span>
            <span>Время</span>
            <span>Ходы</span>
            <span>Раунды</span>
            <span>Дата</span>
          </div>
          {recentGames.map((stat, index) => (
              <div key={index} className={styles.tableRow}>
                <span>{stat.mode}x{stat.mode}</span>
                <span>
                  {stat.type === "normal" ? "Обычный" : 
                   stat.type === "reverse" ? "Таймер наоборот" : "Бесконечный"}
                </span>
                <span>{stat.time || "--"} сек</span>
              <span>{stat.moves}</span>
              <span>{stat.rounds || "--"}</span>
                <span>{stat.date}</span>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.statsSection}>
        <h3>Лучшие результаты</h3>
        <div className={styles.statsTable}>
          <div className={styles.tableHeader}>
            <span>Режим</span>
            <span>Тип</span>
            <span>Лучшее время</span>
            <span>Ходы</span>
            <span>Раунды</span>
            <span>Дата</span>
          </div>
          {bestResults.map((stat, index) => (
            <div key={index} className={styles.tableRow}>
              <span>{stat.mode}x{stat.mode}</span>
              <span>
                {stat.type === "normal" ? "Обычный" : 
                 stat.type === "reverse" ? "Таймер наоборот" : "Бесконечный"}
              </span>
              <span>{stat.time || "--"} сек</span>
              <span>{stat.moves}</span>
              <span>{stat.rounds || "--"}</span>
              <span>{stat.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}