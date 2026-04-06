"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"


interface Props {
    open: boolean
    setOpen: (val: boolean) => void
    btnText?: string,
    heading?: string,
    description?: string,
    cancelFc?: () => void,
    continueFc?: () => void,
}

export function AlertBox({ open, setOpen, btnText, heading, description, cancelFc, continueFc }: Props) {
    // const [open, setOpen] = useState(false)

    return (
        <AlertDialog open={open} onOpenChange={setOpen} >
            {btnText && (
                <AlertDialogTrigger asChild>
                    <Button variant="outline">{btnText}</Button>
                </AlertDialogTrigger>
            )}
            <AlertDialogContent className="bg-black/80! border-gray-700">
                <AlertDialogHeader>
                    {heading && <AlertDialogTitle>{heading}</AlertDialogTitle>}
                    {description && <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            cancelFc?.()
                            setOpen(false)
                        }} >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                    className="bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                        onClick={() => {
                            continueFc?.()
                            setOpen(false)
                        }} >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
