import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Radio} from '@atlaskit/radio';
import Badge from '@atlaskit/badge';
import {isEqual} from 'lodash';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import './SourcesTable.scss';
import columnDefinitions from './columnDefinitions';
import {NexusGrid} from '../../../../../ui/elements';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {ADDITIONAL_COLUMN_DEF} from '../../../constants';
import {defineColumn, defineButtonColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import constants from '../fulfillment-order/constants';
import usePrevious from '../../../../../util/hooks/usePrevious';

const {SOURCE_TITLE, SOURCE_SUBTITLE} = constants;

const SourcesTable = ({data, onSelectedSourceChange}) => {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState();
    const previousData = usePrevious(data);

    useEffect(() => {
        if (!isEqual(data, previousData)) {
            setSelectedSource(null);
            setSources(data);
        }
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

    const closeButtonCell = ({data, list = []}) => {
        const {barcode} = data || {};
        const handleClick = () => {
            const updatedRowData = list.filter(el => el.barcode !== barcode);
            if (selectedSource && selectedSource.barcode === barcode) {
                setSelectedSource();
            }
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

    return (
        <div className="nexus-c-sources-table">
            <div className="nexus-c-sources-table__header">
                <div className="nexus-c-sources-table__title">{`${SOURCE_TITLE} (${sources.length})`}</div>
                <div className="nexus-c-sources-table__subtitle">{SOURCE_SUBTITLE}</div>
            </div>
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
    data: PropTypes.array,
    onSelectedSourceChange: PropTypes.func.isRequired,
};

SourcesTable.defaultProps = {
    data: [],
};

export default SourcesTable;
