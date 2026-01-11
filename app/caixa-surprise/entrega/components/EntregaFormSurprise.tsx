"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import EntregaTypeSection from "../../../entrega/components/EntregaTypeSection"
import DeliveryCalendar from "../../../entrega/components/DeliveryCalendar"
import DeliveryMethodSection from "../../../entrega/components/DeliveryMethodSection"

type DigitalMethod = "whatsapp" | "email"
type FisicaMethod = "correios" | "local" | "taxi"

export default function EntregaFormSurprise() {
  const router = useRouter()

  const [tipoEntrega, setTipoEntrega] = useState<"digital" | "fisica" | "ambos">("fisica")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [digitalMethod, setDigitalMethod] = useState<DigitalMethod | null>(null)
  const [fisicaMethod, setFisicaMethod] = useState<FisicaMethod | null>(null)

  const digitalOptions: Array<{ id: DigitalMethod; label: string }> = [
    { id: "whatsapp", label: "WhatsApp" },
    { id: "email", label: "E-mail" },
  ]

  const fisicaOptions: Array<{ id: FisicaMethod; label: string }> = [
    { id: "correios", label: "Correios (PAC)" },
    { id: "local", label: "Retirar no Local" },
    { id: "taxi", label: "Delivery / Uber / Taxi" },
  ]

  useEffect(() => {
    const surpriseDataStr = localStorage.getItem("surprise_box_data")
    if (!surpriseDataStr) {
      router.push("/caixa-surprise")
      return
    }

    const savedSelection = localStorage.getItem("surprise_deliverySelection")
    if (savedSelection) {
      const parsed = JSON.parse(savedSelection)
      setTipoEntrega(parsed.tipoEntrega || "fisica")
      if (parsed.dataEntrega) setSelectedDate(new Date(parsed.dataEntrega))
      if (parsed.metodoDigital) setDigitalMethod(parsed.metodoDigital)
      if (parsed.metodoFisico) setFisicaMethod(parsed.metodoFisico)
    }
  }, [router])

  const canContinue = (): boolean => {
    if (!selectedDate) return false
    if (tipoEntrega === "digital") return !!digitalMethod
    if (tipoEntrega === "fisica") return !!fisicaMethod
    if (tipoEntrega === "ambos") return !!digitalMethod && !!fisicaMethod
    return false
  }

  const handleContinue = () => {
    if (!canContinue() || !selectedDate) return

    const deliverySelection = {
      tipoEntrega,
      dataEntrega: selectedDate.toISOString(),
      metodoDigital: digitalMethod,
      metodoFisico: fisicaMethod,
    }

    localStorage.setItem("surprise_deliverySelection", JSON.stringify(deliverySelection))
    router.push("/caixa-surprise/dados-entrega")
  }

  return (
    <div className="bg-white rounded-2xl shadow-md space-y-6 max-w-xl mx-auto p-6 border border-gray-100">
      {/* 1. Tipo de Entrega */}
      <EntregaTypeSection tipoEntrega={tipoEntrega} setTipoEntrega={setTipoEntrega} />

      {/* 2. Calendário */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Quando devemos entregar?</h3>
        <DeliveryCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </div>

      {/* 3. Métodos de Entrega */}
      <div className="space-y-4">
        {(tipoEntrega === "digital" || tipoEntrega === "ambos") && (
          <DeliveryMethodSection
            title="Como enviamos o link digital?"
            options={digitalOptions}
            selected={digitalMethod}
            onSelect={setDigitalMethod}
          />
        )}

        {(tipoEntrega === "fisica" || tipoEntrega === "ambos") && (
          <DeliveryMethodSection
            title="Como entregamos a Caixa Surprise?"
            options={fisicaOptions}
            selected={fisicaMethod}
            onSelect={setFisicaMethod}
          />
        )}
      </div>

      {/* Botões de Ação */}
      <div className="pt-6 space-y-3">
        <button
          onClick={handleContinue}
          disabled={!canContinue()}
          className="w-full py-4 bg-red-900 text-white rounded-full font-bold hover:bg-red-800 transition shadow-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
        >
          {canContinue() ? "Continuar" : "Preencha os campos acima"}
        </button>

        <button
          onClick={() => router.back()}
          className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  )
}
