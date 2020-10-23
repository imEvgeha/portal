import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import './TableColumnCustomization.scss';
import ColumnCustomizationModal from './ColumnCustomizationModal';

const SELECT_ALL = 'selectAll';
const SELECT_ALL_DISPLAY_NAME = 'Select All';

const TableColumnCustomization = ({availsMapping, columns, updateColumnsOrder}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);
    const [hideShowColumns, setHideShowColumns] = useState();

    const isAllSelected = config => {
        let allSelected = true;
        for (const key in config) {
            if (key === SELECT_ALL) {
                continue;
            }
            allSelected = allSelected && config[key].checked;
        }
        return allSelected;
    };
    useEffect(() => {
        if (availsMapping && columns) {
            const config = {};
            availsMapping &&
                availsMapping.mappings
                    .filter(({dataType}) => dataType)
                    .forEach(column => {
                        if (column.javaVariableName === 'title') {
                            return '';
                        }
                        const checked = columns.indexOf(column.javaVariableName) > -1;

                        config[column.javaVariableName] = {
                            id: column.id,
                            label: column.displayName,
                            checked,
                        };
                    });

            config[SELECT_ALL] = {
                label: SELECT_ALL_DISPLAY_NAME,
                checked: isAllSelected(config),
            };
            setHideShowColumns(config);
        }
    }, [availsMapping, columns]);

    const createConfigForColumnCustomization = () => {
        const actions = [
            {
                text: 'Save',
                onClick: () => {
                    closeModal();
                    saveColumns();
                },
            },
            {
                text: 'Cancel',
                onClick: closeModal,
            },
        ];
        openModal(
            <ColumnCustomizationModal
                importHideShowColumns={setHideShowColumns}
                availsMapping={availsMapping}
                close={closeModal}
                config={hideShowColumns}
            />,
            {
                title: 'Select Visible Columns',
                width: 'small',
                actions,
            }
        );
    };

    const saveColumns = () => {
        const cols = columns.slice();
        // remove all hidden columns
        Object.keys(hideShowColumns).forEach(key => {
            if (hideShowColumns[key].checked === false) {
                const position = cols.indexOf(key);
                if (position > -1) {
                    cols.splice(position, 1);
                }
            }
        });
        // add new visible columns
        Object.keys(hideShowColumns).forEach(key => {
            if (hideShowColumns[key].checked === true) {
                const position = cols.indexOf(key);
                if (position === -1) {
                    cols.push(key);
                }
            }
        });

        updateColumnsOrder(cols);
    };

    const buildConfigAndOpenModal = () => {
        createConfigForColumnCustomization();
    };

    return (
        <div className="nexus-column-customization__icon-button" onClick={buildConfigAndOpenModal}>
            <AppSwitcherIcon size="large" />
        </div>
    );
};

export default TableColumnCustomization;

TableColumnCustomization.propTypes = {
    availsMapping: PropTypes.object,
    columns: PropTypes.array,
    updateColumnsOrder: PropTypes.func,
};

TableColumnCustomization.defaultProps = {
    availsMapping: {},
    columns: [],
    updateColumnsOrder: null,
};
