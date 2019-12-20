import React, {useEffect} from 'react';
import {compose} from 'redux';
import connect from 'react-redux/lib/connect/connect';
import cloneDeep from 'lodash.clonedeep';
import PageHeader from '@atlaskit/page-header';
import IngestPanel from './ingest-panel/IngestPanel';
import './AvailsView.scss';
import NexusGrid from '../ui-elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {rightServiceManager} from '../containers/avail/service/RightServiceManager';
import withFilterableColumns from '../ui-elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../ui-elements/nexus-grid/hoc/withSideBar';
import * as selectors from './right-matching/rightMatchingSelectors';
import {
    createRightMatchingColumnDefs,
} from './right-matching/rightMatchingActions';
import {createLinkableCellRenderer} from './utils';

const NexusGridWithInfiniteScrolling = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: rightServiceManager.doSearch}),
)(NexusGrid);

const AvailsView = ({columnDefs, createRightMatchingColumnDefs, mapping}) => {

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        }
    }, [columnDefs, createRightMatchingColumnDefs]);

    const columnDefsClone = cloneDeep(columnDefs);

    const handleRightRedirect = params => {
        return createLinkableCellRenderer(params, '/avails/rights/');
    };

    const columnDefsWithRedirect = columnDefsClone.map(columnDef => {
        if(columnDef.cellRenderer) {
            columnDef.cellRenderer = handleRightRedirect;
        }
        return columnDef;
    });

    return (
        <div className="nexus-c-avails-view">
            <IngestPanel/>
            <div className="nexus-c-avails-view__avails-table">
                <div className='nexus-c-avails-view__avails-table--title'>Rights</div>
                <NexusGridWithInfiniteScrolling
                    columnDefs={columnDefsWithRedirect}
                    mapping={mapping}
                />
            </div>
        </div>
    );
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = selectors.createRightMatchingColumnDefsSelector();
    const availsMappingSelector = selectors.createAvailsMappingSelector();
    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
        mapping: availsMappingSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
});

// eslint-disable-next-line react-redux/connect-prefer-named-arguments
export default connect(createMapStateToProps, mapDispatchToProps)(AvailsView);
