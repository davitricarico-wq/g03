import type { ReactNode } from 'react';

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
    errorMessage?: string;
    feedback?: FieldFeedback;
    onBlur?: () => void;
}

export type FieldFeedback = {
    type: 'error' | 'warning' | 'success' | 'info';
    message: string;
};

function fieldClass(error?: boolean, feedback?: FieldFeedback): string {
    if (error || feedback?.type === 'error') return 'field invalid';
    if (feedback?.type === 'warning') return 'field warning';
    if (feedback?.type === 'success') return 'field valid';
    return 'field';
}

function RequiredMark() {
    return <span className="required-mark" aria-label="obrigatório">*</span>;
}

function FieldMessage({ error, errorMessage, feedback }: { error?: boolean; errorMessage?: string; feedback?: FieldFeedback }) {
    if (error && errorMessage) return <span className="field-error-msg">{errorMessage}</span>;
    if (!feedback?.message) return null;
    return <span className={`field-feedback-msg ${feedback.type}`}>{feedback.message}</span>;
}

export function TextField({ label, value, onChange, type = 'text', placeholder, required, inputMode, maxLength, error, errorMessage, feedback, onBlur }: TextFieldProps) {
    return (
        <div className={fieldClass(error, feedback)}>
            <label>{label}{required && <RequiredMark />}</label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                inputMode={inputMode}
                maxLength={maxLength}
                aria-invalid={Boolean(error || feedback?.type === 'error')}
                aria-required={required}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
            />
            <FieldMessage error={error} errorMessage={errorMessage} feedback={feedback} />
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
    errorMessage?: string;
    feedback?: FieldFeedback;
}

export function SelectField({ label, value, onChange, options, placeholder = 'Selecione', disabledOptions = [], required, error, errorMessage, feedback }: SelectFieldProps) {
    return (
        <div className={fieldClass(error, feedback)}>
            <label>{label}{required && <RequiredMark />}</label>
            <select value={value} aria-invalid={Boolean(error || feedback?.type === 'error')} aria-required={required} onChange={(e) => onChange(e.target.value)}>
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt} disabled={disabledOptions.includes(opt)}>
                        {opt}
                    </option>
                ))}
            </select>
            <FieldMessage error={error} errorMessage={errorMessage} feedback={feedback} />
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
}

export function TextAreaField({ label, value, onChange, placeholder }: TextAreaFieldProps) {
    return (
        <div className="field">
            <label>{label}</label>
            <textarea rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}

export function Row({ children }: { children: ReactNode }) {
    return <div className="field-row">{children}</div>;
}
