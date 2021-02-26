import React, {useContext, useEffect, useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import Tag from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import Add from '@vubiquity-nexus/portal-assets/action-add.svg';
import {GRID_EVENTS} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {
    defineButtonColumn,
    defineColumn,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/elements/columnDefinitions';
import withEditableColumns from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withEditableColumns';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import StatusTag from '@vubiquity-nexus/portal-ui/lib/elements/nexus-status-tag/StatusTag';
import {cloneDeep, flattenDeep, get, isEmpty, groupBy, set} from 'lodash';
import {compose} from 'redux';
import mappings from '../../../../../../profile/servicesTableMappings.json';
import {NexusGrid} from '../../../../../ui/elements';
import {showToastForErrors} from '../../../../../util/http-client/handleError';
import constants from '../fulfillment-order/constants';
import {SELECT_VALUES, SERVICE_SCHEMA, CLICK_FOR_SELECTION, NO_SELECTION} from './Constants';
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

    // recipient is fixed for a fullfillment order. should be same for all service rows, take from first row
    const recipient = get(data, 'deteServices[0].deteTasks.deteDeliveries[0].externalDelivery.deliverToId', '');

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


    useEffect(() => {
        if (!isEmpty(data)) {
            data.fs && setProviderServices(`${data.fs.toLowerCase()}Services`);
            setServices(data);
        }
    }, [data]);

    useEffect(
        () => {
            if (!isEmpty(services)) {
                const flattenedObject = cloneDeep(services)[providerServices].map((service, index) => ({
                    serviceType:
                        service.externalServices.serviceType === 'DETE Recipient'
                            ? SELECT_VALUES.serviceType[0]
                            : service.externalServices.serviceType,
                    assetType: service.externalServices.assetType || '',
                    components: service.details || [],
                    spec: service.externalServices.formatType,
                    doNotStartBefore: service.overrideStartDate || '',
                    priority: service.externalServices.parameters.find(param => param.name === 'Priority').value,
                    watermark: get(service,'externalServices.parameters',{}).find(param => param.name === 'Watermark')?.value??false,
                    recipient,
                    operationalStatus: service.foiStatus || '',
                    rowIndex: index,
                    rowHeight: 50,
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
    const ComponentCellRenderer = ({node, rowIndex, tableData ,data, deteComponents,services}) => {
        let toolTipContent = '';
        if (!isDisabled) {
            if (!['Audio', 'Subtitles', 'Closed Captioning'].includes(get(node,'data.assetType'))) {
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

        const handleComponentsEdit = (index,  components) => {
            const newRow = cloneDeep(tableData[index]);
            const update = cloneDeep(services);
            const serviceWithComponents = flattenDeep(Object.values(components)).map(item => {
                return {...item, typeAttribute: get(node,'data.assetType') === 'Audio' ? 'audioDetail' : 'textDetail'};
            });

            update.deteServices[index].details = serviceWithComponents.map(item => {
                delete item['isChecked'];
                return item;
            });
            newRow.components = update.deteServices[index].details;
            setTableData(prev => prev.map((row, idx) => (idx === index ? newRow: row)));
            setUpdatedServices(update);
        };

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
                                          assetType: get(node,'data.assetType'),
                                          barcode: data.barcode,
                                          title,
                                          compSummary: get(node,'data.components',[]),
                                          componentArray: getComponentsForPicker(get(node,'data.assetType')),
                                      }}
                                      closeModal={closeModal}
                                      saveComponentData={handleComponentsEdit}
                                      index={rowIndex}
                                  />,
                                  {
                                      width: get(node,'data.assetType') === 'Audio' ? 'x-large' : 'large',
                                  }
                              );
                    }}
                >
                    {
                        Object.keys(
                            groupBy(get(node,'data.components',[]), v => [v.language, v.trackConfig || v.type])
                        ).map(item => <Tag key={item} text={item} />)}
                </div>
            </Tooltip>
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

    // eslint-disable-next-line react/prop-types

    const watermarkCol = {
        sortable: false,
        // eslint-disable-next-line react/prop-types
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: ({rowIndex, node}) =>
            ({
                rowIndex,
                node,
                toggleCheck: ()=>handleFieldEdit(rowIndex,'externalServices.parameters','Watermark',!get(tableData[rowIndex], 'watermark')),
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
            showToastForErrors(null, {
                errorToast: {
                    title: 'Formats Not Found',
                    description: `Formats Not Found for recipient "${e.data.recipient}"`,
                },
            });
        }
    };

    const handleFieldEdit = (index,fieldPath, fieldName,newValue) => {
        const newRow = cloneDeep(tableData[index]);
        const update = cloneDeep(services);
        set(newRow,fieldName,newValue);
        if(fieldPath === 'externalServices.parameters') {
            const inx = get(update.deteServices[index],'externalServices.parameters',{}).findIndex(param => param.name === fieldName);
            if(inx >= 0) {
                set(update,`deteServices[${index}].externalServices.parameters[${inx}]`,{name: fieldName, value: newValue}) ;
            }
            else
                update.deteServices[index].externalServices.parameters = [...update.deteServices[index].externalServices.parameters, {name: fieldName, value: newValue}]
        }
        else
            set(update,`deteService[${index}].${fieldPath}`,newValue);
        setTableData(prev => prev.map((row, idx) => (idx === index ? newRow: row)));
        setServices(update);
        setUpdatedServices(update);
    }

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
                    onCellClicked: e => !isDisabled && checkSpecOptions(e),
                };
            case 'watermark':
                return {...item, ...watermarkCol}

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
                currentService.externalServices.parameters.find(param => param.name === 'Watermark').value =
                    data.watermark;
                if (get(currentService, 'deteTasks.deteDeliveries.length', 0) !== 0)
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
        const newExternalId = `${externalId}-${updatedService.length + 1}`;
        blankService.deteSources = cloneDeep(updatedService[0].deteSources);
        blankService.deteTasks = cloneDeep(updatedService[0].deteTasks);
        blankService.externalServices.externalId = newExternalId;
        blankService.externalServices.externalSystem = updatedService[0].externalServices.externalSystem;
        blankService.overrideDueDate = blankService.deteTasks.dueDate;
        blankService.deteTasks.deteDeliveries[0].externalDelivery.deliverToId = recipient;
        blankService.deteTasks.deteDeliveries[0].externalDelivery.externalId = newExternalId;
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

    const servicesCount = get(services[`${providerServices}`],'length',0);
    const barcode = get(services,'barcode', null);

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
                selectValues={{...SELECT_VALUES, spec: specOptions}}
                onGridEvent={handleTableChange}
                onCellMouseOver={getSpecOptions}
                frameworkComponents={
                    {
                        'componentCellRenderer': ComponentCellRenderer,
                        'checkBoxRenderer': CheckBoxRenderer,
                    }
                }
            />
        </div>
    );
};

ServicesTable.propTypes = {
    data: PropTypes.object,
    isDisabled: PropTypes.bool,
    setUpdatedServices: PropTypes.func,
    components: PropTypes.array,
    recipientsOptions: PropTypes.object,
    externalId: PropTypes.string.isRequired,
};

ServicesTable.defaultProps = {
    data: null,
    isDisabled: false,
    setUpdatedServices: () => null,
    components: [],
    recipientsOptions: {},
};

export default ServicesTable;
