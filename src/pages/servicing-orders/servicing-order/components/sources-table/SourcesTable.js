import React, {useState, useEffect} from 'react';
import {compose} from 'redux';
import {isEqual} from 'lodash';
import PropTypes from 'prop-types';
import {Radio} from '@atlaskit/radio';
import Badge from '@atlaskit/badge';
import './SourcesTable.scss';
import columnDefinitions from './columnDefinitions';
import {NexusGrid} from '../../../../../ui/elements';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import constants from '../fulfillment-order/constants';
import usePrevious from '../../../../../util/hooks/usePrevious';
import mappings  from '../../../../../../profile/sourceTableMapping';
import withColumnsResizing from '../../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import { SELECT_VALUES, NON_EDITABLE_COLS } from './Constants';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';

const {SOURCE_TITLE, SOURCE_SUBTITLE} = constants;

const SourceTableGrid = compose(
    withColumnsResizing()
)(NexusGrid);

const SourcesTable = ({data, onSelectedSourceChange}) => {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState();
    const previousData = usePrevious(data);

    useEffect(() => {
        if (!isEqual(data, previousData)) {
            setSelectedSource(null);
            setSources(data);
        }
        setSources(data);
    }, [data]);

    useEffect(() => {
        onSelectedSourceChange(selectedSource);
    }, [selectedSource]);

    const serviceButtonCell = ({data, selectedItem = {}}) => { // eslint-disable-line
        const {barcode} = data || {};

        return (
            <CustomActionsCellRenderer id={barcode}>
                <Radio
                    name={barcode}
                    isChecked={selectedItem && selectedItem.barcode === barcode}
                    onChange={() => setSelectedSource(data)}
                />
            </CustomActionsCellRenderer>
        );
    };

    const radioButtonColumn = defineColumn({
        width: 40,
        colId: 'radio',
        field: 'radio',
        cellRendererParams: {selectedItem: selectedSource},
        cellRendererFramework: serviceButtonCell,
    });


    const servicesColumn = defineColumn({
        headerName: '#',
        width: 40,
        colId: 'services',
        field: 'services',
        cellRendererFramework: ({data}) => {
            // TODO: fix this
            const name = data && `${data['fs'].toLowerCase()}Services`;
            const serviceLength = (name && data[name]) ? data[name].length : 0;

            return (
                <Badge>
                    {serviceLength}
                </Badge>
            );
        }
    });

    const onSourceTableChange = ({type, rowIndex, data}) => {
        if( type === GRID_EVENTS.CELL_VALUE_CHANGED) {
            let newSources = sources.slice();
            newSources[rowIndex] = data;
            setSources(newSources);
        }
    };

    return (
        <div className="nexus-c-sources">
            <div className="nexus-c-sources-table__header">
                <h2>{`${SOURCE_TITLE} (${sources.length})`}</h2>
                <div>{SOURCE_SUBTITLE}</div>
            </div>
            <SourceTableGrid
                columnDefs={[
                    radioButtonColumn,
                    servicesColumn,
                    ...columnDefinitions
                ]}
                rowData={sources}
                domLayout="autoHeight"
                mapping={mappings}
                notEditableColumns={NON_EDITABLE_COLS}
                selectValues={SELECT_VALUES}
                onGridEvent={onSourceTableChange}
            />
        </div>
    );
};

SourcesTable.propTypes = {
    data: PropTypes.array,
    onSelectedSourceChange: PropTypes.func.isRequired,
};

SourcesTable.defaultProps = {
    data: [],
};

export default SourcesTable;
