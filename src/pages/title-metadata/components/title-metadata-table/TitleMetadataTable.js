import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import {GRID_EVENTS} from '../../../../ui/elements/nexus-grid/constants';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import './TitleMetadataTable.scss';

const TitleMetadataTableGrid = compose(
    withSideBar(),
    withFilterableColumns(),
    withColumnsResizing(),
    withSorting(),
    withInfiniteScrolling({fetchData: () => []})
)(NexusGrid);

const TitleMetadataTable = () => {
    const [paginationData, setPaginationData] = useState({
        pageSize: 0,
        totalCount: 0,
    });

    const setTotalCount = total => {
        setPaginationData(prevData => {
            return {
                ...prevData,
                totalCount: total,
            };
        });
    };

    const setDisplayedRows = count => {
        setPaginationData(prevData => {
            return {
                ...prevData,
                pageSize: count,
            };
        });
    };

    const onGridReady = ({type, api, columnApi}) => {
        const {READY} = GRID_EVENTS;
        switch (type) {
            case READY: {
                api.sizeColumnsToFit();
                break;
            }
            default:
                break;
        }
    };

    return (
        <div className="nexus-c-title-metadata-table">
            <TitleMetadataTableGrid
                id="TitleMetadataTable"
                columnDefs={[]}
                mapping={[]}
                suppressRowClickSelection
                onGridEvent={onGridReady}
                setTotalCount={setTotalCount}
                setDisplayedRows={setDisplayedRows}
            />
        </div>
    );
};

TitleMetadataTable.propTypes = {
    //
};

TitleMetadataTable.defaultProps = {
    //
};

export default TitleMetadataTable;
