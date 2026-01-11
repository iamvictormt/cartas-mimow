"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { TruckIcon, EnvelopeIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline"

export default function EntregaSurprisePage() {
  const router = useRouter()
  const [surpriseData, setSurpriseData] = useState<any>(null)
  const [destinatario, setDestinatario] = useState("")
  const [tipoEntrega, setTipoEntrega] = useState<"fisica" | "digital" | "ambos">("fisica")
  const [metodoFisico, setMetodoFisico] = useState<"correios" | "local" | "taxi">("correios")
  const [metodoDigital, setMetodoDigital] = useState<"whatsapp" | "email">("whatsapp")
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [endereco, setEndereco] = useState("")
  const [cep, setCep] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("surprise_box_data")
    if (!saved) {
      router.push("/caixa-surprise")
      return
    }
    setSurpriseData(JSON.parse(saved))
  }, [router])

  const handleContinue = () => {
    if (!destinatario.trim()) {
      alert("Por favor, informe o nome do destinatário")
      return
    }

    if (tipoEntrega === "digital" || tipoEntrega === "ambos") {
      if (metodoDigital === "whatsapp" && !whatsapp.trim()) {
        alert("Por favor, informe o WhatsApp")
        return
      }
      if (metodoDigital === "email" && !email.includes("@")) {
        alert("Por favor, informe um e-mail válido")
        return
      }
    }

    if (tipoEntrega === "fisica" || tipoEntrega === "ambos") {
      if (metodoFisico === "correios" && (!endereco.trim() || cep.length < 8)) {
        alert("Por favor, preencha o endereço e CEP")
        return
      }
    }

    const deliveryData = {
      destinatario,
      tipoEntrega,
      metodoFisico,
      metodoDigital,
      whatsapp,
      email,
      endereco,
      cep,
    }

    localStorage.setItem("surprise_delivery", JSON.stringify(deliveryData))
    router.push("/caixa-surprise/pagamento")
  }

  if (!surpriseData) return null

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow px-4 sm:px-8 lg:px-16 pt-24 pb-12 sm:pt-28">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
              ← Voltar
            </button>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dados de Entrega</h1>
            <p className="text-gray-500 mt-2">Informe os dados para entrega da Caixa Surprise Mimo</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl shadow-gray-200/60 p-8 space-y-6 border border-gray-100">
            {/* Destinatário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Destinatário</label>
              <input
                type="text"
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
                placeholder="Para quem é o presente?"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-900 focus:border-transparent"
              />
            </div>

            {/* Tipo de Entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Entrega</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTipoEntrega("fisica")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    tipoEntrega === "fisica" ? "border-red-900 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <TruckIcon className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                  <span className="text-sm font-medium">Física</span>
                </button>
                <button
                  onClick={() => setTipoEntrega("digital")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    tipoEntrega === "digital" ? "border-red-900 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <DevicePhoneMobileIcon className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                  <span className="text-sm font-medium">Digital</span>
                </button>
                <button
                  onClick={() => setTipoEntrega("ambos")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    tipoEntrega === "ambos" ? "border-red-900 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <EnvelopeIcon className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                  <span className="text-sm font-medium">Ambos</span>
                </button>
              </div>
            </div>

            {/* Entrega Digital */}
            {(tipoEntrega === "digital" || tipoEntrega === "ambos") && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="font-semibold text-gray-900">Entrega Digital</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMetodoDigital("whatsapp")}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all ${
                      metodoDigital === "whatsapp"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setMetodoDigital("email")}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all ${
                      metodoDigital === "email"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    E-mail
                  </button>
                </div>

                {metodoDigital === "whatsapp" && (
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="WhatsApp do destinatário"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-900"
                  />
                )}

                {metodoDigital === "email" && (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail do destinatário"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-900"
                  />
                )}
              </div>
            )}

            {/* Entrega Física */}
            {(tipoEntrega === "fisica" || tipoEntrega === "ambos") && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="font-semibold text-gray-900">Entrega Física</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMetodoFisico("correios")}
                    className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      metodoFisico === "correios"
                        ? "border-red-900 bg-red-50 text-red-900"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    Correios
                  </button>
                  <button
                    onClick={() => setMetodoFisico("local")}
                    className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      metodoFisico === "local"
                        ? "border-red-900 bg-red-50 text-red-900"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    Retirar
                  </button>
                  <button
                    onClick={() => setMetodoFisico("taxi")}
                    className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      metodoFisico === "taxi"
                        ? "border-red-900 bg-red-50 text-red-900"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    Delivery
                  </button>
                </div>

                {metodoFisico === "correios" && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Endereço completo"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-900"
                    />
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                      placeholder="CEP"
                      maxLength={8}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-900"
                    />
                  </div>
                )}

                {metodoFisico === "local" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Você escolheu retirar no local. Após confirmar o pedido, enviaremos a localização via WhatsApp.
                    </p>
                  </div>
                )}

                {metodoFisico === "taxi" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800">
                      Entrega via Uber/Taxi. Entraremos em contato via WhatsApp para coordenar a entrega.
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleContinue}
              className="w-full bg-red-900 text-white py-4 rounded-full font-bold text-lg hover:bg-red-800 transition-all shadow-lg"
            >
              Continuar para Pagamento
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
