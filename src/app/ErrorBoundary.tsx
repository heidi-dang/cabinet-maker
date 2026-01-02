import React from "react";

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: unknown) {
        console.error("App error caught:", error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 24 }}>
                    <h2>Something went wrong</h2>
                    <p>The app encountered an error. Refresh the page.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
