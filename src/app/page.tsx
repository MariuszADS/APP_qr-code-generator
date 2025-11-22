import QRForm from "@/components/QRForm"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4">
      <section className="w-full max-w-xl text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          QR Code Generator
        </h1>
        <QRForm/>
        <p className="text-sm text-slate-300"> To jest aplikacja do generowania kodów QR z  przypisaną piosenką. W kolejnych krokach dodamy formularz, generowanie kodów oraz listę zapisanych piosenek.</p>

        <p className="text-xs text-slate-400"> Projekt edukacyjny: uczę się Next.js, TypeScriptu i Tailwind CSS,
          budując coś praktycznego.</p>

        <div className="mt-6 inline-flex items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-2 text-xs text-slate-300">
          <span className=" mr-2 h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>W następnym kroku pojawi się tutaj formularz 🎧</span>
        </div>
      </section>
    </main>
  )
}