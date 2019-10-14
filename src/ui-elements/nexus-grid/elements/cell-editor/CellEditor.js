import React, {Component} from 'react';

class CellEditor extends Component {
    isPopup() {
        return true;
    }

    render() {
        const {children} = this.props;

        return (
            <div 
                className="nexus-c-cell-editor"
                style={{width: '200px'}} 
            >
                {children}
            </div>
        );
    }
}

export default CellEditor;

