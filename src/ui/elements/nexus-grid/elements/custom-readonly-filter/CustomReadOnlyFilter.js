import React from 'react';

export default class CustomReadOnlyFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.readOnlyValue,
        };
    }


    setModel = (model) => {
        this.setState({value : model ? model.value : this.props.readOnlyValue});
    };

    getModel = () => {
        return ({
            type: 'equals',
            filter: this.props.readOnlyValue
        });
    };

    isFilterActive = () => {
        return false;
    };

    doesFilterPass = () => {
        return true;
    };
    render () {
        return (
            <div >
            Read Only Filter:
            <input readOnly value={this.state.value}/>
          </div>
        );
    }
}