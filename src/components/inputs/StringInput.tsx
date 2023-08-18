import './StringInput.css'

type StringProps = {
  name?: string,
  value: string,
  placeholder: string,
  isRequired: boolean,
  handleChange: (e: any) => void  
}

export const StringInput = ({value, handleChange, placeholder, isRequired}: StringProps) => {

  return(
    <div className="input--container">
      <input 
        className="input string-input" 
        name={value} 
        value={value}
        placeholder={placeholder}
        onChange={handleChange} 
        required={isRequired}
      />
      <label className="input__label">Search for a character</label>
    </div>
  )
}