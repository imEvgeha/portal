import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {uid} from 'react-uid';
import NexusDatePicker from '../../../nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import CustomIntlProvider from '../../../nexus-layout/CustomIntlProvider';
import './DateCellEditor.scss';

class DateCellEditor extends Component {
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
                <div className="nexus-c-date-cell-editor">
                    <NexusDatePicker
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

DateCellEditor.propTypes = {
    value: PropTypes.string,
};

DateCellEditor.defaultProps = {
    value: null,
};
export default DateCellEditor;
