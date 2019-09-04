import React from 'react';

class DOP extends React.Component {

    static instance = null;

    constructor(props) {
        super(props);
        this.state = {
            errorCount: 0,
            data: null,
            onDOPMessage: null
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
            if(DOP.instance.state.onDOPMessage) {
                DOP.instance.state.onDOPMessage(DOP.instance.state.errorCount, DOP.instance.state.data);
            }else{
                DOP.sendInfoToDOP(DOP.instance.state.errorCount, DOP.instance.state.data);
            }
        }
    }

    // static mockOnDOPMessage(){
    //     if(DOP.instance) {
    //         DOP.instance.onDOPMessage({data: 'completeTriggered'});
    //     }
    // }

    static sendInfoToDOP(errorCount, data){
        let message = {errorCount: errorCount, ...data};
        setTimeout(() => {
            parent.postMessage(JSON.stringify(message), '*');
        }, 100);
    }

    static setErrorsCount(val){
        if(DOP.instance) {
            DOP.instance.setState({errorCount: val});
        }
    }

    static setData(data){
        if(DOP.instance) {
            DOP.instance.setState({data: data});
        }
    }

    static setDOPMessageCallback(f){
        if(DOP.instance) {
            DOP.instance.setState({onDOPMessage: f});
        }
    }

    render() {
        return '';
    }
}

export default DOP;