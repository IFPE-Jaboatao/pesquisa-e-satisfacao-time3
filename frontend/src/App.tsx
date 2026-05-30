import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pesquisa e Satisfação</h1>
        <p>Frontend em desenvolvimento</p>
        <button onClick={() => setCount((count) => count + 1)}>
          Contador: {count}
        </button>
      </header>
    </div>
  )
}

export default App
