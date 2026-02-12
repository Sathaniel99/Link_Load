// Iconos
import { FaExternalLinkAlt } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
// Componentes
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
// Types
import { type ColumnDef } from "@tanstack/react-table"
import type { FileProps } from "@/components/Main"
import { toast } from "sonner"
import { useTranslations } from "@/context/useLanguaje"

export const useColumns = (deleteFile: (id: string) => void) => {
  const { t } = useTranslations();
  
  const translate = (ax: string) => t(`dt_${ax}`);

  const columns: ColumnDef<FileProps>[] = [

    // ID
    {
      accessorKey: "id",
      header: translate('id'),
      cell: ({ row }) => {
        return (<span className="w-full flex justify-center">{row.index + 1}</span>)
      }
    },
    // NOMBRE DEL ARCHIVO
    {
      accessorKey: "name",
      header: translate('name'),
      cell: ({ row }) => {
        const name = row.original.url;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="max-w-xs truncate block">{name}</span>
            </TooltipTrigger>
            <TooltipContent>
              {name}
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    // ORIGEN
    {
      accessorKey: "origen",
      header: translate('origen'),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <img
              className="w-10 h-auto object-contain"
              src={`/Link_Load/${row.original.page}.svg`}
              alt={row.original.page}
              loading="lazy"
            />
          </TooltipTrigger>
          <TooltipContent>
            {row.original.page === "desconocida" ? "Origen desconocido" : row.original.page.toUpperCase()}
          </TooltipContent>
        </Tooltip>
      ),
    },
    // ACCIONES
    {
      accessorKey: "acciones",
      header: translate('actions'),
      cell: ({ row }) => {
        const page = row.original.page as "mediafire" | "mega" | "desconocida"
        const url = row.original.url
        const id = row.original.id

        const class_b = {
          "mediafire": "default",
          "mega": "destructive",
          "desconocida": "warning",
        }

        const variante = class_b[page] as "default" | "destructive" | "warning" | "link" | "success" | "outline" | "secondary" | "ghost" | null | undefined

        const del = () => {
          deleteFile(id);
          toast.success(`${translate('dt_toast_1')}\n ${row.original.url}`);
        }

        return (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'destructive'}
                  size="icon"
                  onClick={() => del()}
                  className="h-8 w-8"
                >
                  <MdDelete />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {translate('dt_tt_1')}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="h-8 w-8 shadow-xl shadow-cyan-500/20"
                  variant={variante}
                  size="icon"
                  onClick={() => { window.open(url, '_blank', 'noopener,noreferrer') }}
                >
                  <FaExternalLinkAlt />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {translate('dt_tt_2')} {page === "desconocida" ? translate('dt_tt_3') : page.toUpperCase()}.
              </TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
  ];

  return columns;
};