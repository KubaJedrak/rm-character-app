import { useState } from "react"
import { StringInput } from "../inputs/StringInput"

export const CharacterSearch = () => {

  const [searchValue, setSearchValue] = useState("")

  const handleSearchValue = (e: any):void => {
    setSearchValue(e.target.value)         
  }

  return (
    <div className="container characters-search">
    <StringInput 
      value={searchValue}
      placeholder="Find character"
      isRequired={false}
      handleChange={handleSearchValue}
    />
  </div>
  )
}