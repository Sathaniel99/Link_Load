// Iconos
import { Moon, Sun } from "lucide-react"
// Componentes
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// Context
import { useTheme } from "./Theme/useTheme"
// Iconos
import { FaCheckCircle } from "react-icons/fa"
import { MdComputer } from "react-icons/md"
import { useMemo } from "react"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  const temas = useMemo(() => [
    {
      type: 'Claro',
      tema: 'light',
      icon: <Sun className="size-4" />,
      func: () => setTheme("light"),
    },
    {
      type: 'Oscuro',
      tema: 'dark',
      icon: <Moon className="size-4" />,
      func: () => setTheme("dark"),
    },
    {
      type: 'Sistema',
      tema: 'system',
      icon: <MdComputer className="size-4" />,
      func: () => setTheme("system"),
    },
  ], [setTheme])

  return (
    <>
      <DropdownMenu>

        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-slate-900 dark:text-slate-300" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-slate-900 dark:text-slate-300" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">

          {temas.map((element, index) => (

            <DropdownMenuItem
              key={index} onClick={element.func}
              className={`flex items-center justify-between gap-2 ${theme === element.tema ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-accent'}`}
            >
              <span className="flex items-center gap-2 font-semibold">
                {element.icon}
                {element.type}
              </span>
              {theme === element.tema && (
                <FaCheckCircle className="size-4 text-green-500" />
              )}
            </DropdownMenuItem>

          ))}

        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}