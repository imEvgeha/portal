import React from 'react';
import {BreadcrumbItem, Breadcrumb} from 'reactstrap';
import {Link, withRouter} from 'react-router-dom';

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import t from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { Loader } from 'react-loaders';

const mapStateToProps = state => {
    return {
        blocking: state.root.blocking
    };
};

class NexusBreadcrumb extends React.Component {

    static instance = null;
    static content = [];

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        NexusBreadcrumb.instance = this;
    }

    render() {
        const renderLink = (entry, last) => {
            if (!last) {
                return <Link to={{pathname: entry.path, search: entry.search, state: entry.state}} onClick={entry.onClick}>{entry.name}</Link>;
            } else {
                return entry.name;
            }
        };
        return (
            !NexusBreadcrumb.empty() && !this.props.location.pathname.endsWith('/v2') && (
                <BlockUi tag="div" blocking={this.props.blocking} loader={<Loader />}>
                    <div style={{zIndex: '500', position: 'relative'}}>
                        <Breadcrumb style={{position: 'relative', background: 'white'}}>
                            {NexusBreadcrumb.content.map((entry, index, array) => (
                                <BreadcrumbItem
                                    key={entry.name}
                                >{renderLink(entry, index === array.length - 1)}
                                </BreadcrumbItem>
))}
                        </Breadcrumb>
                    </div>
                </BlockUi>
              )
        );
    }

    static push(option) {
        if(NexusBreadcrumb.empty()) {
            if(Array.isArray(option)) {
                NexusBreadcrumb.set(option);
            }else{
                NexusBreadcrumb.set([option]);
            }
        }else{
            if(Array.isArray(option)) {
                NexusBreadcrumb.set(NexusBreadcrumb.content.concat(option));
            }else{
                NexusBreadcrumb.set(NexusBreadcrumb.content.concat([option]));
            }
        }
    }

    static pop(){
        let newOptions = NexusBreadcrumb.content.slice(0, -1);
        NexusBreadcrumb.set(newOptions);
    }

    static set(options){
        if(Array.isArray(options)) {
            NexusBreadcrumb.content = options;
        }else{
            NexusBreadcrumb.content = [options];
        }

        if(NexusBreadcrumb.instance) {
            NexusBreadcrumb.instance.setState({});
        }
    }

    static empty() {
        return NexusBreadcrumb.content.length === 0;
    }
}

NexusBreadcrumb.propTypes = {
    blocking: t.bool,
};

export default withRouter(connect(mapStateToProps, null)(NexusBreadcrumb));