import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getRepositoryName} from '@vubiquity-nexus/portal-utils/lib/utils';
import {PINNED_COLUMN_DEF} from '../constants';

const withMatchAndDuplicateList = () => WrappedComponent => {
    const ComposedComponent = ({onCandidatesChange, ...rest}) => {
        const [selectedItems, setSelectedItems] = useState([]);
        const [matchList, setMatchList] = useState({});
        const [duplicateList, setDuplicateList] = useState({});

        // inform parent component about match, duplicate list change
        useEffect(() => {
            onCandidatesChange({matchList, duplicateList});
            setSelectedItems([...Object.values(matchList), ...Object.values(duplicateList)]);
        }, [matchList, duplicateList, onCandidatesChange]);

        const matchButton = {
            ...PINNED_COLUMN_DEF,
            colId: 'matchButton',
            field: 'matchButton',
            headerName: 'Master',
            cellRendererParams: {isNexusDisabled: true, selectionType: 'radio'},
            cellRenderer: 'titleSelectionRenderer',
            editable: true,
        };
        const duplicateButton = {
            ...PINNED_COLUMN_DEF,
            colId: 'duplicateButton',
            field: 'duplicateButton',
            headerName: 'Duplicate',
            cellRendererParams: {isNexusDisabled: true},
            cellRenderer: 'titleSelectionRenderer',
            editable: true,
        };

        const onCellValueChanged = (params = {}) => {
            const {
                newValue,
                data: {id},
                data = {},
                node,
                column,
                api,
            } = params;
            const repo = getRepositoryName(id);
            if (column.colId === 'duplicateButton') {
                const newList = {...duplicateList};
                if (newValue) {
                    if (matchList[repo] && matchList[repo].id === id) {
                        node.setDataValue('duplicateButton', false);
                    } else {
                        newList[id] = data;
                    }
                } else {
                    delete newList[id];
                }
                setDuplicateList(newList);
            } else if (column.colId === 'matchButton') {
                if (newValue) {
                    const newMatchList = {...matchList};
                    if (matchList[repo]) {
                        api.getRowNode(matchList[repo].id).setDataValue('matchButton', false);
                    }
                    newMatchList[repo] = data;
                    setMatchList(newMatchList);
                }
            }
        };
        return (
            <WrappedComponent
                {...rest}
                onCellValueChanged={onCellValueChanged}
                matchButton={matchButton}
                duplicateButton={duplicateButton}
                selectedItems={selectedItems}
            />
        );
    };
    ComposedComponent.propTypes = {
        onCandidatesChange: PropTypes.func,
    };
    ComposedComponent.defaultProps = {
        onCandidatesChange: () => null,
    };
    return ComposedComponent;
};

export default withMatchAndDuplicateList;
