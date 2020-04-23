import React, {Component} from 'react';

class RouterErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error, errorInfo) {
        console.warn(error) // eslint-disable-line
        this.setState(state => ({
            error,
            errorInfo,
        }));
    }

    render() {
        const {hasError, error, errorInfo} = this.state;
        const {children} = this.props;

        if (hasError) {
            return (
                <div className="nexus-c-router-error-boundary">
                    {error}
                    {errorInfo}
                </div>
            );
        }

        return children;
    }
}

export default RouterErrorBoundary;
