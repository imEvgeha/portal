import React, {useContext, useEffect, useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Tag from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import Add from '@vubiquity-nexus/portal-assets/action-add.svg';
import {cloneDeep, flattenDeep, get, isEmpty, groupBy, difference} from 'lodash';
import {compose} from 'redux';
import mappings from '../../../../../../profile/servicesTableMappings.json';
import {NexusGrid} from '../../../../../ui/elements';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineButtonColumn, defineColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withEditableColumns from '../../../../../ui/elements/nexus-grid/hoc/withEditableColumns';
import {NexusModalContext} from '../../../../../ui/elements/nexus-modal/NexusModal';
import StatusTag from '../../../../../ui/elements/nexus-status-tag/StatusTag';
import {getSpecOptions} from '../../../servicingOrdersService';
import constants from '../fulfillment-order/constants';
import {SELECT_VALUES, SERVICE_SCHEMA, CLICK_FOR_SELECTION, NO_SELECTION} from './Constants';
import ErrorsList from './ErrorsList';
import columnDefinitions from './columnDefinitions';
import ComponentsPicker from './components-picker/ComponentsPicker';
import './ServicesTable.scss';

const ServicesTableGrid = compose(withEditableColumns())(NexusGrid);

const errorIcon = `<i class='fas fa-exclamation-triangle' style='color:red' />`;

const ServicesTable = ({data, isDisabled, setUpdatedServices, components: componentsArray, deteErrors}) => {
    const [services, setServices] = useState({});
    const [originalServices, setOriginalServices] = useState({});
    const [tableData, setTableData] = useState([]);
    const [providerServices, setProviderServices] = useState('');
    const [recipientsOptions, setRecipientsOptions] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const {openModal, closeModal} = useContext(NexusModalContext);

    const deteComponents = useMemo(() => componentsArray.find(item => item && item.barcode === data.barcode), [
        data.barcode,
    ]);

    const title =
        get(data, 'title', '') ||
        get(
            get(data, 'deteServices[0].deteSources', []).find(item => item.barcode === data.barcode),
            'title',
            ''
        );

    const {tenant} = data;

    useEffect(() => {
        if (!isEmpty(data)) {
            const recp = get(data, 'deteServices[0].deteTasks.deteDeliveries[0].externalDelivery.deliverToId', '');
            recp !== 'VU' ? setRecipientsOptions([recp, 'VU']) : setRecipientsOptions(['VU']);
            setProviderServices(`${data.fs.toLowerCase()}Services`);
            setServices(data);
            setOriginalServices(data);
        }
    }, [data]);

    console.log('data: ', data);

    useEffect(
        () => {
            if (!isEmpty(services)) {
                const flattenedObject = services[providerServices].map((service, index) => ({
                    serviceType:
                        service.externalServices.serviceType === 'DETE Recipient'
                            ? SELECT_VALUES.serviceType[0]
                            : SELECT_VALUES.serviceType[1],
                    assetType: service.externalServices.assetType || '',
                    components: service.details || [],
                    spec: service.externalServices.formatType,
                    doNotStartBefore: service.overrideStartDate || '',
                    priority: service.externalServices.parameters.find(param => param.name === 'Priority').value,
                    recipient: service.deteTasks.deteDeliveries[0].externalDelivery.deliverToId || '',
                    operationalStatus: service.status,
                    rowIndex: index,
                    rowHeight: 50,
                }));
                setTableData(flattenedObject);
                setRecipients(flattenedObject.map(row => row.recipient));
            }
        },
        // disabling eslint here as it couldn;t be tested since no scenario was found as of now
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [services]
    );

    /*
    useEffect(() => {
        console.log('effect 3: ', recipients);
        const formatSheets = {};
        tableData.forEach(row => {
            getSpecOptions(row.recipient, tenant).then( res => console.log('formatsheets w', res));
        })
    },[recipients]); */

    const handleComponentsEdit = (index, components) => {
        const newRow = cloneDeep(tableData[index]);
        newRow.components = [...Object.keys(components)];
        setTableData(prev => prev.map((row, idx) => (idx === index ? newRow : row)));
        const update = cloneDeep(services);
        const serviceWithComponents = flattenDeep(Object.values(components)).map(item => {
            return {...item, typeAttribute: tableData[index].assetType === 'Audio' ? 'audioDetail' : 'textDetail'};
        });

        update.deteServices[index].details = serviceWithComponents.map(item => {
            delete item['isChecked'];
            return item;
        });
        setUpdatedServices(update);
    };

    const handleServiceRemoval = index => {
        const updatedService = cloneDeep(services[`${providerServices}`]);
        updatedService.splice(index, 1);
        const newServices = {...services, [`${providerServices}`]: updatedService};
        setServices(newServices);
        setUpdatedServices(newServices);
    };

    const getComponentsForPicker = assetType => {
        if (assetType === 'Audio') return get(deteComponents, 'components.audioComponents', []);
        else if (assetType === 'Subtitles') return get(deteComponents, 'components.subtitleComponents', []);
        else if (assetType === 'Closed Captioning') return get(deteComponents, 'components.captionComponents', []);
        return [];
    };

    // eslint-disable-next-line react/prop-types
    const closeButtonCell = ({rowIndex}) => {
        return (
            <CustomActionsCellRenderer id={rowIndex.toString()} classname="nexus-c-services__close-icon">
                {!isDisabled && (
                    <span onClick={() => handleServiceRemoval(rowIndex)}>
                        <EditorRemoveIcon size="medium" primaryColor="grey" />
                    </span>
                )}
            </CustomActionsCellRenderer>
        );
    };

    // eslint-disable-next-line react/prop-types
    const componentsCell = ({rowIndex}) => {
        let toolTipContent = '';
        if (!isDisabled) {
            if (!['Audio', 'Subtitles', 'Closed Captioning'].includes(get(tableData[rowIndex], 'assetType', ''))) {
                toolTipContent = NO_SELECTION;
            } else {
                toolTipContent = CLICK_FOR_SELECTION;
            }
        }

        return (
            <Tooltip content={toolTipContent}>
                <div
                    style={{minHeight: '25px'}}
                    onClick={() => {
                        return isDisabled || toolTipContent !== CLICK_FOR_SELECTION
                            ? null
                            : openModal(
                                  <ComponentsPicker
                                      data={{
                                          assetType: tableData[rowIndex].assetType,
                                          barcode: data.barcode,
                                          title,
                                          compSummary: tableData[rowIndex].components,
                                          componentArray: getComponentsForPicker(tableData[rowIndex].assetType),
                                      }}
                                      closeModal={closeModal}
                                      saveComponentData={handleComponentsEdit}
                                      index={rowIndex}
                                  />,
                                  {
                                      width: tableData[rowIndex].assetType === 'Audio' ? 'x-large' : 'large',
                                  }
                              );
                    }}
                >
                    {tableData[rowIndex] &&
                        Object.keys(
                            groupBy([...tableData[rowIndex].components], v => [v.language, v.trackConfig || v.format])
                        ).map(item => <Tag key={item} text={item} />)}
                </div>
            </Tooltip>
        );
    };

    const closeButtonColumn = defineButtonColumn({
        width: 30,
        cellRendererFramework: closeButtonCell,
        cellRendererParams: services && services[providerServices],
    });

    const componentCol = {
        cellRendererFramework: componentsCell,
        cellRendererParams: {data, tableData},
    };

    const statusCol = {
        headerComponentParams: {menuIcon: errorIcon},
        headerComponentFramework: () => (
            <Tooltip content={deteErrors.length ? `View ${deteErrors.length} errors` : '0 errors'}>
                <div
                    onClick={() =>
                        deteErrors.length ? openModal(<ErrorsList errors={deteErrors} closeModal={closeModal} />) : null
                    }
                >
                    Operational Status <ErrorIcon size="small" primaryColor={deteErrors.length ? 'red' : 'grey'} />
                </div>
            </Tooltip>
        ),
        sortable: false,
        // eslint-disable-next-line react/prop-types
        cellRendererFramework: ({rowIndex}) => <StatusTag status={get(tableData[rowIndex], 'operationalStatus', '')} />,
        cellRendererParams: {tableData},
    };

    const colDef = columnDefinitions.map(item => {
        switch (item.colId) {
            case 'components':
                return {...item, ...componentCol};
            case 'operationalStatus':
                return {...item, ...statusCol};
            default:
                return item;
        }
    });

    // set service type value to save to api based on service type and asset type drop down selected
    const setOrderServiceType = (serviceType, assetType) => {
        const service = '';
        if (serviceType === 'Process & Deliver') return 'DETE Recipient';
        else if (serviceType === 'DETE Ingest') {
            if (assetType === 'Video') return 'Master';
            else if (assetType === 'Subtitles' || assetType === 'Closed Captioning' || assetType === 'Audio')
                return assetType;
        }
        return service;
    };
    const handleTableChange = ({rowIndex, type, api, data}) => {
        switch (type) {
            case GRID_EVENTS.READY: {
                api.sizeColumnsToFit();
                break;
            }
            case GRID_EVENTS.CELL_VALUE_CHANGED: {
                const updatedServices = cloneDeep(services[providerServices]);
                const currentService = updatedServices[rowIndex];
                // TODO: Super inefficient, need to find a better way
                // Re-mapping the data
                currentService.externalServices.serviceType = setOrderServiceType(data.serviceType, data.assetType);
                if (data.assetType !== currentService.externalServices.assetType) currentService.details = []; // make components empty when assetType changes
                currentService.externalServices.assetType = data.assetType;
                currentService.externalServices.formatType = data.spec;
                currentService.overrideStartDate = data.doNotStartBefore || '';
                currentService.externalServices.parameters.find(param => param.name === 'Priority').value =
                    data.priority;
                currentService.deteTasks.deteDeliveries[0].externalDelivery.deliverToId = data.recipient;
                currentService.status = data.operationalStatus;

                const newServices = {...services, [providerServices]: updatedServices};
                setServices(newServices);
                setUpdatedServices(newServices);
                break;
            }
            default:
                break;
        }
    };

    const addEmptyServicesRow = () => {
        const updatedService = cloneDeep(services[`${providerServices}`]);
        const blankService = cloneDeep(SERVICE_SCHEMA);
        blankService.deteSources[0].barcode = data.barcode;
        blankService.externalServices.externalId = get(data, 'deteServices[0].externalServices.externalId', '');
        updatedService.push(blankService);
        const newServices = {...services, [`${providerServices}`]: updatedService};
        setServices(newServices);
        setUpdatedServices(newServices);
    };

    const orderingColumn = defineColumn({
        headerName: '#',
        width: 30,
        colId: 'serviceId',
        field: 'serviceId',
        cellRendererFramework: data => {
            return data ? data.rowIndex + 1 : null;
        },
    });

    const servicesCount = services[`${providerServices}`] ? services[`${providerServices}`].length : 0;
    const barcode = services.barcode || null;

    const valueGetter = params => {
        return get(params.data, params.colDef.dataSource || params.colDef.field, '');
    };

    const disableMappings = () => {
        return cloneDeep(mappings).map(mapping => ({
            ...mapping,
            readOnly: true,
            enableEdit: false,
        }));
    };

    return (
        <div className="nexus-c-services-table">
            <div className="nexus-c-services-table__header">
                <h3 className="nexus-c-services-table__title">{`${constants.SERVICES_TITLE} (${servicesCount})`}</h3>
                <div className="nexus-c-services-table__subtitle">
                    {constants.SERVICES_BARCODE}: {barcode}
                </div>
                <div className="nexus-c-services-table__add-icon">
                    {!isDisabled && <Add onClick={addEmptyServicesRow} />}
                </div>
            </div>
            <ServicesTableGrid
                defaultColDef={{...valueGetter, sortable: true, resizable: true}}
                isMenuHidden={false}
                columnDefs={[orderingColumn, closeButtonColumn, ...colDef]}
                rowData={tableData}
                domLayout="autoHeight"
                mapping={isDisabled ? disableMappings(mappings) : mappings}
                selectValues={{...SELECT_VALUES, recipient: recipientsOptions}}
                onGridEvent={handleTableChange}
            />
        </div>
    );
};

ServicesTable.propTypes = {
    data: PropTypes.object,
    isDisabled: PropTypes.bool,
    setUpdatedServices: PropTypes.func,
    components: PropTypes.array,
    deteErrors: PropTypes.array,
};

ServicesTable.defaultProps = {
    data: null,
    isDisabled: false,
    setUpdatedServices: () => null,
    components: [],
    deteErrors: [],
};

export default ServicesTable;
