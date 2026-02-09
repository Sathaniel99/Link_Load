// Componentes
import { Textarea } from "../ui/textarea"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
// Iconos
import { SiGnubash } from "react-icons/si";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaCopy } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { LuDownload, LuWandSparkles } from "react-icons/lu";
import { RiFolderUploadFill } from "react-icons/ri";
import { Separator } from "../ui/separator";
// Hooks
import { useRef, useState, forwardRef } from "react";
import { toast } from "sonner";
// Utiles
import { processDownloadLinks } from "./utils/linkConverter";

export const Tab_Converter = ({ handled_void }: { handled_void: (arg: string) => void }) => {
    const [convert, setConvert] = useState<boolean>(false)
    const input_textarea = useRef<HTMLTextAreaElement>(null)
    const array_textarea = useRef<HTMLTextAreaElement>(null)

    // Limpiar los dos textareas
    const handledClean_All = () => {
        if (input_textarea.current) {
            input_textarea.current.value = "";
        }
        if (array_textarea.current && convert) {
            array_textarea.current.value = "";
        }

        toast.success(`Limpieza del texto realizada.`)
    }

    // Copiar el texto del segundo textarea
    const HandledCopy = () => {
        if (array_textarea.current) {
            const textToCopy = array_textarea.current.value;
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        toast.success(`Texto copiado al portapapeles.`);
                    })
                    .catch(err => {
                        console.error("Error al copiar:", err);
                        toast.error(`Error al copiar: ${err.message}`);
                    });
            } else {
                toast.warning("No hay contenido para copiar");
            }
        }
    };

    // Convertir a array
    const HandledTransform_to_Array = () => {
        if (!input_textarea.current || !array_textarea.current) {
            toast.error("Error: Textareas no disponibles");
            return;
        }

        const texto = input_textarea.current.value;

        if (!texto.trim()) {
            toast.warning("No hay texto para convertir");
            return;
        }

        try {
            // Usar la función del módulo
            const resultado = processDownloadLinks(texto);

            // Actualizar el textarea de salida
            array_textarea.current.value = resultado.jsonOutput;

            // Mostrar resumen en un toast
            const { summary } = resultado;
            let mensaje = `${summary.total} enlaces convertidos`;

            if (summary.mediafire > 0) {
                mensaje += ` (${summary.mediafire} MediaFire)`;
            }
            if (summary.mega > 0) {
                mensaje += ` (${summary.mega} MEGA)`;
            }
            if (summary.partsRange) {
                mensaje += ` - ${summary.partsRange}`;
            }

            toast.success(mensaje);

        } catch (error) {
            console.error("Error al convertir enlaces:", error);
            toast.error("Error al procesar los enlaces");
        }
    };

    // Cargar enlaces en la tabla principal
    const HandledLoad_to_Download = () => {
        if (input_textarea.current && input_textarea.current.value != "") {
            handled_void(input_textarea.current.value)
            return;
        }
        toast.error("No hay elementos.");
    }

    // Importar un txt y parsearlo para obtener el texto en formato: enlace1\nenlace2\nenlace3
    const HandledImport_File = () => {
        // Crear un input de tipo file temporal
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt,.json,text/plain';

        fileInput.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];

            if (!file) {
                toast.warning("No se seleccionó ningún archivo");
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;

                    if (!content) {
                        toast.error("El archivo está vacío");
                        return;
                    }

                    // Limpiar contenido
                    const cleanedContent = content.trim();

                    let linksArray: string[] = [];
                    let message = "";

                    // Intentar parsear como JSON
                    try {
                        const parsed = JSON.parse(cleanedContent);

                        if (Array.isArray(parsed)) {
                            // Si es array JSON, extraer los enlaces
                            linksArray = parsed
                                .filter((item: unknown): item is string =>
                                    typeof item === 'string' && item.trim().length > 0
                                )
                                .map((item: string) => item.trim());
                            message = `JSON array cargado: ${file.name} (${linksArray.length} elementos)`;
                        } else if (typeof parsed === 'object' && parsed !== null) {
                            // Si es objeto JSON (no array), extraer valores
                            const values: unknown[] = Object.values(parsed);
                            linksArray = values
                                .filter((item: unknown): item is string =>
                                    typeof item === 'string' && item.trim().length > 0
                                )
                                .map((item: string) => item.trim());
                            message = `JSON objeto cargado: ${file.name} (${linksArray.length} enlaces)`;
                        } else {
                            // Si es otro tipo (string, number, etc.)
                            linksArray = [cleanedContent];
                            message = `JSON cargado: ${file.name}`;
                        }
                    } catch {
                        // Si no es JSON válido, procesar como texto plano
                        // Dividir por líneas y filtrar líneas vacías
                        linksArray = cleanedContent
                            .split('\n')
                            .map(line => line.trim())
                            .filter(line => line.length > 0);
                        message = `Archivo TXT cargado: ${file.name} (${linksArray.length} líneas)`;
                    }

                    // Convertir a formato de enlace sobre enlace
                    const formattedContent = linksArray.join('\n');

                    // Actualizar el textarea
                    if (input_textarea.current) {
                        input_textarea.current.value = formattedContent;
                        toast.success(message);
                    } else {
                        toast.error("Error: Textarea no disponible");
                    }

                } catch (error) {
                    console.error("Error al leer el archivo:", error);
                    toast.error("Error al procesar el archivo");
                }
            };

            reader.onerror = () => {
                toast.error("Error al leer el archivo");
            };

            reader.readAsText(file);
        };

        fileInput.click();
    }

    // Descargar el array creado en un archivo JSON
    const HandledDownload_Array = () => {
        if (!array_textarea.current) {
            toast.error("No hay array generado para descargar");
            return;
        }

        const content = array_textarea.current.value.trim();

        if (!content) {
            toast.warning("El array está vacío");
            return;
        }

        try {
            // Intentar validar que sea un JSON válido
            try {
                const parsed = JSON.parse(content);

                // Si es un array, usar ese formato bonito
                if (Array.isArray(parsed)) {
                    // Formatear como JSON bonito
                    const jsonContent = JSON.stringify(parsed, null, 2);
                    downloadJsonFile(jsonContent, "enlaces_array.json");
                    toast.success(`Array descargado como JSON (${parsed.length} elementos)`);
                } else {
                    // Si es objeto pero no array, también descargar como JSON
                    const jsonContent = JSON.stringify(parsed, null, 2);
                    downloadJsonFile(jsonContent, "enlaces.json");
                    toast.success("Objeto JSON descargado");
                }
            } catch {
                // Si no es JSON válido, crear un array con el contenido
                // Dividir por líneas y filtrar líneas vacías
                const lines = content.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);

                if (lines.length === 0) {
                    toast.error("No hay contenido válido para descargar");
                    return;
                }

                const jsonArray = JSON.stringify(lines, null, 2);

                downloadJsonFile(jsonArray, "Enlaces.json");

                toast.success(`${lines.length} enlaces convertidos a JSON y descargados`);
            }

        } catch (error) {
            console.error("Error al descargar el JSON:", error);
            toast.error("Error al descargar el archivo");
        }
    }

    // Función auxiliar para descargar archivo JSON
    const downloadJsonFile = (content: string, filename: string) => {
        const blob = new Blob([content], {
            type: 'application/json;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return (
        <Card className="border-slate-700 w-full max-w-full">

            <CardHeader>

                <CardAction>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <FieldLabel className="cursor-pointer transition-all rounded-2xl hover:bg-blue-700/20 hover:border-blue-700">
                                <Field orientation="horizontal" className="p-2! flex items-center!">
                                    <Checkbox
                                        id="converter-checkbox"
                                        name="converter-checkbox"
                                        checked={convert}
                                        onCheckedChange={(checked) => setConvert(checked === true)}
                                    />
                                    <FieldContent className="text-sm! sm:text-base m-0 ml-2">
                                        Conversor de enlaces
                                    </FieldContent>
                                </Field>

                            </FieldLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                            Esta opción te permite convertir los enlaces y organizarlos en formato JSON.
                        </TooltipContent>
                    </Tooltip>
                </CardAction>

                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <SiGnubash size={'32'} className="text-blue-600 bg-blue-600/20 p-2 rounded-xl sm:size-10" />
                    Conversor Inteligente
                </CardTitle>

                <CardDescription className="text-sm sm:text-base">
                    Extrae y ordena automáticamente enlaces de descarga.
                </CardDescription>
            </CardHeader>

            <CardContent className="border border-slate-800 p-4 sm:p-6">
                <FieldGroup className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* Panel Izquierda */}
                    <TextAreas
                        handled={HandledImport_File}
                        icon_button={<IoDocumentTextOutline />}
                        textTooltip='Importar archivo ".txt"'
                        label_Legend="ENTRADA DE TEXTO"
                        ref={input_textarea}
                        readOnly={false}
                        placeholder="Pega aquí tus enlaces de MediaFire o MEGA..."
                    />

                    {/* Panel Derecha */}
                    {convert &&
                        <TextAreas
                            handled={HandledDownload_Array}
                            icon_button={<LuDownload />}
                            textTooltip="Descargar array"
                            label_Legend="ARRAY GENERADO"
                            ref={array_textarea}
                            readOnly={true}
                            placeholder="El array JSON aparecerá aquí..."
                        />
                    }
                </FieldGroup>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-2 p-4 sm:p-6">
                {/* Grupo izquierdo */}
                <Footer_Buttons
                    convert={convert}
                    variant1="default"
                    handled1={HandledLoad_to_Download}
                    icon1={<RiFolderUploadFill />}
                    text1="Cargar a Descargas"
                    variant2="success"
                    handled2={HandledTransform_to_Array}
                    icon2={<LuWandSparkles />}
                    text2="Convertir a Array"
                />

                <Separator orientation="horizontal" className="sm:hidden my-2" />

                {/* Grupo derecho */}
                <Footer_Buttons
                    convert={true} // Siempre mostrar botones de limpieza
                    variant1="destructive"
                    handled1={handledClean_All}
                    icon1={<MdDelete />}
                    text1="Limpiar todo"
                    variant2="ghost"
                    handled2={HandledCopy}
                    icon2={<FaCopy />}
                    text2="Copiar Resultado"
                />
            </CardFooter>
        </Card>
    )
}

