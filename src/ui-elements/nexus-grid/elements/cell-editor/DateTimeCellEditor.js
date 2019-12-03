import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './DateTimeCellEditor.scss';
import NexusDateTimePicker from '../../../nexus-date-time-picker/NexusDateTimePicker';

class DateTimeCellEditor extends Component {
    static propTypes = {
        value: PropTypes.string,
    }; 

    static defaultProps = {
        value: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value, 
        };
    }

    isPopup = () => true;

    getValue = () => this.state.value;

    handleChange = (value) => {
        this.setState({
            value,
        });
    };

    render() {
        const {value} = this.state;

        return (
            <div className="nexus-c-date-time-cell-editor">
                <NexusDateTimePicker
                    id={value}
                    value={value}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default DateTimeCellEditor;

