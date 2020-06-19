import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {get, cloneDeep} from 'lodash';
import columnDefinitions from './columnDefinitions';
import {NexusGrid} from '../../../ui/elements';
import mappings from './TitleMatchingRightsTable.json';

const TitleMatchingRightsTable = ({data}) => {
    const [tableData, setTableData] = useState([]);

    const flattenData = data => {
        const tableData = cloneDeep(data).filter(item => {
            if (Array.isArray(item.territory)) {
                item.territory = get(item.territory[0], 'country', '');
            }
            return item;
        });
        return tableData;
    };

    const handleRowSelectionChange = ({api}) => {
        // get selected row data with api.getSelectedRows()
    };

    useEffect(() => {
        if (data.length) {
            setTableData(flattenData(data));
        } else {
            setTableData([]);
        }
    }, [data]);

    return (
        <div className="nexus-c-title-matching-rights-table">
            <NexusGrid
                columnDefs={columnDefinitions}
                mapping={mappings}
                rowData={tableData}
                rowSelection="single"
                domLayout="autoHeight"
                onSelectionChanged={handleRowSelectionChange}
            />
        </div>
    );
};

TitleMatchingRightsTable.propTypes = {
    data: PropTypes.array,
};

TitleMatchingRightsTable.defaultProps = {
    data: null,
};

export default TitleMatchingRightsTable;
