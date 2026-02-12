// Hooks
import { useState } from "react";
// Iconos
import { IoSearchOutline } from "react-icons/io5";
import { TbSortAscending } from "react-icons/tb";
import { RiSortDesc } from "react-icons/ri";
import { MdInfoOutline } from "react-icons/md";
// Componentes
import { type FileProps } from "../Main"
import { Card, CardDescription, CardHeader, CardTitle, } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// Componentes del Data-Table
import { useColumns } from "./Table/columns" // ✅ Importas el hook
import { DataTable } from "./Table/data-table"
import { useLanguage } from "@/context/useLanguaje";

interface Tab_DownloadProps {
    files: FileProps[];
    onDeleteFile: (id: string) => void;
}

export const Tab_Download = ({ files, onDeleteFile }: Tab_DownloadProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortAscending, setSortAscending] = useState(true);
    const { t } = useLanguage()

    // ✅ Usas el hook aquí
    const columns = useColumns(onDeleteFile);

    const files_length = files.length;

    // Filtrar archivos por término de búsqueda
    const filteredFiles = files.filter(file =>
        file.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.page?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar archivos
    const sortedFiles = [...filteredFiles].sort((a, b) => {
        const nameA = a.page || a.url;
        const nameB = b.page || b.url;

        if (sortAscending) {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });

    const toggleSort = () => {
        setSortAscending(!sortAscending);
    };

    return (
        <div className="container mx-auto">
            <Card className="border-slate-700 mb-3">
                <CardHeader className="">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <MdInfoOutline size={'32'} className="text-blue-600 bg-blue-600/20 p-2 rounded-xl sm:size-10" />
                        {t('tb_title')}
                    </CardTitle>

                    <CardDescription className="text-sm sm:text-base">
                        {files_length > 0 ? `${t('tb_subtitle_many_part1')} ${files_length > 1 ? t('tb_subtitle_many_part2_if2') : t('tb_subtitle_many_part2_if1')} ${files_length} ${t('tb_subtitle_many_part3')}${files_length > 1 && 's'} ${t('tb_subtitle_many_part4')}.` : t('tb_subtitle_else')}
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Barra de búsqueda y ordenamiento */}
            <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                    <Input
                        type="text"
                        placeholder={`${t('tb_search_input')}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                    />
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchTerm("")}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        >
                            ✕
                        </Button>
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-400 hidden sm:inline">
                        {searchTerm && `Encontrados: ${sortedFiles.length}`}
                    </span>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={toggleSort}
                                className="h-10 w-10"
                            >
                                {sortAscending ?
                                    <TbSortAscending className="h-5 w-5" /> :
                                    <RiSortDesc className="h-5 w-5" />
                                }
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {sortAscending ? t('tb_sort_button_up') : t('tb_sort_button_down')}
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* ✅ Pasas las columns directamente (ya no es función) */}
            <DataTable columns={columns} data={sortedFiles} />
        </div>
    )
}