"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

import DestinatarioField from "../../dados-entrega/components/DestinatarioField"
import DigitalFields from "../../dados-entrega/components/DigitalFields"
import FisicaFields from "../../dados-entrega/components/FisicaFields"

type DeliverySelection = {
  tipoEntrega: "digital" | "fisica" | "ambos"
  dataEntrega: string | null
  metodoDigital: "whatsapp" | "email" | null
  metodoFisico: "correios" | "local" | "taxi" | null
}

export default function DadosEntregaSurprisePage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [destinatario, setDestinatario] = useState("")
  const [endereco, setEndereco] = useState("")
  const [cpe, setCpe] = useState("")

  const [deliveryData, setDeliveryData] = useState<DeliverySelection | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("surprise_deliverySelection")
    const surpriseData = localStorage.getItem("surprise_box_data")

    if (!saved || !surpriseData) {
      router.push("/caixa-surprise")
      return
    }

    try {
      setDeliveryData(JSON.parse(saved))
    } catch {
      router.push("/caixa-surprise")
    }
  }, [router])

  if (!deliveryData) return null

  const isDigital = deliveryData.tipoEntrega === "digital" || deliveryData.tipoEntrega === "ambos"
  const isFisica = deliveryData.tipoEntrega === "fisica" || deliveryData.tipoEntrega === "ambos"

  const handleContinue = () => {
    let isValid = true

    if (!destinatario.trim()) isValid = false

    if (isDigital) {
      if (deliveryData.metodoDigital === "email" && !email.includes("@")) isValid = false
      if (deliveryData.metodoDigital === "whatsapp" && !whatsapp.trim()) isValid = false
    }

    if (isFisica) {
      if (deliveryData.metodoFisico === "correios") {
        if (!endereco.trim() || cpe.length < 9) isValid = false
      } else {
        if (cpe.length < 10) isValid = false
      }
    }

    if (!isValid) {
      alert("Por favor, preencha todos os campos corretamente.")
      return
    }

    const valorFrete = localStorage.getItem("valor_frete") || "0"
    const prazoFrete = localStorage.getItem("prazo_frete") || "A combinar"

    const fullDeliveryData = {
      ...deliveryData,
      destinatario: destinatario.trim(),
      endereco: deliveryData.metodoFisico === "correios" ? endereco.trim() : `Combinar entrega via WhatsApp: ${cpe}`,
      cep: deliveryData.metodoFisico === "correios" ? cpe.replace(/\D/g, "") : "N/A",
      telefoneContatoFisico: deliveryData.metodoFisico === "local" || deliveryData.metodoFisico === "taxi" ? cpe : null,
      email: isDigital && deliveryData.metodoDigital === "email" ? email : null,
      whatsappDigital: isDigital && deliveryData.metodoDigital === "whatsapp" ? whatsapp : null,
      detalhesFrete: {
        valor: deliveryData.metodoFisico === "correios" ? Number.parseFloat(valorFrete) : 0,
        prazo: deliveryData.metodoFisico === "correios" ? prazoFrete : "A combinar com o suporte",
        metodo: deliveryData.metodoFisico,
      },
      dataFinalizacao: new Date().toISOString(),
    }

    localStorage.setItem("surprise_fullDeliveryData", JSON.stringify(fullDeliveryData))
    router.push("/caixa-surprise/pagamento")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-6 pt-28 pb-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Dados de Entrega</h1>
            <p className="text-gray-500 mt-2 text-sm">Quase lá! Precisamos saber quem recebe a Caixa Surprise.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 space-y-10 border border-gray-100">
            {/* Seção 1: Identificação */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-8 h-px bg-gray-200"></span>
                Destinatário
              </h2>
              <DestinatarioField value={destinatario} onChange={setDestinatario} />
            </section>

            {/* Seção 2: Digital */}
            {isDigital && (
              <section className="space-y-4 animate-in fade-in duration-500">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-8 h-px bg-gray-200"></span>
                  Entrega Digital via {deliveryData.metodoDigital}
                </h2>
                <DigitalFields
                  method={deliveryData.metodoDigital}
                  email={email}
                  setEmail={setEmail}
                  whatsapp={whatsapp}
                  setWhatsapp={setWhatsapp}
                />
              </section>
            )}

            {/* Seção 3: Física */}
            {isFisica && (
              <section className="space-y-4 animate-in fade-in duration-700">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-8 h-px bg-gray-200"></span>
                  {deliveryData.metodoFisico === "correios" ? "Dados de Envio" : "Dados de Contato"}
                </h2>

                <FisicaFields
                  method={deliveryData.metodoFisico}
                  endereco={endereco}
                  setEndereco={setEndereco}
                  cpe={cpe}
                  setCpe={setCpe}
                />
              </section>
            )}

            {/* Botões de Ação */}
            <div className="pt-8 space-y-4">
              <button
                onClick={handleContinue}
                className="w-full bg-red-900 text-white py-3 rounded-full font-semibold text-lg hover:bg-red-800 transition-all active:scale-[0.98]"
              >
                Continuar para Pagamento
              </button>

              <button
                onClick={() => router.back()}
                className="w-full text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors py-2"
              >
                Voltar e alterar opções
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
