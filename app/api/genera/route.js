export async function POST(req) {
  const { form, voci, imponibile, sconto, iva, totale } = await req.json()

  const vociStr = voci
    .filter(v => v.desc)
    .map(v => `- ${v.desc}: ${v.qty} × CHF ${parseFloat(v.price).toFixed(2)} = CHF ${(v.qty * v.price).toFixed(2)}`)
    .join('\n')

  const prompt = `Sei un assistente professionale svizzero. Scrivi un preventivo formale in italiano con questi dati:

Azienda: ${form.azienda || 'N/D'}
Cliente: ${form.cliente || 'N/D'}
Lavoro: ${form.lavoro || 'N/D'}
${vociStr ? `Voci:\n${vociStr}` : ''}
Imponibile: CHF ${imponibile.toFixed(2)}
${parseFloat(form.sconto) > 0 ? `Sconto ${form.sconto}%: − CHF ${sconto.toFixed(2)}` : ''}
IVA ${form.iva}%: CHF ${iva.toFixed(2)}
Totale: CHF ${totale.toFixed(2)}
${form.note ? `Note: ${form.note}` : ''}

Scrivi un preventivo professionale svizzero con: oggetto, descrizione lavori, riepilogo economico, condizioni pagamento 30 giorni, validità offerta 30 giorni, saluti formali. Tono diretto e professionale.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await res.json()
  const testo = data.content?.[0]?.text || 'Errore nella generazione.'
  return Response.json({ testo })
}
