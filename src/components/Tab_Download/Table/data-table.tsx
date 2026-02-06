// Iconos
import { ImSpinner2 } from "react-icons/im"
// Componentes
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[] | (() => ColumnDef<TData, TValue>[])
    data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {

    const resolvedColumns = typeof columns === 'function' ? columns() : columns;

    const table = useReactTable({
        data,
        columns: resolvedColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 8,
            },
        },
    })

    const totalPages = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex + 1

    // Función para generar los números de página
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            // Si hay pocas páginas, mostrar todas
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Mostrar páginas con ellipsis
            if (currentPage <= 3) {
                // Páginas cercanas al inicio
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i)
                }
                pageNumbers.push(-1) // Ellipsis
                pageNumbers.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                // Páginas cercanas al final
                pageNumbers.push(1)
                pageNumbers.push(-1) // Ellipsis
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i)
                }
            } else {
                // Páginas en el medio
                pageNumbers.push(1)
                pageNumbers.push(-1) // Ellipsis
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i)
                }
                pageNumbers.push(-1) // Ellipsis
                pageNumbers.push(totalPages)
            }
        }

        return pageNumbers
    }

    return (
        <div className="space-y-4">
            <Card className="p-0 border-slate-700! overflow-hidden">
                <div className="overflow-hidden rounded-md">
                    <Table className="">
                        <TableHeader className="bg-slate-800">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={resolvedColumns.length} className="h-24 text-center">
                                        <span className="flex gap-1 justify-center items-center">
                                            <ImSpinner2 className="animate-spin text-blue-700 size-6" /> No hay resultados a mostrar.
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Mostrar siempre la información y controles de paginación si hay datos */}
            {data.length > 0 && (
                <div className="flex items-center justify-between">
                    {/* Información de página actual */}
                    <div className="text-sm text-slate-400">
                        {totalPages > 1 ? (
                            <>
                                Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} de {data.length} archivos
                            </>
                        ) : (
                            <>Mostrando {data.length} de {data.length} archivos</>
                        )}
                    </div>

                    {/* Controles de paginación */}
                    {totalPages > 1 ? (
                        <Pagination>
                            <PaginationContent>
                                {/* Botón Anterior */}
                                <PaginationItem>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="h-fit p-0"
                                    >
                                        <PaginationPrevious className="bg-transparent! hover:bg-transparent! active:bg-transparent!" />
                                    </Button>
                                </PaginationItem>

                                {/* Números de página */}
                                {getPageNumbers().map((pageNumber, index) => (
                                    <PaginationItem key={index}>
                                        {pageNumber === -1 ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                onClick={() => table.setPageIndex(pageNumber - 1)}
                                                isActive={currentPage === pageNumber}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}

                                {/* Botón Siguiente */}
                                <PaginationItem>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="h-fit p-0"
                                    >
                                        <PaginationNext className="bg-transparent! hover:bg-transparent! active:bg-transparent!" />
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    ) : (
                        <div className="w-0 flex-1"></div>
                    )}

                    {/* Selector de tamaño de página */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Mostrar:</span>
                        <Select
                            value={table.getState().pagination.pageSize.toString()}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="w-full max-w-48 transition-all">
                                <SelectValue placeholder="Cant. elementos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Cant. elementos</SelectLabel>
                                    {[8, 16, 24, 32].map(pageSize => (
                                        <SelectItem key={pageSize} value={pageSize.toString()}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
        </div>
    )
}