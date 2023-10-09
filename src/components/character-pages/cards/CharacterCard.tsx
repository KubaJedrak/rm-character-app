import { useEffect, useState, useRef, useCallback } from "react"
import './CharacterCard.css'

type CharacterData = {
  character: any,
  isCardActive: boolean,
  handleActiveCard: (isActive: boolean, characterID: number) => void,
  tooltipDataFunc: (episodes: string[], isVisible: boolean) => void 
}

export const CharacterCard = ({character, isCardActive, handleActiveCard, tooltipDataFunc}: CharacterData) => {

  const [isActive, setIsActive] = useState(isCardActive)
  const [containerClass, setContainerClass] = useState("")
  const [episodeIDs, setEpisodeIDs] = useState<string[]>([])
  const {id, image, name, status, episode: episodes} = character
  const targetElementRef = useRef<any>(null)
  const regex = /[a-zA-Z0-9._%+-]+\/(\d+)$/  

  episodes.forEach( (episode: string) => {
    const match = episode.match(regex)   
    
    if (match) {
      const episodeID = match[1]   
      if (!episodeIDs.includes(episodeID)) episodeIDs.push(episodeID)     
    }    
  })

  // ----- FUNCTIONS: -----
  
  // --- Card Active Funcs: ---
  const handleCardClick = (): void => {
    setIsActive(!isActive)
  }

  // --- Tooltip Funcs: ---
  const handleMouseOver = (): void => {
    tooltipDataFunc(episodeIDs, true)
  }

  const handleMouseOut = (): void => {
    tooltipDataFunc([], false)
  }

  //   -- Card Active CSS trigger & Active Count (in Pages) update --
  useEffect( () => {
    handleActiveCard(isActive, character.id)
  }, [isActive, character.id])

  // update active cards on pagination from activeCards array
  useEffect(() => {
    if (isCardActive) setContainerClass("card characters-page__card active")
    if (!isCardActive) setContainerClass("card characters-page__card")
  }, [isCardActive])

  return(
    <div className={containerClass} onClick={handleCardClick}>
      <div className="card__image--container">
        <img className="card__img" alt={`A portrait of the character ${name}`} src={image} />
      </div>
      <div className='card__info'>
        <h5>{name}</h5>
        <p className="card__info--text">
          Status: <span className="card__info--text card__info--normal-text">{status}</span>
        </p>
        <div 
          className="card__info--text tooltip"
          ref={targetElementRef}          
        >
          Number of episodes: <p 
            className="card__info--text card__info--tooltip-text"
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseOut}
            id={`card-${id}`}
          >{episodes.length}</p>
        </div>
      </div>
    </div>
  )
}