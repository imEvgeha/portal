import React from 'react';
import {isEmpty} from 'lodash';
import './CustomComplexFloatingFilter.scss';

class CustomComplexFloatingFilter extends React.Component {
    constructor(props) {
        super(props);
        const { column: { colDef: {field}}, currentParentModel} = props;
        const {filter = {}} = currentParentModel() || {};
        this.state = {
            value: filter
        };
    }

    onParentModelChanged = ({filter = {}}) => {
        this.setState({value: filter});
    };

    render() {
        const {value} = this.state;

        return (
            <div className='nexus-c-complex-floating-filter'>
                { value && !isEmpty(value) && <span>{JSON.stringify(value)}</span>}
            </div>
        );
    }
}

export default CustomComplexFloatingFilter;
