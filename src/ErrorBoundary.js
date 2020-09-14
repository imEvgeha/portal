import React from 'react';
import Button from '@atlaskit/button';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import {Link} from 'react-router-dom';
import {URL} from './util/Common';

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

    render() {
        // eslint-disable-next-line react/destructuring-assignment
        if (this.state.errorInfo) {
            // Error path
            return (
                <div
                    style={{
                        marginLeft: '22%',
                        marginTop: '10%',
                        width: '50%',
                        padding: '50px',
                        backgroundColor: '#E4E4E4',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: '10px',
                    }}
                >
                    <ErrorIcon size="xlarge" primaryColor="red" />
                    <div>
                        <h1 style={{fontWeight: 'bold'}}> Oops! Something went wrong</h1>
                    </div>
                    <br />
                    <br />
                    <Link to={URL.keepEmbedded(window.location)}>
                        <Button appearance="link" onClick={() => this.setState({error: null, errorInfo: null})}>
                            Click here to Reload current page
                        </Button>
                    </Link>
                    <Link to={URL.keepEmbedded('/')}>
                        <Button appearance="link" onClick={() => this.setState({error: null, errorInfo: null})}>
                            Click here to open home page
                        </Button>
                    </Link>

                    {/* TODO: report error to backend from this.state.error & this.state.errorInfo.componentStack */}
                </div>
            );
        }
        // eslint-disable-next-line react/destructuring-assignment
        return this.props.children;
    }
}
