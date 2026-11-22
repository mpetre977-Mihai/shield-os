import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(req: Request) {
  const body = await req.json()
  const { data, error } = await supabase.from('invoices').insert([{ number: body.number, client_name: body.client_name, amount: Number(body.amount) || 0, status: body.status || 'draft', details: body.details || '' }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}