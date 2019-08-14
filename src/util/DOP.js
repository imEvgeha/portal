import React from 'react';

class DOP extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorCount: 0
        };
    }

    componentDidMount() {
        window.addEventListener('message', this.onDOPMessage);
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

    render() {
        return '';
    }
}

export default DOP;