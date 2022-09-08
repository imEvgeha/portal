import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {get, isUndefined} from 'lodash';
import './NexusTenantData.scss';
import NexusField from '../../NexusField';

const NexusTenantData = ({title, sectionID}) => {
    // // eslint-disable-next-line no-console
    // console.log(title);

    const externalIdProperties = ['vzExternalIds', 'movidaExternalIds', 'movidaUkExternalIds'];

    const calculateLabel = externalId => {
        switch (externalId) {
            case 'movidaExternalIds':
                return 'Movida External ID';
            case 'movidaUkExternalIds':
                return 'Movida UK External ID';
            case 'vzExternalIds':
                return 'VZ External IDs';
            default:
                return '';
        }
    };

    const calculateValue = externalId => {
        return title[externalId].externalTitleId;
    };

    return (
        <>
            {externalIdProperties.map(externalId => {
                // check if external id is added as a property to the title object
                if (get(title, externalId) && !isUndefined(get(title, externalId))) {
                    return (
                        <div className={classnames('nexus-c-dynamic-form__field')}>
                            <NexusField
                                id={title.id}
                                key={`${title.id}_key`}
                                name={externalId}
                                sectionID={sectionID}
                                isGridLayout={true}
                                isTitlePage={true}
                                label={calculateLabel(externalId)}
                                type="tenantData"
                                value={calculateValue(externalId)}
                            />
                        </div>
                    );
                }
            })}
        </>
    );
};

NexusTenantData.propTypes = {
    title: PropTypes.object,
    sectionID: PropTypes.string,
};

NexusTenantData.defaultProps = {
    title: {},
    sectionID: '',
};

export default NexusTenantData;
