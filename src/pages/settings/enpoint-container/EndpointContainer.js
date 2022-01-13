import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import {NEXUS_ENTITY_TYPES} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/constants';
import {Action} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/entity-actions/Actions.class';
import {Button} from 'primereact/button';
import {getConfigApiValues} from '../../legacy/common/CommonConfigService';
import NexusDataPanel from '../nexus-data-panel/NexusDataPanel';

const EndpointContainer = ({endpoint}) => {
    const [endpointList, setEndpointList] = useState([]);
    const [endpointsLoading, setEndpointsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(undefined);
    const [page, setPage] = useState(0);

    const loadEndpointData = (pageNo, searchField, searchValue, pageSize = 20) => {
        setEndpointsLoading(true);
        getConfigApiValues(endpoint?.urls?.['search'], pageNo, pageSize, null, searchField, searchValue).then(res => {
            setEndpointList([...endpointList, ...res.data]);
            setTotalRecords(res.total);
            setEndpointsLoading(false);
            setPage(pageNo + 1);
        });
    };

    useEffect(() => {
        setPage(0);
        setTotalRecords(0);
        setEndpointList([]);
    }, [endpoint]);

    useEffect(() => {
        if (!endpointList.length) {
            loadEndpointData(0, getSearchField(), '');
        }
    }, [endpointList]);

    const getSearchField = () => {
        const searchField =
            endpoint.displayValueFieldNames && Array.isArray(endpoint.displayValueFieldNames)
                ? endpoint.displayValueFieldNames
                : [];

        return searchField?.[0] || '';
    };

    const headerTemplate = () => {
        return (
            <div>
                <NexusEntity heading={endpoint.displayName} type={NEXUS_ENTITY_TYPES.subheader} />
            </div>
        );
    };

    const endpointListItemTemplate = entry => {
        const actions = [
            new Action({
                icon: 'pi pi-pencil',
                action: undefined,
                position: 5,
                disabled: false,
                buttonId: 'btnEditConfig',
            }),
            new Action({
                icon: 'pi pi-times',
                action: () => undefined,
                position: 6,
                disabled: false,
                buttonId: 'btnDeleteConfig',
            }),
        ];

        return (
            <div className="entry">
                <NexusEntity
                    heading={<span>{getLabel(entry)}</span>}
                    type={NEXUS_ENTITY_TYPES.default}
                    actions={actions}
                />
            </div>
        );
    };

    const getLabel = (item, noEmpty = true) => {
        const result =
            endpoint?.displayValueFieldNames &&
            Array.isArray(endpoint.displayValueFieldNames) &&
            endpoint.displayValueFieldNames.reduce((acc, curr) => {
                let result = [...acc];
                if (item[curr]) {
                    result = [...acc, item[curr]];
                }
                return result;
            }, []);
        return (
            (Array.isArray(result) && result.join(endpoint.displayValueDelimiter || ' ,')) ||
            (noEmpty && `[id = ${item.id}]`)
        );
    };

    const footer = () => (
        <div className="row mt-2">
            <div className="col-12 text-center">
                {endpointList.length < totalRecords && !!endpointList.length && (
                    <Button
                        label="Load More"
                        className="p-button-outlined"
                        onClick={() => loadEndpointData(page, getSearchField(), '')}
                    />
                )}
            </div>
        </div>
    );

    return (
        <div className="endpoint-container h-100">
            <NexusDataPanel
                header={headerTemplate()}
                loading={endpointsLoading}
                data={endpointList}
                itemTemplate={endpointListItemTemplate}
                contentFooter={footer()}
            />
        </div>
    );
};

EndpointContainer.propTypes = {
    endpoint: PropTypes.object,
};

EndpointContainer.defaultProps = {
    endpoint: undefined,
};

export default EndpointContainer;
