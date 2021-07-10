import Link from 'next/link';
import styles from '../styles/404.module.scss';

export default function Custom404() {
    return (
        <div className={styles.Error404}>
            <p>Oops</p>
            <p>404</p>
            <p>Não conseguimos encontrar a página que você está procurando.</p>
            <Link href="/">
                <a>Página Inicial</a>
            </Link>
        </div>
    )
  }