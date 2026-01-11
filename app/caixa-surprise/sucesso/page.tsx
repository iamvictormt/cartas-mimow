"use client"

import { useRouter } from "next/navigation"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { CheckCircleIcon, GiftIcon } from "@heroicons/react/24/outline"

export default function SucessoSurprisePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />

      <main className="flex-grow px-4 sm:px-8 lg:px-16 pt-28 pb-12 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-gray-100">
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full p-6">
                <CheckCircleIcon className="h-16 w-16 text-green-600" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Pedido Recebido!</h1>
              <p className="text-gray-600">
                Sua Caixa Surprise Mimo foi registrada com sucesso. Em breve entraremos em contato via WhatsApp para
                confirmar o pagamento e os detalhes da entrega.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800 font-medium">
                Fique atento ao seu WhatsApp! Enviaremos todas as informações sobre o andamento do seu pedido.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => router.push("/caixa-surprise")}
                className="w-full flex items-center justify-center gap-2 bg-red-900 text-white py-3 rounded-full font-bold hover:bg-red-800 transition-all shadow-lg"
              >
                <GiftIcon className="h-5 w-5" />
                Criar Nova Caixa Surprise
              </button>

              <button
                onClick={() => router.push("/home")}
                className="w-full py-2 text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                Voltar para Início
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
