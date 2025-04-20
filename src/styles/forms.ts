import { StylesConfig } from 'react-select'

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
    color: '#828ca0',
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
