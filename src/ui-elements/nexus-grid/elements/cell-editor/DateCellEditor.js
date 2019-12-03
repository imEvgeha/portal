import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NexusDatePicker from '../../../nexus-date-picker/NexusDatePicker';

class DateCellEditor extends Component {
    static propTypes = {
        options: PropTypes.array,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
    }; 

    static defaultProps = {
        options: [],
        value: null,
    };

    constructor(props) {
        super(props);
        console.log(props, 'props')
        this.state = {
            value: props.value, 
        };
    }

    isPopup = () => {
        return true;
    }

    getValue = () => {
        const {value} = this.state;
        return value;
    }

    handleChange = (value) => {
        this.setState({
            value,
        });
    };

    render() {
        const {value} = this.state;

        return (
            <div className="nexus-c-select-cell-editor">
                <NexusDatePicker 
                    id={value}
                    value={value}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default DateCellEditor;

