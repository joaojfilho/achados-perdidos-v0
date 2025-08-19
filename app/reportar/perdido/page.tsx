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
import { ArrowLeft, Upload, MapPin, User, Loader2 } from "lucide-react"
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

interface FormErrors {
  nomeItem?: string
  descricao?: string
  categoria?: string
  local?: string
  data?: string
  email?: string
  telefone?: string
}

export default function ReportarPerdidoPage() {
  const { toast } = useToast()
  const { adicionarItemPerdido } = useItems()
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const [errors, setErrors] = useState<FormErrors>({})

  const validateField = (field: keyof FormDataPerdido, value: string): string | undefined => {
    switch (field) {
      case "nomeItem":
        return value.trim().length < 3 ? "Nome do item deve ter pelo menos 3 caracteres" : undefined
      case "descricao":
        return value.trim().length < 10 ? "Descrição deve ter pelo menos 10 caracteres" : undefined
      case "categoria":
        return !value ? "Selecione uma categoria" : undefined
      case "local":
        return value.trim().length < 3 ? "Local deve ter pelo menos 3 caracteres" : undefined
      case "data":
        return !value ? "Data é obrigatória" : undefined
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "E-mail inválido"
        }
        return undefined
      case "telefone":
        if (value && !/^$$\d{2}$$\s\d{4,5}-\d{4}$/.test(value)) {
          return "Telefone deve estar no formato (00) 00000-0000"
        }
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar campos obrigatórios
    newErrors.nomeItem = validateField("nomeItem", formData.nomeItem)
    newErrors.descricao = validateField("descricao", formData.descricao)
    newErrors.categoria = validateField("categoria", formData.categoria)
    newErrors.local = validateField("local", formData.local)
    newErrors.data = validateField("data", formData.data)

    // Validar campos opcionais se preenchidos
    if (formData.email) {
      newErrors.email = validateField("email", formData.email)
    }
    if (formData.telefone) {
      newErrors.telefone = validateField("telefone", formData.telefone)
    }

    setErrors(newErrors)

    // Retorna true se não há erros
    return !Object.values(newErrors).some((error) => error !== undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário antes de continuar.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await adicionarItemPerdido(formData)

      toast({
        title: "Item reportado com sucesso!",
        description: "Seu item perdido foi adicionado ao sistema. Você será notificado se alguém encontrá-lo.",
      })

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
      setErrors({})
    } catch (error) {
      console.error("[v0] Erro ao reportar item perdido:", error)
      toast({
        title: "Erro ao reportar item",
        description: "Ocorreu um erro ao salvar seu item. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormDataPerdido, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Validar campo em tempo real se já teve erro
    if (errors[field as keyof FormErrors]) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleTelefoneChange = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "")

    // Aplica máscara
    let formatted = numbers
    if (numbers.length >= 2) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    }
    if (numbers.length >= 7) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }

    handleInputChange("telefone", formatted)
  }

  return (
    <div className="min-h-screen bg-background">
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
              <div className="space-y-2">
                <Label htmlFor="nomeItem">Nome do Item *</Label>
                <Input
                  id="nomeItem"
                  placeholder="Ex: iPhone 13, Carteira de couro marrom, Chaves do carro"
                  value={formData.nomeItem}
                  onChange={(e) => handleInputChange("nomeItem", e.target.value)}
                  className={errors.nomeItem ? "border-red-500" : ""}
                  required
                />
                {errors.nomeItem && <p className="text-sm text-red-500">{errors.nomeItem}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                  <SelectTrigger className={errors.categoria ? "border-red-500" : ""}>
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
                {errors.categoria && <p className="text-sm text-red-500">{errors.categoria}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição Detalhada *</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o item em detalhes: cor, tamanho, marca, características especiais, etc."
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  className={errors.descricao ? "border-red-500" : ""}
                  rows={4}
                  required
                />
                {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="local">Local onde foi perdido *</Label>
                  <Input
                    id="local"
                    placeholder="Ex: Shopping Center, Parque da Cidade, Rua XV"
                    value={formData.local}
                    onChange={(e) => handleInputChange("local", e.target.value)}
                    className={errors.local ? "border-red-500" : ""}
                    required
                  />
                  {errors.local && <p className="text-sm text-red-500">{errors.local}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data aproximada *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => handleInputChange("data", e.target.value)}
                    className={errors.data ? "border-red-500" : ""}
                    required
                  />
                  {errors.data && <p className="text-sm text-red-500">{errors.data}</p>}
                </div>
              </div>

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
                      onChange={(e) => handleTelefoneChange(e.target.value)}
                      className={errors.telefone ? "border-red-500" : ""}
                      maxLength={15}
                    />
                    {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>
              </div>

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

              <div className="space-y-2">
                <Label>Foto do Item (Opcional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Clique para adicionar uma foto do item</p>
                  <p className="text-xs text-muted-foreground mt-1">(Funcionalidade será implementada em breve)</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Reportar Item Perdido"
                  )}
                </Button>
                <Button type="button" variant="outline" asChild disabled={isSubmitting}>
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
