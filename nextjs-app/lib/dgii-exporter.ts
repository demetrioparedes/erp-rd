import { supabase } from './supabase';

export async function generate607Report(userId: string, period: string): Promise<string> {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      ncf,
      customers(rnc, name),
      total,
      itbis,
      issued_at
    `)
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

export async function generate606Report(userId: string, period: string): Promise<string> {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('company_id', userId);

  if (error) throw error;

  const lines = data.map(p => {
    const tipoId = p.supplier_rnc.length === 11 ? '2' : '1';
    const fecha = p.purchase_date.replace(/-/g, '');
    return [
      '130513074',
      period,
      p.supplier_rnc.padEnd(11, '0'),
      tipoId,
      p.ncf,
      fecha,
      p.amount.toFixed(2),
      p.itbis.toFixed(2),
      p.isr_withheld.toFixed(2),
      p.itbis_withheld.toFixed(2)
    ].join('|');
  });

  return lines.join('\n');
}

export async function generate608Report(userId: string, period: string): Promise<string> {
  const { data, error } = await supabase
    .from('cancelled_invoices')
    .select('*')
    .eq('company_id', userId);

  if (error) throw error;

  const lines = data.map(c => {
    const fecha = c.cancellation_date.replace(/-/g, '');
    return [
      '130513074',
      period,
      c.ncf,
      fecha
    ].join('|');
  });

  return lines.join('\n');
}

export async function generate609Report(userId: string, period: string): Promise<string> {
  const { data, error } = await supabase
    .from('foreign_payments')
    .select('*')
    .eq('company_id', userId);

  if (error) throw error;

  const lines = data.map(p => {
    return [
      '130513074',
      period,
      p.provider_country,
      p.provider_name,
      p.amount_usd.toFixed(2),
      p.isr_withheld.toFixed(2)
    ].join('|');
  });

  return lines.join('\n');
}

export async function generate623Report(userId: string, period: string): Promise<string> {
  const { data, error } = await supabase
    .from('state_withholdings')
    .select('*')
    .eq('company_id', userId);

  if (error) throw error;

  const lines = data.map(w => {
    return [
      '130513074',
      period,
      w.state_entity,
      w.invoice_ncf,
      w.total_amount.toFixed(2),
      w.withholding_amount.toFixed(2)
    ].join('|');
  });

  return lines.join('\n');
}

export async function generate632Report(userId: string, period: string): Promise<string> {
  const { data, error } = await supabase
    .from('related_party_ops')
    .select('*')
    .eq('company_id', userId);

  if (error) throw error;

  const lines = data.map(op => {
    return [
      '130513074',
      period,
      op.related_party_rnc.padEnd(11, '0'),
      op.relationship_type,
      op.operation_type,
      op.amount.toFixed(2)
    ].join('|');
  });

  return lines.join('\n');
}

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}