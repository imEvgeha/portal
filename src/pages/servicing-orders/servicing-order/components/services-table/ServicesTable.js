import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import {cloneDeep, get, isEmpty} from 'lodash';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import mappings from '../../../../../../profile/servicesTableMappings';
import Add from '../../../../../assets/action-add.svg';
import {NexusGrid} from '../../../../../ui/elements';
import {Checkbox} from '@atlaskit/checkbox';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineButtonColumn, defineColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withEditableColumns from '../../../../../ui/elements/nexus-grid/hoc/withEditableColumns';
import constants from '../fulfillment-order/constants';
import columnDefinitions from './columnDefinitions';
import {SELECT_VALUES, SERVICE_SCHEMA} from './Constants';
import './ServicesTable.scss';

const ServicesTableGrid = compose(withEditableColumns())(NexusGrid);

const ServicesTable = ({data, isDisabled, setUpdatedServices}) => {
    const [services, setServices] = useState({});
    const [originalServices, setOriginalServices] = useState({});
    const [tableData, setTableData] = useState([]);
    const [providerServices, setProviderServices] = useState('');

    useEffect(
        () => {
            if (!isEmpty(data)) {
                setProviderServices(`${data.fs.toLowerCase()}Services`);
                setServices(data);
                setOriginalServices(data);
            }
        },
        [data]
    );

    useEffect(
        () => {
            if (!isEmpty(services)) {
                const flattenedObject = services[providerServices].map((service, index) => ({
                    componentId: service.externalServices.externalId,
                    spec: service.externalServices.formatType,
                    doNotStartBefore: service.overrideDueDate,
                    priority: service.externalServices.parameters.find(param => param.name === 'Priority').value,
                    deliverToVu: service.deteTasks.deteDeliveries.externalDelivery.deliverToId.toLowerCase() === 'vu',
                    operationalStatus: service.status,
                    rowIndex: index
                }));
                setTableData(flattenedObject);
            }
        },
        [services]
    );

    const handleServiceRemoval = index => {
        const updatedService = cloneDeep(services[`${providerServices}`]);
        updatedService.splice(index, 1);
        const newServices = {...services, [`${providerServices}`]: updatedService};
        setServices(newServices);
        setUpdatedServices(newServices);
    };

    const closeButtonCell = ({rowIndex}) => {
        return (
            <CustomActionsCellRenderer id={1} classname="nexus-c-services__close-icon">
                {!isDisabled && (
                    <span onClick={() => handleServiceRemoval(rowIndex)}>
                        <EditorCloseIcon />
                    </span>
                )}
            </CustomActionsCellRenderer>
        );
    };

    const closeButtonColumn = defineButtonColumn({
        cellRendererFramework: closeButtonCell,
        cellRendererParams: services && services[providerServices]
    });

    const handleRowDataChange = ({rowIndex, type, data}) => {
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED && data) {
            const updatedServices = cloneDeep(services[providerServices]);
            const currentService = updatedServices[rowIndex];
            // TODO: Super inefficient, need to find a better way
            // Re-mapping the data
            currentService.externalServices.externalId = data.componentId;
            currentService.externalServices.formatType = data.spec;
            currentService.overrideDueDate = data.doNotStartBefore;
            currentService.externalServices.parameters.find(param => param.name === 'Priority').value = data.priority;
            currentService.deteTasks.deteDeliveries.externalDelivery.deliverToId = setDeliverToId(data.deliverToVu, rowIndex);
            currentService.status = data.operationalStatus;

            const newServices = {...services, [providerServices]: updatedServices};

            setServices(newServices);
            // this change is propogated up to the Servicing Order form to submit
            setUpdatedServices(newServices);
        }
    };

    const setDeliverToId = (deliverToVu, index) => {
        const deliverToId = get(originalServices, [providerServices, index, 'deteTasks', 'deteDeliveries', 'externalDelivery', 'deliverToId'], '');
        if (deliverToVu) {
            return 'VU';
        } else {
            // Set deliverToId to previous value, if none set to ''
            return deliverToId && deliverToId.toLowerCase() !== 'vu' ? deliverToId : '';
        }
    };

    const addEmptyServicesRow = () => {
        const updatedService = cloneDeep(services[`${providerServices}`]);
        const blankService = cloneDeep(SERVICE_SCHEMA);
        blankService.deteSources.barcode = data.barcode;
        updatedService.push(blankService);
        const newServices = {...services, [`${providerServices}`]: updatedService};
        setServices(newServices);
        setUpdatedServices(newServices);
    };

    const orderingColumn = defineColumn({
        headerName: '#',
        width: 40,
        colId: 'serviceId',
        field: 'serviceId',
        cellRendererFramework: data => {
            return data ? data.rowIndex + 1 : null;
        }
    });

    // Checkbox
    const checkboxColumn = {
        headerName: 'Deliver to VU',
        colId: 'deliverToVu',
        field: 'deliverToVu',
        cellRendererFramework: ({data}) => {
            return (
                <div className="nexus-c-services-table__checkbox">
                    <Checkbox isChecked={data.deliverToVu} value="" onChange={() => onCheckboxChange(data)} />
                </div>
            );
        }
    };

    const onCheckboxChange = (data) => {
        const newData = cloneDeep(data);
        newData.deliverToVu = !newData.deliverToVu;
        handleRowDataChange({rowIndex: newData.rowIndex, type: GRID_EVENTS.CELL_VALUE_CHANGED, data: newData});
    };

    const servicesCount = services[`${providerServices}`] ? services[`${providerServices}`].length : 0;
    const barcode = services.barcode || null;

    const valueGetter = params => {
        return get(params.data, params.colDef.dataSource || params.colDef.field, '');
    };

    const disableMappings = () => {
        return cloneDeep(mappings).map(mapping => ({
            ...mapping,
            readOnly: true,
            enableEdit: false
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
                defaultColDef={{valueGetter}}
                columnDefs={[
                    orderingColumn,
                    closeButtonColumn,
                    ...columnDefinitions.slice(0,4),
                    checkboxColumn,
                    columnDefinitions[4]
                ]}
                rowData={tableData}
                domLayout="autoHeight"
                onGridReady={params => params.api.sizeColumnsToFit()}
                mapping={isDisabled ? disableMappings(mappings) : mappings}
                selectValues={SELECT_VALUES}
                onGridEvent={handleRowDataChange}
            />
        </div>
    );
};

ServicesTable.propTypes = {
    data: PropTypes.object,
    isDisabled: PropTypes.bool,
    setUpdatedServices: PropTypes.func
};

ServicesTable.defaultProps = {
    data: null,
    isDisabled: false,
    setUpdatedServices: () => null
};

export default ServicesTable;
