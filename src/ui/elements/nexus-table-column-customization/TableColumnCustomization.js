import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@atlaskit/checkbox';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import './TableColumnCustomization.scss';

const SELECT_ALL = 'selectAll';
const SELECT_ALL_DISPLAY_NAME = 'Select All';

const TableColumnCustomization = ({availsMapping, columns, updateColumnsOrder}) => {
    const [hideShowColumns, setHideShowColumns] = useState();
    const {openModal, closeModal} = useContext(NexusModalContext);

    useEffect(() => {
        if (hideShowColumns) {
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
            openModal(buildModalContent(hideShowColumns), {title: 'Select Visible Columns', width: 'small', actions});
        }
    }, [hideShowColumns]);

    const createConfigForColumnCustomization = () => {
        const config = {};
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
    };

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

    const toggleColumn = id => {
        const newHideShowColumns = {...hideShowColumns};
        newHideShowColumns[id].checked = !newHideShowColumns[id].checked;
        newHideShowColumns[SELECT_ALL].checked = isAllSelected(newHideShowColumns);
        setHideShowColumns(newHideShowColumns);
    };

    const toggleSelectAll = selectAllKey => {
        const newHideShowColumns = {...hideShowColumns};
        const newValue = !newHideShowColumns[selectAllKey].checked;
        newHideShowColumns[selectAllKey].checked = newValue;

        availsMapping.mappings
            .filter(({dataType}) => dataType)
            .forEach(column => {
                if (column.javaVariableName === 'title') {
                    return '';
                }
                newHideShowColumns[column.javaVariableName].checked = newValue;
            });
        setHideShowColumns(newHideShowColumns);
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

    const buildModalContent = config => {
        const options = [buildCheckBox(SELECT_ALL, toggleSelectAll)];
        for (const key in config) {
            if (key === SELECT_ALL) {
                continue;
            }
            options.push(buildCheckBox(key, toggleColumn));
        }

        return <div> {options} </div>;
    };

    let buildCheckBox = (key, onChange) => {
        const data = hideShowColumns[key];
        return (
            <Checkbox
                key={key}
                id={data.id}
                name={data.id}
                label={data.label}
                onChange={() => onChange(key)}
                isChecked={data.checked}
            />
        );
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
