import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SimpleTag as Tag} from '@atlaskit/tag';
import {Tooltip} from '@portal/portal-components';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {
    defineButtonColumn,
    defineColumn,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import StatusTag from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-tag/StatusTag';
import {addToast} from '@vubiquity-nexus/portal-ui/src/toast/NexusToastNotificationActions';
import {cloneDeep, flattenDeep, get, groupBy, isEmpty, set} from 'lodash';
import {useDispatch} from 'react-redux';
import {compose} from 'redux';
import mappings from '../../../../../../profile/servicesTableMappings.json';
import {NexusGrid} from '../../../../../ui/elements';
import constants from '../fulfillment-order/constants';
import {
    CLICK_FOR_SELECTION,
    DETE_SERVICE_TYPE,
    NO_SELECTION,
    SELECT_VALUES,
    SERVICE_SCHEMA,
    SOURCE_STANDARD,
} from './Constants';
import CheckBoxRenderer from './cell-renderers/CheckBoxRenderer';
import CloseButtonCellRenderer from './cell-renderers/CloseButtonCellRenderer';
import columnDefinitions from './columnDefinitions';
import ComponentsPicker from './components-picker/ComponentsPicker';
import './ServicesTable.scss';

const ServicesTableGrid = compose(withEditableColumns())(NexusGrid);

const ServicesTable = ({
    data,
    recipientsOptions,
    isDisabled,
    setUpdatedServices,
    components: componentsArray,
    externalId,
}) => {
    const [services, setServices] = useState({});
    const [tableData, setTableData] = useState([]);
    const [providerServices, setProviderServices] = useState('');
    const [specOptions, setSpecOptions] = useState([]);
    const {openModal, closeModal} = useContext(NexusModalContext);
    const dispatch = useDispatch();

    // recipient is fixed for a fullfillment order. should be same for all service rows, take from first row
    const recipient = get(data, 'deteServices[0].deteTasks.deteDeliveries[0].externalDelivery.deliverToId', '');

    const deteComponents = componentsArray?.find(item => item && item.barcode === data?.barcode);

    const title =
        get(data, 'title', '') ||
        get(
            get(data, 'deteServices[0].deteSources', []).find(item => item.barcode === data.barcode),
            'title',
            ''
        );

    useEffect(() => {
        if (!isEmpty(data)) {
            data.fs && setProviderServices(`${data.fs.toLowerCase()}Services`);
            setServices(data);
        }
    }, [data]);

    useEffect(
        () => {
            if (!isEmpty(services)) {
                const flattenedObject = services[providerServices].map((service, index) => ({
                    serviceType:
                        service.externalServices.serviceType === DETE_SERVICE_TYPE
                            ? SELECT_VALUES.serviceType
                            : service.externalServices.serviceType,
                    assetType: service.externalServices.assetType || '',
                    components: service.details || [],
                    spec: service.externalServices.formatType,
                    doNotStartBefore: service.overrideStartDate || '',
                    priority: service.externalServices.parameters.find(param => param.name === 'Priority').value,
                    watermark: get(service, 'externalServices.parameters', {}).find(param => param.name === 'Watermark')
                        ?.value,
                    recipient,
                    operationalStatus: service.foiStatus || '',
                    rowIndex: index,
                    rowHeight: 50,
                    sourceStandard: service?.externalServices?.parameters?.find(param => param.name === SOURCE_STANDARD)
                        ?.value,
                    deliveryMethod: service?.deteTasks?.deteDeliveries?.[0]
                        ? service.deteTasks.deteDeliveries[0].deliveryMethod
                        : undefined,
                }));

                setTableData(flattenedObject);
            }
        },
        // disabling eslint here as it couldn;t be tested since no scenario was found as of now
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [services]
    );

    const handleServiceRemoval = index => {
        const updatedService = cloneDeep(services[`${providerServices}`]);
        updatedService.splice(index, 1);
        const newServices = {...services, [`${providerServices}`]: updatedService};
        setServices(newServices);
        setUpdatedServices(newServices);
    };

    // eslint-disable-next-line react/prop-types
    const ComponentCellRenderer = ({node, rowIndex, tableData, data, deteComponents, services}) => {
        let toolTipContent = '';
        if (!isDisabled) {
            if (!['Audio', 'Subtitles', 'Closed Captioning'].includes(get(node, 'data.assetType'))) {
                toolTipContent = NO_SELECTION;
            } else {
                toolTipContent = CLICK_FOR_SELECTION;
            }
        }

        const getComponentsForPicker = assetType => {
            if (assetType === 'Audio') return get(deteComponents, 'components.audioComponents', []);
            else if (assetType === 'Subtitles') return get(deteComponents, 'components.subtitleComponents', []);
            else if (assetType === 'Closed Captioning') return get(deteComponents, 'components.captionComponents', []);
            return [];
        };

        const handleComponentsEdit = (index, components) => {
            const newRow = cloneDeep(tableData[index]);
            const update = cloneDeep(services);
            const serviceWithComponents = flattenDeep(Object.values(components)).map(item => {
                return {...item, typeAttribute: get(node, 'data.assetType') === 'Audio' ? 'audioDetail' : 'textDetail'};
            });

            update.deteServices[index].details = serviceWithComponents.map(item => {
                delete item['isChecked'];
                return item;
            });
            newRow.components = update.deteServices[index].details;
            setTableData(prev => prev.map((row, idx) => (idx === index ? newRow : row)));
            setUpdatedServices(update);
        };

        const renderComponentsPicker = () => (
            <ComponentsPicker
                data={{
                    assetType: get(node, 'data.assetType'),
                    barcode: data.barcode,
                    title,
                    compSummary: get(node, 'data.components', []),
                    componentArray: getComponentsForPicker(get(node, 'data.assetType')),
                }}
                closeModal={closeModal}
                saveComponentData={handleComponentsEdit}
                index={rowIndex}
            />
        );

        const onTooltipOptionClick = () => {
            return isDisabled || toolTipContent !== CLICK_FOR_SELECTION
                ? null
                : openModal(renderComponentsPicker(), {
                      width: get(node, 'data.assetType') === 'Audio' ? 'x-large' : 'large',
                  });
        };

        const getDataComponents = () =>
            Object.keys(groupBy(get(node, 'data.components', []), v => [v.language, v.trackConfig || v.type]));

        return (
            <div className="tooltip-cell-renderer-wrapper">
                <div className="tooltip-cell-renderer" onClick={onTooltipOptionClick}>
                    {toolTipContent}
                </div>
                {!!getDataComponents().length && (
                    <Tooltip target=".tooltip-cell-renderer">
                        <div style={{minHeight: '25px'}}>
                            {getDataComponents().map(item => (
                                <Tag key={item} text={item} />
                            ))}
                        </div>
                    </Tooltip>
                )}
            </div>
        );
    };

    const closeButtonColumn = defineButtonColumn({
        width: 30,
        cellRendererFramework: CloseButtonCellRenderer,
        cellRendererParams: ({rowIndex}) => ({rowIndex, isDisabled, handleServiceRemoval}),
    });

    const componentCol = {
        cellRenderer: 'componentCellRenderer',
        cellRendererParams: {tableData, data, services, deteComponents},
    };

    const statusCol = {
        sortable: false,
        // eslint-disable-next-line react/prop-types
        cellRendererFramework: ({rowIndex}) => <StatusTag status={get(tableData[rowIndex], 'operationalStatus', '')} />,
        cellRendererParams: {tableData},
    };

    const watermarkCol = {
        sortable: false,
        cellRenderer: 'checkBoxRenderer',
        headerComponentFramework: () => (
            <span title="watermark">
                <i className="fas fa-tint" />
            </span>
        ),
        cellRendererParams: ({rowIndex, node}) => ({
            tableData,
            rowIndex,
            node,
            isDisabled,
            toggleCheck: () =>
                handleFieldEdit(
                    rowIndex,
                    'externalServices.parameters',
                    'Watermark',
                    !get(tableData[rowIndex], 'watermark')
                ),
        }),
    };

    // get spec col selection values dynamically when user hovers the row
    const getSpecOptions = e => {
        if (!isDisabled) {
            const options = get(recipientsOptions, `[${e.data.recipient}]`, []);
            if (options.length > 0) setSpecOptions(options);
            else setSpecOptions([]);
        }
    };
    // if not specs available, show toast error on click
    const checkSpecOptions = e => {
        if (specOptions.length === 0) {
            const errorDetails = e.data.recipient
                ? `Formats Not Found for recipient "${e.data.recipient}"`
                : `Recipient Not Found for ${e.data.barcode}`;
            dispatch(
                addToast({
                    detail: errorDetails,
                    severity: 'error',
                })
            );
        }
    };

    const handleFieldEdit = (index, fieldPath, fieldName, newValue) => {
        const updatedRow = cloneDeep(tableData[index]);
        const updatedServices = cloneDeep(services);
        set(updatedRow, fieldName, newValue);

        if (fieldPath === 'externalServices.parameters') {
            const inx = get(updatedServices.deteServices[index], 'externalServices.parameters', {}).findIndex(
                param => param.name === fieldName
            );
            if (inx >= 0) {
                if (newValue === false) {
                    // remove parameter if value is false
                    const reducedParams = updatedServices?.deteServices[index]?.externalServices?.parameters?.filter(
                        item => item.name !== fieldName
                    );
                    set(updatedServices, `deteServices[${index}].externalServices.parameters`, reducedParams);
                } else
                    set(updatedServices, `deteServices[${index}].externalServices.parameters[${inx}]`, {
                        name: fieldName,
                        value: newValue,
                    });
            } else if (newValue !== false) {
                const addedParams = [
                    ...updatedServices?.deteServices[index]?.externalServices?.parameters,
                    {name: fieldName, value: newValue},
                ];
                set(updatedServices, `deteServices[${index}].externalServices.parameters`, addedParams);
            }
        } else {
            set(updatedServices, `deteService[${index}].${fieldPath}`, newValue);
        }

        setTableData(prev => prev.map((row, idx) => (idx === index ? updatedRow : row)));
        setServices(updatedServices);
        setUpdatedServices(updatedServices);
    };

    const colDef = columnDefinitions.map(item => {
        switch (item.colId) {
            case 'components':
                return {...item, ...componentCol};
            case 'operationalStatus':
                return {...item, ...statusCol};
            case 'spec':
                return {
                    ...item,
                    // eslint-disable-next-line react/prop-types
                    cellRendererFramework: ({rowIndex}) => {
                        const value = get(tableData[rowIndex], 'spec', '');
                        // show tooltip as the value is too long to fit in column width
                        return <span title={value}>{value}</span>;
                    },
                    cellRendererParams: tableData,
                    onCellClicked: e => !isDisabled && checkSpecOptions(e),
                };
            case 'watermark':
                return {...item, ...watermarkCol};

            default:
                return item;
        }
    });

    // set service type value to save to api based on service type
    const setOrderServiceType = serviceType => {
        return serviceType === SELECT_VALUES.serviceType ? DETE_SERVICE_TYPE : serviceType;
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
                currentService.externalServices.parameters.find(param => param.name === SOURCE_STANDARD).value =
                    data.sourceStandard;
                currentService.externalServices.parameters.find(param => param.name === 'Priority').value =
                    data.priority;

                if (!currentService?.deteTasks?.deteDeliveries?.length) {
                    currentService.deteTasks.deteDeliveries = [{deliveryMethod: SELECT_VALUES.deliveryMethod[0]}];
                } else {
                    currentService.deteTasks.deteDeliveries[0].deliveryMethod = data.deliveryMethod;
                }

                // watermark will not arrive for old orders, hence need to check
                const extParamWatermark = currentService.externalServices.parameters.find(
                    param => param.name === 'Watermark'
                );
                if (extParamWatermark) extParamWatermark.value = data.watermark;
                if (get(currentService, 'deteTasks.deteDeliveries.length', 0) !== 0)
                    currentService.deteTasks.deteDeliveries[0].externalDelivery = {
                        ...get(data, 'deteServices[0].deteTasks.deteDeliveries[0].externalDelivery', ''),
                    };
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
        const newExternalId = `${externalId}-${updatedService.length + 1}`;
        blankService.deteSources = cloneDeep(updatedService[0].deteSources);
        blankService.deteTasks = cloneDeep(updatedService[0].deteTasks);
        blankService.externalServices.externalId = newExternalId;
        blankService.externalServices.externalSystem = updatedService[0].externalServices.externalSystem;
        blankService.overrideDueDate = blankService.deteTasks.dueDate;

        blankService.deteTasks.deteDeliveries[0].externalDelivery = {};

        blankService.deteTasks.deteDeliveries[0].externalDelivery.deliverToId = recipient;
        blankService.deteTasks.deteDeliveries[0].externalDelivery.externalId = newExternalId;
        blankService.deteTasks.deteDeliveries[0].deliveryMethod = SELECT_VALUES.deliveryMethod[0];

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

    const servicesCount = get(services[`${providerServices}`], 'length', 0);
    const barcode = get(services, 'barcode', null);

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
                    {!isDisabled && <i className="po po-add" onClick={addEmptyServicesRow} />}
                </div>
            </div>

            {
                // eslint-disable-next-line react/prop-types
                tableData?.length && (
                    <ServicesTableGrid
                        defaultColDef={{...valueGetter, sortable: true, resizable: true}}
                        isMenuHidden={false}
                        columnDefs={[orderingColumn, closeButtonColumn, ...colDef]}
                        rowData={tableData}
                        domLayout="autoHeight"
                        mapping={isDisabled ? disableMappings(mappings) : mappings}
                        selectValues={{...SELECT_VALUES, spec: specOptions}}
                        onGridEvent={handleTableChange}
                        onCellMouseOver={getSpecOptions}
                        frameworkComponents={{
                            componentCellRenderer: ComponentCellRenderer,
                            checkBoxRenderer: CheckBoxRenderer,
                        }}
                    />
                )
            }
        </div>
    );
};

ServicesTable.propTypes = {
    data: PropTypes.object,
    isDisabled: PropTypes.bool,
    setUpdatedServices: PropTypes.func,
    components: PropTypes.array,
    recipientsOptions: PropTypes.object,
    externalId: PropTypes.string,
};

ServicesTable.defaultProps = {
    data: null,
    isDisabled: false,
    setUpdatedServices: () => null,
    components: [],
    recipientsOptions: {},
    externalId: '',
};

export default ServicesTable;
