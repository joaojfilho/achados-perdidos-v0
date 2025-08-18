import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { ItemPerdidoModel, ItemEncontradoModel } from "@/lib/models/Item"

export async function GET() {
  try {
    await connectDB()

    const [itensPerdidos, itensEncontrados] = await Promise.all([
      ItemPerdidoModel.find({}).sort({ criadoEm: -1 }),
      ItemEncontradoModel.find({}).sort({ criadoEm: -1 }),
    ])

    const perdidosTransformados = itensPerdidos.map((item) => ({
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

    const encontradosTransformados = itensEncontrados.map((item) => ({
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

    return NextResponse.json({
      perdidos: perdidosTransformados,
      encontrados: encontradosTransformados,
    })
  } catch (error) {
    console.error("Erro ao buscar todos os itens:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
