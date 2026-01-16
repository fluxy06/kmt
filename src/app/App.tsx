import Footer from '../layots/Footer/footer'
import Header from '../layots/Header/header'
import Modal from '../features/Modal/Modal'
import './App.css'

function App() {

  return (
    <div>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-[80px]">
                    <Modal />
            </main>
            <Footer />
          </div>
    </div>
  )
}

export default App
