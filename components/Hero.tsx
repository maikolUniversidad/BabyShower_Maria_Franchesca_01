'use client';

import { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

const TARGET_DATE = new Date('2026-02-07T15:00:00'); // February 7, 2026 at 3:00 PM

export default function Hero() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const days = Math.max(0, differenceInDays(TARGET_DATE, now));
            const hours = Math.max(0, differenceInHours(TARGET_DATE, now) % 24);
            const minutes = Math.max(0, differenceInMinutes(TARGET_DATE, now) % 60);
            setTimeLeft({ days, hours, minutes });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            className="relative min-h-screen flex flex-col justify-center items-center py-12 px-4 overflow-hidden"
            style={{
                backgroundImage: `url(/vintage/floral-wallpaper.png)`,
                backgroundSize: '400px auto',
                backgroundRepeat: 'repeat',
                backgroundPosition: 'center top'
            }}
        >
            {/* Main Invitation Card */}
            <div className="relative max-w-[600px] w-full bg-vintage-ivory shadow-2xl animate-gentle-fade-in"
                style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.01) 2px, rgba(0, 0, 0, 0.01) 4px)`,
                }}>

                {/* Vertical Floral Borders */}
                <div className="absolute left-0 top-0 bottom-0 w-8 opacity-40"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, #a8b5a0 0px, #a8b5a0 1px, transparent 1px, transparent 4px)',
                    }}></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 opacity-40"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, #a8b5a0 0px, #a8b5a0 1px, transparent 1px, transparent 4px)',
                    }}></div>

                {/* Card Content */}
                <div className="relative px-12 md:px-16 py-16 md:py-20">

                    {/* Decorative Frame with Monogram */}
                    <div className="relative flex flex-col items-center mb-8">
                        {/* Floral Frame */}
                        <div className="relative w-64 h-64 md:w-72 md:h-72">
                            <Image
                                src="/vintage/floral-frame.png"
                                alt=""
                                fill
                                className="object-contain"
                                priority
                            />
                            {/* Monogram MF */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-script text-6xl md:text-7xl text-vintage-dusty-pink"
                                    style={{ marginTop: '10px' }}>
                                    MF
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* BABY SHOWER Label */}
                    <div className="text-center mb-6">
                        <p className="text-vintage-sepia text-xs md:text-sm tracking-vintage uppercase font-vintage-serif font-light">
                            Baby Shower
                        </p>
                    </div>

                    {/* Main Name - Script Font */}
                    <div className="text-center mb-12">
                        <h1 className="font-script text-6xl md:text-7xl lg:text-8xl text-vintage-dusty-pink leading-tight">
                            Maria
                        </h1>
                        <h1 className="font-script text-6xl md:text-7xl lg:text-8xl text-vintage-dusty-pink leading-tight -mt-4">
                            Franchesca
                        </h1>
                    </div>

                    {/* Event Details - 3 Column Layout */}
                    <div className="grid grid-cols-3 gap-4 text-center mb-8 py-6 border-t border-b border-vintage-sepia/20">
                        {/* Date Column */}
                        <div className="font-vintage-serif">
                            <p className="text-xs text-vintage-sepia uppercase tracking-wide mb-1">Sábado</p>
                            <p className="text-4xl md:text-5xl text-vintage-dusty-pink font-light">7</p>
                            <p className="text-xs text-vintage-sepia uppercase tracking-wide mt-1">Febrero</p>
                        </div>

                        {/* Location Column */}
                        <div className="font-vintage-serif border-l border-r border-vintage-sepia/20">
                            <p className="text-xs text-vintage-sepia uppercase tracking-wide mb-1">Club</p>
                            <p className="text-sm md:text-base text-vintage-sepia uppercase tracking-wide mt-1">Metropolitan</p>
                            <p className="text-[10px] text-vintage-sepia/70 uppercase tracking-wide mt-2">Salón</p>
                            <p className="text-xs text-vintage-sepia uppercase tracking-wide">Metropolitan</p>
                        </div>

                        {/* Time Column */}
                        <div className="font-vintage-serif">
                            <p className="text-4xl md:text-5xl text-vintage-dusty-pink font-light">3:00</p>
                            <p className="text-xs text-vintage-sepia uppercase tracking-wide mt-1">PM</p>
                        </div>
                    </div>

                    {/* City and Year */}
                    <div className="text-center mb-6">
                        <p className="text-vintage-sepia text-xs uppercase tracking-vintage font-vintage-serif">
                            Bogotá, 2026
                        </p>
                    </div>

                    {/* Subtle Countdown */}
                    <div className="text-center opacity-50 mt-8">
                        <p className="text-[10px] text-vintage-sepia uppercase tracking-wide mb-2 font-vintage-serif">Faltan</p>
                        <div className="flex justify-center gap-4 text-vintage-sepia/70">
                            <div>
                                <span className="text-xl font-vintage-serif">{timeLeft.days}</span>
                                <span className="text-[9px] uppercase ml-1 font-vintage-serif">días</span>
                            </div>
                            <span className="text-vintage-sepia/40">•</span>
                            <div>
                                <span className="text-xl font-vintage-serif">{timeLeft.hours}</span>
                                <span className="text-[9px] uppercase ml-1 font-vintage-serif">hrs</span>
                            </div>
                            <span className="text-vintage-sepia/40">•</span>
                            <div>
                                <span className="text-xl font-vintage-serif">{timeLeft.minutes}</span>
                                <span className="text-[9px] uppercase ml-1 font-vintage-serif">min</span>
                            </div>
                        </div>
                    </div>

                    {/* Map Link */}
                    <div className="text-center mt-8">
                        <a
                            href="https://www.google.com/maps/place/Metropolitan+Club/@4.655542,-74.0491041,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3f9a6f4263d69d:0x293372fe71755c24!8m2!3d4.6555367!4d-74.0465292!16s%2Fg%2F1tfjxb82?entry=ttu&g_ep=EgoyMDI2MDEyNS4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2 border border-vintage-sepia/30 text-vintage-sepia hover:bg-vintage-sepia/5 transition-colors text-xs uppercase tracking-wide font-vintage-serif"
                        >
                            <MapPin size={14} />
                            Ver ubicación
                        </a>
                    </div>
                </div>
            </div>

            {/* Ribbon Bow Decoration (positioned above card) */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 opacity-90 z-10">
                <Image
                    src="/vintage/ribbon-bow.png"
                    alt=""
                    fill
                    className="object-contain"
                />
            </div>
        </section>
    );
}
