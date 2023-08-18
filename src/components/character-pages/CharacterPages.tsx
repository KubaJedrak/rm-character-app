import { useEffect, useState } from "react"
import { PaginationButton } from "../buttons/PaginationButton"
import { CharacterCard } from "./cards/CharacterCard"

import './CharacterPages.css'

type CharactersParams = {
  characters: object[]
}

export const CharacterPages = ({characters}: CharactersParams) => {

  const [activeCards, setActiveCards] = useState(1) // setting it to 1 balances the initial (-1) update to state in CharacterCard
  // I'd do context normally for this but I don't think it makes sense to bother with it?^

  const updateActiveCardsFunc = (isActive: boolean): void => {
    if (isActive) setActiveCards(activeCards+1)
    if (!isActive) setActiveCards(activeCards-1) 
  }

  const turnPage = (): void => {
    
  }

  return(
    <div className="container characters-page--container">
      <div className="characters-page__active-counter">
        <p className="characters-page--active-counter--text">Cards active: <span>{activeCards}</span></p>
      </div>
      <div className="characters-page">
        <ul className="characters-list">
          {characters.map( (character, id) => {
            return(
              <li key={id} className="characters-list__item">
                <CharacterCard character={characters[id]} activeCardTallyFunction={updateActiveCardsFunc} /> 
              </li>
            )
          })}
        </ul>
      </div>
      <div className="characters-page--buttons">
        <PaginationButton nextPage={false} handleClick={turnPage} />
        <PaginationButton nextPage={true} handleClick={turnPage} />
      </div>
    </div>
  )
}