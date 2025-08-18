"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, MapPin, Calendar, Phone, Mail, Eye, AlertCircle } from "lucide-react"
import { useItems } from "@/contexts/items-context"
import type { Item } from "@/lib/types"

const categorias = [
  "Todos",
  "Eletrônicos",
  "Documentos",
  "Roupas e Acessórios",
  "Bolsas e Carteiras",
  "Chaves",
  "Joias",
  "Óculos",
  "Livros",
  "Brinquedos",
  "Outros",
]

export default function BuscarPage() {
  const { itensPerdidos, itensEncontrados, buscarItens, loading } = useItems()
  const [busca, setBusca] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos")
  const [localFiltro, setLocalFiltro] = useState("")
  const [tipoAtivo, setTipoAtivo] = useState("perdidos")

  const itensFiltrados = useMemo(() => {
    const itensAtivos = tipoAtivo === "perdidos" ? itensPerdidos : itensEncontrados
    return buscarItens(busca, categoriaFiltro, localFiltro).filter((item) => item.tipo === tipoAtivo)
  }, [buscarItens, busca, categoriaFiltro, localFiltro, tipoAtivo, itensPerdidos, itensEncontrados])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando itens...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Buscar Itens</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="busca">Buscar por nome ou descrição</Label>
                <Input
                  id="busca"
                  placeholder="Digite o que você está procurando..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Input
                  id="local"
                  placeholder="Filtrar por local..."
                  value={localFiltro}
                  onChange={(e) => setLocalFiltro(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs para alternar entre perdidos e encontrados */}
        <Tabs value={tipoAtivo} onValueChange={setTipoAtivo} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="perdidos" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Itens Perdidos ({itensPerdidos.length})
            </TabsTrigger>
            <TabsTrigger value="encontrados" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Itens Encontrados ({itensEncontrados.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="perdidos" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itensFiltrados.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            {itensFiltrados.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum item encontrado</h3>
                <p className="text-muted-foreground">
                  {itensPerdidos.length === 0
                    ? "Ainda não há itens perdidos reportados."
                    : "Tente ajustar os filtros ou buscar por outros termos."}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="encontrados" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itensFiltrados.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            {itensFiltrados.length === 0 && (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum item encontrado</h3>
                <p className="text-muted-foreground">
                  {itensEncontrados.length === 0
                    ? "Ainda não há itens encontrados reportados."
                    : "Tente ajustar os filtros ou buscar por outros termos."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ItemCard({ item }: { item: Item }) {
  const isPerdido = item.tipo === "perdido"

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{item.nomeItem}</CardTitle>
          <Badge variant={isPerdido ? "destructive" : "secondary"}>{isPerdido ? "Perdido" : "Encontrado"}</Badge>
        </div>
        <Badge variant="outline" className="w-fit">
          {item.categoria}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">{item.descricao}</CardDescription>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              {isPerdido ? "Perdido em:" : "Encontrado em:"} {item.local}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date(item.data).toLocaleDateString("pt-BR")}</span>
          </div>
          {!isPerdido && "localGuardado" in item && item.localGuardado && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>Guardado em: {item.localGuardado}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium text-foreground mb-2">Contato:</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            {item.nomeContato && <p>{item.nomeContato}</p>}
            {item.telefone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>{item.telefone}</span>
              </div>
            )}
            {item.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>{item.email}</span>
              </div>
            )}
          </div>
        </div>

        <Button className="w-full" size="sm">
          {isPerdido ? "Este é meu item" : "Entrar em contato"}
        </Button>
      </CardContent>
    </Card>
  )
}
