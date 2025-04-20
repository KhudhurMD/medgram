import { ComponentProps } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import ReactSelect from 'react-select'
import { Message } from 'yup'
import { specialtyOptions } from '../../data/constants/graph'
import { StylesConfig } from 'react-select'
import { SelectOption } from '../../types/forms'

interface SelectProps {
  name: string
  label: string
  placeholder: string
  control: Control<FieldValues, unknown>
  options: SelectOption[]
  error?: Message
  extraProps?: ComponentProps<typeof ReactSelect>
}

export function Select({ name, label, control, options, placeholder, error, extraProps: selectProps }: SelectProps) {
  return (
    <div className='mb-4'>
      <label htmlFor={name} className='text-md mb-1 block font-medium text-gray-600'>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ReactSelect
            isClearable
            value={field.value}
            onChange={field.onChange}
            ref={field.ref}
            placeholder={placeholder}
            options={options}
            styles={selectStyles}
            {...selectProps}
          />
        )}
      />
      {error && <div className='text-sm text-red-500'>{error.toString()}</div>}
    </div>
  )
}

export const selectStyles: StylesConfig = {
  control: (provided) => ({
    ...provided,
    border: '2px solid #e5e7eb',
    borderRadius: '7px',
    padding: '2px 3px',
    boxShadow: 'none',
    ':hover': {
      border: '2px solid #e5e7eb99',
    },
    '&:focus-within': {
      borderColor: '#5C1CD5',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    color: '#e5e7eb',
  }),
  menuPortal: (provided) => ({
    ...provided,
    color: '#e5e7eb',
  }),
  input: (provided) => ({
    ...provided,
    border: 'none',
    outline: 'none',
    ':focus': {
      border: 'none',
      outline: 'none',
      borderColor: 'none',
      '--tw-ring-color': '#ffffff',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#5C1CD5' : 'white',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: state.isSelected ? '#8951F2' : '#ece3fb',
    },
  }),
  container: (provided) => ({
    ...provided,
    marginBottom: '4px',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#e5e7eb',
    borderRadius: '5px',
    color: '#6e7687',
    fontWeight: '500',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    transition: '0.2s ease',
    borderRadius: '5px',
    backgroundColor: 'none',
    color: '#828ca0',
    ':hover': {
      backgroundColor: 'none',
      color: '#5C1CD5',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '3px 7px',
  }),
}
