import './DashboardContainer.scss';

import React from 'react';
import {confirmModal} from '../../components/share/ConfirmModal';
import t from 'prop-types';
import AvailsResultTable from './components/AvailsResultTable';
import connect from 'react-redux/es/connect/connect';

const mapStateToProps = state => {
    return {
        availTabPage: state.dashboard.availTabPage,
        availTabPageSelected: state.dashboard.availTabPageSelected,
    };
};

class SearchResultsTab extends React.Component {

    static propTypes = {
        availTabPage: t.object,
        availTabPageSelected: t.array,
        onTogleAdvancedSearch: t.func
    };

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    exportAvails = () => {
        confirmModal.open('Confirm export',
            () => {
            },
            () => {
            },
            {description: `You have select ${this.props.availTabPageSelected.length} avails.`});
    };

    render() {
        return (
            <div id="dashboard-result-table">
                <div className={'container-fluid'}>
                    <div className="row justify-content-between">
                        <div className="col-4 align-bottom">
                            <span className="table-top-text" id={'dashboard-result-number'} style={{paddingTop: '10px'}}>
                                Results: {this.props.availTabPage.total}
                            </span>
                            <span className={'nx-container-margin table-top-text'} id={'dashboard-result-number'}>
                                Selected items: {this.props.availTabPageSelected.length}
                            </span>
                        </div>
                        <div className="col-2">
                            <i className={'fas fa-download table-top-icon float-right'} onClick={this.exportAvails}> </i>
                            <i className={'fas fa-th table-top-icon float-right'}> </i>
                            <i className={'fas fa-filter table-top-icon float-right'} onClick={this.props.onTogleAdvancedSearch}> </i>
                        </div>
                    </div>
                    <AvailsResultTable/>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(SearchResultsTab);