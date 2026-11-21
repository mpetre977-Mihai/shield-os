import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(req: Request) {
  const body = await req.json()
  const { data, error } = await supabase.from('clients').insert([{ name: body.name, email: body.email, company: body.company }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}