// app/midia/page.tsx
import { Suspense } from "react"
import MidiaClient from "./MidiaClient"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default async function MidiaPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>
}) {
  const resolvedParams = await searchParams

  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow sm:px-16 px-6 pt-28 pb-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-900"></div>
          </main>
          <Footer />
        </div>
      }
    >
      <MidiaClient tipo={resolvedParams.tipo} />
    </Suspense>
  )
}
