import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import {get, cloneDeep} from 'lodash';
import Button from '@atlaskit/button';
import columnDefinitions from '../title-matching-rights-table/columnDefinitions';
import {NexusGrid} from '../../../ui/elements';
import withFilterableColumns from '../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withSideBar from '../../../ui/elements/nexus-grid/hoc/withSideBar';
import withColumnsResizing from '../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withSorting from '../../../ui/elements/nexus-grid/hoc/withSorting';
import mappings from '../title-matching-rights-table/TitleMatchingRightsTable.json';

const TitlesTable = compose(
    withColumnsResizing(),
    withSideBar(),
    withFilterableColumns(),
    withSorting(),
)(NexusGrid);

const RightsMatchingTitlesTable = ({data}) => {
    const [tableData, setTableData] = useState([]);


    useEffect(() => {
        if (data && data.length) {
            setTableData(data);
        } else {
            setTableData([]);
        }
    }, [data]);

    return (
        <div className="nexus-c-rights-matching-titles-table">
            <div className="nexus-c-rights-matching-titles-table__header">
                <h3>Titles</h3>
                <Button
                    className="nexus-c-rights-matching-titles-table__selected-btn"
                    onClick={() => null}
                >Selected(0)
                </Button>
            </div>
            <TitlesTable
                columnDefs={columnDefinitions}
                mapping={mappings}
                rowData={tableData}
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
