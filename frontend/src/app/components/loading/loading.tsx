import styles from "./loading.module.css";

export default function LoadingComponent() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className={styles.loader}></div>
        </div>
    );
}
