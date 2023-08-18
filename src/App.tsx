import { useFetchWithQueryFilter } from './hooks/useFetchWithQueryFilter';
import { useEffect, useState } from 'react';
import { StringInput } from './components/inputs/StringInput';
import { CharacterSearch } from './components/character-search/CharacterSearch';
import { CharacterPages } from './components/character-pages/CharacterPages';

import './App.css';

function App() {

  const [characters, setCharacters] = useState([])
  const [info, setInfo] = useState({})
  const [ready, setReady] = useState(false)
 
  const getCharacters = async () => {
    const response = await fetch("https://rickandmortyapi.com/api/character")
    const data = await response.json()

    setInfo(data.info)
    setCharacters(data.results)
    setReady(true)
  } 

  useEffect( () => {
    getCharacters()
  }, [])

  return (
    <div className="App">
      {ready && 
      <>
        <h2>Rick & Morty Character Sheet</h2>
        <CharacterSearch />
        <CharacterPages characters={characters} />
      </>}
      {!ready && <p>Loading...</p>}
    </div>
  );
}

export default App;
