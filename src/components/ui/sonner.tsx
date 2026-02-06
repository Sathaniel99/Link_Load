import { Loader2Icon } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { IoIosWarning } from "react-icons/io";
import { MdDangerous } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={'toaster group '}
      icons={{
        success: <FaCheckCircle className="size-4 text-green-600" />,
        info: <MdInfoOutline className="size-4 text-cyan-600" />,
        warning: <IoIosWarning className="size-4 text-amber-600" />,
        error: <MdDangerous className="size-4 text-red-600" />,
        loading: <Loader2Icon className="size-4 animate-spin text-blue-600" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
