import React, {Component} from 'react';
import Select from '@atlaskit/select';

class SelectCellEditor extends Component {
    isPopup = () => {
        return true;
    }

    render() {
        const {options} = this.props;

        return (
            <div 
                className="nexus-c-select-cell-editor"
                style={{width: '200px'}} 
            >
                <Select
                    className="single-select"
                    classNamePrefix="react-select"
                    options={options}
                    placeholder="Select"
                />
            </div>
        );
    }
}

export default SelectCellEditor;
