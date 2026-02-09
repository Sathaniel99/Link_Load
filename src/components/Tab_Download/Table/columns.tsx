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


export const columns = (deleteFile: (id: string) => void): ColumnDef<FileProps>[] => [
  // ID
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (<span className="w-full flex justify-center">{row.index + 1}</span>)
    }
  },
  // NOMBRE DEL ARCHIVO
  {
    accessorKey: "name",
    header: "NOMBRE DEL ARCHIVO",
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
    header: "ORIGEN",
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
    header: "ACCIONES",
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
        toast.success(`Eliminado satisfactoriamente el elemento:\n ${row.original.url}`);
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
              Eliminar enlace
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
              Ir a {page === "desconocida" ? "la WEB" : page.toUpperCase()}.
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },
]