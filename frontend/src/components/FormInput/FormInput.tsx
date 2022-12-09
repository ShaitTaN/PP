import React, { FC } from "react";
import './formInput.css'

interface Props{
	type?: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: FC<Props> = ({type = 'text', placeholder, value, onChange}) => {
  return (
    <div className={value ? "formInput active" : "formInput"}>
      <input id={placeholder} type={type} value={value} onChange={onChange}/>
			<label htmlFor={placeholder} >{placeholder}</label>
    </div>
  );
};

export default FormInput;
