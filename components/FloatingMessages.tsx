'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue } from 'framer-motion';
import { X, Quote } from 'lucide-react';

interface Message {
    name: string;
    message: string;
    timestamp?: string;
}

export default function FloatingMessages({ messages }: { messages: Message[] }) {
    const [selected, setSelected] = useState<Message | null>(null);
    // Duplicate messages to create seamless loop if there are enough
    const displayMessages = messages.length > 0
        ? [...messages, ...messages, ...messages] // Triple it for safety
        : [];

    return (
        <div className="relative w-full py-12 overflow-hidden">

            {/* Background Wind/Flow Effect Elements could go here */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-stone-50 via-transparent to-stone-50 z-10" />

            {messages.length === 0 ? (
                <div className="text-center text-gray-400 italic">Sé el primero en dejar un mensaje...</div>
            ) : (
                <div className="flex">
                    <motion.div
                        className="flex gap-6 px-6"
                        animate={{
                            x: ["0%", "-50%"]
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: Math.max(20, messages.length * 5), // Adjust speed based on count
                                ease: "linear",
                            },
                        }}
                        whileHover={{ animationPlayState: 'paused' }} // CSS alternative or logic to pause
                    // Note: framer-motion doesn't support pause on hover directly in animate prop easily without controls. 
                    // We will settle for simple continuous scroll for now, or just let users click moving targets (they are slow).
                    >
                        {displayMessages.map((msg, idx) => (
                            <MessageCard
                                key={`${idx}-${msg.name}`}
                                msg={msg}
                                onClick={() => setSelected(msg)}
                            />
                        ))}
                    </motion.div>
                </div>
            )}

            {/* Modal / Main View */}
            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)}
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        />
                        <motion.div
                            layoutId={`msg-${selected.name}`}
                            className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full relative z-10 m-4"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        >
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>

                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                                    <Quote className="w-8 h-8 text-pink-500 fill-current opacity-50" />
                                </div>
                            </div>

                            <p className="text-xl md:text-2xl font-serif text-gray-800 text-center italic mb-8 leading-relaxed">
                                "{selected.message}"
                            </p>

                            <div className="flex flex-col items-center">
                                <div className="w-10 h-1 bg-pink-200 rounded-full mb-3" />
                                <h4 className="font-medium text-gray-900">{selected.name}</h4>
                                <span className="text-xs text-gray-400 mt-1">Mensaje de Baby Shower</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MessageCard({ msg, onClick }: { msg: Message; onClick: () => void }) {
    // Random slight rotation for "floating leaf" feel
    const rotation = Math.random() * 6 - 3; // -3 to 3 degrees

    return (
        <motion.div
            onClick={onClick}
            className="flex-shrink-0 w-80 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            whileHover={{
                y: -10,
                rotate: 0,
                scale: 1.02
            }}
            initial={{ rotate: rotation }}
        >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-50 to-transparent -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-150 duration-500" />

            <p className="text-gray-600 italic mb-4 line-clamp-4 relative z-10">"{msg.message}"</p>

            <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 font-bold text-xs uppercase border border-pink-100">
                    {msg.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-900">{msg.name}</span>
            </div>
        </motion.div>
    );
}
