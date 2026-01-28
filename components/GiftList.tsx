'use client';

import { useState, useEffect } from 'react';
import { Gift } from '@/types';
import { Gift as GiftIcon, ExternalLink, User, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function GiftList() {
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchGifts = async () => {
        try {
            const res = await fetch('/api/gifts');
            const data = await res.json();
            if (Array.isArray(data)) {
                setGifts(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGifts();
    }, []);

    const openClaimModal = (gift: Gift) => {
        setSelectedGift(gift);
        setIsModalOpen(true);
    };

    const closeClaimModal = () => {
        setIsModalOpen(false);
        setSelectedGift(null);
    };

    const onClaimSuccess = () => {
        closeClaimModal();
        fetchGifts(); // Refresh data
    };

    const handleUnclaim = async (giftId: string) => {
        const confirmed = window.confirm("¿Estás seguro? Este regalo ya es tuyo y vas a quitar la selección.");
        if (!confirmed) return;

        try {
            const res = await fetch('/api/gifts/unclaim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gift_id: giftId }),
            });

            if (res.ok) {
                fetchGifts();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al liberar el regalo');
            }
        } catch (e) {
            console.error(e);
            alert('Error al liberar el regalo');
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl font-serif text-gray-800 mb-2">Lista de Regalos</h2>
                <p className="text-gray-500">
                    Estos son algunos detalles que nos gustarían para Maria Franchesca. Si decides regalarnos algo de la lista, por favor márcalo como "Seleccionado" para evitar repetidos.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gifts.map((gift) => (
                    <GiftCard
                        key={gift.gift_id}
                        gift={gift}
                        onClaim={() => openClaimModal(gift)}
                        onUnclaim={() => handleUnclaim(gift.gift_id)}
                    />
                ))}
            </div>

            {isModalOpen && selectedGift && (
                <ClaimModal gift={selectedGift} onClose={closeClaimModal} onSuccess={onClaimSuccess} />
            )}
        </div>
    );
}

function getDirectImageUrl(url: string) {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
        const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
            // Using lh3.googleusercontent.com which is often more reliable for direct embedding
            return `https://lh3.googleusercontent.com/d/${idMatch[1]}=s1000`;
        }
    }
    return url;
}

function GiftCard({ gift, onClaim, onUnclaim }: { gift: Gift; onClaim: () => void; onUnclaim: () => void }) {
    const isClaimed = gift.status === 'claimed' || gift.status === 'disqualified';

    return (
        <div className={clsx(
            "group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md flex flex-col h-full",
            isClaimed && "bg-gray-50 opacity-90"
        )}>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                {gift.image_url ? (
                    <img
                        src={getDirectImageUrl(gift.image_url)}
                        alt={gift.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <GiftIcon className="w-12 h-12" />
                    </div>
                )}

                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                    {gift.type === 'unlimited' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white backdrop-blur-sm shadow-sm">
                            Multi-Padrino
                        </span>
                    ) : isClaimed ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100/90 text-red-800 backdrop-blur-sm">
                            No disponible
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/90 text-white backdrop-blur-sm">
                            Disponible
                        </span>
                    )}
                </div>
            </div>

            <h3 className="text-xl font-medium text-gray-900 mb-2">{gift.title}</h3>

            {gift.notes && (
                <div className="mb-4 flex-grow">
                    <p className="text-sm italic text-gray-600 border-l-2 border-vintage-sepia/20 pl-3 py-1 bg-vintage-cream/30 rounded-r-lg">
                        {gift.notes}
                    </p>
                </div>
            )}

            <div className="mt-auto space-y-3 pt-4 border-t border-gray-50">
                {gift.store_url && (
                    <a
                        href={gift.store_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Ver tienda
                    </a>
                )}

                {/* Action Button Logic */}
                {gift.type === 'unlimited' ? (
                    <button
                        onClick={onClaim}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <GiftIcon className="w-4 h-4" />
                        Regalar también
                    </button>
                ) : isClaimed ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                            <User className="w-4 h-4" />
                            <span>Seleccionado por {gift.claimed_by}</span>
                        </div>
                        <button
                            onClick={onUnclaim}
                            className="w-full py-2 bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-medium"
                        >
                            Escoger otro regalo diferente
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onClaim}
                        className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                    >
                        Seleccionar Regalo
                    </button>
                )}
            </div>
        </div>
    );
}

function ClaimModal({ gift, onClose, onSuccess }: { gift: Gift; onClose: () => void; onSuccess: () => void }) {
    const [error, setError] = useState<string | null>(null);
    const [availableNames, setAvailableNames] = useState<string[]>([]);
    const [loadingNames, setLoadingNames] = useState(true);
    const [selectedName, setSelectedName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchNames() {
            try {
                const res = await fetch('/api/rsvp-names');
                const names = await res.json();
                setAvailableNames(names);
            } catch (e) {
                console.error('Error fetching names:', e);
                setError('No se pudieron cargar los nombres disponibles');
            } finally {
                setLoadingNames(false);
            }
        }
        fetchNames();
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedName) {
            setError('Por favor selecciona un nombre');
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/gifts/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gift_id: gift.gift_id,
                    name: selectedName,
                    phone: '',
                    email: ''
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Error desconocido');
            }

            onSuccess();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div
                className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Seleccionar Regalo</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Estás seleccionando: <span className="font-medium text-gray-800">{gift.title}</span>
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Selecciona tu nombre</label>
                        {loadingNames ? (
                            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-400 text-center">
                                <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                                Cargando nombres...
                            </div>
                        ) : availableNames.length === 0 ? (
                            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-500 text-center text-sm">
                                No hay nombres disponibles.
                            </div>
                        ) : (
                            <select
                                value={selectedName}
                                onChange={(e) => setSelectedName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                                required
                            >
                                <option value="">-- Selecciona tu nombre --</option>
                                {availableNames.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2.5 px-4 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedName || availableNames.length === 0}
                            className="py-2.5 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
