
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  type?: 'input' | 'textarea';
  icon?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  type = 'input',
  icon
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required && ' *'}</Label>
      {type === 'input' ? (
        <div className={`flex items-center relative ${icon ? 'relative' : ''}`}>
          {icon && <span className="absolute left-3 text-gray-400">{icon}</span>}
          <Input
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={icon ? 'pl-10' : ''}
            required={required}
          />
        </div>
      ) : (
        <Textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;
