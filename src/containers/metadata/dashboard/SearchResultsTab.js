import './DashboardContainer.scss';

import React from 'react';
import PropTypes from 'prop-types';




class SearchResultsTab extends React.Component {

    hideShowColumns={};

    constructor(props) {
        super(props);
    }

    render() {
        const renderReportSelect = () => {
            return (
                <select className="form-control border-0 d-inline"
                        id={'dashboard-avails-report-select'}
                        onChange={this.handleChangeReport}
                        value={this.props.reportName}>
                    <option value="">None selected</option>
                    {
                        //configurationService.getReportsNames().map((reportName) => (<option key={reportName} value={reportName}>{reportName}</option>))
                    }
                </select>
            );
        };

        return (
            <div id="dashboard-result-table">
                <div className={'container-fluid'}>
                    <div className="row justify-content-between" style={{paddingTop: '16px'}}>
                        <div className="align-bottom" style={{marginLeft: '15px'}}>
                            <span className="table-top-text" id={'dashboard-result-number'} style={{paddingTop: '10px'}}>
                                Results: {this.props.availTabPage.total}
                            </span>
                            {this.selectedItemsComponent()}
                        </div>
                        <div  style={{marginRight: '15px'}}>
                            <div className="d-inline-flex align-content-center" style={{whiteSpace: 'nowrap', marginRight: '8px'}}>
                                <span className="align-self-center" >Selected report:</span>
                                {renderReportSelect()}
                            </div>
                            <i className={'fas fa-download table-top-icon float-right'} onClick={this.exportAvails}> </i>
                            <i className={'fas fa-th table-top-icon float-right'} onClick={this.selectColumns}> </i>
                        </div>
                    </div>
                    {/*<AvailsResultTable/>*/}
                </div>
            </div>
        );
    }
}

SearchResultsTab.propTypes = {
    reportName: PropTypes.string.isRequired,
    availTabPage: PropTypes.object,
};



export default SearchResultsTab;