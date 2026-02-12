import './App.css'
import { Main } from './components/Main'
import { Footer } from './components/Footer'
import { LanguageProvider } from './context/LanguajeContext'

function App() {

  return (
    <LanguageProvider>
      <Main></Main>
      <Footer></Footer>
    </LanguageProvider>
  )
}

export default App
