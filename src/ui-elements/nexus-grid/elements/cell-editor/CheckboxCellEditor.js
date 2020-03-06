import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CheckboxCellEditor extends Component {
    static propTypes = {
        value: PropTypes.bool,
    }; 

    static defaultProps = {
        value: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            isChecked: props.value,
        };
    }

    afterGuiAttached() {
        this.inputRef.current.focus();
        this.inputRef.current.select();
    }

    onChange = () => {
        this.setState(state => ({
            isChecked: !state.isChecked,
        }));
    }

    inputRef = React.createRef();

    render() {
        const {isChecked} = this.state;
        return (
            <input 
                style={{width: '100%', height: '100%', position: 'relative', top: '-5px'}}
                type="checkbox" 
                ref={this.inputRef}
                checked={isChecked} 
                onChange={this.onChange}
            />
        );
    }
}

export default CheckboxCellEditor;

