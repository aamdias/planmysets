import Link from 'next/link';

export default function LandingPage() {
  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg px-3 py-1 text-sm dark:bg-gray-800">
              <img src="/maromba-ai-logo-light.svg" alt="MarombaAI" className="inline-block h-8 w-32" />
            </div>
            <h1 className="text-3xl text-[#4B4B4B] font-bold tracking-tighter sm:text-5xl xl:text-6xl/none pb-4">
              Nunca mais <span className="underline decoration-[#EB5864]">fique parado</span> na academia
            </h1>
            <p className="mx-auto max-w-[600px] text-gray-500 font-light md:text-xl dark:text-gray-400">
              Conheça o app capaz de criar treinos personalizados para academia com Inteligência Artificial.
            </p>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Link
              href="/sign-in"
              className="inline-flex h-14 w-44 items-center justify-center rounded-lg bg-gradient-to-r from-[#EB5864] to-[#cf4a56] px-8 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#EB5864] disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Começar
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-14 w-44 items-center justify-center rounded-lg border border-[#FEB9C1] bg-white px-8 text-base font-semibold text-[#EB5864] shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#EB5864] disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
