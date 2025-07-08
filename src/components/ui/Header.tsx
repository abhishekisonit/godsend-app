"use client"

import { Flex, Text, Menu, Button, Portal } from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();

    const handleMenuClick = (action: string) => {
        switch (action) {
            case 'login':
                router.push('/auth/signin');
                break;
            case 'about':
                router.push('/about');
                break;
            default:
                break;
        }
    };

    return (
        <Flex as="header" align="center" justify="space-between" px={6} py={4} bg="white" boxShadow="sm">
            <Text fontWeight="bold" fontSize="xl" letterSpacing="wide">
                YOUR SITE
            </Text>
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        aria-label="Open menu"
                        _hover={{
                            bg: "var(--color-bg-secondary)",
                            borderColor: "var(--color-border-primary)"
                        }}
                        _active={{
                            bg: "var(--color-bg-tertiary)"
                        }}
                    >
                        <HiMenu
                            style={{
                                color: 'var(--color-text-secondary)',
                                transition: 'var(--transition-normal)'
                            }}
                            className="hover:text-gray-900"
                        />
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item value="login" onClick={() => handleMenuClick('login')}>
                                Sign In
                            </Menu.Item>
                            <Menu.Item value="about" onClick={() => handleMenuClick('about')}>
                                About
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </Flex>
    );
};

export default Header; 