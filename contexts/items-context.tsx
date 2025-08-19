"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Item, ItemPerdido, ItemEncontrado, FormDataPerdido, FormDataEncontrado } from "@/lib/types"

interface ItemsContextType {
  items: Item[]
  itensPerdidos: ItemPerdido[]
  itensEncontrados: ItemEncontrado[]
  adicionarItemPerdido: (data: FormDataPerdido) => Promise<void>
  adicionarItemEncontrado: (data: FormDataEncontrado) => Promise<void>
  buscarItens: (query: string, categoria?: string, local?: string) => Item[]
  loading: boolean
  recarregarItens: () => Promise<void>
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  const carregarItens = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/items")

      if (!response.ok) {
        throw new Error("Erro ao carregar itens")
      }

      const data = await response.json()
      const todosItens: Item[] = [...data.perdidos, ...data.encontrados]

      // Ordenar por data de criação (mais recentes primeiro)
      todosItens.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())

      setItems(todosItens)
      console.log("[v0] Itens carregados da API:", todosItens.length)
    } catch (error) {
      console.error("[v0] Erro ao carregar itens da API:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarItens()
  }, [])

  const adicionarItemPerdido = async (data: FormDataPerdido) => {
    try {
      console.log("[v0] Iniciando adição de item perdido:", data)

      const response = await fetch("/api/items/perdidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Erro na resposta da API:", errorText)
        throw new Error(`Erro ao adicionar item perdido: ${response.status} - ${errorText}`)
      }

      const novoItem: ItemPerdido = await response.json()
      setItems((prev) => [novoItem, ...prev])
      console.log("[v0] Item perdido adicionado com sucesso:", novoItem)
    } catch (error) {
      console.error("[v0] Erro completo ao adicionar item perdido:", error)
      throw error
    }
  }

  const adicionarItemEncontrado = async (data: FormDataEncontrado) => {
    try {
      console.log("[v0] Iniciando adição de item encontrado:", data)

      const response = await fetch("/api/items/encontrados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Erro na resposta da API:", errorText)
        throw new Error(`Erro ao adicionar item encontrado: ${response.status} - ${errorText}`)
      }

      const novoItem: ItemEncontrado = await response.json()
      setItems((prev) => [novoItem, ...prev])
      console.log("[v0] Item encontrado adicionado com sucesso:", novoItem)
    } catch (error) {
      console.error("[v0] Erro completo ao adicionar item encontrado:", error)
      throw error
    }
  }

  const buscarItens = (query: string, categoria?: string, local?: string): Item[] => {
    return items.filter((item) => {
      const matchQuery =
        query === "" ||
        item.nomeItem.toLowerCase().includes(query.toLowerCase()) ||
        item.descricao.toLowerCase().includes(query.toLowerCase())

      const matchCategoria = !categoria || categoria === "Todos" || item.categoria === categoria

      const matchLocal = !local || local === "" || item.local.toLowerCase().includes(local.toLowerCase())

      return matchQuery && matchCategoria && matchLocal
    })
  }

  const itensPerdidos = items.filter((item): item is ItemPerdido => item.tipo === "perdido")
  const itensEncontrados = items.filter((item): item is ItemEncontrado => item.tipo === "encontrado")

  const value: ItemsContextType = {
    items,
    itensPerdidos,
    itensEncontrados,
    adicionarItemPerdido,
    adicionarItemEncontrado,
    buscarItens,
    loading,
    recarregarItens: carregarItens, // Adicionar função para recarregar dados
  }

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
}

export function useItems() {
  const context = useContext(ItemsContext)
  if (context === undefined) {
    throw new Error("useItems deve ser usado dentro de um ItemsProvider")
  }
  return context
}
