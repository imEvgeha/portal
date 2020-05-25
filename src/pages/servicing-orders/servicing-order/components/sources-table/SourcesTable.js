import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Radio} from '@atlaskit/radio';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import './SourcesTable.scss';
import columnDefinitions from './columnDefinitions';
import {NexusGrid, NexusTitle} from '../../../../../ui/elements';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {ADDITIONAL_COLUMN_DEF} from '../../../constants';
import {defineColumn, defineButtonColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import {prepareRowData} from './util';

const SourcesTable = ({data, onSelectedSourceChange}) => {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState();

    useEffect(() => {
        const rowData = prepareRowData(data);
        setSources(rowData);
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
                    isChecked={selectedItem.barcode === barcode}
                    onChange={() => setSelectedSource(data)}
                />
            </CustomActionsCellRenderer>
        );
    };

    const closeButtonCell = ({data, list = []}) => {
        const {barcode} = data || {};
        const handleClick = () => {
            const updatedRowData = list.filter(el => el.barcode !== barcode);
            setSources(updatedRowData);
        };

        return (
            <CustomActionsCellRenderer id={barcode}>
                <span onClick={handleClick}>
                    <EditorCloseIcon />
                </span>
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

    const closeButtonColumn = defineButtonColumn({
        cellRendererFramework: closeButtonCell,
        cellRendererParams: {list: sources},
    });

    const servicesColumn = defineColumn({
        headerName: '#',
        width: 40,
        colId: 'services',
        field: 'services',
        cellRenderer: ({data}) => {
            const name = data && `${data['fs'].toLowerCase()}Services`;
            return name && data[name] && data[name].length;
        }
    });

    return (
        <div className="nexus-c-sources-table">
            <NexusTitle isSubTitle>{`Sources (${sources.length})`}</NexusTitle>
            <NexusGrid 
                columnDefs={[
                    radioButtonColumn,
                    closeButtonColumn,
                    servicesColumn, 
                    ...columnDefinitions
                ]}
                rowData={sources}
                domLayout="autoHeight"
            />
        </div>
    );
};

SourcesTable.propTypes = {
    data: PropTypes.object,
    onSelectedSourceChange: PropTypes.func.isRequired,
};

SourcesTable.defaultProps = {
    data: {},
};

export default SourcesTable;
