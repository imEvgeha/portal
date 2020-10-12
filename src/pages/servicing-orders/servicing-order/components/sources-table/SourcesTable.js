import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Badge from '@atlaskit/badge';
import {Radio} from '@atlaskit/radio';
import {isEqual, cloneDeep} from 'lodash';
import {compose} from 'redux';
import mappings from '../../../../../../profile/sourceTableMapping.json';
import loadingGif from '../../../../../assets/img/loading.gif';
import {NexusGrid} from '../../../../../ui/elements';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '../../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import usePrevious from '../../../../../util/hooks/usePrevious';
import {showToastForErrors} from '../../../../../util/http-client/handleError';
import constants from '../fulfillment-order/constants';
import {NON_EDITABLE_COLS, SELECT_VALUES} from './Constants';
import columnDefinitions from './columnDefinitions';
import './SourcesTable.scss';
import {fetchAssetFields} from './util';

const {SOURCE_TITLE, SOURCE_SUBTITLE} = constants;

const SourceTableGrid = compose(withColumnsResizing())(NexusGrid);

const Loading = 'loading...';

const SourcesTable = ({data: dataArray, onSelectedSourceChange, setUpdatedServices, isDisabled, setIsSaved}) => {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const previousData = usePrevious(dataArray);
    const barcodes = dataArray.map(item => item.barcode.trim());

    // useEffect(() => populateRowData(), [data]);
    useEffect(
        () => {
            if (!isEqual(dataArray, previousData)) {
                setSelectedSource(null);
                populateRowData();
            }
            populateRowData();
        },
        // disabling eslint here as it couldn;t be tested since no scenario was found as of now
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataArray]
    );

    useEffect(() => {
        if (selectedSource === null && dataArray.length > 0) {
            setSelectedSource(dataArray[0]);
        }
    }, [selectedSource, dataArray]);

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

    const loadingCell = params => {
        if (params.value === 'loading...') {
            return `<img src=${loadingGif} alt="loading..."/>`;
        } 
            return params.value;
        
    };

    const barcodeColumn = !isDisabled
        ? {...columnDefinitions[0], editable: true}
        : {...columnDefinitions[0], editable: false};
    let newColDef = [barcodeColumn, ...columnDefinitions.filter((item, index) => index !== 0)];
    newColDef = newColDef.map(item => {
        return {...item, cellRenderer: loadingCell};
    });

    const onSourceTableChange = async ({type, rowIndex, data, api}) => {
        const prevSources = sources.slice();
        prevSources[rowIndex] = {
            ...prevSources[rowIndex],
            barcode: barcodes[rowIndex],
        };
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED) {
            const barcodeIndex = barcodes.findIndex(item => item === data.barcode.trim());
            if (barcodeIndex !== -1) {
                showToastForErrors(null, {
                    errorToast: {
                        title: 'Duplicate Entry',
                        description: `Entry ${data.barcode.trim()} already exists in this list`,
                    },
                });
                api.setRowData(prevSources);
            } else if (barcodes[rowIndex] !== data.barcode.trim()) {
                // call MGM fetch api and update barcode
                const loadingSources = sources.slice();
                let loading = data;
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
                try {
                    const {assetFormat, title = [], spec, status, componentAssociations = []} = await fetchAssetFields(
                        data.barcode
                    );
                    const newSources = cloneDeep(sources[0]);
                    newSources.deteServices[0].deteSources[rowIndex] = {
                        ...newSources.deteServices[0].deteSources[rowIndex],
                        amsAssetId: data.barcode,
                        barcode: data.barcode,
                        assetFormat,
                        title: title[0].name,
                        version: spec,
                        status,
                        standard: componentAssociations[0].component.standard,
                    };
                    setUpdatedServices(newSources);
                } catch (e) {
                    setSources(prevSources);
                }
            }
        }
    };

    const populateRowData = () => {
        const dataClone = cloneDeep(dataArray);
        const sourcesArray = [];
        const newDataArray = [];

        // eslint-disable-next-line no-return-assign
        dataClone.length &&
            dataClone.forEach((item, index) => (newDataArray[index] = item.deteServices[0].deteSources[index]));
        newDataArray.forEach((item, index) => (sourcesArray[index] = {...item, ...dataClone[index]}));
        setSources(sourcesArray);
    };

    return (
        <div className="nexus-c-sources">
            <div className="nexus-c-sources__header">
                <h2>{`${SOURCE_TITLE} (${sources.length})`}</h2>
                <div>{SOURCE_SUBTITLE}</div>
            </div>
            <SourceTableGrid
                columnDefs={[radioButtonColumn, servicesColumn, ...newColDef]}
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
    isDisabled: PropTypes.bool.isRequired,
    setIsSaved: PropTypes.func.isRequired,
};

SourcesTable.defaultProps = {
    data: [],
};

export default SourcesTable;
