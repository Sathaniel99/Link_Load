import { useLanguage } from "@/context/useLanguaje"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { FaCheckCircle } from "react-icons/fa"

export const ChangeLang = () => {

    const { language, setLanguage } = useLanguage()

    const langs = [
        {
            lang: "Español",
            language: "es",
            func: () => setLanguage("es")
        },
        {
            lang: "English",
            language: "en",
            func: () => setLanguage("en")
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="p-1"
                    aria-label="Cambiar idioma"
                >
                    <div className="w-full h-full rounded-full overflow-hidden border border-primary">
                        <img
                            className="object-cover w-full h-full"
                            src={`/Link_Load/${language}.webp`}
                            alt={`${language === 'es' ? 'Spanish' : 'English'} flag`}
                            loading="lazy"
                        />
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="min-w-35 sm:min-w-40 p-1.5"
                sideOffset={8}
            >
                {langs.map((element, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={element.func}
                        className={`flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base cursor-pointer rounded-md transition-all ${language === element.language ? 'bg-primary/10 text-primary dark:bg-primary/20 font-medium' : 'hover:bg-accent hover:text-accent-foreground'}
        `}
                    >
                        <span className="flex items-center gap-2 sm:gap-3">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-primary-foreground/20">
                                <img
                                    src={`/Link_Load/${element.language}.webp`}
                                    alt={`${element.language} flag`}
                                    className="object-cover w-full h-full"
                                    loading="lazy"
                                />
                            </div>
                            <span className="font-medium">{element.lang}</span>
                        </span>

                        {language === element.language && (
                            <FaCheckCircle className="size-3.5 sm:size-4 text-green-500 animate-in fade-in zoom-in" />
                        )}
                    </DropdownMenuItem>
                ))}

                {/* Indicador de idioma actual - solo móvil */}
                <div className="mt-1.5 pt-1.5 border-t border-border sm:hidden">
                    <p className="px-2 py-1 text-xs text-muted-foreground text-center">
                        Idioma actual: {language === 'es' ? 'Español' : 'English'}
                    </p>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}