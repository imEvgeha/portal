import React from 'react';

class DOP extends React.Component {

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
                parent.postMessage('{"errorCount": 0}', '*');
            }, 100);
        }
    }

    render() {
        return '';
    }
}

export default DOP;