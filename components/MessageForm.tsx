'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, Send, Loader2 } from 'lucide-react';
import FloatingMessages from './FloatingMessages';

const messageSchema = z.object({
    name: z.string().min(1, 'Dinos quién eres'),
    message: z.string().min(1, 'Escribe un mensaje bonito'),
});

type MessageData = z.infer<typeof messageSchema>;

export default function MessageForm() {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [messages, setMessages] = useState<{ name: string, message: string }[]>([]);

    useEffect(() => {
        fetch('/api/messages')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMessages(data);
            })
            .catch(console.error);
    }, [success]); // Refresh on success

    const { register, handleSubmit, reset, formState: { errors } } = useForm<MessageData>({
        resolver: zodResolver(messageSchema)
    });

    const onSubmit = async (data: MessageData) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSuccess(true);
                reset();
                setTimeout(() => setSuccess(false), 5000);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="space-y-12">
            <div className="bg-pink-50 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="relative z-10 max-w-lg mx-auto">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-6 shadow-sm">
                        <Heart className="w-6 h-6 text-pink-500 fill-current" />
                    </div>

                    <h2 className="text-3xl font-serif text-gray-800 mb-2">Déjanos un Mensaje</h2>
                    <p className="text-gray-600 mb-8">Escribe tus buenos deseos para el bebé y los papás.</p>

                    {success ? (
                        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-green-700 font-medium animate-in zoom-in">
                            ¡Gracias por tus bellas palabras! 💌
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input
                                {...register('name')}
                                className="w-full px-5 py-3 rounded-full border-none bg-white shadow-sm focus:ring-2 focus:ring-pink-300 placeholder:text-gray-400 outline-none"
                                placeholder="Tu nombre"
                            />
                            {errors.name && <p className="text-red-500 text-xs text-left px-4">{errors.name.message}</p>}

                            <textarea
                                {...register('message')}
                                rows={4}
                                className="w-full px-5 py-4 rounded-3xl border-none bg-white shadow-sm focus:ring-2 focus:ring-pink-300 placeholder:text-gray-400 outline-none resize-none"
                                placeholder="Escribe tu mensaje aquí..."
                            />
                            {errors.message && <p className="text-red-500 text-xs text-left px-4">{errors.message.message}</p>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                    <>
                                        <Send className="w-4 h-4" /> Enviar Mensaje
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Messages Animation */}
            {messages.length > 0 && (
                <div className="w-full">
                    <h3 className="text-center font-serif text-2xl text-gray-800 mb-8">Mensajes de Cariño</h3>
                    <FloatingMessages messages={messages} />
                </div>
            )}
        </section>
    );
}
