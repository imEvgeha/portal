import React from 'react';
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
        const {value = {}} = this.state;
        let arrayContent = [];
        let keyContent;

        Object.keys(value || {}).forEach((key) => {
            keyContent = '';
            if(value[key]) {
                if(Array.isArray(value[key])){
                    if(value[key].length > 0) {
                        keyContent = value[key].join(', ');
                    }
                }else{
                    keyContent = value[key];
                }

                if(keyContent) {
                    arrayContent.push(key + ': ' + keyContent);
                }
            }
        });

        const content = arrayContent.join(' ');

        return (
            <div className='nexus-c-complex-floating-filter'>
                <span title={content}>{content}</span>
            </div>
        );
    }
}

export default CustomComplexFloatingFilter;
