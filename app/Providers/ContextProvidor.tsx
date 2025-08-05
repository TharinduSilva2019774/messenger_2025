"use client";

import { GlobalContext, GlobalProvider } from "./globalProvidor";   

interface Props {
    children: React.ReactNode;
}

export default function ContextProvidor({ children }: Props) {
    return (
        <div>
            {children}
        </div>
    )
}