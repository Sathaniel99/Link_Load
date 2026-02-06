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

export const Footer = () => {

    const redes = [
        { link: `https://github.com/${github}`, icon: <FaGithub size={20} />, red: "GitHub", color: "hover:bg-purple-700 hover:border-purple-700" },
        { link: `https://www.facebook.com/${facebook}`, icon: <FaFacebook size={20} />, red: "Facebook", color: "hover:bg-blue-900 hover:border-blue-900" },
        { link: `https://www.instagram.com/${instagram}`, icon: <FaInstagram size={20} />, red: "Instagram", color: "hover:bg-orange-700 hover:border-orange-700" },
        { link: `https://t.me/${telegram}`, icon: <FaTelegram size={20} />, red: "Telegram", color: "hover:bg-blue-700 hover:border-blue-700" },
        { link: `https://wa.me/${whatsapp}?text=Hola%20Sathaniel,%20me%20gustaria%20hablar%20con%20usted`, icon: <FaWhatsapp size={20} />, red: "Whatsapp", color: "hover:bg-green-700 hover:border-green-700" },
    ]


    return (
        <footer className="flex flex-col w-full px-4 pb-6 gap-4 sm:items-center sm:justify-between">

            <Separator className="max-w-5xl border-t border-slate-700 mb-3" />

            <div className="flex justify-between w-full max-w-5xl ">

                <div className="flex flex-col gap-1 text-slate-700 dark:text-slate-500">
                    <h1 className="flex items-center gap-2 text-xl font-semibold sirin-stencil"><MdElectricBolt size={30} className="text-primary" /> LinkLoad <ModeToggle /> </h1>
                    <small>Gestor para enlaces de descargas.</small>
                </div>

                {/* Redes sociales */}
                <div className="flex gap-1">
                    {redes.map((element, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger>
                                <a
                                    href={element.link} target="_blank" rel="noopener noreferrer"
                                    className={`h-10 w-10 border transition-all transform hover:-translate-y-1 rounded-full flex items-center justify-center border-slate-700 text-slate-700 hover:text-white dark:text-white bg-transparent ${element.color}`}
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

            <h1 className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-500">
                {new Date().getFullYear()} Sathaniel®
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Avatar className="transform hover:-translate-y-1 transition-all hover:animate-bounce cursor-pointer">
                            <AvatarImage src="/Link_Load/sathaniel.jpg" />
                            <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>Sathaniel</TooltipContent>
                </Tooltip>
                <Separator orientation={'vertical'} className="h-4 mx-2 bg-slate-700" /> Creado con <IoHeart size={'20'} className="text-red-600 animate-pulse" /> para la comunidad.
            </h1>
        </footer >
    );
};
