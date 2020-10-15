import React from 'react';
import ReactDOM from 'react-dom';
import {AgGridReact} from 'ag-grid-react';
import getContextMenuItems from '../../../../ui/elements/nexus-grid/elements/cell-renderer/getContextMenuItems';
import './ResultsTable.scss';

export default class ResultsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 500,
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.setTable = this.setTable.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        //ugly hack to change height once advanced filter finishes its transition (appearing or dissapearing)
        let elem = document.querySelector('.vu-advanced-search-panel');
        if (elem) {
            elem.addEventListener('transitionend', this.updateWindowDimensions);
        }
        elem = document.querySelector('.vu-free-text-search');
        if (elem) {
            elem.addEventListener('transitionend', this.updateWindowDimensions);
        }
    }

    componentWillUnmount() {
        if (this.refresh !== null) {
            clearInterval(this.refresh);
            this.refresh = null;
        }
        window.removeEventListener('resize', this.updateWindowDimensions);
        let elem = document.querySelector('.vu-advanced-search-panel');
        if (elem) {
            elem.removeEventListener('transitionend', this.updateWindowDimensions);
        }
        elem = document.querySelector('.vu-free-text-search');
        if (elem) {
            elem.removeEventListener('transitionend', this.updateWindowDimensions);
        }
    }

    updateWindowDimensions() {
        const offsetTop = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
        this.setState({height: window.innerHeight - offsetTop - 10});
    }

    setTable(element) {
        this.props.setTable(element);
    }

    render() {
        return (
            <div
                className={'rights-results-table ag-theme-balham ' + (this.props.hidden ? 'd-none' : '')}
                style={{
                    height: this.state.height + 'px',
                    width: '100%',
                }}
            >
                <AgGridReact
                    {...this.props}
                    ref={this.setTable}
                    columnDefs={this.props.colDef}
                    headerHeight="52"
                    rowHeight="48"
                    getContextMenuItems={getContextMenuItems}
                />
            </div>
        );
    }
}
