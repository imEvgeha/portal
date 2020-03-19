import React from 'react';

class DOP extends React.Component {
    static instance = null;

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

    // static mockOnDOPMessage() {
    //     if(DOP.instance) {
    //         DOP.instance.onDOPMessage({data: 'completeTriggered'});
    //     }
    // }

    static sendInfoToDOP(errorCount, data){
        const message = {errorCount, externalAppData: data};
        setTimeout(() => {
            parent.postMessage(JSON.stringify(message), '*');
        }, 100);
    }

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

    render() {
        return '';
    }
}

export default DOP;

