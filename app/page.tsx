import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Eye, MapPin } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Achados e Perdidos</h1>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/buscar" className="text-muted-foreground hover:text-foreground transition-colors">
                Buscar
              </Link>
              <Link href="/reportar" className="text-muted-foreground hover:text-foreground transition-colors">
                Reportar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Encontre o que você perdeu</h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Sistema moderno e confiável para reportar itens perdidos e encontrados. Conecte-se com pessoas que podem ter
            encontrado seus pertences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/reportar/perdido">
                <Plus className="w-5 h-5 mr-2" />
                Reportar Item Perdido
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-lg px-8">
              <Link href="/reportar/encontrado">
                <Eye className="w-5 h-5 mr-2" />
                Reportar Item Encontrado
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Como funciona</h3>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>1. Reporte</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Descreva o item perdido ou encontrado com detalhes como local, data e características.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-secondary-foreground" />
                </div>
                <CardTitle>2. Busque</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Procure por itens usando filtros de categoria, local e data para encontrar correspondências.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>3. Conecte</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Entre em contato com quem encontrou seu item ou reclame um item que você encontrou.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h3 className="text-3xl font-bold text-foreground mb-6">Pronto para começar?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se à nossa comunidade e ajude a reunir pessoas com seus pertences perdidos.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/buscar">
              <Search className="w-5 h-5 mr-2" />
              Explorar Itens
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Achados e Perdidos. Sistema desenvolvido para ajudar a comunidade.
          </p>
        </div>
      </footer>
    </div>
  )
}
