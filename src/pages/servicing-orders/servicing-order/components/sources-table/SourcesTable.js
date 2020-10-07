import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Badge from '@atlaskit/badge';
import {Radio} from '@atlaskit/radio';
import {isEqual, cloneDeep, flatten} from 'lodash';
import {compose} from 'redux';
import mappings from '../../../../../../profile/sourceTableMapping.json';
import {NexusGrid} from '../../../../../ui/elements';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '../../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import usePrevious from '../../../../../util/hooks/usePrevious';
import constants from '../fulfillment-order/constants';
import {NON_EDITABLE_COLS, SELECT_VALUES} from './Constants';
import columnDefinitions from './columnDefinitions';
import './SourcesTable.scss';
import {fetchAssetFields} from './util';

const {SOURCE_TITLE, SOURCE_SUBTITLE} = constants;

const SourceTableGrid = compose(withColumnsResizing())(NexusGrid);

const Loading = 'loading...';

const SourcesTable = ({data, onSelectedSourceChange, setUpdatedServices}) => {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const previousData = usePrevious(data);
    const barcodes = data.map(item => item.barcode);

    // useEffect(() => populateRowData(), [data]);
    useEffect(
        () => {
            if (!isEqual(data, previousData)) {
                setSelectedSource(null);
                populateRowData();
            }
            populateRowData();
        },
        // disabling eslint here as it couldn;t be tested since no scenario was found as of now
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data]
    );

    useEffect(() => {
        if (selectedSource === null && data.length > 0) {
            setSelectedSource(data[0]);
        }
    }, [selectedSource, data]);

    useEffect(
        () => {
            onSelectedSourceChange(selectedSource);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedSource]
    );

    // eslint-disable-next-line
    const serviceButtonCell = ({data, selectedItem = {}}) => {
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
            const serviceLength = name && data[name] ? data[name].length : 0;

            return <Badge>{serviceLength}</Badge>;
        },
    });

    const onSourceTableChange = ({type, rowIndex, data}) => {
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED) {
            if (barcodes[rowIndex] !== data.barcode) {
                // call MGM fetch api and update barcode
                const loadingSources = sources.slice();
                let loading = cloneDeep(data);
                loading = {
                    ...loading,
                    title: Loading,
                    version: Loading,
                    assetFormat: Loading,
                    status: Loading,
                    standard: Loading,
                };
                loadingSources[rowIndex] = loading;
                setSources(loadingSources);
                fetchAssetFields(data.barcode)
                    .then(res => {
                        const newSources = sources.slice();
                        newSources[rowIndex] = {
                            ...loading,
                            barcode: data.barcode,
                            assetFormat: res.assetFormat,
                            title: res.title[0].name,
                            version: res.spec,
                            status: res.status,
                            standard: res.componentAssociations[0].component.standard,
                        };

                        setSources(newSources);
                    })
                    .catch(() => {
                        const prevSources = sources.slice();
                        prevSources[rowIndex] = {
                            ...prevSources[rowIndex],
                            barcode: barcodes[rowIndex],
                        };
                        setSources(prevSources);
                    });
            }
        }
    };

    const populateRowData = () => {
        const sourcesArray = [];
        const dataArray = [];
        data.length &&
            data.map(item => {
                dataArray.push(item.deteServices[0].deteSources[0]);
            });
        dataArray.map((item, index) => {
            sourcesArray.push({...item, ...data[index]});
        });
        setSources(sourcesArray);
    };

    return (
        <div className="nexus-c-sources">
            <div className="nexus-c-sources__header">
                <h2>{`${SOURCE_TITLE} (${sources.length})`}</h2>
                <div>{SOURCE_SUBTITLE}</div>
            </div>
            <SourceTableGrid
                columnDefs={[radioButtonColumn, servicesColumn, ...columnDefinitions]}
                rowData={sources}
                domLayout="normal"
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
    setUpdatedServices: PropTypes.func.isRequired,
};

SourcesTable.defaultProps = {
    data: [],
};

export default SourcesTable;
