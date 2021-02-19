import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Badge from '@atlaskit/badge';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import {Radio} from '@atlaskit/radio';
import Add from '@vubiquity-nexus/portal-assets/action-add.svg';
import loadingGif from '@vubiquity-nexus/portal-assets/img/loading.gif';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {
    defineButtonColumn,
    defineColumn,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {isEqual, cloneDeep, get} from 'lodash';
import {compose} from 'redux';
import {NexusGrid} from '../../../../../ui/elements';
import usePrevious from '../../../../../util/hooks/usePrevious';
import {showToastForErrors} from '../../../../../util/http-client/handleError';
import constants from '../fulfillment-order/constants';
import {NON_EDITABLE_COLS, SELECT_VALUES, INIT_SOURCE_ROW, TEMP_SOURCE_ROW} from './Constants';
import columnDefinitions from './columnDefinitions';
import './SourcesTable.scss';
import {fetchAssetFields} from './util';
import {RESTRICTED_TENANTS} from '../constants';

const {SOURCE_TITLE, SOURCE_SUBTITLE} = constants;

const SourceTableGrid = compose(withColumnsResizing())(NexusGrid);

const SourcesTable = ({data: dataArray, onSelectedSourceChange, setUpdatedServices, isDisabled}) => {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const previousData = usePrevious(dataArray);

    const barcodes = dataArray.map(item => item.barcode.trim());

    const isRestrictedTenant = RESTRICTED_TENANTS.includes(dataArray[0] && dataArray[0].tenant);

    useEffect(
        () => {
            if (!isEqual(dataArray, previousData)) {
                setSelectedSource(null);
                populateRowData();
            } else populateRowData();
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
    const serviceButtonCell = ({data, rowIndex, node, colDef,selectedSource}) => {
        const {barcode} = data || {};
        const servicesName = `${data['fs'].toLowerCase()}Services`;

        console.log('colDef',colDef);
        // eslint-disable-next-line react/prop-types
        node.selected = true;
        return (
            <div id={barcode}>
                <input type="radio"
                    name={barcode}
                    /* eslint-disable-next-line react/prop-types */
                    checked={selectedSource.barcode ? dataArray[rowIndex].barcode === selectedSource.barcode : false}
                    onClick={()=>setSelectedRow({data, rowIndex})}
                />
            </div>
        );
    };


  const setSelectedRow = ({data, rowIndex, value, column}) => {
      console.log(value, column)
      const servicesName = `${data['fs'].toLowerCase()}Services`;
      setSelectedSource({...data, [servicesName]: dataArray[rowIndex].deteServices})
    }

    const radioButtonColumn = defineColumn({
        width: 35,
        colId: 'radio',
        field: 'radio',
        cellRendererParams: {selectedSource},
        cellRendererFramework: serviceButtonCell,
    });

    const servicesColumn = defineColumn({
        headerName: '#',
        width: 35,
        colId: 'services',
        field: 'services',
        cellRendererFramework: ({data}) => <Badge>{data.serviceCount}</Badge>,
    });

    // eslint-disable-next-line react/prop-types
    const deleteButtonCell = ({rowIndex, data}) => {
        return isRestrictedTenant && dataArray.length === 1 ? (
            ''
        ) : (
            <CustomActionsCellRenderer id={rowIndex.toString()} classname="nexus-c-services__close-icon">
                {!isDisabled && (
                    <span onClick={() => removeSourceRow(data.barcode)}>
                        <EditorRemoveIcon size="medium" primaryColor="grey" />
                    </span>
                )}
            </CustomActionsCellRenderer>
        );
    };

    const deleteButtonColumn = defineButtonColumn({
        width: 35,
        cellRendererFramework: deleteButtonCell,
        cellRendererParams: '',
    });

    const loadingCell = params => {
        if (params.value === ' ') {
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

    const onSourceTableChange = async ({type, rowIndex, data, api, gridOptions}) => {
        switch (type) {
            case GRID_EVENTS.READY: {
                api.sizeColumnsToFit();
                break;
            }
            case GRID_EVENTS.CELL_VALUE_CHANGED: {
                /*
                    only barcode is editable
                    when barcode change detected, call dete title/asset api to get data
                    update row data and call setUpdatedService to update data in parent component
                 */
                const prevSources = sources.slice();
                prevSources[rowIndex] = {
                    ...prevSources[rowIndex],
                    barcode: barcodes[rowIndex],
                };
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
                    // call DETE fetch api and update barcode.
                    const loadingSources = sources.slice();
                    let loading = data;
                    loading = {
                        ...loading,
                        ...cloneDeep(TEMP_SOURCE_ROW),
                    };
                    loadingSources[rowIndex] = loading;
                    setSources(loadingSources);
                    try {
                        const {
                            assetFormat,
                            title = [],
                            spec,
                            status,
                            componentAssociations = [],
                        } = await fetchAssetFields(data.barcode);
                        /*
                         dataArray[0] is a full order object.
                         sources rows are in dataArray[0].deteServices[0].deteSources[...]
                         todo: data props to be optimised. kbora
                         */
                        const updatedOrder = cloneDeep(dataArray[0]);
                        updatedOrder.deteServices[0].deteSources[rowIndex] = {
                            ...updatedOrder.deteServices[0].deteSources[rowIndex],
                            amsAssetId: data.barcode,
                            barcode: data.barcode,
                            assetInfo: {
                                amsAssetId: data.barcode,
                                assetFormat,
                                barcode: data.barcode,
                                title: title[0].name,
                                version: spec,
                                status,
                                standard: componentAssociations[0].component.standard,
                            },
                        };
                        setUpdatedServices({...updatedOrder});
                    } catch (e) {
                        setSources(prevSources);
                    }
                }
                break;
            }
            default:
                break;
        }
    };

    const addEmptySourceRow = () => {
        if (sources[sources.length - 1].barcode === '')
            showToastForErrors(null, {
                errorToast: {
                    title: 'Invalid Action',
                    description: 'Please add one row at a time',
                },
            });
        else {
            setSources([...sources, cloneDeep(INIT_SOURCE_ROW)]);
        }
    };

    const removeSourceRow = barcode => {
        const newSources = cloneDeep(dataArray[0]);
        newSources.deteServices[0].deteSources = newSources.deteServices[0].deteSources.filter(
            item => item.barcode !== barcode
        );
        setUpdatedServices(newSources);
    };

    const populateRowData = () => {
        // extract only relevant assetInfo property from dataArray as table row
        // todo: check if we can optimise data props to one object instead of array of copy objects
        const sourcesArray = [];
        dataArray.forEach(
            (item, index) =>
                (sourcesArray[index] = {
                    fs: dataArray[index].fs,
                    serviceCount: get(dataArray[index], 'deteServices.length', 0),
                    ...get(dataArray[index], `deteServices[0].deteSources[${index}].assetInfo`, {}),
                })
        );

        setSources(sourcesArray);
    };

    return (
        <div className="nexus-c-sources">
            <div className="nexus-c-sources__header">
                <h2>{`${SOURCE_TITLE} (${sources.length})`}</h2>
                <div>{SOURCE_SUBTITLE}</div>
                {sources.length > 0 && (
                    <div className="nexus-c-source-table__add-icon">
                        {!isDisabled && !isRestrictedTenant && <Add onClick={addEmptySourceRow} />}
                    </div>
                )}
            </div>
            <SourceTableGrid
                columnDefs={[radioButtonColumn, deleteButtonColumn, servicesColumn, ...newColDef]}
                defaultColDef={{
                    flex: 1,
                    sortable: true,
                }}
                rowData={sources}
                domLayout="normal"
                notEditableColumns={NON_EDITABLE_COLS}
                selectValues={SELECT_VALUES}
                onGridEvent={onSourceTableChange}
                onCellClicked={setSelectedRow}
            />
        </div>
    );
};

SourcesTable.propTypes = {
    data: PropTypes.array,
    onSelectedSourceChange: PropTypes.func.isRequired,
    setUpdatedServices: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isRequired,
};

SourcesTable.defaultProps = {
    data: [],
};

export default SourcesTable;
