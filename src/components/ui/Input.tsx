import { Input as ChakraInput, type InputProps as ChakraInputProps } from '@chakra-ui/react'
import styles from './Input.module.css'

interface InputProps extends Omit<ChakraInputProps, 'variant' | 'size'> {
    variant?: 'default' | 'error' | 'success'
    size?: 'sm' | 'md' | 'lg'
}

export function Input({
    variant = 'default',
    size = 'md',
    className,
    ...props
}: InputProps) {
    const inputClass = [
        styles.input,
        styles[variant],
        styles[size],
        className
    ].filter(Boolean).join(' ')

    return (
        <ChakraInput
            className={inputClass}
            variant="outline"
            size="md"
            {...props}
        />
    )
} 