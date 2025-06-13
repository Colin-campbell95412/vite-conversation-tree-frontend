import React from 'react';
import './CustomTextArea.css';

interface CustomTextAreaProps {
    focusedField: string | null;
    setFocusedField: any;
    formData: string;
    handleChange: any;
    errors: any;
    name: string;
    placeholder: string;
    value: string;
    type?: string;
  }

const CustomTextArea: React.FC<CustomTextAreaProps> = (props: CustomTextAreaProps) => {
    const { focusedField, setFocusedField, value, handleChange, errors, name, placeholder } = props;
    return (
        <textarea
            placeholder={placeholder}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            rows={5}
            name={name}
            value={value}
            onChange={handleChange}
            className={`${errors[name] && focusedField !== name ? "custom-textarea required" : "custom-textarea"}`} />
    );
};
export default CustomTextArea;