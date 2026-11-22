import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const invoiceId = body.invoiceId
  const { data: inv, error } = await supabase.from('invoices').select('*').eq('id', invoiceId).single()
  if (error || !inv) return NextResponse.json({ error: 'Factura nu a fost gasita' }, { status: 404 })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017</cbc:CustomizationID>
  <cbc:ID>${inv.number || 'FACT'}</cbc:ID>
  <cbc:IssueDate>${new Date().toISOString().slice(0, 10)}</cbc:IssueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>
  <cac:AccountingSupplierParty><cac:Party><cac:PartyName><cbc:Name>SHIELD OS</cbc:Name></cac:PartyName></cac:Party></cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty><cac:Party><cac:PartyName><cbc:Name>${inv.client_name || 'Client'}</cbc:Name></cac:PartyName></cac:Party></cac:AccountingCustomerParty>
  <cac:LegalMonetaryTotal><cbc:PayableAmount currencyID="EUR">${Number(inv.amount) || 0}</cbc:PayableAmount></cac:LegalMonetaryTotal>
  <cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity unitCode="C62">1</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="EUR">${Number(inv.amount) || 0}</cbc:LineExtensionAmount><cac:Item><cbc:Name>SHIELD OS - ${inv.number || 'FACT'}</cbc:Name></cac:Item><cac:Price><cbc:PriceAmount currencyID="EUR">${Number(inv.amount) || 0}</cbc:PriceAmount></cac:Price></cac:InvoiceLine>
</Invoice>`

  await supabase.from('invoices').update({ efactura_status: 'generata' }).eq('id', invoiceId)
  return NextResponse.json({ ok: true, number: inv.number, xml })
}