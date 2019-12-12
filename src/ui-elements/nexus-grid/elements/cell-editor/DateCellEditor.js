import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NexusDatePicker from '../../../nexus-date-picker/NexusDatePicker';
import CustomIntlProvider from '../../../../layout/CustomIntlProvider';

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
                        id={value}
                        value={value}
                        onChange={this.handleChange}
                    />
                </div>
            </CustomIntlProvider>
        );
    }
}

export default DateCellEditor;

