import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { ItemPerdidoModel } from "@/lib/models/Item"
import type { FormDataPerdido } from "@/lib/types"

export async function GET() {
  try {
    await connectDB()
    const items = await ItemPerdidoModel.find({}).sort({ criadoEm: -1 })

    const transformedItems = items.map((item) => ({
      id: item._id.toString(),
      nomeItem: item.nomeItem,
      descricao: item.descricao,
      categoria: item.categoria,
      local: item.local,
      data: item.data,
      nomeContato: item.nomeContato,
      telefone: item.telefone,
      email: item.email,
      observacoes: item.observacoes,
      criadoEm: item.criadoEm,
      tipo: "perdido" as const,
    }))

    return NextResponse.json(transformedItems)
  } catch (error) {
    console.error("Erro ao buscar itens perdidos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data: FormDataPerdido = await request.json()

    const novoItem = new ItemPerdidoModel({
      ...data,
      criadoEm: new Date().toISOString(),
    })

    const itemSalvo = await novoItem.save()

    const response = {
      id: itemSalvo._id.toString(),
      nomeItem: itemSalvo.nomeItem,
      descricao: itemSalvo.descricao,
      categoria: itemSalvo.categoria,
      local: itemSalvo.local,
      data: itemSalvo.data,
      nomeContato: itemSalvo.nomeContato,
      telefone: itemSalvo.telefone,
      email: itemSalvo.email,
      observacoes: itemSalvo.observacoes,
      criadoEm: itemSalvo.criadoEm,
      tipo: "perdido" as const,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar item perdido:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
