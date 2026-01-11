"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { VideoCameraIcon, PhotoIcon, ChatBubbleLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

interface Item {
  id: string
  nome: string
  descricao: string
  valor: number
  quantidade: number
  imagens: string[]
  videoUrl?: string
  infoAdicional?: string
  tipo: "produto" | "servico" | "experiencia" | "premio"
}

export default function CategoriaPage() {
  const router = useRouter()
  const params = useParams()
  const categoria = params?.categoria as string

  const [items, setItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingMedia, setViewingMedia] = useState<string | null>(null)

  const categoryConfig: Record<string, { title: string; emoji: string }> = {
    produtos: { title: "Produtos", emoji: "🎁" },
    servicos: { title: "Serviços", emoji: "💼" },
    experiencias: { title: "Experiências", emoji: "✨" },
    premios: { title: "Prêmios Diversos", emoji: "🎫" },
  }

  const config = categoryConfig[categoria] || categoryConfig.produtos

  useEffect(() => {
    const mockItems: Item[] = [
      {
        id: "1",
        nome: "Kit Presente Deluxe",
        descricao: "Kit completo com produtos premium selecionados com carinho para criar momentos especiais",
        valor: 150.0,
        quantidade: 5,
        imagens: ["/placeholder.svg?height=400&width=400"],
        videoUrl: "https://example.com/video1",
        tipo: "produto",
      },
      {
        id: "2",
        nome: "Produto Premium Gold",
        descricao: "Produto de altíssima qualidade, ideal para presentear quem você ama",
        valor: 250.0,
        quantidade: 3,
        imagens: ["/placeholder.svg?height=400&width=400"],
        tipo: "produto",
      },
      {
        id: "3",
        nome: "Experiência Exclusiva",
        descricao: "Uma experiência única e memorável que ficará marcada para sempre",
        valor: 380.0,
        quantidade: 2,
        imagens: ["/placeholder.svg?height=400&width=400"],
        videoUrl: "https://example.com/video3",
        tipo: "experiencia",
      },
      {
        id: "4",
        nome: "Kit Surpresa Especial",
        descricao: "Surpresa cuidadosamente preparada para momentos inesquecíveis",
        valor: 180.0,
        quantidade: 8,
        imagens: ["/placeholder.svg?height=400&width=400"],
        tipo: "produto",
      },
    ]

    setTimeout(() => {
      setItems(mockItems)
      setLoading(false)
    }, 600)
  }, [categoria])

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleContinue = () => {
    if (selectedItems.length === 0) {
      alert("Selecione pelo menos um item para continuar")
      return
    }

    const selected = items.filter((item) => selectedItems.includes(item.id))
    localStorage.setItem("surprise_items", JSON.stringify(selected))
    router.push("/caixa-surprise/personalizar")
  }

  const calculateTotal = () => {
    return items.filter((item) => selectedItems.includes(item.id)).reduce((sum, item) => sum + item.valor, 0)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow px-4 sm:px-8 lg:px-16 pt-24 pb-32 sm:pt-28">
        <div className="max-w-7xl mx-auto">
          {/* Header with back button and category info */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
            >
              ← Voltar
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">{config.emoji}</div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{config.title}</h1>
            </div>

            {selectedItems.length > 0 && (
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                <CheckCircleIcon className="h-5 w-5 text-red-900" />
                <span className="font-bold text-gray-900 text-sm">
                  {selectedItems.length} {selectedItems.length === 1 ? "item selecionado" : "itens selecionados"}
                </span>
              </div>
            )}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {items.map((item) => {
              const isSelected = selectedItems.includes(item.id)

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg overflow-hidden shadow-lg border-2 transition-all cursor-pointer hover:shadow-xl ${
                    isSelected ? "border-red-900 ring-2 ring-red-200" : "border-gray-100 hover:border-gray-200"
                  }`}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={item.imagens[0] || "/placeholder.svg"}
                      alt={item.nome}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-red-900 text-white rounded-full p-2">
                        <CheckCircleIcon className="h-5 w-5" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded-lg text-xs font-bold">
                      {item.quantidade} disponíveis
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{item.nome}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.descricao}</p>

                    {/* Media Buttons */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {item.videoUrl && (
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex flex-col items-center gap-1 py-2 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 border border-purple-200"
                        >
                          <VideoCameraIcon className="h-4 w-4" />
                          <span className="text-xs font-medium">Vídeo</span>
                        </button>
                      )}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-col items-center gap-1 py-2 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 border border-blue-200"
                      >
                        <PhotoIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">Fotos</span>
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-col items-center gap-1 py-2 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 border border-green-200"
                      >
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">WhatsApp</span>
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xl font-black text-red-900">
                        R$ {item.valor.toFixed(2).replace(".", ",")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleItemSelection(item.id)
                        }}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          isSelected ? "bg-red-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected ? "✓ Adicionado" : "Adicionar"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {selectedItems.length} {selectedItems.length === 1 ? "item" : "itens"} selecionado(s)
              </p>
              <p className="text-2xl font-black text-red-900">R$ {calculateTotal().toFixed(2).replace(".", ",")}</p>
            </div>
            <button
              onClick={handleContinue}
              className="bg-red-900 text-white px-8 py-3 rounded-full font-bold hover:bg-red-800 transition-all"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
