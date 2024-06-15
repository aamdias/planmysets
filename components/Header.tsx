import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Component() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white text-gray-900 shadow">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <img src="/maromba-ai-logo-light.svg" alt="MarombaAI" className="h-8 w-32" />
      </Link>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </header>
  )
}