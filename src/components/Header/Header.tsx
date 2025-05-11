import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      {<h1>Память</h1>}
    </header>
  );
}