'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [clients, setClients] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [invNumber, setInvNumber] = useState('')
  const [invClient, setInvClient] = useState('')
  const [invAmount, setInvAmount] = useState('')
  const [conTitle, setConTitle] = useState('')
  const [conClient, setConClient] = useState('')
  const [conAmount, setConAmount] = useState('')
  const [taskTitle, setTaskTitle] = useState('')

  async function loadAll() {
    try {
      const [r1, r2, r3, r4] = await Promise.all([fetch('/api/clients'), fetch('/api/invoices'), fetch('/api/contracts'), fetch('/api/tasks')])
      const c = await r1.json()
      const i = await r2.json()
      const co = await r3.json()
      const t = await r4.json()
      setClients(Array.isArray(c) ? c : [])
      setInvoices(Array.isArray(i) ? i : [])
      setContracts(Array.isArray(co) ? co : [])
      setTasks(Array.isArray(t) ? t : [])
      setMsg('OK: Clienti ' + (Array.isArray(c) ? c.length : 0) + ', Facturi ' + (Array.isArray(i) ? i.length : 0) + ', Contracte ' + (Array.isArray(co) ? co.length : 0) + ', Tasks ' + (Array.isArray(t) ? t.length : 0))
    } catch (e: any) { setMsg('Eroare retea: ' + e.message) }
  }

  async function addClient() {
    const res = await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, company }) })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare adaugare client: ' + data.error); return }
    setMsg('Client adaugat!')
    setName(''); setEmail(''); setCompany('')
    loadAll()
  }

  async function addInvoice() {
    const res = await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ number: invNumber, client_name: invClient, amount: invAmount, status: 'draft' }) })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare factura: ' + data.error); return }
    setMsg('Factura adaugata!')
    setInvNumber(''); setInvClient(''); setInvAmount('')
    loadAll()
  }

  async function addContract() {
    const res = await fetch('/api/contracts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: conTitle, client_name: conClient, amount: conAmount, status: 'draft' }) })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare contract: ' + data.error); return }
    setMsg('Contract adaugat!')
    setConTitle(''); setConClient(''); setConAmount('')
    loadAll()
  }

  async function addTask() {
    const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: taskTitle, status: 'todo' }) })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare task: ' + data.error); return }
    setMsg('Task adaugat!')
    setTaskTitle('')
    loadAll()
  }

  async function genDPA() {
    const res = await fetch('/api/dpa', { method: 'POST' })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare DPA: ' + data.error); return }
    setMsg('DPA generat!')
  }

  async function genDPIA() {
    const res = await fetch('/api/dpia', { method: 'POST' })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare DPIA: ' + data.error); return }
    setMsg('DPIA generat!')
  }

  async function delClient(id: string) {
    if (!confirm('Stergi acest client?')) return
    const res = await fetch('/api/clients?id=' + id, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare stergere: ' + data.error); return }
    setMsg('Client sters!')
    loadAll()
  }

  async function delInvoice(id: string) {
    if (!confirm('Stergi aceasta factura?')) return
    const res = await fetch('/api/invoices?id=' + id, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare stergere: ' + data.error); return }
    setMsg('Factura stearsa!')
    loadAll()
  }

  async function delContract(id: string) {
    if (!confirm('Stergi acest contract?')) return
    const res = await fetch('/api/contracts?id=' + id, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare stergere: ' + data.error); return }
    setMsg('Contract sters!')
    loadAll()
  }

  async function delTask(id: string) {
    if (!confirm('Stergi acest task?')) return
    const res = await fetch('/api/tasks?id=' + id, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare stergere: ' + data.error); return }
    setMsg('Task sters!')
    loadAll()
  }

  async function payStripe(inv: any) {
    setMsg('Se deschide Stripe...')
    const res = await fetch('/api/stripe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ invoiceId: inv.id, invoiceNumber: inv.number, amount: inv.amount }) })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare plata Stripe: ' + data.error); return }
    window.location.href = data.url
  }

  async function genEfactura(inv: any) {
    const res = await fetch('/api/efactura', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ invoiceId: inv.id }) })
    const data = await res.json()
    if (!res.ok) { setMsg('Eroare eFactura: ' + data.error); return }
    const blob = new Blob([data.xml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'eFactura-' + (data.number || 'FACT') + '.xml'
    a.click()
    URL.revokeObjectURL(url)
    setMsg('eFactura generata si descarcata! XML UBL ANAF pentru ' + data.number + '. Incarca fisierul manual in SPV, fara certificat nu se poate trimite automat.')
    loadAll()
  }

  useEffect(() => { loadAll() }, [])

  const inputStyle = { color: '#000', background: '#fff', border: '1px solid #000', padding: '10px', width: '100%', marginBottom: '8px' } as const
  const btnStyle = { padding: '10px', background: '#000', color: '#fff', cursor: 'pointer', marginRight: '10px' } as const
  const delStyle = { padding: '6px 10px', background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', marginLeft: '6px' } as const
  const boxStyle = { border: '1px solid #000', padding: '12px', marginBottom: '16px' } as const

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto', background: '#fff', color: '#000', minHeight: '100vh' }}>
      <h1>SHIELD OS</h1>
      <p><b>Clienti:</b> {clients.length} | <b>Facturi:</b> {invoices.length} | <b>Contracte:</b> {contracts.length} | <b>Tasks:</b> {tasks.length}</p>
      <p><b>Mesaj:</b> {msg}</p>

      <div style={boxStyle}>
        <h2>Clienti</h2>
        <input style={inputStyle} placeholder="Nume" value={name} onChange={e => setName(e.target.value)} />
        <input style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={inputStyle} placeholder="Companie" value={company} onChange={e => setCompany(e.target.value)} />
        <button onClick={addClient} style={btnStyle}>Adauga client</button>
        <button onClick={genDPA} style={btnStyle}>Genereaza DPA</button>
        <button onClick={genDPIA} style={btnStyle}>Genereaza DPIA</button>
        {clients.map((c: any) => (<div key={c.id} style={{ border: '1px solid #ccc', padding: '8px', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}><span>{c.name} - {c.email} - {c.company}</span><button onClick={() => delClient(c.id)} style={delStyle}>Sterge</button></div>))}
      </div>

      <div style={boxStyle}>
        <h2>Facturi - Stripe Real + eFactura</h2>
        <input style={inputStyle} placeholder="Numar factura, ex FACT-001" value={invNumber} onChange={e => setInvNumber(e.target.value)} />
        <input style={inputStyle} placeholder="Client" value={invClient} onChange={e => setInvClient(e.target.value)} />
        <input style={inputStyle} placeholder="Suma, ex 97" value={invAmount} onChange={e => setInvAmount(e.target.value)} />
        <button onClick={addInvoice} style={btnStyle}>Adauga factura</button>
        {invoices.map((x: any) => (<div key={x.id} style={{ border: '1px solid #ccc', padding: '8px', marginTop: '6px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{x.number} - {x.client_name} - {x.amount} EUR - {x.status} {x.payment_status ? ' | Plata: ' + x.payment_status : ''} {x.efactura_status ? ' | eFactura: ' + x.efactura_status : ''}</span><button onClick={() => delInvoice(x.id)} style={delStyle}>Sterge</button></div><div style={{ marginTop: '6px' }}><button onClick={() => payStripe(x)} style={btnStyle}>Plateste cu Stripe</button><button onClick={() => genEfactura(x)} style={btnStyle}>Genereaza eFactura</button></div></div>))}
      </div>

      <div style={boxStyle}>
        <h2>Contracte</h2>
        <input style={inputStyle} placeholder="Titlu contract" value={conTitle} onChange={e => setConTitle(e.target.value)} />
        <input style={inputStyle} placeholder="Client" value={conClient} onChange={e => setConClient(e.target.value)} />
        <input style={inputStyle} placeholder="Suma, ex 297" value={conAmount} onChange={e => setConAmount(e.target.value)} />
        <button onClick={addContract} style={btnStyle}>Adauga contract</button>
        {contracts.map((x: any) => (<div key={x.id} style={{ border: '1px solid #ccc', padding: '8px', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}><span>{x.title} - {x.client_name} - {x.amount} EUR - {x.status}</span><button onClick={() => delContract(x.id)} style={delStyle}>Sterge</button></div>))}
      </div>

      <div style={boxStyle}>
        <h2>Tasks</h2>
        <input style={inputStyle} placeholder="Titlu task, ex Suna clientul" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
        <button onClick={addTask} style={btnStyle}>Adauga task</button>
        {tasks.map((x: any) => (<div key={x.id} style={{ border: '1px solid #ccc', padding: '8px', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}><span>{x.title} - {x.status}</span><button onClick={() => delTask(x.id)} style={delStyle}>Sterge</button></div>))}
      </div>
    </main>
  )
}