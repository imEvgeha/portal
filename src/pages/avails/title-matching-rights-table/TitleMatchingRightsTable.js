import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {cloneDeep, get} from 'lodash';
import {compose} from 'redux';
import withColumnsResizing from '../../../../packages/ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import {NexusGrid} from '../../../ui/elements';
import mappings from './TitleMatchingRightsTable.json';
import columnDefinitions from './columnDefinitions';
import './TitleMatchingRightsTable.scss';

const TitleMatchingRightsTable = ({data}) => {
    const [tableData, setTableData] = useState([]);

    const TitlesTable = compose(withColumnsResizing())(NexusGrid);

    const flattenData = data => {
        return cloneDeep(data).filter(item => {
            if (Array.isArray(item.territory)) {
                item.territory = get(item.territory[0], 'country', '');
            }
            if (item.episodic) {
                item.seriesTitle = item.episodic.seriesTitle;
                item.episodeNumber = item.episodic.episodeNumber;
                item.seasonNumber = item.episodic.seasonNumber;
            }
            return item;
        });
    };

    const handleRowSelectionChange = () => {
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
            <TitlesTable
                columnDefs={columnDefinitions}
                mapping={mappings}
                rowData={tableData}
                rowSelection="single"
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
