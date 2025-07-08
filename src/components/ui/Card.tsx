import { Box, type BoxProps } from '@chakra-ui/react'
import styles from './Card.module.css'

interface CardProps extends Omit<BoxProps, 'variant'> {
    variant?: 'elevated' | 'outline' | 'ghost'
    title?: string
    subtitle?: string
    content?: string
    footer?: string
    children?: React.ReactNode
    onClick?: () => void
}

export function Card({
    variant = 'elevated',
    title,
    subtitle,
    content,
    footer,
    children,
    onClick,
    className,
    ...props
}: CardProps) {
    const cardClass = [
        styles.card,
        styles[variant],
        onClick && styles.clickable,
        className
    ].filter(Boolean).join(' ')

    return (
        <Box
            className={cardClass}
            onClick={onClick}
            cursor={onClick ? 'pointer' : undefined}
            {...props}
        >
            {(title || subtitle) && (
                <Box className={styles.header}>
                    {title && <Box as="h3" className={styles.title}>{title}</Box>}
                    {subtitle && <Box as="p" className={styles.subtitle}>{subtitle}</Box>}
                </Box>
            )}

            {(children || content) && (
                <Box className={styles.body}>
                    {children || <Box as="p" className={styles.content}>{content}</Box>}
                </Box>
            )}

            {footer && (
                <Box className={styles.footer}>
                    <Box as="p" className={styles.footerText}>{footer}</Box>
                </Box>
            )}
        </Box>
    )
} 