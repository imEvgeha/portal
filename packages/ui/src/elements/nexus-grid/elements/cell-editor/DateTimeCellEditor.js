import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {uid} from 'react-uid';
import NexusDateTimePicker from '../../../nexus-date-and-time-elements/nexus-date-time-picker/NexusDateTimePicker';
import CustomIntlProvider from '../../../nexus-layout/CustomIntlProvider';
import './DateTimeCellEditor.scss';

class DateTimeCellEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    isPopup = () => true;

    // eslint-disable-next-line react/destructuring-assignment
    getValue = () => this.state.value;

    handleChange = value => {
        this.setState({
            value,
        });
    };

    render() {
        const {value} = this.state;

        return (
            <CustomIntlProvider>
                <div className="nexus-c-date-time-cell-editor">
                    <NexusDateTimePicker
                        id={uid(value || '')}
                        value={value || ''}
                        onChange={this.handleChange}
                        isTimestamp={true}
                    />
                </div>
            </CustomIntlProvider>
        );
    }
}

DateTimeCellEditor.propTypes = {
    value: PropTypes.string,
};

DateTimeCellEditor.defaultProps = {
    value: null,
};

export default DateTimeCellEditor;
