'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Error: ' + error.message);
    else router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-center">ERP RD</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded border p-3" required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded border p-3" required />
          <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 py-3 text-white">
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
