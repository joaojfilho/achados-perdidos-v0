import mongoose, { Schema, type Document } from "mongoose"
import type { ItemPerdido, ItemEncontrado } from "@/lib/types"

export interface ItemPerdidoDocument extends Omit<ItemPerdido, "id">, Document {
  _id: string
}

export interface ItemEncontradoDocument extends Omit<ItemEncontrado, "id">, Document {
  _id: string
}

const ItemBaseSchema = {
  nomeItem: { type: String, required: true },
  descricao: { type: String, required: true },
  categoria: { type: String, required: true },
  local: { type: String, required: true },
  data: { type: String, required: true },
  nomeContato: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true },
  observacoes: { type: String, default: "" },
  criadoEm: { type: String, default: () => new Date().toISOString() },
}

const ItemPerdidoSchema = new Schema(
  {
    ...ItemBaseSchema,
    tipo: { type: String, default: "perdido", immutable: true },
  },
  {
    timestamps: true,
    collection: "itens_perdidos",
  },
)

const ItemEncontradoSchema = new Schema(
  {
    ...ItemBaseSchema,
    tipo: { type: String, default: "encontrado", immutable: true },
    localEncontrado: { type: String, required: true },
    dataEncontrada: { type: String, required: true },
    localGuardado: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "itens_encontrados",
  },
)

export const ItemPerdidoModel =
  mongoose.models.ItemPerdido || mongoose.model<ItemPerdidoDocument>("ItemPerdido", ItemPerdidoSchema)
export const ItemEncontradoModel =
  mongoose.models.ItemEncontrado || mongoose.model<ItemEncontradoDocument>("ItemEncontrado", ItemEncontradoSchema)
