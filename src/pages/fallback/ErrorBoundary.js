import React from 'react';
import Button from '@atlaskit/button';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import {Link} from 'react-router-dom';
import {URL} from '../../util/Common';
import './ErrorBoundary.scss';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: null, errorInfo: null};
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo,
        });
    }

    setErrorNull = () => this.setState({error: null, errorInfo: null});

    render() {
        const {error, errorInfo} = this.state;
        const {children} = this.props;
        if (errorInfo) {
            return (
                <div className="nexus-c-error">
                    <div>
                        <ErrorIcon size="large" primaryColor="red" />
                        <h2 className="nexus-c-error__heading"> Oops! Something went wrong</h2>
                    </div>
                    <h4 className="nexus-c-error__message">
                        We are working on resolving this quickly. Reloading the page might also help :)
                    </h4>
                    <div>
                        <Link to={URL.keepEmbedded(window.location)}>
                            <Button appearance="primary" onClick={this.setErrorNull}>
                                Reload this Page
                            </Button>
                        </Link>
                        <Link to={URL.keepEmbedded('/')} style={{marginLeft: '20px'}}>
                            <Button onClick={this.setErrorNull}>Go to Homepage</Button>
                        </Link>
                    </div>

                    {/* TODO: report error to backend from this.state.error & this.state.errorInfo.componentStack */}
                </div>
            );
        }

        return children;
    }
}
