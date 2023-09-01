import { CharacterPages } from './components/character-pages/CharacterPages';
import { useState, useEffect , useRef } from 'react';
import './App.css';

function App() {

  const [appBounds, setAppBounds] = useState<DOMRect | null>(null)
  const appRef = useRef<any>(null)

  useEffect(() => {
    setAppBounds(appRef.current.getBoundingClientRect())
  }, [appRef])

  return (
    <div 
      className="App"
      ref={appRef}
    >
      <h2>Rick & Morty Character Sheet</h2>
      <CharacterPages appBounds={appBounds} />
    </div>
  );
}

export default App;