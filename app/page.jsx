import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: '#1D9E75', marginBottom: 16
        }} />
        <h1 style={{ fontSize: 32, fontWeight: 500, marginBottom: 8 }}>Offerto</h1>
        <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
          Preventivi e fatture professionali in secondi.
          Per artigiani, freelance e PMI.
        </p>
      </div>

      <Link href="/preventivo" style={{
        display: 'inline-block',
        background: '#1D9E75',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: 8,
        textDecoration: 'none',
        fontSize: 15,
        fontWeight: 500
      }}>
        Crea un preventivo →
      </Link>
    </main>
  )
}
