import { ArrowLeft } from "lucide-react"
import Link from "next/link"

type Props = {
    text: string
}

export const BackLink = ({text}: Props) => {
    return (
        <Link href="/" className="mb-6 flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            {text}
         </Link>
    )
}