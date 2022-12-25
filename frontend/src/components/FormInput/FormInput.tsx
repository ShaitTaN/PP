import React, { FC } from "react";
import './formInput.css'

interface Props{
	type?: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
}

const FormInput: FC<Props> = ({type = 'text', placeholder, value, onChange, error}) => {
  return (
    <div className={value ? "formInput active" : "formInput"}>
      <input id={placeholder} type={type} value={value} onChange={onChange}/>
			<label className="formInput__placeholder" htmlFor={placeholder} >{placeholder}</label>
			<span className="formInput__error">{error}</span>
    </div>
  );
};

export default FormInput;
