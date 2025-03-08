import React, { Component, ErrorInfo } from "react";
import { ErrorPage } from "../error/ErrorPage";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Ici vous pouvez envoyer l'erreur à votre service de monitoring
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          error={this.state.error || undefined}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}
