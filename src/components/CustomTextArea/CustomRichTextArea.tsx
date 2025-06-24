import React, { useRef } from 'react';
import './CustomTextArea.css';

interface CustomRichTextAreaProps {
    focusedField: string | null;
    setFocusedField: any;
    value: string;
    onChange: (value: string) => void;
    errors: any;
    name: string;
    placeholder: string;
}

const CustomRichTextArea: React.FC<CustomRichTextAreaProps> = (props: CustomRichTextAreaProps) => {
    const { focusedField, setFocusedField, value, onChange, errors, name, placeholder } = props;
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={ref}
            contentEditable
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            className={`${errors[name] && focusedField !== name ? "custom-textarea required" : "custom-textarea"}`}
            style={{ minHeight: 120, border: '1px solid #ccc', borderRadius: 4, padding: 8, background: '#fff' }}
            onInput={e => onChange((e.target as HTMLDivElement).innerHTML)}
            dangerouslySetInnerHTML={{ __html: value }}
            suppressContentEditableWarning
        />
    );
};
export default CustomRichTextArea;
