"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { db } from "../../../lib/firebaseConfig"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

const WHATSAPP_NUMBER = "5567992236484"

export default function PagamentoSurprisePage() {
  const router = useRouter()
  const [surpriseData, setSurpriseData] = useState<any>(null)
  const [deliveryData, setDeliveryData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const surprise = localStorage.getItem("surprise_box_data")
    const delivery = localStorage.getItem("surprise_delivery")

    if (!surprise || !delivery) {
      router.push("/caixa-surprise")
      return
    }

    setSurpriseData(JSON.parse(surprise))
    setDeliveryData(JSON.parse(delivery))
  }, [router])

  const handleWhatsAppPayment = async () => {
    if (!surpriseData || !deliveryData) return

    setLoading(true)
    try {
      const pedidoId = `CSM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      const orderData = {
        pedidoId,
        tipo: "caixa_surprise",
        origem: "whatsapp",
        status: "aguardando_pagamento",
        cliente: {
          destinatario: deliveryData.destinatario,
          email: deliveryData.email || null,
          whatsapp: deliveryData.whatsapp || null,
        },
        conteudo: {
          remetente: surpriseData.remetente,
          mensagem: surpriseData.mensagem || "",
          items: surpriseData.items,
        },
        logistica: {
          tipoEntrega: deliveryData.tipoEntrega,
          metodoFisico: deliveryData.metodoFisico || null,
          metodoDigital: deliveryData.metodoDigital || null,
          endereco: deliveryData.endereco || null,
          cep: deliveryData.cep || null,
          whatsapp_entrega: deliveryData.whatsapp || null,
          email_entrega: deliveryData.email || null,
        },
        financeiro: {
          total: surpriseData.total,
          metodo: "whatsapp",
        },
        criado_em: serverTimestamp(),
      }

      await addDoc(collection(db, "pedidos_surprise"), orderData)

      const itemsList = surpriseData.items
        .map((item: any) => `  • ${item.nome} - R$ ${item.valor.toFixed(2)}`)
        .join("\n")

      const msgParaWpp =
        `*NOVA CAIXA SURPRISE: ${pedidoId}*\n` +
        `----------------------------------\n` +
        `*De:* ${surpriseData.remetente}\n` +
        `*Para:* ${deliveryData.destinatario}\n` +
        `----------------------------------\n` +
        `*ITENS DA CAIXA:*\n${itemsList}\n` +
        `----------------------------------\n` +
        `*Entrega:* ${deliveryData.metodoFisico === "correios" ? "Correios" : deliveryData.metodoFisico === "local" ? "Retirada Local" : "Delivery/Taxi"}\n` +
        `*Endereço:* ${deliveryData.endereco || "A combinar"}\n` +
        `----------------------------------\n` +
        `*Total:* R$ ${surpriseData.total.toFixed(2).replace(".", ",")}\n` +
        `----------------------------------\n` +
        `Olá! Gostaria de finalizar o pagamento da Caixa Surprise via WhatsApp.`

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msgParaWpp)}`, "_blank")

      localStorage.removeItem("surprise_box_data")
      localStorage.removeItem("surprise_items")
      localStorage.removeItem("surprise_delivery")
      localStorage.removeItem("surprise_category")

      setTimeout(() => {
        router.push("/caixa-surprise/sucesso")
      }, 1000)
    } catch (error) {
      console.error("Erro ao processar pedido:", error)
      alert("Erro ao processar pedido. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (!surpriseData || !deliveryData) return null

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow px-4 sm:px-8 lg:px-16 pt-24 pb-12 sm:pt-28">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Finalizar Pedido</h1>
            <p className="text-gray-500 mt-2">Revise os dados e finalize via WhatsApp</p>
          </div>

          <div className="space-y-6">
            {/* Resumo do Pedido */}
            <div className="bg-white rounded-lg shadow-xl shadow-gray-200/60 p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Resumo da Caixa Surprise</h3>

              <div className="space-y-3 mb-4">
                {surpriseData.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.nome}</span>
                    <span className="font-semibold text-gray-900">R$ {item.valor.toFixed(2).replace(".", ",")}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold text-red-900">
                  R$ {surpriseData.total.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            {/* Dados de Entrega */}
            <div className="bg-white rounded-lg shadow-xl shadow-gray-200/60 p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Dados de Entrega</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Destinatário:</span>
                  <span className="font-medium text-gray-900">{deliveryData.destinatario}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium text-gray-900 capitalize">{deliveryData.tipoEntrega}</span>
                </div>
                {deliveryData.endereco && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Endereço:</span>
                    <span className="font-medium text-gray-900">{deliveryData.endereco}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Botão WhatsApp */}
            <button
              onClick={handleWhatsAppPayment}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 p-4 bg-green-600 text-white rounded-full hover:bg-green-700 font-bold text-lg transition-all shadow-lg disabled:opacity-50"
            >
              <Image src="/images/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
              {loading ? "Processando..." : "Finalizar via WhatsApp"}
            </button>

            <button
              onClick={() => router.back()}
              className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition"
            >
              Voltar
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
