import React from 'react';

class DOP extends React.Component {

    static instance = null;

    constructor(props) {
        super(props);
        this.state = {
            errorCount: 0
        };
    }

    componentDidMount() {
        window.addEventListener('message', this.onDOPMessage);
        DOP.instance = this;
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.onDOPMessage);
    }

    onDOPMessage(e){
        if(e.data === 'completeTriggered'){
            //Save or Complete clicked
            setTimeout(()=>{
                parent.postMessage('{"errorCount": ' + this.state.errorCount + '}', '*');
            }, 100);
        }
    }

    static setErrorsCount(val){
        if(DOP.instance) {
            DOP.instance.setState({errorCount: val});
        }
    }

    render() {
        return '';
    }
}

export default DOP;