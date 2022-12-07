import React, { FC } from "react";
import './formInput.scss'

interface Props{
	type: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: FC<Props> = ({type, placeholder, value, onChange}) => {
  return (
    <div className={value ? "formInput active" : "formInput"}>
      <input type={type} value={value} onChange={onChange}/>
			<span>{placeholder}</span>
    </div>
  );
};

export default FormInput;
