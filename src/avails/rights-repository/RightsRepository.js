import React, {useEffect} from 'react';
import {compose} from 'redux';
import connect from 'react-redux/lib/connect/connect';
import cloneDeep from 'lodash.clonedeep';
import withSideBar from '../../ui-elements/nexus-grid/hoc/withSideBar';
import withFilterableColumns from '../../ui-elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../ui-elements/nexus-grid/hoc/withInfiniteScrolling';
import {rightServiceManager} from '../../containers/avail/service/RightServiceManager';
import NexusGrid from '../../ui-elements/nexus-grid/NexusGrid';
import * as selectors from '../right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../right-matching/rightMatchingActions';
import {createLinkableCellRenderer} from '../utils';

const NexusGridWithInfiniteScrolling = compose(
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: rightServiceManager.doSearch}),
)(NexusGrid);

const RightsRepository = ({columnDefs, createRightMatchingColumnDefs, mapping}) => {

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
        <div className="nexus-c-avails-view__avails-table">
            <div className='nexus-c-avails-view__avails-table--title'>Rights</div>
            <NexusGridWithInfiniteScrolling
                columnDefs={columnDefsWithRedirect}
                mapping={mapping}
            />
        </div>
    );
};

const mapStateToProps = () => {
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

export default connect(mapStateToProps, mapDispatchToProps)(RightsRepository);