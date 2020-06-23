import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import {get, cloneDeep} from 'lodash';
import Button from '@atlaskit/button';
import columnDefinitions from './columnDefinitions';
import {NexusGrid} from '../../../ui/elements';
import withFilterableColumns from '../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withSorting from '../../../ui/elements/nexus-grid/hoc/withSorting';
import withInfiniteScrolling from '../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import {defineEpisodeAndSeasonNumberColumn, getLinkableColumnDefs} from '../../../ui/elements/nexus-grid/elements/columnDefinitions';
import {titleServiceManager} from '../../legacy/containers/metadata/service/TitleServiceManager';
import mappings from './RightsMatchingTitlesTable.json';
import './RightsMatchingTitlesTable.scss';

const TitlesTable = compose(
    withColumnsResizing(),
    withSideBar(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: titleServiceManager.smartSearch}),
    withSorting(),
)(NexusGrid);

const RightsMatchingTitlesTable = ({data, setTotalCount}) => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (data && data.length) {
            setTableData(data);
        } else {
            setTableData([]);
        }
    }, [data]);

    const numOfEpisodeAndSeasonField = defineEpisodeAndSeasonNumberColumn();
    const updatedColumnDefs = getLinkableColumnDefs([numOfEpisodeAndSeasonField, ...columnDefinitions]);

    return (
        <div className="nexus-c-rights-matching-titles-table">
            <TitlesTable
                columnDefs={updatedColumnDefs}
                mapping={mappings}
                setTotalCount={setTotalCount}
                domLayout="autoHeight"
            />
        </div>
    );
};

RightsMatchingTitlesTable.propTypes = {
    data: PropTypes.array,
};

RightsMatchingTitlesTable.defaultProps = {
    data: null,
};

export default RightsMatchingTitlesTable;
