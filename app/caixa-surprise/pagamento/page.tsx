"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { db } from "../../../lib/firebaseConfig"
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from "firebase/firestore"

import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import PaymentMethodSelector from "../../pagamento/components/PaymentMethodSelector"
import PixPaymentSection from "../../pagamento/components/PixPaymentSection"
import CreditCardPaymentSection from "../../pagamento/components/CreditCardPaymentSection"
import BoletoPaymentSection from "../../pagamento/components/BoletoPaymentSection"

import type { PaymentMethod, PaymentResponse, PaymentResponseData } from "../../../types/pagamento"

interface SurpriseItem {
  id: string
  nome: string
  valor: number
  descricao?: string
  imagens?: string[]
  tipo?: string
}

interface SurpriseBoxData {
  items: SurpriseItem[]
  identificar?: boolean
  remetente?: string
  mensagem?: string
  total?: number
  timestamp?: number
}

interface DeliveryData {
  email?: string
  destinatario?: string
  whatsapp?: string
  dataEntrega?: string
  tipoEntrega?: string
  endereco?: string
  cep?: string
  metodoFisico?: string
  metodoDigital?: string
  telefoneContatoFisico?: string
}

const WHATSAPP_NUMBER = "5567992236484"

export default function PagamentoSurprisePage() {
  const router = useRouter()

  const [cartTotal, setCartTotal] = useState<number>(0)
  const [metodo, setMetodo] = useState<PaymentMethod>("")
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [pixKey, setPixKey] = useState<string | null>(null)
  const [boletoUrl, setBoletoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [freteValor, setFreteValor] = useState<number>(0)
  const [fretePrazo, setFretePrazo] = useState<string>("")

  useEffect(() => {
    setIsMounted(true)

    if (typeof window !== "undefined") {
      const deliveryStr = localStorage.getItem("surprise_fullDeliveryData")
      const surpriseStr = localStorage.getItem("surprise_box_data")
      const valorFreteStr = localStorage.getItem("valor_frete")
      const prazoStr = localStorage.getItem("prazo_frete")

      if (!surpriseStr) {
        router.push("/caixa-surprise")
        return
      }

      try {
        const delivery: DeliveryData = deliveryStr ? JSON.parse(deliveryStr) : {}
        const surprise: SurpriseBoxData = JSON.parse(surpriseStr)

        if (delivery.email) setEmail(delivery.email)

        const precoTotal = surprise.total || 0
        const vFrete = Number(valorFreteStr) || 0

        setFreteValor(vFrete)
        setFretePrazo(prazoStr || "PAC")
        setCartTotal(precoTotal + vFrete)
      } catch (err) {
        console.error("Erro ao processar dados:", err)
      }
    }
  }, [router])

  useEffect(() => {
    if (!paymentId) return
    const q = query(collection(db, "pedidos_surprise"), where("financeiro.payment_id", "==", paymentId))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.data().status === "pago") router.push("/caixa-surprise/sucesso")
      })
    })
    return () => unsubscribe()
  }, [paymentId, router])

  const saveOrderUniversal = useCallback(
    async (type: "checkout" | "whatsapp", paymentData?: PaymentResponseData) => {
      if (typeof window === "undefined") return

      const deliveryRaw = localStorage.getItem("surprise_fullDeliveryData")
      const surpriseRaw = localStorage.getItem("surprise_box_data")

      const delivery: DeliveryData = deliveryRaw ? JSON.parse(deliveryRaw) : {}
      const surprise: SurpriseBoxData = surpriseRaw ? JSON.parse(surpriseRaw) : {}

      const customId =
        type === "whatsapp"
          ? `CSM-WPP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          : `CSM-SITE-${Date.now().toString().slice(-6)}`

      const orderData = {
        pedidoId: customId,
        tipo: "caixa_surprise",
        origem: type,
        status: type === "whatsapp" ? "finalizado_whatsapp" : "pendente_pagamento",
        cliente: {
          email: email || delivery.email || "Não informado",
          nome: delivery.destinatario || "Não informado",
          whatsapp: delivery.whatsapp || "Não informado",
        },
        conteudo: {
          de: surprise.remetente || "Anônimo",
          para: delivery.destinatario || "Não informado",
          mensagem: surprise.mensagem || "",
          items: surprise.items || [],
          data_entrega: delivery.dataEntrega || null,
        },
        logistica: {
          tipo: delivery.tipoEntrega || "fisica",
          endereco: delivery.endereco || "Não informado",
          cpe: delivery.metodoFisico === "correios" ? delivery.cep || "Não informado" : "N/A",
          whatsapp_entrega:
            delivery.metodoFisico === "local" || delivery.metodoFisico === "taxi"
              ? delivery.telefoneContatoFisico
              : delivery.whatsapp || null,
          metodo_digital: delivery.metodoDigital || null,
          metodo_fisico: delivery.metodoFisico || null,
          prazo_estimado: fretePrazo,
        },
        financeiro: {
          total: cartTotal,
          valor_produto: cartTotal - freteValor,
          valor_frete: freteValor,
          metodo: type === "whatsapp" ? "whatsapp" : metodo || "pix",
          payment_id: paymentData?.id?.toString() || null,
          payment_status: paymentData?.status || "pending",
        },
        criado_em: serverTimestamp(),
      }

      await addDoc(collection(db, "pedidos_surprise"), orderData)
    },
    [email, cartTotal, metodo, freteValor, fretePrazo],
  )

  const handlePayment = async (method: "pix" | "boleto", extraBoletoData?: Record<string, unknown>) => {
    if (!email || !email.includes("@")) {
      alert("Por favor, insira um e-mail válido.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal,
          email,
          description: "Caixa Surprise Mimo",
          method,
          ...extraBoletoData,
        }),
      })
      const data: PaymentResponse = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Erro no pagamento")
      await saveOrderUniversal("checkout", data.data)
      if (method === "pix" && data.data?.qr_code) {
        setQrCode(`data:image/png;base64,${data.data.qr_code_base64}`)
        setPixKey(data.data.qr_code)
        setPaymentId(data.data.id?.toString() || null)
      }
      if (method === "boleto" && data.data?.boleto_url) setBoletoUrl(data.data.boleto_url)
    } catch (err) {
      console.error(err)
      alert("Erro ao processar pagamento.")
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppFinalization = async () => {
    if (typeof window === "undefined") return
    setLoading(true)
    try {
      await saveOrderUniversal("whatsapp")

      const deliveryData: DeliveryData = JSON.parse(localStorage.getItem("surprise_fullDeliveryData") || "{}")
      const surpriseData: SurpriseBoxData = JSON.parse(localStorage.getItem("surprise_box_data") || "{}")

      const dataFormatada = deliveryData.dataEntrega
        ? new Date(deliveryData.dataEntrega).toLocaleDateString("pt-BR")
        : "A combinar"

      const itemsList = (surpriseData.items || [])
        .map((item: SurpriseItem) => `  • ${item.nome} - R$ ${item.valor.toFixed(2).replace(".", ",")}`)
        .join("\n")

      const msgParaWpp =
        `*NOVA CAIXA SURPRISE*\n` +
        `----------------------------------\n` +
        `*De:* ${surpriseData.remetente}\n` +
        `*Para:* ${deliveryData.destinatario}\n` +
        `*Itens:*\n${itemsList}\n` +
        `----------------------------------\n` +
        `*Método:* ${deliveryData.metodoFisico === "taxi" ? "Uber/Táxi" : deliveryData.metodoFisico === "local" ? "Retirada" : "Correios"}\n` +
        `*Detalhes:* ${deliveryData.endereco}\n` +
        (deliveryData.metodoFisico === "correios" ? `*CEP:* ${deliveryData.cep}\n` : "") +
        `*Data Entrega:* ${dataFormatada}\n` +
        `----------------------------------\n` +
        `*Total:* R$ ${cartTotal.toFixed(2).replace(".", ",")}\n` +
        `----------------------------------\n` +
        `Olá! Gostaria de finalizar o pagamento via WhatsApp.`

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msgParaWpp)}`, "_blank")
    } catch (error) {
      console.error(error)
      alert("Erro ao salvar pedido.")
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Pagamento</h1>
        <p className="text-sm text-gray-600 text-center mb-8">Escolha como prefere pagar sua Caixa Surprise</p>

        <div className="max-w-lg mx-auto mb-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-2 pb-3 mb-3 border-b border-dashed border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Caixa Surprise:</span>
              <span className="font-medium text-gray-900">
                R$ {(cartTotal - freteValor).toFixed(2).replace(".", ",")}
              </span>
            </div>
            {freteValor > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  Frete para entrega:
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">{fretePrazo}</span>
                </span>
                <span className="font-medium text-gray-900">+ R$ {freteValor.toFixed(2).replace(".", ",")}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-bold">Total a pagar:</span>
            <div className="text-right">
              <p className="font-extrabold text-3xl text-red-900 leading-none">
                R$ {cartTotal.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8 max-w-lg mx-auto border border-gray-100">
          <PaymentMethodSelector value={metodo} onChange={setMetodo} />
          <div>
            {metodo === "pix" && (
              <PixPaymentSection
                email={email}
                onEmailChange={setEmail}
                onGeneratePix={() => handlePayment("pix")}
                loading={loading}
                qrCode={qrCode}
                pixKey={pixKey}
              />
            )}
            {metodo === "cartao" && <CreditCardPaymentSection cartTotal={cartTotal} />}
            {metodo === "boleto" && (
              <BoletoPaymentSection
                email={email}
                onEmailChange={setEmail}
                onGenerateBoleto={(data: Record<string, unknown>) => handlePayment("boleto", data)}
                loading={loading}
                boletoUrl={boletoUrl}
              />
            )}
          </div>
          <button
            onClick={handleWhatsAppFinalization}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-4 border-2 border-green-500 text-green-700 rounded-full hover:bg-green-50 font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            <Image src="/images/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
            Finalizar via WhatsApp
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
