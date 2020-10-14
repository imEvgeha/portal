import React from 'react';
import TableHeader from './elements/table-header/TableHeader';

export default function withSelectRightHeader(SelectRightHeaderWrappedComponent) {
    return props => {
        return (
            <SelectRightsTableHeader SelectRightHeaderWrappedComponent={SelectRightHeaderWrappedComponent} {...props} />
        );
    };
}

class SelectRightsTableHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            table: null,
        };
    }

    setTable = element => {
        if (element) {
            this.setState({table: element});
            if (this.props.setTable) {
                this.props.setTable(element);
            }
        }
    };

    render() {
        const {SelectRightHeaderWrappedComponent, hidden} = this.props;
        return (
            <div>
                {!hidden && <TableHeader table={this.state.table} />}
                <SelectRightHeaderWrappedComponent {...this.props} setTable={this.setTable} />
            </div>
        );
    }
}
