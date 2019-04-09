import React from 'react';
import {BreadcrumbItem, Breadcrumb} from 'reactstrap';
import {Link} from 'react-router-dom';
import {URL} from '../util/Common';

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
                return <Link to={{pathname: entry.path, search: URL.search(), state: entry.state}} onClick={entry.onClick}>{entry.name}</Link>;
            } else {
                return entry.name;
            }
        };
        return (
            <div style={{zIndex: '500', position: 'relative'}}>
                <Breadcrumb style={{position: 'relative', background: 'white'}}>
                    {NexusBreadcrumb.content.map((entry, index, array) => (<BreadcrumbItem key={entry.name}>{renderLink(entry, index === array.length - 1)}</BreadcrumbItem>))}
                </Breadcrumb>
            </div>
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

export default NexusBreadcrumb;
