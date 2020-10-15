import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './ActionCellRenderer.scss';
import CustomActionsCellRenderer from '../../../../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {NexusTooltip} from '../../../../../../../../ui/elements/';
import {storeTitle} from '../../../../../../../metadata/metadataActions';
import {getRepositoryName} from '../../../../../../../avails/utils';
import TitleSystems from '../../../../../../constants/metadata/systems';

const ActionCellRenderer = ({data, storeTitle}) => {
    const [isMovidaOrVz, setIsMovidaOrVz] = useState(false);

    useEffect(() => {
        const {id = ''} = data || {};
        setIsMovidaOrVz(getRepositoryName(id) === TitleSystems.MOVIDA || getRepositoryName(id) === TitleSystems.VZ);
    }, [data]);

    return (
        <CustomActionsCellRenderer id={`action-${data && data.id}`}>
            {isMovidaOrVz && (
                <NexusTooltip content="Legacy title reconciliation">
                    <div>
                        <a
                            className="nexus-c-metadata-table-action"
                            href={`/metadata/detail/${data && data.id}/legacy-title-reconciliation`}
                            onClick={() => storeTitle(data)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Inspect
                        </a>
                    </div>
                </NexusTooltip>
            )}
        </CustomActionsCellRenderer>
    );
};

ActionCellRenderer.propTypes = {
    storeTitle: PropTypes.func.isRequired,
    data: PropTypes.object,
};

ActionCellRenderer.defaultProps = {
    data: {},
};

const mapDispatchToProps = dispatch => ({
    storeTitle: payload => dispatch(storeTitle(payload)),
});

export default connect(null, mapDispatchToProps)(ActionCellRenderer);
