import type { CSSProperties, ReactNode } from 'react';

interface TextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    inputMode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel';
    maxLength?: number;
    error?: boolean;
    onBlur?: () => void;
}

export function TextField({ label, value, onChange, type = 'text', placeholder, required, inputMode, maxLength, error, onBlur }: TextFieldProps) {
    return (
        <div className={`field${error ? ' invalid' : ''}`}>
            <label>{label}{required && ' *'}</label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                inputMode={inputMode}
                maxLength={maxLength}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
            />
        </div>
    );
}

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: readonly string[];
    placeholder?: string;
    disabledOptions?: readonly string[];
    required?: boolean;
    error?: boolean;
}

export function SelectField({ label, value, onChange, options, placeholder = 'Selecione', disabledOptions = [], required, error }: SelectFieldProps) {
    return (
        <div className={`field${error ? ' invalid' : ''}`}>
            <label>{label}{required && ' *'}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt} disabled={disabledOptions.includes(opt)}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}

interface CheckboxFieldProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
    return (
        <label className="field checkbox-field">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span>{label}</span>
        </label>
    );
}

interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    boxStyle?: CSSProperties;
}

export function TextAreaField({ label, value, onChange, placeholder, boxStyle }: TextAreaFieldProps) {
    return (
        <div style={boxStyle} className="field">
            <label>{label}</label>
            <textarea rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}

export function Row({ children }: { children: ReactNode }) {
    return <div className="field-row">{children}</div>;
}
