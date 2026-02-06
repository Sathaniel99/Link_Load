import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Jimp from 'jimp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function run() {
  const projectRoot = path.resolve(__dirname, '..')
  const publicDir = path.join(projectRoot, 'public')
  const src = path.join(publicDir, 'icon_web.png')

  if (!fs.existsSync(src)) {
    console.error('No se encontró', src)
    process.exit(1)
  }

  const out192 = path.join(publicDir, 'icon-192.png')
  const out512 = path.join(publicDir, 'icon-512.png')

  try {
    console.log('Leyendo imagen original...')
    const image = await Jimp.read(src)

    console.log('Generando icon-192.png...')
    await image.clone().resize(192, 192).write(out192)

    console.log('Generando icon-512.png...')
    await image.clone().resize(512, 512).write(out512)

    console.log('✓ Iconos generados en', publicDir)
    console.log('  - icon-192.png')
    console.log('  - icon-512.png')
  } catch (err) {
    console.error('Error al generar iconos:', err)
    process.exit(1)
  }
}

run()
