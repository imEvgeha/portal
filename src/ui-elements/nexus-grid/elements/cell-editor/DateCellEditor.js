import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {uid} from 'react-uid';
import NexusDatePicker from '../../../nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import CustomIntlProvider from '../../../../layout/CustomIntlProvider';
import './DateCellEditor.scss';

class DateCellEditor extends Component {
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

export default DateCellEditor;

