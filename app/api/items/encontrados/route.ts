import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { ItemEncontradoModel } from "@/lib/models/Item"
import type { FormDataEncontrado } from "@/lib/types"

export async function GET() {
  try {
    await connectDB()
    const items = await ItemEncontradoModel.find({}).sort({ criadoEm: -1 })

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
      tipo: "encontrado" as const,
      localEncontrado: item.localEncontrado,
      dataEncontrada: item.dataEncontrada,
      localGuardado: item.localGuardado,
    }))

    return NextResponse.json(transformedItems)
  } catch (error) {
    console.error("Erro ao buscar itens encontrados:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API: Iniciando POST para item encontrado")

    await connectDB()
    console.log("[v0] API: Conectado ao MongoDB")

    const data: FormDataEncontrado = await request.json()
    console.log("[v0] API: Dados recebidos:", data)

    const novoItem = new ItemEncontradoModel({
      nomeItem: data.nomeItem,
      descricao: data.descricao,
      categoria: data.categoria,
      local: data.localEncontrado, // Map localEncontrado to local field
      data: data.dataEncontrada, // Map dataEncontrada to data field
      nomeContato: data.nomeContato,
      telefone: data.telefone,
      email: data.email,
      observacoes: data.observacoes,
      localEncontrado: data.localEncontrado,
      dataEncontrada: data.dataEncontrada,
      localGuardado: data.localGuardado,
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
      tipo: "encontrado" as const,
      localEncontrado: itemSalvo.localEncontrado,
      dataEncontrada: itemSalvo.dataEncontrada,
      localGuardado: itemSalvo.localGuardado,
    }

    console.log("[v0] API: Retornando resposta:", response)
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("[v0] API: Erro detalhado ao criar item encontrado:", error)
    console.error("[v0] API: Stack trace:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}
