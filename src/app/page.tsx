'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [clients, setClients] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')

  async function loadData() {
    try {
      const res = await fetch('/api/clients')
      const data = await res.json()
      if (!res.ok) { setMsg('Eroare: ' + (data.error || 'Eroare server')); setClients([]); return }
      setClients(data)
      setMsg('OK, clienti incarcati: ' + data.length)
    } catch (e: any) {
      setMsg('Eroare retea: ' + e.message)
    }
  }

  async function addClient() {
    const res = await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, company }) })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare adaugare: ' + data.error); return }
    setMsg('Client adaugat!')
    setName(''); setEmail(''); setCompany('')
    loadData()
  }

  async function genDPA() {
    const res = await fetch('/api/dpa', { method: 'POST' })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare DPA: ' + data.error); return }
    setMsg('DPA generat!')
  }

  useEffect(() => { loadData() }, [])

  const inputStyle = { color: '#000', background: '#fff', border: '1px solid #000', padding: '10px', width: '100%', marginBottom: '8px' } as const

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', background: '#fff', color: '#000', minHeight: '100vh' }}>
      <h1>SHIELD OS</h1>
      <p><b>Clienti:</b> {clients.length}</p>
      <p><b>Mesaj:</b> {msg}</p>
      <h2>Adauga client</h2>
      <input style={inputStyle} placeholder="Nume" value={name} onChange={e => setName(e.target.value)} />
      <input style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input style={inputStyle} placeholder="Companie" value={company} onChange={e => setCompany(e.target.value)} />
      <button onClick={addClient} style={{ padding: '10px', background: '#000', color: '#fff', cursor: 'pointer', marginRight: '10px' }}>Adauga client</button>
      <button onClick={genDPA} style={{ padding: '10px', background: '#000', color: '#fff', cursor: 'pointer' }}>Genereaza DPA</button>
      <h2>Lista clienti</h2>
      {clients.map((c: any) => (
        <div key={c.id} style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '6px' }}>
          {c.name} - {c.email} - {c.company}
        </div>
      ))}
    </main>
  )
}