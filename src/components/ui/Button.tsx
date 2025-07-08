import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from '@chakra-ui/react'
import styles from './Button.module.css'

interface ButtonProps extends Omit<ChakraButtonProps, 'variant' | 'size'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
    size?: 'sm' | 'md' | 'lg'
}

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: ButtonProps) {
    const buttonClass = [
        styles.button,
        styles[variant],
        styles[size],
        className
    ].filter(Boolean).join(' ')

    return (
        <ChakraButton
            className={buttonClass}
            variant="outline" // Use our CSS instead of Chakra's variants
            size="md"    // Use our CSS instead of Chakra's sizes
            {...props}
        >
            {children}
        </ChakraButton>
    )
} 