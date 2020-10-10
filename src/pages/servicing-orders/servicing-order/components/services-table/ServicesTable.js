import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import {cloneDeep, get, isEmpty} from 'lodash';
import {compose} from 'redux';
import mappings from '../../../../../../profile/servicesTableMappings.json';
import Add from '../../../../../assets/action-add.svg';
import {NexusGrid} from '../../../../../ui/elements';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineButtonColumn, defineColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withEditableColumns from '../../../../../ui/elements/nexus-grid/hoc/withEditableColumns';
import constants from '../fulfillment-order/constants';
import {SELECT_VALUES, SERVICE_SCHEMA} from './Constants';
import columnDefinitions from './columnDefinitions';
import './ServicesTable.scss';

const OP_STATUS_COL_INDEX = 4;

const ServicesTableGrid = compose(withEditableColumns())(NexusGrid);

const ServicesTable = ({data, isDisabled, setUpdatedServices, setIsSaved}) => {
    const [services, setServices] = useState({});
    const [originalServices, setOriginalServices] = useState({});
    const [tableData, setTableData] = useState([]);
    const [providerServices, setProviderServices] = useState('');
    const [recipientsOptions, setRecipientsOptions] = useState([]);

    useEffect(() => {
        if (!isEmpty(data)) {
            const recp = data.deteServices[0].deteTasks.deteDeliveries[0].externalDelivery.deliverToId;
            recp !== 'VU' ? setRecipientsOptions([recp, 'VU']) : setRecipientsOptions(['VU']);
            setProviderServices(`${data.fs.toLowerCase()}Services`);
            setServices(data);
            setOriginalServices(data);
        }
    }, [data]);

    useEffect(
        () => {
            if (!isEmpty(services)) {
                const flattenedObject = services[providerServices].map((service, index) => ({
                    componentId: service.externalServices.externalId,
                    spec: service.externalServices.formatType,
                    doNotStartBefore: service.overrideStartDate || '',
                    priority: service.externalServices.parameters.find(param => param.name === 'Priority').value,
                    recipient: service.deteTasks.deteDeliveries[0].externalDelivery.deliverToId || '',
                    operationalStatus: service.status,
                    rowIndex: index,
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
    const closeButtonCell = ({rowIndex}) => {
        return (
            <CustomActionsCellRenderer id={rowIndex.toString()} classname="nexus-c-services__close-icon">
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
        cellRendererParams: services && services[providerServices],
    });

    const handleRowDataChange = ({rowIndex, type, data}) => {
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED && data) {
            const updatedServices = cloneDeep(services[providerServices]);
            const currentService = updatedServices[rowIndex];
            // TODO: Super inefficient, need to find a better way
            // Re-mapping the data
            currentService.externalServices.externalId = data.componentId;
            currentService.externalServices.formatType = data.spec;
            currentService.overrideStartDate = data.doNotStartBefore || '';
            currentService.externalServices.parameters.find(param => param.name === 'Priority').value = data.priority;
            // eslint-disable-next-line max-len
            currentService.deteTasks.deteDeliveries[0].externalDelivery.deliverToId = data.recipient;
            currentService.status = data.operationalStatus;

            const newServices = {...services, [providerServices]: updatedServices};
            setServices(newServices);
            // this change is propogated up to the Servicing Order form to submit
            setUpdatedServices(newServices);
            setIsSaved(true);
        }
    };

    const addEmptyServicesRow = () => {
        const updatedService = cloneDeep(services[`${providerServices}`]);
        const blankService = cloneDeep(SERVICE_SCHEMA);
        blankService.deteSources[0].barcode = data.barcode;
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
        },
    });

    const recipientColumn = {
        headerName: 'Recipient',
        colId: 'recipient',
        field: 'recipient',
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
                defaultColDef={{valueGetter}}
                columnDefs={[
                    orderingColumn,
                    closeButtonColumn,
                    // slice column defs to put checkbox before operations status columns
                    ...columnDefinitions.slice(0, OP_STATUS_COL_INDEX),
                    recipientColumn,
                    columnDefinitions[OP_STATUS_COL_INDEX],
                ]}
                rowData={tableData}
                domLayout="autoHeight"
                onGridReady={params => params.api.sizeColumnsToFit()}
                mapping={isDisabled ? disableMappings(mappings) : mappings}
                selectValues={{...SELECT_VALUES, recipient: recipientsOptions}}
                onGridEvent={handleRowDataChange}
            />
        </div>
    );
};

ServicesTable.propTypes = {
    data: PropTypes.object,
    isDisabled: PropTypes.bool,
    setUpdatedServices: PropTypes.func,
    setIsSaved: PropTypes.func.isRequired,
};

ServicesTable.defaultProps = {
    data: null,
    isDisabled: false,
    setUpdatedServices: () => null,
};

export default ServicesTable;
