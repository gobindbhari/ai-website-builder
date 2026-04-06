// 


"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"


export function AvatarDropdown() {
    const { data: session } = authClient.useSession()
    return (
        <DropdownMenu >
            <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                        <AvatarFallback className=" border border-black/50!" >{session?.user.name[0]}</AvatarFallback>
                    </Avatar>
                </Button>
            } />
            <DropdownMenuContent className="w-32  border border-black/30! dark:border-white/30!" alignOffset={10} sideOffset={10} >
                <DropdownMenuGroup>
                    <DropdownMenuItem>Projects</DropdownMenuItem>
                    {/* <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem> */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                            toast.promise(authClient.signOut(), {
                                loading: "Logging out...",
                                success: "Logged out",
                                error: "Something went wrong",
                            });
                        }}
                    >
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
