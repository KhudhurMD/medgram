import { Message } from 'yup'

export interface InputProps {
  name: string
  label?: string
  error?: Message
  className?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export const Input = ({ label, name, error, className, inputProps }: InputProps) => {
  return (
    <>
      {label && (
        <label htmlFor={name} className='text-md block font-medium text-gray-600'>
          {label}
        </label>
      )}

      <div className='mt-1 mb-4'>
        <input
          className={`block w-full appearance-none rounded-md border-2 border-gray-200 px-3 py-2 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 ${className}`}
          {...inputProps}
        />
        {error && <div className='text-sm text-red-500'>{error.toString()}</div>}
      </div>
    </>
  )
}
