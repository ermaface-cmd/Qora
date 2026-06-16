'use client'
import { useState } from 'react'

export default function Preventivo() {
  const [voci, setVoci] = useState([{ desc: '', qty: 1, price: '' }])
  const [form, setForm] = useState({ azienda: '', cliente: '', lavoro: '', iva: '8.1', sconto: '0', note: '' })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const aggiungi = () => setVoci([...voci, { desc: '', qty: 1, price: '' }])
  const rimuovi = (i) => setVoci(voci.filter((_, j) => j !== i))
  const updateVoce = (i, k, v) => setVoci(voci.map((r, j) => j === i ? { ...r, [k]: v } : r))

  const imponibile = voci.reduce((s, v) => s + (parseFloat(v.qty) || 0) * (parseFloat(v.price) || 0), 0)
  const sconto = imponibile * (parseFloat(form.sconto) || 0) / 100
  const base = imponibile - sconto
  const iva = base * parseFloat(form.iva) / 100
  const totale = base + iva

  const genera = async () => {
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch('/api/genera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, voci, imponibile, sconto, iva, totale })
      })
      const data = await res.json()
      setOutput(data.testo || 'Errore nella generazione.')
    } catch {
      setOutput('Errore di rete.')
    }
    setLoading(false)
  }

  const s = { input: { width: '100%', padding: '8px 12px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 14, marginBottom: 12, background: '#fff' } }

  return (
    <main style={{ maxWidth: 600, margin: '40px auto', padding: '0 24px 80px' }}>
      <a href="/" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>← Home</a>
      <h1 style={{ fontSize: 22, fontWeight: 500, margin: '16px 0 24px' }}>Nuovo preventivo</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 0 }}>
        <input style={s.input} placeholder="La tua azienda" value={form.azienda} onChange={e => setForm({ ...form, azienda: e.target.value })} />
        <input style={s.input} placeholder="Cliente" value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} />
      </div>

      <input style={s.input} placeholder="Tipo di lavoro / servizio" value={form.lavoro} onChange={e => setForm({ ...form, lavoro: e.target.value })} />

      <div style={{ fontSize: 12, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Voci</div>
      {voci.map((v, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
          <input style={{ ...s.input, marginBottom: 0 }} placeholder="Descrizione" value={v.desc} onChange={e => updateVoce(i, 'desc', e.target.value)} />
          <input style={{ ...s.input, marginBottom: 0 }} type="number" placeholder="Qtà" value={v.qty} onChange={e => updateVoce(i, 'qty', e.target.value)} />
          <input style={{ ...s.input, marginBottom: 0 }} type="number" placeholder="CHF" value={v.price} onChange={e => updateVoce(i, 'price', e.target.value)} />
          <button onClick={() => rimuovi(i)} style={{ background: 'none', border: '0.5px solid #ddd', borderRadius: 8, cursor: 'pointer', padding: '0 10px', color: '#aaa' }}>×</button>
        </div>
      ))}
      <button onClick={aggiungi} style={{ width: '100%', padding: 8, border: '0.5px dashed #ccc', borderRadius: 8, background: 'none', cursor: 'pointer', fontSize: 13, color: '#888', marginBottom: 16 }}>+ Aggiungi voce</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <select style={s.input} value={form.iva} onChange={e => setForm({ ...form, iva: e.target.value })}>
          <option value="0">0% (esente)</option>
          <option value="2.6">2.6%</option>
          <option value="3.8">3.8%</option>
          <option value="8.1">8.1% (CH standard)</option>
        </select>
        <input style={s.input} type="number" placeholder="Sconto %" value={form.sconto} onChange={e => setForm({ ...form, sconto: e.target.value })} />
      </div>

      <textarea style={{ ...s.input, minHeight: 70, resize: 'vertical' }} placeholder="Note aggiuntive (opzionale)" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />

      <div style={{ background: '#f4f4f2', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 4 }}><span>Imponibile</span><span>CHF {imponibile.toFixed(2)}</span></div>
        {parseFloat(form.sconto) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 4 }}><span>Sconto {form.sconto}%</span><span>− CHF {sconto.toFixed(2)}</span></div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 8 }}><span>IVA {form.iva}%</span><span>CHF {iva.toFixed(2)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 500, borderTop: '0.5px solid #ddd', paddingTop: 8 }}><span>Totale</span><span>CHF {totale.toFixed(2)}</span></div>
      </div>

      <button onClick={genera} disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#aaa' : '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: loading ? 'default' : 'pointer' }}>
        {loading ? 'Generazione in corso...' : 'Genera preventivo con AI →'}
      </button>

      {output && (
        <div style={{ marginTop: 20, background: '#fff', border: '0.5px solid #ddd', borderRadius: 10, padding: 16, fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {output}
        </div>
      )}
    </main>
  )
}
