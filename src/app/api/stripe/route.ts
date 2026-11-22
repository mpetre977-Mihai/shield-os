import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const amount = Number(body.amount) || 97
  const invoiceNumber = body.invoiceNumber || 'FACT'
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return NextResponse.json({ error: 'Lipseste STRIPE_SECRET_KEY in Vercel. Pune cheia in Settings -> Environment Variables.' }, { status: 500 })

  const params = new URLSearchParams()
  params.append('mode', 'payment')
  params.append('success_url', 'https://shield-os-eight.vercel.app/?plata=succes')
  params.append('cancel_url', 'https://shield-os-eight.vercel.app/?plata=anulata')
  params.append('managed_payments[enabled]', 'false')
  params.append('line_items[0][price_data][currency]', 'eur')
  params.append('line_items[0][price_data][product_data][name]', 'SHIELD OS - ' + invoiceNumber)
  params.append('line_items[0][price_data][product_data][tax_code]', 'txcd_10000000')
  params.append('line_items[0][price_data][unit_amount]', String(Math.round(amount * 100)))
  params.append('line_items[0][quantity]', '1')

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + secret, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Eroare Stripe' }, { status: 500 })
  return NextResponse.json({ ok: true, url: data.url })
}