import React from "react";

type Props = {
    children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
    return (
        <main
            style={{
                maxWidth: "var(--content-width)",
                margin: "0 auto",
                padding: "var(--space-lg)",
            }}
        >
            {children}
        </main>
    );
}
