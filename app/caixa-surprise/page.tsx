"use client"

import { useRouter } from "next/navigation"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function CaixaSurprisePage() {
  const router = useRouter()

  const categories = [
    {
      id: "produtos",
      title: "Produtos",
      description: "Presentes físicos selecionados com carinho",
      emoji: "🎁",
    },
    {
      id: "servicos",
      title: "Serviços",
      description: "Consultorias, sessões e atendimentos personalizados",
      emoji: "💼",
    },
    {
      id: "experiencias",
      title: "Experiências",
      description: "Viagens, passeios, shows e momentos inesquecíveis",
      emoji: "✨",
    },
    {
      id: "premios",
      title: "Prêmios Diversos",
      description: "Vouchers, ingressos, tickets e surpresas especiais",
      emoji: "🎫",
    },
  ]

  const handleCategorySelect = (categoryId: string) => {
    localStorage.setItem("surprise_category", categoryId)
    router.push(`/caixa-surprise/${categoryId}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow px-4 sm:px-8 lg:px-16 pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Caixa Surprise Mimo</h1>
            <p className="text-gray-500 mt-2">Presenteie com produtos, serviços, experiências e prêmios especiais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="group bg-white rounded-lg p-8 shadow-xl shadow-gray-200/60 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all text-left"
              >
                <div className="text-5xl mb-4">{category.emoji}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{category.title}</h3>
                <p className="text-gray-600 leading-relaxed">{category.description}</p>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg p-8 shadow-xl shadow-gray-200/60 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-4">Como funciona?</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-900 text-white flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <p className="text-gray-700">Escolha uma categoria acima</p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-900 text-white flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <p className="text-gray-700">Selecione os itens que deseja adicionar à caixa</p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-900 text-white flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <p className="text-gray-700">Personalize com mensagem e escolha se quer se identificar</p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-900 text-white flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <p className="text-gray-700">Confirme os dados de entrega e finalize o pedido</p>
              </li>
            </ol>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
