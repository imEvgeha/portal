import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import columnDefinitions from './columnDefinitions';
import {NexusGrid} from '../../../ui/elements';
import mappings from './titleMatchingTableMappings.json';
//import {GRID_EVENTS} from '../../../ui/elements/nexus-grid/constants';

const TitleMatchingTable = ({data}) => {

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if(data.length > 0) {
            console.log(data);
            setTableData(data);
        }
    }, [data]);

    return (
        <div className="nexus-c-title-matching-table">
            <NexusGrid
                columnDefs={columnDefinitions}
                mapping={mappings}
                rowData={tableData}
                domLayout="autoHeight"
            />
        </div>
    );
};

TitleMatchingTable.propTypes = {
    data: PropTypes.array,
};

TitleMatchingTable.defaultProps = {
    data: null,
};

export default TitleMatchingTable;
