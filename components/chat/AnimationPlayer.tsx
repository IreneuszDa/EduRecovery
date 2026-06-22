'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Download, RefreshCw, Maximize2, Minimize2, Info } from 'lucide-react';
import './AnimationPlayer.css';

interface AnimationPlayerProps {
    animationId: string;
    prompt: string;
}

interface VoiceOverScript {
    intro: string;
    concept1: string;
    concept2: string;
    concept3: string;
    summary: string;
}

export default function AnimationPlayer({ animationId, prompt }: AnimationPlayerProps) {
    const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pollingInterval, setPollingInterval] = useState<number>(2000);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [voiceOverScript, setVoiceOverScript] = useState<VoiceOverScript | null>(null);
    const [currentScript, setCurrentScript] = useState<string>('');
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle video playback control
    const togglePlay = () => {
        if (videoRef.current) {
            // Save current scroll position
            const scrollPosition = window.scrollY;

            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);

            // Ensure scroll position is maintained
            setTimeout(() => {
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'auto'
                });
            }, 50);
        }
    };

    // Handle mute/unmute
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Handle fullscreen toggle
    const toggleFullscreen = () => {
        if (containerRef.current) {
            if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        }
    };

    // Handle video progress update
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            const progressValue = (currentTime / duration) * 100;
            setProgress(progressValue);

            // Update current voice-over script based on video progress
            if (voiceOverScript) {
                if (progressValue < 20) {
                    setCurrentScript(voiceOverScript.intro);
                } else if (progressValue < 40) {
                    setCurrentScript(voiceOverScript.concept1);
                } else if (progressValue < 60) {
                    setCurrentScript(voiceOverScript.concept2);
                } else if (progressValue < 80) {
                    setCurrentScript(voiceOverScript.concept3);
                } else {
                    setCurrentScript(voiceOverScript.summary);
                }
            }
        }
    };

    // Handle seeking on progress bar click
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const progressBar = e.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = clickPosition * videoRef.current.duration;
        }
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            // Only handle keys if we have a video and are not in an input/textarea
            if (!videoRef.current || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key) {
                case ' ':  // Space key for play/pause
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'm':  // M key for mute/unmute
                case 'M':
                    toggleMute();
                    break;
                case 'f':  // F key for fullscreen
                case 'F':
                    toggleFullscreen();
                    break;
                case 'ArrowLeft':  // Left arrow to go back 5 seconds
                    if (videoRef.current) {
                        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
                    }
                    break;
                case 'ArrowRight':  // Right arrow to go forward 5 seconds
                    if (videoRef.current) {
                        videoRef.current.currentTime = Math.min(
                            videoRef.current.duration,
                            videoRef.current.currentTime + 5
                        );
                    }
                    break;
            }
        };

        // Listen for keyboard events
        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [togglePlay, toggleMute, toggleFullscreen]);

    // Listen for fullscreen change
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Prevent auto-scrolling when video URL changes
    useEffect(() => {
        if (videoUrl) {
            // Store the current scroll position
            const scrollPosition = window.scrollY;

            // Restore the scroll position after the video element is rendered
            const restoreScroll = () => {
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'auto'
                });
            };

            // Wait for the render cycle to complete
            requestAnimationFrame(() => {
                restoreScroll();
                // Sometimes we need a second attempt to ensure it works
                setTimeout(restoreScroll, 100);
            });
        }
    }, [videoUrl]);

    useEffect(() => {
        let isMounted = true;
        let timer: NodeJS.Timeout | null = null;

        const checkAnimationStatus = async () => {
            try {
                const response = await fetch(`/api/animate?id=${animationId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch animation status: ${response.statusText}`);
                }

                const data = await response.json();

                if (!isMounted) return;

                setStatus(data.status);

                if (data.videoUrl) {
                    // Save current scroll position before setting video URL
                    const scrollPosition = window.scrollY;

                    // Set the video URL
                    setVideoUrl(data.videoUrl);
                    setPollingInterval(0); // Stop polling when we have a video URL

                    // Restore scroll position after state updates
                    setTimeout(() => {
                        window.scrollTo({
                            top: scrollPosition,
                            behavior: 'auto' // Use 'auto' to prevent smooth scrolling animation
                        });
                    }, 100);

                    // Try to fetch voice-over script
                    try {
                        const scriptUrl = data.videoUrl.replace('ExplainerAnimation.mp4', 'voiceover_script.json');
                        const scriptResponse = await fetch(scriptUrl);
                        if (scriptResponse.ok) {
                            const scriptData = await scriptResponse.json();
                            setVoiceOverScript(scriptData);
                            setCurrentScript(scriptData.intro);
                        }
                    } catch (scriptError) {
                        console.warn('Voice-over script not available:', scriptError);
                    }
                } else if (data.status === 'failed') {
                    setError(data.errorMessage || 'Animation generation failed');
                    setPollingInterval(0); // Stop polling on failure
                } else if (data.status === 'completed' && !data.videoUrl) {
                    // Handle case where code was generated successfully but no video was created
                    const message = data.errorMessage || 'Kod animacji został wygenerowany pomyślnie! Renderowanie wideo jest obecnie niedostępne.';
                    setError(message);
                    setPollingInterval(0);
                } else if (data.status === 'processing') {
                    // When processing, poll more frequently
                    setPollingInterval(2000);
                } else {
                    // For pending status, poll less frequently
                    setPollingInterval(5000);
                }
            } catch (error) {
                if (!isMounted) return;
                console.error('Error checking animation status:', error);
                setError('Failed to check animation status');
            }
        };

        // Start polling immediately
        checkAnimationStatus();

        // Continue polling at the specified interval if needed
        if (pollingInterval > 0) {
            timer = setInterval(checkAnimationStatus, pollingInterval);
        }

        return () => {
            isMounted = false;
            if (timer) clearInterval(timer);
        };
    }, [animationId, pollingInterval]);

    if (error) {
        // Check for specific Python errors we know how to explain
        let errorDetails = "";
        let suggestedFix = "";

        if (error.includes("NameError: name 'cleanPrompt' is not defined") ||
            error.includes("clean_prompt") ||
            error.includes("variable") ||
            error.includes("undefined")) {
            errorDetails = "Problem z przekazywaniem zmiennych do skryptu animacji.";
            suggestedFix = "Zespół techniczny został powiadomiony o tym problemie.";
        } else if (error.includes("ModuleNotFoundError")) {
            errorDetails = "Brakujący moduł Python potrzebny do generowania animacji.";
            suggestedFix = "Spróbuj ponownie za chwilę.";
        } else if (error.includes("Permission") || error.includes("Access")) {
            errorDetails = "Problem z uprawnieniami do plików przy generowaniu animacji.";
            suggestedFix = "Spróbuj odświeżyć stronę i spróbować ponownie.";
        }

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300"
            >
                <h3 className="font-semibold text-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Wystąpił błąd podczas generowania animacji
                </h3>

                {errorDetails && (
                    <div className="mt-3 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
                        <p className="font-medium">{errorDetails}</p>
                        {suggestedFix && <p className="mt-1 text-sm">{suggestedFix}</p>}
                    </div>
                )}

                <p className="mt-3 text-sm opacity-80">
                    Szczegóły błędu: {error}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-700/40 rounded-md text-sm font-medium transition-colors"
                    >
                        Odśwież stronę
                    </button>
                    <button
                        onClick={() => {
                            setError(null);
                            setStatus('pending');
                            setPollingInterval(2000);
                        }}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800/30 hover:bg-slate-200 dark:hover:bg-slate-700/40 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            </motion.div>
        );
    } return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 animation-player"
        >
            <h3 className="text-lg font-medium mb-2 text-slate-800 dark:text-slate-200 flex items-center">
                <span className="mr-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
                    Animacja:
                </span>
                {prompt}
            </h3>

            <div ref={containerRef} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 shadow-lg">
                {videoUrl ? (
                    <div className={`video-container relative fullscreen-transition ${isFullScreen ? 'h-screen w-screen' : 'aspect-video'}`}>
                        {/* Video Element */}
                        <video
                            ref={videoRef}
                            className="w-full h-full object-contain bg-black"
                            src={videoUrl}
                            loop
                            onPlay={() => {
                                const scrollPos = window.scrollY;
                                setIsPlaying(true);
                                setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'auto' }), 50);
                            }}
                            onPause={() => setIsPlaying(false)}
                            onLoadedData={() => {
                                // Preserve scroll position when video loads
                                const scrollPos = window.scrollY;
                                setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'auto' }), 50);
                            }}
                            onTimeUpdate={handleTimeUpdate}
                            muted={isMuted}
                        >
                            Your browser does not support the video tag.
                        </video>

                        {/* Custom Video Controls */}
                        <div className="video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white flex flex-col gap-2">
                            {/* Progress Bar */}
                            <div
                                className="w-full h-2 bg-white/30 rounded-full cursor-pointer"
                                onClick={handleSeek}
                            >
                                <div
                                    className="h-full progress-animated rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Controls Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Play/Pause Button */}
                                    <button
                                        onClick={togglePlay}
                                        className="control-button p-1.5 rounded-full"
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                    >
                                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                        <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                                    </button>

                                    {/* Volume Control with Slider */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={toggleMute}
                                            className="control-button p-1.5 rounded-full"
                                            aria-label={isMuted ? "Unmute" : "Mute"}
                                        >
                                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                            <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                                        </button>

                                        {!isMuted && (
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                defaultValue="1"
                                                className="volume-slider w-16 md:w-24"
                                                onChange={(e) => {
                                                    if (videoRef.current) {
                                                        videoRef.current.volume = parseFloat(e.target.value);
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Current Time / Duration */}
                                    {videoRef.current && (
                                        <div className="text-xs text-white/80 hidden sm:block">
                                            {Math.floor(videoRef.current.currentTime / 60)}:
                                            {Math.floor(videoRef.current.currentTime % 60).toString().padStart(2, '0')}
                                            {' / '}
                                            {Math.floor((videoRef.current.duration || 0) / 60)}:
                                            {Math.floor((videoRef.current.duration || 0) % 60).toString().padStart(2, '0')}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Info Button with Keyboard Shortcuts */}
                                    <div className="relative group">
                                        <button className="control-button p-1.5 rounded-full">
                                            <Info size={16} />
                                        </button>
                                        <div className="absolute bottom-full right-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity w-48">
                                            <p className="font-semibold mb-1">Skróty klawiszowe:</p>
                                            <div className="flex justify-between">
                                                <span>Odtwarzanie/pauza</span>
                                                <span className="keyboard-hint">Spacja</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Wycisz/odcisz</span>
                                                <span className="keyboard-hint">M</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Pełny ekran</span>
                                                <span className="keyboard-hint">F</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Download Button */}
                                    <a
                                        href={videoUrl}
                                        download
                                        className="control-button p-1.5 rounded-full"
                                        aria-label="Download"
                                    >
                                        <Download size={18} />
                                        <span className="sr-only">Pobierz</span>
                                    </a>

                                    {/* Fullscreen Button */}
                                    <button
                                        onClick={toggleFullscreen}
                                        className="control-button p-1.5 rounded-full"
                                        aria-label={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                                    >
                                        {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                        <span className="sr-only">{isFullScreen ? "Zamknij pełny ekran" : "Pełny ekran"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/70 dark:to-slate-900/50 p-6">
                        <div className="text-center max-w-md">
                            <div className="relative mx-auto w-24 h-24">
                                <div className="absolute inset-0 rounded-full border-4 border-blue-500/10 dark:border-blue-400/10"></div>
                                <div className="spinner absolute inset-[4px] rounded-full border-4 border-transparent"></div>

                                {/* Animated icon based on status */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-blue-500 dark:text-blue-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        {status === 'pending' ? (
                                            // Brain icon for pending
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm0 0v3m8-3v3m-9 8h10a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2z" />
                                        ) : (
                                            // Video camera icon for processing
                                            <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                        )}
                                    </svg>
                                </div>
                            </div>

                            <h4 className="mt-6 text-xl font-semibold text-slate-700 dark:text-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block text-transparent bg-clip-text">
                                {status === 'pending' ? 'Przygotowuję animację' :
                                    status === 'processing' ? 'Renderuję animację' :
                                        'Ładowanie...'}
                            </h4>

                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                                {status === 'pending' ?
                                    'Analizujemy Twoje zapytanie i przygotowujemy dane do wizualizacji. To potrwa tylko chwilę...' :
                                    status === 'processing' ?
                                        'Generujemy wysokiej jakości animację edukacyjną z interaktywnym narratorem i wizualizacjami. Już prawie gotowe...' :
                                        'Przygotowujemy materiały edukacyjne...'
                                }
                            </p>

                            <div className="mt-6 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full progress-animated rounded-full"
                                    style={{
                                        width: status === 'pending' ? '35%' :
                                            status === 'processing' ? '75%' : '15%'
                                    }}
                                ></div>
                            </div>

                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                {status === 'pending' ? 'Szacowany czas: ~20 sekund' :
                                    status === 'processing' ? 'Szacowany czas: ~10 sekund' :
                                        'Inicjalizacja...'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Voice-over transcript section */}
                {videoUrl && currentScript && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                                <Volume2 size={16} className="text-blue-500 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    Narracja
                                    <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">Live</span>
                                </h4>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    <span className="voiceover-highlight">{currentScript}</span>
                                </p>

                                {/* Additional information or tips */}
                                <div className="mt-3 text-xs text-slate-500 dark:text-slate-500 flex items-center">
                                    <Info size={12} className="mr-1" />
                                    <span>Narracja zmienia się w trakcie animacji, dostosowując się do prezentowanych treści.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status === 'pending' ? 'bg-yellow-400 animate-pulse' :
                                status === 'processing' ? 'bg-blue-400 animate-pulse' :
                                    status === 'completed' ? 'bg-green-400' : 'bg-red-400'
                                }`}></div>
                            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {status === 'pending' ? 'Oczekuje' :
                                    status === 'processing' ? 'Przetwarzanie' :
                                        status === 'completed' ? 'Ukończono' : 'Błąd'}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {videoUrl && (
                                <>
                                    <button
                                        onClick={() => {
                                            if (videoRef.current) {
                                                videoRef.current.currentTime = 0;
                                                videoRef.current.play();
                                                setIsPlaying(true);
                                            }
                                        }}
                                        className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <RefreshCw size={14} />
                                        <span>Odtwórz ponownie</span>
                                    </button>
                                    <a
                                        href={videoUrl}
                                        download
                                        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        <Download size={14} />
                                        <span>Pobierz</span>
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
