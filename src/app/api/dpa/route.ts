import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

export async function POST() {
  const { data, error } = await supabase.from('compliance_logs').insert([{ type: 'DPA', details: 'DPA generat din dashboard' }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, data })
}