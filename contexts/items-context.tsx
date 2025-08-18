"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Item, ItemPerdido, ItemEncontrado, FormDataPerdido, FormDataEncontrado } from "@/lib/types"

interface ItemsContextType {
  items: Item[]
  itensPerdidos: ItemPerdido[]
  itensEncontrados: ItemEncontrado[]
  adicionarItemPerdido: (data: FormDataPerdido) => void
  adicionarItemEncontrado: (data: FormDataEncontrado) => void
  buscarItens: (query: string, categoria?: string, local?: string) => Item[]
  loading: boolean
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

const STORAGE_KEY = "achados-perdidos-items"

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY)
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems)
        setItems(parsedItems)
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar itens do localStorage:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Salvar dados no localStorage sempre que items mudar
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error("[v0] Erro ao salvar itens no localStorage:", error)
      }
    }
  }, [items, loading])

  const adicionarItemPerdido = (data: FormDataPerdido) => {
    const novoItem: ItemPerdido = {
      id: crypto.randomUUID(),
      tipo: "perdido",
      nomeItem: data.nomeItem,
      descricao: data.descricao,
      categoria: data.categoria,
      local: data.local,
      data: data.data,
      nomeContato: data.nomeContato,
      telefone: data.telefone,
      email: data.email,
      observacoes: data.observacoes,
      criadoEm: new Date().toISOString(),
    }

    setItems((prev) => [novoItem, ...prev])
    console.log("[v0] Item perdido adicionado:", novoItem)
  }

  const adicionarItemEncontrado = (data: FormDataEncontrado) => {
    const novoItem: ItemEncontrado = {
      id: crypto.randomUUID(),
      tipo: "encontrado",
      nomeItem: data.nomeItem,
      descricao: data.descricao,
      categoria: data.categoria,
      local: data.localEncontrado,
      data: data.dataEncontrada,
      localEncontrado: data.localEncontrado,
      dataEncontrada: data.dataEncontrada,
      localGuardado: data.localGuardado,
      nomeContato: data.nomeContato,
      telefone: data.telefone,
      email: data.email,
      observacoes: data.observacoes,
      criadoEm: new Date().toISOString(),
    }

    setItems((prev) => [novoItem, ...prev])
    console.log("[v0] Item encontrado adicionado:", novoItem)
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
