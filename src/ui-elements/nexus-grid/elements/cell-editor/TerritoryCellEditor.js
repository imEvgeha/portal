import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import './TerritoryCellEditor.scss';
import CustomIntlProvider from '../../../../layout/CustomIntlProvider';
import TerritoryField from '../../../../containers/avail/components/TerritoryFiels';

class TerritoryCellEditor extends Component {
    static propTypes = {
        value: PropTypes.array,
        isOpen: PropTypes.bool,
    };

    static defaultProps = {
        value: null,
        isOpen: false
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            isOpen: props.isOpen
        };
    }

    getValue = () => this.state.value;

    // handleChange = (value) => {
    //     this.setState({value});
    // };

    onRemove = (territory) => {
        const value = this.state.value.filter(t => !isEqual(t, territory));
        this.setState({value});
    };

    onClick = (e) => {
        console.log('onClick', e);
    }

    render() {
        const {value} = this.state;

        return (
            <CustomIntlProvider>
                <div onClick={this.onClick} className="nexus-c-territory-cell-editor">
                    <TerritoryField
                        territory={value}
                        name={'territory-cell'}
                        onRemoveClick={(terr) => this.onRemove(terr)}
                        onAddClick={this.onClick}
                        onPlusClick={this.onClick}
                        // mappingErrorMessage={this.mappingErrorMessage}
                    />
                </div>
            </CustomIntlProvider>
        );
    }
}

export default TerritoryCellEditor;

