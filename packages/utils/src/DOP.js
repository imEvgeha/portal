import React from 'react';

const POST_MESSAGE_TIMEOUT = 100;

class DOP extends React.Component {
    static sendInfoToDOP(errorCount, data) {
        const message = {errorCount, externalAppData: data};
        setTimeout(() => {
            // eslint-disable-next-line no-restricted-globals
            parent.postMessage(JSON.stringify(message), '*');
        }, POST_MESSAGE_TIMEOUT);
    }

    // static mockOnDOPMessage() {
    //     if(DOP.instance) {
    //         DOP.instance.onDOPMessage({data: 'completeTriggered'});
    //     }
    // }

    static setErrorsCount(val) {
        if (DOP.instance) {
            DOP.instance.setState({errorCount: val});
        }
    }

    static setData(data) {
        if (DOP.instance) {
            DOP.instance.setState({data});
        }
    }

    static setDOPMessageCallback(f) {
        if (DOP.instance) {
            DOP.instance.setState({onDOPMessage: f});
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            /* eslint-disable react/no-unused-state */
            errorCount: 0,
            data: null,
            onDOPMessage: null,
            /* eslint-enable react/no-unused-state */
        };
    }

    componentDidMount() {
        window.addEventListener('message', this.onDOPMessage);
        DOP.instance = this;
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.onDOPMessage);
    }

    static instance = null;

    onDOPMessage(e) {
        if (e.data === 'completeTriggered') {
            const {errorCount, data, onDOPMessage} = DOP.instance.state;
            // Save or Complete clicked
            if (typeof onDOPMessage === 'function') {
                onDOPMessage(errorCount, data);
            } else {
                DOP.sendInfoToDOP(errorCount, data);
            }
        }
    }

    render() {
        return '';
    }
}

export default DOP;
