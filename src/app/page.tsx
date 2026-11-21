'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [clients, setClients] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [cui, setCui] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  async function loadAll() {
    const [c, i, ct, l] = await Promise.all([
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').order('created_at', { ascending: false }),
      supabase.from('contracts').select('*').order('created_at', { ascending: false }),
      supabase.from('compliance_logs').select('*').order('created_at', { ascending: false }),
    ])
    if (c.data) setClients(c.data)
    if (i.data) setInvoices(i.data)
    if (ct.data) setContracts(ct.data)
    if (l.data) setLogs(l.data)
    setLoading(false)
  }

  useEffect(() => { loadAll() }, [])

  async function addClient(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setMsg('Scrie numele clientului'); return }
    const { error } = await supabase.from('clients').insert([{ name, email, company, cui }])
    if (error) setMsg('Eroare: ' + error.message)
    else { setMsg('Client adaugat!'); setName(''); setEmail(''); setCompany(''); setCui(''); loadAll() }
  }

  async function generateDPA() {
    const { error } = await supabase.from('compliance_logs').insert([{ type: 'DPA', status: 'generated', content: 'DPA generat - SHIELD OS MVP - verifica si adapteaza la clientul tau.' }])
    if (error) setMsg('Eroare: ' + error.message)
    else { setMsg('DPA generat in compliance_logs!'); loadAll() }
  }

  if (loading) return <main style={{ padding: 24, fontFamily: 'sans-serif' }}>Se incarca SHIELD OS...</main>

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 1100, margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 32, marginBottom: 4 }}>SHIELD OS</h1>
      <p style={{ color: '#475569', marginTop: 0 }}>Revenue + Compliance + Clienti + Operatiuni - EU-first, GDPR + EU AI Act</p>
      {msg && <div style={{ background: '#dcfce7', padding: 12, borderRadius: 8, marginBottom: 16 }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, flex: 1, minWidth: 150 }}><b>{clients.length}</b><br />Clienti</div>
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, flex: 1, minWidth: 150 }}><b>{invoices.length}</b><br />Facturi</div>
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, flex: 1, minWidth: 150 }}><b>{contracts.length}</b><br />Contracte</div>
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, flex: 1, minWidth: 150 }}><b>{logs.length}</b><br />Doc. Compliance</div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <section style={{ background: '#fff', padding: 16, borderRadius: 12, flex: 1, minWidth: 300 }}>
          <h2>Adauga client</h2>
          <form onSubmit={addClient} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nume *" style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Companie" style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
            <input value={cui} onChange={e => setCui(e.target.value)} placeholder="CUI" style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }} />
            <button type="submit" style={{ padding: 12, background: '#0f172a', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer' }}>Salveaza client</button>
          </form>
          <h3 style={{ marginTop: 20 }}>Clienti recenti</h3>
          {clients.length === 0 && <p style={{ color: '#64748b' }}>Niciun client inca. Adauga primul client mai sus.</p>}
          {clients.map((c: any) => (
            <div key={c.id} style={{ borderTop: '1px solid #e2e8f0', padding: '8px 0' }}>
              <b>{c.name}</b> {c.company ? `- ${c.company}` : ''} <br />
              <span style={{ color: '#64748b', fontSize: 13 }}>{c.email || ''} {c.cui ? `| CUI ${c.cui}` : ''}</span>
            </div>
          ))}
        </section>

        <section style={{ background: '#fff', padding: 16, borderRadius: 12, flex: 1, minWidth: 300 }}>
          <h2>Compliance - GDPR</h2>
          <p style={{ color: '#475569' }}>Genereaza DPA / DPIA si salveaza in compliance_logs.</p>
          <button onClick={generateDPA} style={{ padding: 12, background: '#166534', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer', width: '100%' }}>Genereaza DPA</button>
          <h3 style={{ marginTop: 20 }}>Documente generate</h3>
          {logs.length === 0 && <p style={{ color: '#64748b' }}>Niciun document inca.</p>}
          {logs.map((l: any) => (
            <div key={l.id} style={{ borderTop: '1px solid #e2e8f0', padding: '8px 0' }}>
              <b>{l.type}</b> - {l.status} <br />
              <span style={{ color: '#64748b', fontSize: 13 }}>{l.content?.slice(0, 80)}</span>
            </div>
          ))}
          <h3 style={{ marginTop: 20 }}>Facturi: {invoices.length} | Contracte: {contracts.length}</h3>
          <p style={{ color: '#64748b', fontSize: 13 }}>Facturile si contractele se adauga din Supabase / Pasul 4 - Stripe + eFactura. Baza de date e deja pregatita.</p>
        </section>
      </div>
    </main>
  )
}