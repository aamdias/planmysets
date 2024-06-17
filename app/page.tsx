import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from "@clerk/nextjs/server";

export default function LandingPage() {

  const { userId } = auth();

  return (
    <>
    {!userId && (
      <section className="w-full h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl text-[#4B4B4B] font-bold tracking-tighter sm:text-5xl xl:text-6xl/none pb-2 md:pb-4">
              Nunca mais <span className="underline decoration-[#EB5864]">fique parado</span> na academia
            </h1>
            <p className="mx-auto max-w-[600px] text-gray-500 font-light md:text-xl dark:text-gray-400">
              Conheça o app capaz de criar treinos personalizados para academia com Inteligência Artificial.
            </p>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center py-4">
          <Button asChild className="w-40 bg-gradient-to-r from-[#EB5864] to-[#994E54] font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link href="/sign-up">
            Começar</Link>
          </Button>
          <Button asChild className="w-40 font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105" variant="secondary">
            <Link href="/sign-in">Entrar</Link>
          </Button>
          </div>
        </div>
      </div>
    </section>
      )}
      {userId && (
        <section className="w-full h-screen flex items-center justify-center">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl text-[#4B4B4B] font-bold tracking-tighter sm:text-5xl xl:text-6xl/none pb-2 md:pb-4">
                Nunca mais <span className="underline decoration-[#EB5864]">fique parado</span> na academia
              </h1>
              <p className="mx-auto max-w-[600px] text-gray-500 font-light md:text-xl dark:text-gray-400">
                Conheça o app capaz de criar treinos personalizados para academia com Inteligência Artificial.
              </p>
            </div>
            <div className="flex flex-col gap-4 justify-center items-center py-4">
            <Button asChild className="w-40 font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105" variant="default">
              <Link href="/sign-in">Acessar treinos</Link>
            </Button>
            </div>
          </div>
        </div>
      </section>
        )}
    </>
  );
}
