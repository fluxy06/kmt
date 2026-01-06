import Card from '../features/CardService/Card'
import './App.css'

function App() {

  return (
    <div>
          <Card 
          bilbord={{
            id: 1,
            title: 'Сити-щиты',
            size: 'размеры: 10x20',
            imageUrl: 'https://via.placeholder.com/150'
          }} 
          width={{ min: '288px', preferred: '50vw', max: '380px' }}
          
          />
    </div>
  )
}

export default App