// Componente TextAreas con forwardRef
interface TextAreasProps {
    icon_button: React.ReactElement;
    textTooltip: string;
    label_Legend: string;
    readOnly?: boolean;
    placeholder?: string;
    handled: () => void;
}

const TextAreas = forwardRef<HTMLTextAreaElement, TextAreasProps>(
    ({ icon_button, textTooltip, label_Legend, readOnly = false, placeholder = "", handled }, ref) => {
        return (
            <FieldSet className="w-full">
                <FieldLegend className="flex items-center gap-2 w-full py-3 m-0 text-slate-400">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="text-blue-600" variant={'outline'} size="icon" onClick={handled}>
                                {icon_button}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{textTooltip}</TooltipContent>
                    </Tooltip>
                    <Label className="text-sm sm:text-base whitespace-nowrap">
                        {label_Legend}
                    </Label>
                </FieldLegend>
                <Field>
                    <Textarea
                        ref={ref}
                        className={`min-h-64 max-h-64 w-full resize-none flex-1 font-mono text-sm ${readOnly && 'text-green-400'}`}
                        readOnly={readOnly}
                        placeholder={placeholder}
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all'
                        }}
                    />
                </Field>
            </FieldSet>
        );
    }
);

TextAreas.displayName = "TextAreas";

// Componente Footer_Buttons
interface Footer_ButtonsProps {
    variant1: "link" | "default" | "destructive" | "success" | "outline" | "secondary" | "ghost";
    handled1: () => void;
    icon1: React.ReactElement;
    text1: string;
    variant2: "link" | "default" | "destructive" | "success" | "outline" | "secondary" | "ghost";
    handled2: () => void;
    icon2: React.ReactElement;
    text2: string;
    convert: boolean;
}

const Footer_Buttons = ({ variant1, handled1, icon1, text1, variant2, handled2, icon2, text2, convert }: Footer_ButtonsProps) => {
    return (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
                variant={variant1}
                onClick={handled1}
                className="w-full sm:w-auto gap-2"
            >
                {icon1} {text1}
            </Button>
            {convert && (
                <Button
                    variant={variant2}
                    onClick={handled2}
                    className="w-full sm:w-auto gap-2"
                >
                    {icon2} {text2}
                </Button>
            )}
        </div>
    )
}