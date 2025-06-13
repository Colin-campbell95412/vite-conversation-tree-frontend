import React from 'react';
import './CustomInput.css';

interface CustomInputProps {
    focusedField?: string | null | undefined;
    setFocusedField?: any;
    formData?: string;
    handleChange?: any;
    errors?: any;
    name: string;
    placeholder?: string;
    value?: string;
    type?: string;
  }

const CustomInput: React.FC<CustomInputProps> = (props: CustomInputProps) => {
    const { focusedField, setFocusedField, value, handleChange, errors, name, type, placeholder } = props;
    return (
        <input type={type ? type : "text"}
            placeholder={placeholder}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            name={name}
            value={value}
            onChange={handleChange}
            className={`${errors[name] && focusedField !== name ? "custom-input required" : "custom-input"}`} />
    );
};
export default CustomInput;