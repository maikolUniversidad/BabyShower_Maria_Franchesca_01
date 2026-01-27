'use client';

import { useState, useEffect } from 'react';
import { Loader2, Lock } from 'lucide-react';

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'rsvp' | 'gifts' | 'messages'>('rsvp');
    const [data, setData] = useState<any[][]>([]);

    const checkAuth = async (pwd: string) => {
        setLoading(true);
        setError('');
        try {
            // Try to fetch RSVP as a check
            const res = await fetch(`/api/admin/rsvp?token=${pwd}`);
            if (res.ok) {
                setIsAuthenticated(true);
                loadData(activeTab, pwd);
            } else {
                setError('Contraseña incorrecta');
            }
        } catch (e) {
            setError('Error al conectar');
        } finally {
            setLoading(false);
        }
    };

    const loadData = async (tab: string, pwd: string = password) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/${tab}?token=${pwd}`);
            if (res.ok) {
                const jsonData = await res.json();
                setData(jsonData);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadData(activeTab);
        }
    }, [activeTab]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        checkAuth(password);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ingresa la contraseña"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                        {(['rsvp', 'gifts', 'messages'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                                        ? 'bg-gray-900 text-white shadow'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        {data[0]?.map((header, i) => (
                                            <th key={i} className="px-6 py-4 font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.slice(1).map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            {row.map((cell, j) => (
                                                <td key={j} className="px-6 py-4 text-gray-700 whitespace-nowrap">
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {data.length <= 1 && (
                                        <tr>
                                            <td colSpan={data[0]?.length || 1} className="px-6 py-8 text-center text-gray-400">
                                                No hay datos para mostrar
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
