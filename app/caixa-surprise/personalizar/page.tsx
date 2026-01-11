"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

interface SurpriseItem {
  id: string
  nome: string
  valor: number
  descricao?: string
  imagens?: string[]
  tipo?: string
}

export default function PersonalizarPage() {
  const router = useRouter()
  const [items, setItems] = useState<SurpriseItem[]>([])
  const [identificar, setIdentificar] = useState(true)
  const [remetente, setRemetente] = useState("")
  const [mensagem, setMensagem] = useState("")

  useEffect(() => {
    const savedItems = localStorage.getItem("surprise_items")
    if (!savedItems) {
      router.push("/caixa-surprise")
      return
    }
    setItems(JSON.parse(savedItems))
  }, [router])

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.valor, 0)
  }

  const handleFinish = () => {
    if (identificar && !remetente.trim()) {
      alert("Por favor, informe seu nome")
      return
    }

    const surpriseBox = {
      items,
      identificar,
      remetente: identificar ? remetente : "Anônimo",
      mensagem,
      total: calculateTotal(),
      timestamp: Date.now(),
    }

    localStorage.setItem("surprise_box_data", JSON.stringify(surpriseBox))
    router.push("/caixa-surprise/entrega")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow px-4 sm:px-8 lg:px-16 pt-24 pb-12 sm:pt-28">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
              ← Voltar
            </button>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Personalize sua Caixa</h1>
            <p className="text-gray-500 mt-2">Adicione seu toque especial</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-xl shadow-gray-200/60 p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Itens Selecionados</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.nome}</span>
                    <span className="font-bold text-red-900">R$ {item.valor.toFixed(2).replace(".", ",")}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-red-900">
                  R$ {calculateTotal().toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl shadow-gray-200/60 p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Identificação</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIdentificar(true)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      identificar ? "border-red-900 bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-bold text-gray-900">Me identificar</p>
                  </button>
                  <button
                    onClick={() => setIdentificar(false)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      !identificar ? "border-red-900 bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-bold text-gray-900">Anônimo</p>
                  </button>
                </div>

                {identificar && (
                  <input
                    type="text"
                    value={remetente}
                    onChange={(e) => setRemetente(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-red-900/20 focus:border-transparent outline-none transition-all"
                  />
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl shadow-gray-200/60 p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Mensagem Especial (opcional)</h3>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Deixe uma mensagem especial..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-red-900/20 focus:border-transparent outline-none transition-all resize-none"
              />
              <p className="text-sm text-gray-500 mt-2 text-right">{mensagem.length}/500</p>
            </div>

            <button
              onClick={handleFinish}
              disabled={identificar && !remetente.trim()}
              className="w-full bg-red-900 text-white py-3 rounded-full font-semibold text-lg hover:bg-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar para Entrega
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
