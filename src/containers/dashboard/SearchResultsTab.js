import './DashboardContainer.scss';

import React from 'react';
import AvailsResultTable from './components/AvailsResultTable';

export default class SearchResultsTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <AvailsResultTable/>
            </div>
        );
    }
}