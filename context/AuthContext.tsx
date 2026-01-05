
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (userData: any) => void;
    logout: () => void;
    isModalOpen: boolean;
    openAuthModal: (onSuccess?: () => void) => void;
    closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onLoginSuccess, setOnLoginSuccess] = useState<(() => void) | null>(null);

    const login = (userData: any) => {
        setIsAuthenticated(true);
        setUser(userData);
        if (onLoginSuccess) {
            onLoginSuccess();
            setOnLoginSuccess(null);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const openAuthModal = (callback?: () => void) => {
        if (callback) {
            setOnLoginSuccess(() => callback);
        }
        setIsModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsModalOpen(false);
        setOnLoginSuccess(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isModalOpen, openAuthModal, closeAuthModal }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
