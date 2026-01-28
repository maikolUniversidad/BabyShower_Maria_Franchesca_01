"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Intentar reproducir automáticamente al cargar (la mayoría de navegadores lo bloquearán)
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;

            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.log("Autoplay was prevented:", error);
                        setIsPlaying(false);
                    });
            }
        }
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <audio
                ref={audioRef}
                src="/Sonido/Mi Pequeñito Amor.mp3"
                loop
            />
            <button
                onClick={toggleMusic}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 border border-pink-100"
                aria-label={isPlaying ? "Silenciar música" : "Reproducir música"}
            >
                {isPlaying ? (
                    <Volume2 className="h-6 w-6 text-pink-500 animate-pulse" />
                ) : (
                    <VolumeX className="h-6 w-6 text-gray-400" />
                )}
            </button>
        </div>
    );
}
