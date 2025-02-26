// ../common/form/Select.tsx
import React from "react";

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  placeholder,
  children,
}) => {
  return (
    <select value={value} onChange={onChange} className="border rounded p-2">
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
};

export default Select;
