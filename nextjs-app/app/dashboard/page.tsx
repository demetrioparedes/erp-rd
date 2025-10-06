'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/');
      else { setUser(session.user); setLoading(false); }
    };
    check();
  }, [router]);

  if (loading) return <div>Cargando...</div>;
  return <div>Bienvenido, {user?.email}!</div>;
}
