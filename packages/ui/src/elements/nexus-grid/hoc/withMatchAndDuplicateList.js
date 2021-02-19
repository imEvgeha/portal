import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getRepositoryName, TitleSystems} from '@vubiquity-nexus/portal-utils/lib/utils';
import {PINNED_COLUMN_DEF} from '../constants';

const withMatchAndDuplicateList = (isNexusDisabled = false) => WrappedComponent => {
    const ComposedComponent = ({onCandidatesChange, ...rest}) => {
        const [matchList, setMatchList] = useState({});
        const [duplicateList, setDuplicateList] = useState({});

        // inform parent component about match, duplicate list change
        useEffect(() => {
            onCandidatesChange({matchList, duplicateList});
        }, [matchList, duplicateList, onCandidatesChange]);

        const matchButton = {
            ...PINNED_COLUMN_DEF,
            colId: 'matchButton',
            field: 'matchButton',
            headerName: 'Master',
            cellRendererParams: {isNexusDisabled, selectionType: 'radio'},
            cellRenderer: 'titleSelectionRenderer',
            editable: true,
        };
        const duplicateButton = {
            ...PINNED_COLUMN_DEF,
            colId: 'duplicateButton',
            field: 'duplicateButton',
            headerName: 'Duplicate',
            cellRendererParams: {isNexusDisabled},
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
            let nodeFound = {};
            const {NEXUS, MOVIDA, VZ} = TitleSystems;
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
                        nodeFound = api.getRowNode(matchList[repo].id);
                        nodeFound && nodeFound.setDataValue('matchButton', false);
                    }
                    newMatchList[repo] = data;
                    if (repo === NEXUS) {
                        [MOVIDA, VZ].forEach(r => {
                            if (matchList[r]) {
                                delete newMatchList[r];
                                nodeFound = api.getRowNode(matchList[r].id);
                                nodeFound && nodeFound.setDataValue('matchButton', false);
                            }
                        });
                    } else if (matchList[NEXUS]) {
                        delete newMatchList[NEXUS];
                        nodeFound = api.getRowNode(matchList[NEXUS].id);
                        nodeFound && nodeFound.setDataValue('matchButton', false);
                    }
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
                selectedItems={[...Object.values(matchList), ...Object.values(duplicateList)]}
                matchList={matchList}
                duplicateList={duplicateList}
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
