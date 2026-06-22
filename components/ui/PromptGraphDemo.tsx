import React, { useState } from 'react';
import PromptGraph from './PromptGraph';
import styles from './PromptGraph.module.css';

interface PromptGraphDemoProps {
    initialPrompt?: string;
    className?: string;
}

const PromptGraphDemo: React.FC<PromptGraphDemoProps> = ({
    initialPrompt = 'Draw a linear function y = 2x + 3 with range -5, 5',
    className = '',
}) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [inputValue, setInputValue] = useState(initialPrompt);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPrompt(inputValue);
        setError(null);
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
    };

    return (
        <div className={`${styles.promptGraphDemo} ${className}`}>
            <div className={styles.promptGraphControls}>
                <form onSubmit={handleSubmit} className={styles.promptInputForm}>
                    <div className={styles.promptInputContainer}>
                        <label htmlFor="graphPrompt">Opisz wykres:</label>
                        <input
                            id="graphPrompt"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Np. wykres funkcji liniowej y = 2x + 3 z zakresem -5, 5"
                            className={styles.promptInput}
                        />
                    </div>
                    <button type="submit" className="prompt-submit-button">
                        Generuj wykres
                    </button>
                </form>

                {error && <div className="prompt-error">{error}</div>}

                <div className="prompt-examples">
                    <h4>Przykłady:</h4>
                    <ul>
                        <li><button onClick={() => setInputValue('Draw a linear function y = 2x - 1 with range -10, 10')}>Funkcja liniowa y = 2x - 1</button></li>
                        <li><button onClick={() => setInputValue('Draw a quadratic function y = x^2 - 4x + 4 with title "Parabola" x-label "X values" y-label "Y values"')}>Funkcja kwadratowa z etykietami</button></li>
                        <li><button onClick={() => setInputValue('Draw a sine wave with amplitude 2 and frequency 0.5 with range -10, 10')}>Funkcja sinusoidalna</button></li>
                        <li><button onClick={() => setInputValue('Draw a normal distribution with mean = 0 and std = 1')}>Rozkład normalny</button></li>
                        <li><button onClick={() => setInputValue('Draw a bar graph of y = x^2 with range 0, 10')}>Wykres słupkowy</button></li>
                    </ul>
                </div>
            </div>

            <div className="prompt-graph-container">
                <PromptGraph
                    prompt={prompt}
                    height={400}
                    onError={handleError}
                />
            </div>

            <div className="prompt-graph-info">
                <h3>Jak to działa?</h3>
                <p>
                    Opisz wykres, który chcesz wygenerować, używając prostego języka.
                    Komponenty rozpoznaje różne typy funkcji (liniowa, kwadratowa, wykładnicza, sinusoidalna)
                    i typy wykresów (liniowy, słupkowy, kołowy, punktowy).
                </p>
                <p>Możesz również określić:</p>
                <ul>
                    <li>Tytuł wykresu: <code>title "Mój wykres"</code></li>
                    <li>Etykiety osi: <code>x-label "Oś X"</code> i <code>y-label "Oś Y"</code></li>
                    <li>Zakres wartości: <code>range -10, 10</code></li>
                </ul>
            </div>
        </div>
    );
};

export default PromptGraphDemo;
