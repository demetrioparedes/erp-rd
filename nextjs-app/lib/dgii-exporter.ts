import { supabase } from './supabase';

export async function generate607Report(userId: string, period: string): Promise<string> {
  const { data, error } = await supabase
    .from('invoices')
    .select(
      ncf,
      customers(rnc, name),
      total,
      itbis,
      issued_at
    )
    .eq('company_id', userId);

  if (error) throw error;

  const lines = data.map(inv => {
    const rncCliente = inv.customers?.rnc || '00000000000';
    const tipoId = rncCliente.length === 11 ? '2' : '1';
    const fecha = new Date(inv.issued_at).toISOString().split('T')[0].replace(/-/g, '');
    return [
      '130513074',
      period,
      '1',
      rncCliente.padEnd(11, '0'),
      tipoId,
      inv.ncf,
      fecha,
      inv.total.toFixed(2),
      inv.itbis.toFixed(2)
    ].join('|');
  });

  return lines.join('\n');
}

// ... (otras funciones de exportación ya están en respuestas anteriores)
// Por brevedad, incluimos solo 607 aquí. Puedes agregar las demás después.
export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
