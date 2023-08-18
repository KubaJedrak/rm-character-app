import { useEffect, useState } from "react"
import { createPortal } from 'react-dom';

import './CharacterCard.css'
import { TooltipContent } from "./TooltipContent"
import { isVisible } from "@testing-library/user-event/dist/utils";


type CharacterData = {
  character: any, //because I CAN! >.>       (or can I interface?)
  activeCardTallyFunction: (isActive: boolean) => void
}

type Season = string[]

export const CharacterCard = ({character, activeCardTallyFunction}: CharacterData) => {

  const [isActive, setIsActive] = useState(false)
  const [containerClass, setContainerClass] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const {id, image, name, status, episode: episodes} = character 

  const regex = /[a-zA-Z0-9._%+-]+\/(\d+)$/
  let episodeIDs: string[] = []

  episodes.forEach( (episode: string) => {
    const match = episode.match(regex)
    
    if (match) {
      const episodeID = match[1]           
      episodeIDs.push(episodeID)
    }
  })

  // --- TOOLTIP: ---

  let seasons: string[][] = [[], [], [], [], [], []]

  episodeIDs.forEach( (episode: string) => {
    if (Number(episode) >= 0 && Number(episode) <= 11) {
      seasons[0].push(episode)
    }
    if (Number(episode) >= 12 && Number(episode) <= 21) {
      seasons[1].push(episode)
    }
    if (Number(episode) >= 22 && Number(episode) <= 31) {
      seasons[2].push(episode)
    }
    if (Number(episode) >= 32 && Number(episode) <= 41) {
      seasons[3].push(episode)
    }
    if (Number(episode) >= 42 && Number(episode) <= 51) {
      seasons[4].push(episode)
    }
    if (Number(episode) > 52) {
      seasons[5].push(episode)
    }
  })

  seasons.forEach((season: string[], i: number): void => {
    season.forEach((episode: string, i: number, season: string[]): void => {
      season[i] = "Episode " + season[i]
    })
  })   

  const content = (
    <div id="tooltip--container">
      {seasons.map( (season: string[], id: number): any => {
        if (season.length > 0) {
          return (
            <div key={id}>
              <h4>{`Season ${id+1}`}</h4>
              {season.map( (episode: string, id: number): any => {                
                return(
                  <p className="tooltip--text" key={id}>{episode}</p>
                )
              })}
            </div>
          )
        }
      })}
    </div>
  )

  // --- FUNCTIONS: ---

  const handleCardClick = (): void => {
    setIsActive(!isActive)
  }

  const handleMouseOver = (element: any): void => {
    setIsVisible(true)
    // const rect = element.getBoundingClientRect()
    // console.log(rect);
    
  }

  const handleMouseOut = (): void => {
    setIsVisible(false)
  }

  useEffect( () => {
    if (isActive) {
      setContainerClass("card characters-page__card active")
      activeCardTallyFunction(isActive)
    } else {
      setContainerClass("card characters-page__card")
      activeCardTallyFunction(isActive)
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
            episodeInfo={episodeIDs} 
            visible={isVisible} 
            top="30px"
            left="30px"
          />, document.body, id)}
        </div>
      </div>
      
    </div>
  )
}