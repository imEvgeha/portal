import React from 'react';
import {connect} from 'react-redux';
import t from 'prop-types';
import {BreadcrumbItem, Breadcrumb} from 'reactstrap';
import {Link} from 'react-router-dom';

const mapStateToProps = state => {
    return {breadcrumb: state.root.breadcrumb};
};

const mapDispatchToProps = {};

class NexusBreadcrumb extends React.Component {
    static propTypes = {
        breadcrumb: t.array,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const renderLink = (entry) => {
            if (entry.path) {
                return <Link to={{pathname: entry.path, state: entry.state}}><span onClick={entry.onClick}>{entry.name}</span></Link>;
            } else {
                return entry.name;
            }
        };
        return (
            <div style={{zIndex: '1000', position: 'relative'}}>
                <Breadcrumb style={{position: 'relative', background: 'white'}}>
                    {this.props.breadcrumb.map((entry) => (<BreadcrumbItem key={entry.name}>{renderLink(entry)}</BreadcrumbItem>))}
                </Breadcrumb>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NexusBreadcrumb);