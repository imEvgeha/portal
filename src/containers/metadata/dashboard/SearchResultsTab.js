import './DashboardContainer.scss';

import React from 'react';
import {confirmModal} from '../../../components/modal/ConfirmModal';
import t from 'prop-types';
import TitleResultTable from './components/TitleResultTable';
import connect from 'react-redux/es/connect/connect';

import {
    resultPageUpdateColumnsOrder
} from '../../../stores/actions/metadata/index';

import { titleMapping } from '../../metadata/service/Profile';

const mapStateToProps = state => {
    return {
        titleTabPage: state.titleReducer.titleTabPage,
        columns: state.titleReducer.session.columns,
        titleTabPageSelected: state.titleReducer.session.titleTabPageSelection.selected,
        reportName: state.titleReducer.session.reportName,
        columnsOrder: state.titleReducer.session.columns
    };
};

const mapDispatchToProps = {
    resultPageUpdateColumnsOrder: resultPageUpdateColumnsOrder
};

class SearchResultsTab extends React.Component {

    static propTypes = {
        titleTabPage: t.object,
        titleTabPageSelected: t.array,
        columns: t.array,
        reportName: t.string,
        columnsOrder: t.array,
        resultPageUpdateColumnsOrder: t.func
    };

    hideShowColumns={};

    constructor(props) {
        super(props);
        this.toggleColumn = this.toggleColumn.bind(this);
        this.selectColumns = this.selectColumns.bind(this);
        this.cancelColumns = this.cancelColumns.bind(this);
    }

    selectColumnsContentProvider() {
        return titleMapping.mappings.map(column => {
                if(column.javaVariableName=='title') return '';
                let checked = this.props.columnsOrder.indexOf(column.javaVariableName) > -1 ? true : false;
                return <div key={column.javaVariableName}><input type='checkbox' name={column.javaVariableName} style={{marginRight: '8px'}} onClick={this.toggleColumn} defaultChecked={checked} />{column.title}<br/></div>;
            }
        );
    }

    selectColumns() {
        confirmModal.open('Select Visible Columns',
            this.saveColumns,
            this.cancelColumns,
            {confirmLabel:'Save',  description: this.selectColumnsContentProvider()});
    }

    toggleColumn(e){
        if(this.hideShowColumns.hasOwnProperty(e.target.name) && this.hideShowColumns[e.target.name] != e.target.checked){
            delete this.hideShowColumns[e.target.name];
        }else{
            this.hideShowColumns[e.target.name]=e.target.checked;
        }
    }

    cancelColumns() {
        this.hideShowColumns={};
    }

    selectedItemsComponent() {
        if (this.props.titleTabPageSelected.length) {
            return <span className={'nx-container-margin table-top-text'}
                         id={'dashboard-selected-title-number'}>Selected items: {this.props.titleTabPageSelected.length}</span>;
        }
    }
    
    render() {
        return (
            <div id="dashboard-result-table">
                <div className={'container-fluid'}>
                    Title Records
                    <TitleResultTable/>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsTab);