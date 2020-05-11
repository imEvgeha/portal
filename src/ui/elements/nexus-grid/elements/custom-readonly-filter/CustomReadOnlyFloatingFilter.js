import React from 'react';

class CustomReadOnlyFloatingFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.readOnlyValue
        };

    }

    onParentModelChanged = ({filter = {}}) => {
        this.setState({value: filter});
    };

    render() {

        return (
            <div>
                {this.props.readOnlyValue}
            </div>
        );
    }
}

export default CustomReadOnlyFloatingFilter;
