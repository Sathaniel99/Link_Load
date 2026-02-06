// Hooks
import { useState } from 'react'
// Iconos
import { MdElectricBolt } from 'react-icons/md'
import { FaCloudDownloadAlt } from "react-icons/fa";
import { LuWandSparkles } from "react-icons/lu";
// Componentes
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tab_Converter } from './Tab_Converter/Tab_Converter';
import { Tab_Download } from './Tab_Download/Tab_Download';
// Utiles
import { convertToCustomFormat } from './Tab_Converter/utils/linkConverter';

export interface FileProps {
    url: string;
    page: string;
    id: string;
}

export const Main = () => {
    const [files, setFiles] = useState<FileProps[]>([]);

    // Manejo de los archivos o enlaces
    const handledFiles = (texto: string) => {
        const new_files = convertToCustomFormat(texto);

        const filesWithId = new_files.map((file, index) => ({
            ...file,
            id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
        }));
        setFiles(files => [...files, ...filesWithId]);
    }

    // Eliminar archivos o enlaces
    const deleteFile = (id: string) => {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    }



    return (
        <main className='w-full max-w-5xl py-4'>

            <section className='flex flex-col gap-5 py-5'>
                <div className='flex flex-col items-center gap-2'>
                    <h1 className='flex items-center text-5xl text-center font-semibold sirin-stencil'><MdElectricBolt className='text-primary' /> Link-Load</h1>
                    <small className='font-semibold text-slate-700! dark:text-slate-400!'>Gestor de enlaces para ordenamiento automático de descargas</small>
                </div>
                <div className='mx-auto'>
                    <h1 className='text-primary text-2xl text-center font-semibold m-0'>{files?.length}</h1>
                    <Separator className='border-t border-slate-600' />
                    <small className='font-semibold m-0 text-slate-700 dark:text-slate-500'>ARCHIVOS</small>
                </div>
            </section>

            <section className='h-auto flex flex-col'>

                <Tabs defaultValue="download" className="w-full">

                    <TabsList className='mx-auto'>
                        <TabsTrigger className='gap-1' value="download"><FaCloudDownloadAlt /> Descargas</TabsTrigger>
                        <TabsTrigger className='gap-1' value="converter"><LuWandSparkles /> Convertidor</TabsTrigger>
                    </TabsList>

                    <TabsContent className='min-h-155 m-0' value="download">
                        <Tab_Download files={files} onDeleteFile={deleteFile} />
                    </TabsContent>

                    <TabsContent className='min-h-155 m-0' value="converter">
                        <Tab_Converter handled_void={handledFiles} />
                    </TabsContent>

                </Tabs>
            </section>
        </main>
    )
}