import  { createContext, useState, useContext, ReactNode } from "react";
import {Models } from "react-native-appwrite";

type AuthContextType = {
    user: Models.User | null;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) { 
    return <AuthContext.Provider></AuthContext.Provider>
}

export function useAuth() {
    return {};
}