import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ActionCrossCircle from '@vubiquity-nexus/portal-assets/action-cross-circle.svg';
import IconActionAdd from '@vubiquity-nexus/portal-assets/icon-action-add.svg';
import IconActionEdit from '@vubiquity-nexus/portal-assets/icon-action-edit.svg';
import NexusConfirmationDialog from '@vubiquity-nexus/portal-ui/lib/elements/nexus-confirmation-dialog/NexusConfirmationDialog';
import NexusDataPanel from '@vubiquity-nexus/portal-ui/lib/elements/nexus-data-panel/NexusDataPanel';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import {NEXUS_ENTITY_TYPES} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/constants';
import {Action} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/entity-actions/Actions.class';
import {SUCCESS_ICON} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/toastActions';
import {useDebounce} from '@vubiquity-nexus/portal-utils/lib/useDebounce';
import {capitalize, cloneDeep} from 'lodash';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {useDispatch} from 'react-redux';
import {showToastForErrors} from '../../../util/http-client/handleError';
import {getConfigApiValues} from '../../legacy/common/CommonConfigService';
import {configService} from '../../legacy/containers/config/service/ConfigService';
import CreateEditConfig from '../create-edit-config/CreateEditConfig';
import './EndpointContainer.scss';

export const cache = {};

const EndpointContainer = ({endpoint}) => {
    const dispatch = useDispatch();
    const [endpointList, setEndpointList] = useState([]);
    const [endpointsLoading, setEndpointsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(undefined);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState();
    const [showEditConfigModal, setShowEditConfigModal] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState(undefined);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(undefined);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const loadEndpointData = (pageNo, searchField, searchValue, pageSize = 20) => {
        setEndpointsLoading(true);
        getConfigApiValues(endpoint?.urls?.['search'], pageNo, pageSize, null, searchField, searchValue).then(res => {
            setEndpointList([...endpointList, ...res.data]);
            setTotalRecords(res.total);
            setEndpointsLoading(false);
            setPage(pageNo + 1);
        });
    };

    const initValues = () => {
        setPage(0);
        setTotalRecords(0);
        !!endpointList.length && setEndpointList([]);
    };

    useEffect(() => {
        setSearchTerm('');
        initValues();
        !endpointList.length && loadEndpointData(0, getSearchField(), '');
    }, [endpoint]);

    useEffect(() => {
        if (!endpointList.length && !searchTerm && !!getSearchField()) {
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
                {searchPanel()}
            </div>
        );
    };

    const searchTermDebounce = useDebounce(() => loadEndpointData(page, getSearchField(), searchTerm), 500);

    useEffect(() => (searchTerm ? searchTermDebounce : initValues()), [searchTerm]);

    const onSearchTermChanged = e => {
        initValues();
        setSearchTerm(e.target.value);
    };

    const searchPanel = () => {
        return (
            <div
                className={`nexus-c-searchbox-wrapper container-fluid ${
                    canLoadMore() ? '' : 'nexus-c-search-wrapper-padding-right'
                }`}
            >
                <div className="row my-2 align-items-center">
                    <div className="col-10">
                        <InputText
                            className="nexus-c-search__inputbox"
                            key="config_search_field"
                            id="config_search_field__inp"
                            name="config_search_field__inp"
                            value={searchTerm}
                            onChange={onSearchTermChanged}
                        />
                    </div>
                    <div className="col-2 text-end">
                        <Button
                            key="add_new_config"
                            id="add_new_config__btn"
                            icon={IconActionAdd}
                            onClick={() => {
                                setSelectedConfig({});
                                setShowEditConfigModal(true);
                            }}
                            className="p-button-text"
                        />
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        entryToDelete && setDeleteDialogVisible(true);
    }, [entryToDelete]);

    const confirmDeletion = entry => setEntryToDelete(entry);

    const onCloseConfirmDialog = () => {
        setDeleteDialogVisible(false);
        setEntryToDelete(undefined);
    };

    const removeConfig = entry => {
        onCloseConfirmDialog();

        const successToast = {
            title: 'DELETED',
            icon: SUCCESS_ICON,
            isAutoDismiss: true,
            description: `${capitalize(entry.name)} config for ${endpoint.displayName} has been successfully deleted!`,
        };

        configService
            .delete(endpoint?.urls?.['CRUD'], entry.id)
            .then(() => {
                searchTerm ? searchTermDebounce() : initValues();
                dispatch(addToast(successToast));
            })
            .catch(error => {
                showToastForErrors(error, {
                    errorToast: {
                        title: 'DELETED',
                    },
                });
            });
    };

    const endpointListItemTemplate = entry => {
        const actions = [
            new Action({
                icon: IconActionEdit,
                action: () => {
                    setSelectedConfig(entry);
                    setShowEditConfigModal(true);
                },
                position: 5,
                disabled: false,
                buttonId: 'btnEditConfig',
            }),
            new Action({
                icon: ActionCrossCircle,
                action: () => confirmDeletion(entry),
                position: 6,
                disabled: false,
                buttonId: 'btnDeleteConfig',
            }),
        ];

        return (
            <div className="nexus-c-endpoint-entry" key={`item_${entry.id}`}>
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
            (noEmpty && `[id = ${item.id}]`) ||
            ''
        );
    };

    const canLoadMore = () => endpointList.length < totalRecords && !!endpointList.length;

    const footer = () => (
        <div className="row mt-2">
            <div className="col-12 text-center">
                {canLoadMore() && (
                    <Button
                        label="Load More"
                        className="p-button-outlined"
                        onClick={() => loadEndpointData(page, getSearchField(), searchTerm)}
                    />
                )}
            </div>
        </div>
    );

    const onHideCreateEditConfigModal = () => {
        setSelectedConfig(undefined);
        setShowEditConfigModal(false);
    };

    const editRecord = val => {
        const newVal = {...selectedConfig, ...val};
        const successToast = {
            title: 'Success',
            icon: SUCCESS_ICON,
            isAutoDismiss: true,
            description: `${capitalize(newVal.name)} config for ${endpoint.displayName} successfully ${
                newVal.id ? 'updated.' : 'added.'
            }`,
        };

        setSubmitLoading(true);
        if (newVal.id) {
            configService.update(endpoint?.urls['CRUD'], newVal.id, newVal).then(
                response => {
                    dispatch(addToast(successToast));
                    const data = endpointList.slice(0);
                    const index = data.findIndex(item => item.id === newVal.id);
                    data[index] = response;
                    setEndpointList(data);
                    setSelectedConfig(undefined);
                    setShowEditConfigModal(false);
                    setSubmitLoading(false);
                },
                () => {
                    setSubmitLoading(false);
                }
            );
        } else {
            configService.create(endpoint?.urls['CRUD'], newVal).then(
                response => {
                    dispatch(addToast(successToast));
                    const data = endpointList.slice(0);
                    data.unshift(response);
                    if (cache[endpoint.urls['CRUD']]) {
                        cache[endpoint.urls['CRUD']] = data;
                    }
                    setEndpointList(data);
                    setTotalRecords(totalRecords + 1);
                    setSelectedConfig(undefined);
                    setShowEditConfigModal(false);
                    setSubmitLoading(false);
                },
                () => {
                    setSubmitLoading(false);
                }
            );
        }
    };

    return (
        <div className="nexus-c-endpoint-container h-100">
            <NexusDataPanel
                header={headerTemplate()}
                loading={endpointsLoading}
                data={endpointList}
                itemTemplate={endpointListItemTemplate}
                contentFooter={footer()}
            />

            {showEditConfigModal && (
                <CreateEditConfig
                    visible={showEditConfigModal}
                    schema={endpoint?.uiSchema}
                    label={selectedConfig ? getLabel(selectedConfig, false) : ''}
                    displayName={endpoint?.displayName}
                    values={cloneDeep(selectedConfig)}
                    onSubmit={editRecord}
                    onHide={onHideCreateEditConfigModal}
                    submitLoading={submitLoading}
                />
            )}

            {deleteDialogVisible && (
                <NexusConfirmationDialog
                    visible={deleteDialogVisible}
                    header="Delete"
                    message={`Would you like to delete ${entryToDelete ? getLabel(entryToDelete) : ''}?`}
                    accept={() => removeConfig(entryToDelete)}
                    reject={onCloseConfirmDialog}
                    rejectLabel="Cancel"
                    acceptLabel="Delete"
                />
            )}
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
