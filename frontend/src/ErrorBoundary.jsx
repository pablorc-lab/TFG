import React from "react";

// Clase para manejar los errores en React
// https://legacy.reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("Error capturado:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return <h2>Error: {this.state.error.toString()}</h2>;
        }
        return this.props.children;
    }
}
export default ErrorBoundary;

