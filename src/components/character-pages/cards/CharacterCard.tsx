import { useEffect, useState } from "react"
import { createPortal } from 'react-dom';
import { TooltipContent } from "./TooltipContent"
import './CharacterCard.css'

type CharacterData = {
  character: any,
  handleActiveCard: (isActive: boolean, listKey: number) => void,
  listKey: number,
}

type EpisodeIDs = string[]

export const CharacterCard = ({character, handleActiveCard, listKey}: CharacterData) => {

  const [isActive, setIsActive] = useState(false)
  const [containerClass, setContainerClass] = useState("")
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [episodeIDs, setEpisodeIDs] = useState<EpisodeIDs>([])
  const {id, image, name, status, episode: episodes} = character
  const regex = /[a-zA-Z0-9._%+-]+\/(\d+)$/

  episodes.forEach( (episode: string) => {
    const match = episode.match(regex)   
    
    if (match) {
      const episodeID = match[1]   
      if (!episodeIDs.includes(episodeID)) episodeIDs.push(episodeID)     
    }    
  })

  // ----- FUNCTIONS: -----

  // --- Tooltip Funcs: ---
  const handleMouseOver = (element: any): void => {
    setIsTooltipVisible(true)
    // const rect = element.getBoundingClientRect()
    // console.log(rect); 
  }

  const handleMouseOut = (): void => {
    setIsTooltipVisible(false)
  }

  // --- Card Active Funcs: ---
  const handleCardClick = (): void => {
    setIsActive(!isActive)
  }

  //   -- Card Active CSS trigger & Active Count (in Pages) update --
  useEffect( () => {
    if (isActive) { 
      setContainerClass("card characters-page__card active")
      handleActiveCard(isActive, listKey)
    } else {
      setContainerClass("card characters-page__card")
      handleActiveCard(isActive, listKey)
    }
  }, [isActive])

  return(
    <div className={containerClass} onClick={handleCardClick}>
      <div className="card__image--container">
        <img className="card__img" src={image} />
      </div>
      <div className='card__info'>
        <h5>{name}</h5>
        <p className="card__info--text">
          Status: <span className="card__info--text card__info--normal-text">{status}</span>
        </p>
        <div className="card__info--text tooltip">
          Number of episodes: <a 
            className="card__info--text card__info--tooltip-text"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            id={`card-${id}`}
          >{episodes.length}</a>
          {createPortal(
          <TooltipContent 
            episodeIDs={episodeIDs}
            visible={isTooltipVisible} 
            top="30px"
            left="30px"
            name={name}
          />, document.body, id)}
        </div>
      </div>
    </div>
  )
}