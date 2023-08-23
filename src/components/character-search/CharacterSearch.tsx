import { useState, useEffect } from "react"
import { StringInput } from "../inputs/StringInput"

type SearchFunction = {
  handleUpdateSearchValue: (searchValue: string) => void,
  handleEnterKeyDown: (e: any) => void
}

export const CharacterSearch = ({handleUpdateSearchValue, handleEnterKeyDown}: SearchFunction) => {

  const [searchValue, setSearchValue] = useState("")



  const handleSearchValue = (e: any):void => {
    setSearchValue(e.target.value)         
  }

  useEffect(() => {
    handleUpdateSearchValue(searchValue)
  }, [searchValue])

  return (
    <div className="container characters-search" onKeyDown={handleEnterKeyDown}>
      <StringInput 
        value={searchValue}
        placeholder="Find character"
        isRequired={false}
        handleChange={handleSearchValue}
      />
    </div>
  )
}