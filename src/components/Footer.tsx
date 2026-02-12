// Iconos
import { MdElectricBolt } from "react-icons/md";
import { IoHeart } from "react-icons/io5";
import { FaGithub, FaInstagram, FaFacebook, FaTelegram, FaWhatsapp } from "react-icons/fa";
// Componentes
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
// Configuraciones
import { github, instagram, facebook, telegram, whatsapp } from '@/lib/configs'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { useTranslations } from "@/context/useLanguaje";
import { ChangeLang } from "./change-lang";

export const Footer = () => {

    const { t } = useTranslations();

    const redes = [
        { link: `https://github.com/${github}`, icon: <FaGithub size={20} />, red: "GitHub", color: "hover:bg-purple-700 hover:border-purple-700" },
        { link: `https://www.facebook.com/${facebook}`, icon: <FaFacebook size={20} />, red: "Facebook", color: "hover:bg-blue-900 hover:border-blue-900" },
        { link: `https://www.instagram.com/${instagram}`, icon: <FaInstagram size={20} />, red: "Instagram", color: "hover:bg-orange-700 hover:border-orange-700" },
        { link: `https://t.me/${telegram}`, icon: <FaTelegram size={20} />, red: "Telegram", color: "hover:bg-blue-700 hover:border-blue-700" },
        { link: `https://wa.me/${whatsapp}?text=Hola%20Sathaniel,%20me%20gustaria%20hablar%20con%20usted`, icon: <FaWhatsapp size={20} />, red: "Whatsapp", color: "hover:bg-green-700 hover:border-green-700" },
    ]

    return (
        <footer className="flex flex-col w-full px-4 py-6 gap-6">
            {/* Contenedor principal centrado */}
            <div className="flex flex-col items-center w-full">
                <Separator className="w-full max-w-7xl border-t border-slate-700 mb-4" />

                {/* Primera fila - adaptable */}
                <div className="flex flex-col md:flex-row w-full max-w-7xl md:items-center md:justify-between gap-6 md:gap-4">

                    {/* Logo y título */}
                    <div className="flex flex-col gap-1 text-slate-700 dark:text-slate-500 mx-auto">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-semibold sirin-stencil">
                                <MdElectricBolt size={30} className="text-primary shrink-0" />
                                LinkLoad
                            </h1>
                            <ModeToggle />
                            <ChangeLang />
                        </div>
                        <small className="text-xs sm:text-sm">{t('footer_subtitle')}</small>
                    </div>

                    {/* Redes sociales - responsive grid */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mx-auto">
                        {redes.map((element, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <a
                                        href={element.link} target="_blank" rel="noopener noreferrer"
                                        className={`h-9 w-9 sm:h-10 sm:w-10 border transition-all transform hover:-translate-y-1 rounded-full flex items-center justify-center border-slate-700 text-slate-700 hover:text-white dark:text-white bg-transparent ${element.color}`}
                                    >
                                        {element.icon}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {element.red}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </div>

                {/* Segunda fila - copyright y créditos */}
                <div className="flex flex-col sm:flex-row w-full max-w-md items-center justify-between mt-6 gap-4 sm:gap-2">

                    {/* Copyright y avatar */}
                    <div className="flex items-center text-slate-700 dark:text-slate-500 text-xs sm:text-sm">
                        <h1 className="flex flex-row items-center gap-2">
                            <span>{new Date().getFullYear()} Sathaniel®</span>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 transform hover:-translate-y-1 transition-all hover:animate-bounce cursor-pointer">
                                        <AvatarImage src="/Link_Load/sathaniel.jpg" />
                                        <AvatarFallback className="text-xs">S</AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>Sathaniel</TooltipContent>
                            </Tooltip>
                        </h1>
                    </div>

                    {/* Separador vertical - oculto en móvil */}
                    <Separator orientation={'vertical'} className="hidden sm:block h-4 bg-slate-700" />

                    {/* Mensaje de comunidad */}
                    <div className="flex items-center text-slate-700 dark:text-slate-500 text-xs sm:text-sm">
                        <h1 className="flex items-center gap-1.5 text-center sm:text-left">
                            {t('footer_text_part1')} <IoHeart size={'18'} className="text-red-600 animate-pulse shrink-0" /> {t('footer_text_part2')}
                        </h1>
                    </div>
                </div>
            </div>
        </footer>
    );
};