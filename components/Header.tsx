import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default function Component() {

const { userId } = auth();

return (
<header className="flex items-center justify-between px-4 py-3 bg-white text-gray-900 shadow">
    <Link href="#" className="flex items-center gap-2" prefetch={false}>
    <img src="/maromba-ai-logo-light.svg" alt="MarombaAI" className="h-8 w-32" />
    </Link>

    {!userId && (
    <div className="flex items-center gap-4">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="secondary">
                <Link href="/sign-in" className="rounded-full">
                Entrar
                </Link>
            </Button>
        </DropdownMenuTrigger>
        </DropdownMenu>
    </div>
    )}
    
    {userId && (
        <div className="flex items-center gap-4">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <UserButton
            />
        </DropdownMenuTrigger>
        </DropdownMenu>
    </div>
    )}

</header>
)
}