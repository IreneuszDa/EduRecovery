'use client';

import React, { useState } from 'react';
import PromptGraphDemo from '@/components/ui/PromptGraphDemo';
import PromptGraphSection from '@/components/course/lesson/PromptGraphSection';

export default function PromptGraphDemoPage() {
    const [activeTab, setActiveTab] = useState<'demo' | 'lesson'>('demo');
    const [completedSections, setCompletedSections] = useState<string[]>([]);

    const handleSectionComplete = (sectionId: string) => {
        setCompletedSections(prev => [...prev, sectionId]);
    };

    const mockOptions = [
        { id: 'linear', text: 'Draw a linear function y = 2x - 1 with range -10, 10' },
        { id: 'quadratic', text: 'Draw a quadratic function y = x^2 - 4x + 4 with title "Parabola"' },
        { id: 'sine', text: 'Draw a sine wave with amplitude 2 and frequency 0.5 with range -10, 10' },
        { id: 'bar', text: 'Draw a bar graph of y = x^2 with range 0, 10' }
    ];

    return (
        <div className="prompt-graph-demo-page">
            <header className="demo-header">
                <h1>Interaktywne wykresy generowane z opisu</h1>
                <p className="subtitle">Twórz wykresy i wizualizacje używając prostych opisów tekstowych</p>

                <div className="demo-tabs">
                    <button
                        className={`demo-tab ${activeTab === 'demo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('demo')}
                    >
                        Samodzielny komponent
                    </button>
                    <button
                        className={`demo-tab ${activeTab === 'lesson' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lesson')}
                    >
                        W kontekście lekcji
                    </button>
                </div>
            </header>

            <main className="demo-content">
                {activeTab === 'demo' ? (
                    <section className="standalone-demo">
                        <h2>Niezależny komponent do generowania wykresów</h2>
                        <p>
                            Ten komponent pozwala na tworzenie wykresów poprzez ich opisanie w języku naturalnym.
                            Wypróbuj różne typy funkcji, takie jak liniowe, kwadratowe, wykładnicze, czy sinusoidalne.
                        </p>
                        <div className="demo-container">
                            <PromptGraphDemo />
                        </div>
                    </section>
                ) : (
                    <section className="lesson-demo">
                        <h2>Komponent w kontekście lekcji</h2>
                        <p>
                            Tak wygląda komponent zintegrowany z materiałem lekcyjnym. Uczniowie mogą eksplorować
                            koncepcje matematyczne poprzez interaktywne wykresy generowane z opisów.
                        </p>

                        <div className="lesson-section">
                            <h3>Lekcja: Funkcje matematyczne</h3>

                            <div className="lesson-content">
                                <p>
                                    Funkcje matematyczne można przedstawić na wiele sposobów: wzorem, tabelą wartości,
                                    czy wykresem. Wykresy są szczególnie pomocne w zrozumieniu zachowania funkcji.
                                </p>

                                <PromptGraphSection
                                    graphPrompt="Draw a linear function y = 2x + 1 with range -5, 5 with title 'Funkcja liniowa' x-label 'x' y-label 'f(x)'"
                                    question="Eksploruj wykres funkcji liniowej. Spróbuj zmienić parametry funkcji i obserwuj, jak zmienia się wykres:"
                                    options={mockOptions}
                                    onComplete={() => handleSectionComplete('section-1')}
                                />

                                {completedSections.includes('section-1') && (
                                    <>
                                        <p>
                                            Funkcje kwadratowe mają charakterystyczny kształt paraboli. Ich ogólna postać to
                                            f(x) = ax² + bx + c, gdzie współczynnik a określa "szerokość" paraboli oraz jej kierunek.
                                        </p>

                                        <PromptGraphSection
                                            graphPrompt="Draw a quadratic function y = x^2 - 4x + 3 with range -2, 6 with title 'Funkcja kwadratowa' x-label 'x' y-label 'f(x)'"
                                            question="Zbadaj funkcję kwadratową. Zwróć uwagę na jej wierzchołek oraz miejsca zerowe:"
                                            options={[
                                                { id: 'quad-1', text: 'Draw a quadratic function y = x^2 - 4x + 3 with range -2, 6' },
                                                { id: 'quad-2', text: 'Draw a quadratic function y = -x^2 + 2x + 3 with range -2, 6' },
                                                { id: 'quad-3', text: 'Draw a quadratic function y = 0.5x^2 + x - 2 with range -5, 5' }
                                            ]}
                                            onComplete={() => handleSectionComplete('section-2')}
                                        />
                                    </>
                                )}

                                {completedSections.includes('section-2') && (
                                    <>
                                        <p>
                                            Funkcje okresowe, takie jak funkcje trygonometryczne, powtarzają swoje wartości
                                            w regularnych odstępach. Przykładem jest funkcja sinus, która ma zastosowanie
                                            w modelowaniu zjawisk falowych, drgań i wielu innych procesów cyklicznych.
                                        </p>

                                        <PromptGraphSection
                                            graphPrompt="Draw a sine function with amplitude 1.5 and frequency 0.5 with range -10, 10 with title 'Funkcja sinus' x-label 'x' y-label 'sin(x)'"
                                            question="Eksploruj funkcję sinus. Zmień amplitudę i częstotliwość, aby zobaczyć jak wpływają na wykres:"
                                            options={[
                                                { id: 'sine-1', text: 'Draw a sine function with amplitude 1.5 and frequency 0.5 with range -10, 10' },
                                                { id: 'sine-2', text: 'Draw a sine function with amplitude 0.5 and frequency 2 with range -10, 10' },
                                                { id: 'cosine', text: 'Draw a sine function with amplitude 1 and frequency 1 with phase 1.57 with range -10, 10' }
                                            ]}
                                            onComplete={() => handleSectionComplete('section-3')}
                                        />
                                    </>
                                )}

                                {completedSections.includes('section-3') && (
                                    <div className="completion-message">
                                        <h3>Gratulacje!</h3>
                                        <p>Ukończyłeś/aś demonstrację interaktywnych wykresów w kontekście lekcji.</p>
                                        <button onClick={() => {
                                            setCompletedSections([]);
                                            window.scrollTo(0, 0);
                                        }}>
                                            Rozpocznij ponownie
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <style jsx>{`
        .prompt-graph-demo-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .demo-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .demo-header h1 {
          margin-bottom: 10px;
          color: #333;
        }
        
        .subtitle {
          color: #666;
          margin-bottom: 30px;
        }
        
        .demo-tabs {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }
        
        .demo-tab {
          padding: 10px 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .demo-tab.active {
          background-color: #4a90e2;
          color: white;
          border-color: #4a90e2;
        }
        
        .demo-content {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .demo-container {
          margin-top: 20px;
        }
        
        .lesson-section {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        
        .lesson-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .completion-message {
          text-align: center;
          padding: 20px;
          background-color: #f0f7ff;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .completion-message button {
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 10px;
        }
        
        .completion-message button:hover {
          background-color: #357abf;
        }
      `}</style>
        </div>
    );
}
