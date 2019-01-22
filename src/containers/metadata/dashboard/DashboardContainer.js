import './DashboardContainer.scss';

import React from 'react';
import FreeTextSearch from '../../metadata/dashboard/components/FreeTextSearch';
import DashboardTab from './DashboardTab';
import PropTypes from 'prop-types';

class DashboardContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dashboard: true
        };
    }


    render() {
        return (
            <div>
                <div className={'container-fluid vu-free-text-search ' + (this.props.showAdvancedSearch ? 'hide': '')}>
                    <div>
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        <FreeTextSearch disabled={false} containerId={'dashboard-title'}
                                            onSearch={this.handleAvailsFreeTextSearch}/>
                                    </td>
                                    <td style={{width: '20px', height: '30px', paddingLeft: '8px'}}>
                                        <button className="btn btn-outline-secondary advanced-search-btn" style={{height: '40px'}} title={'Advanced search'}
                                            id={'dashboard-title-advanced-search-btn'} onClick={this.toggleAdvancedSearch}>
                                            <i className="fas fa-filter table-top-icon" style={{fontSize: '1.25em', marginLeft: '-3px', marginTop: '6px', padding: '0px'}}> </i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {this.state.dashboard && <DashboardTab />}
            </div>
        );
    }
}

DashboardContainer.propTypes = {
    showAdvancedSearch: PropTypes.string
};

export default DashboardContainer;