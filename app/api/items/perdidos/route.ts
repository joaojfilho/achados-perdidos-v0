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
    console.log("[v0] API: Iniciando POST para item perdido")

    await connectDB()
    console.log("[v0] API: Conectado ao MongoDB")

    const data: FormDataPerdido = await request.json()
    console.log("[v0] API: Dados recebidos:", data)

    const novoItem = new ItemPerdidoModel({
      ...data,
      criadoEm: new Date().toISOString(),
    })

    console.log("[v0] API: Modelo criado, tentando salvar...")
    const itemSalvo = await novoItem.save()
    console.log("[v0] API: Item salvo com sucesso:", itemSalvo._id)

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

    console.log("[v0] API: Retornando resposta:", response)
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("[v0] API: Erro detalhado ao criar item perdido:", error)
    console.error("[v0] API: Stack trace:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
