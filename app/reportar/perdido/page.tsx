"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, MapPin, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useItems } from "@/contexts/items-context"
import type { FormDataPerdido } from "@/lib/types"

const categorias = [
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

export default function ReportarPerdidoPage() {
  const { toast } = useToast()
  const { adicionarItemPerdido } = useItems()
  const [formData, setFormData] = useState<FormDataPerdido>({
    nomeItem: "",
    descricao: "",
    categoria: "",
    local: "",
    data: "",
    nomeContato: "",
    telefone: "",
    email: "",
    observacoes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.nomeItem || !formData.descricao || !formData.categoria || !formData.local || !formData.data) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    adicionarItemPerdido(formData)

    toast({
      title: "Item reportado com sucesso!",
      description: "Seu item perdido foi adicionado ao sistema. Você será notificado se alguém encontrá-lo.",
    })

    // Reset form
    setFormData({
      nomeItem: "",
      descricao: "",
      categoria: "",
      local: "",
      data: "",
      nomeContato: "",
      telefone: "",
      email: "",
      observacoes: "",
    })
  }

  const handleInputChange = (field: keyof FormDataPerdido, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
            <h1 className="text-xl font-semibold text-foreground">Reportar Item Perdido</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Descreva seu item perdido
            </CardTitle>
            <CardDescription>
              Forneça o máximo de detalhes possível para aumentar as chances de encontrar seu item.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome do Item */}
              <div className="space-y-2">
                <Label htmlFor="nomeItem">Nome do Item *</Label>
                <Input
                  id="nomeItem"
                  placeholder="Ex: iPhone 13, Carteira de couro marrom, Chaves do carro"
                  value={formData.nomeItem}
                  onChange={(e) => handleInputChange("nomeItem", e.target.value)}
                  required
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
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

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição Detalhada *</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o item em detalhes: cor, tamanho, marca, características especiais, etc."
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Local e Data */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="local">Local onde foi perdido *</Label>
                  <Input
                    id="local"
                    placeholder="Ex: Shopping Center, Parque da Cidade, Rua XV"
                    value={formData.local}
                    onChange={(e) => handleInputChange("local", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data aproximada *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => handleInputChange("data", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Informações de Contato
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="nomeContato">Seu Nome</Label>
                  <Input
                    id="nomeContato"
                    placeholder="Como você gostaria de ser chamado"
                    value={formData.nomeContato}
                    onChange={(e) => handleInputChange("nomeContato", e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange("telefone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Adicionais</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Qualquer informação adicional que possa ajudar..."
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Foto Upload Placeholder */}
              <div className="space-y-2">
                <Label>Foto do Item (Opcional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Clique para adicionar uma foto do item</p>
                  <p className="text-xs text-muted-foreground mt-1">(Funcionalidade será implementada em breve)</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Reportar Item Perdido
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
