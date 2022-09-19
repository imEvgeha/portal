import React from 'react';
import PropTypes from 'prop-types';
import {isNexusTitle} from '@vubiquity-nexus/portal-utils/lib/utils';
import classnames from 'classnames';
import './NexusTenantData.scss';
import NexusField from '../../NexusField';

const NexusTenantData = ({title, sectionID}) => {
    /**
     * Process the properties and come up with a user-friendly label
     * @param externalId - the current external ID processing
     * @returns {string} - user-friendly label for display purposes
     */
    const calculateLabel = externalId => {
        switch (externalId) {
            case 'movida':
            case 'movidaTitleId':
                return 'Movida Title ID';
            case 'movidaId':
                return 'Movida ID';
            case 'movida-uk':
                return 'Movida Int Title ID';
            case 'vz':
            case 'vzTitleId':
                return 'VZ Title ID';
            case 'vzId':
                return 'VZ ID';
            default:
                return '';
        }
    };

    /**
     * Schema varies between Nexus and non-Nexus titles
     * Calculates if it's Nexus title and calls the appropriate Render method
     * @returns {*[]} Returns a JSX.Element for the given schema
     */
    const calculateExternalIds = () => {
        if (title && title.externalIds) {
            // Nexus titles
            if (isNexusTitle(title.id)) {
                return title.externalIds.map(externalId => RenderNexusTitleExternalIds(externalId));
            }
            // non-Nexus titles have different schema
            return title.externalIds.map(externalId => RenderExternalTitleIds(externalId));
        }
    };

    /**
     * Render method for Nexus Titles External IDs
     * @param externalId
     * @returns {JSX.Element}
     * @constructor
     */
    const RenderNexusTitleExternalIds = externalId => {
        return (
            <div className={classnames('nexus-c-dynamic-form__field col-lg-6 col-12')}>
                <NexusField
                    id={externalId.externalId}
                    key={`${externalId.externalId}_key`}
                    name={externalId.externalSystem}
                    sectionID={sectionID}
                    isGridLayout={true}
                    isTitlePage={true}
                    label={calculateLabel(externalId.externalSystem)}
                    type="tenantData"
                    value={externalId.externalTitleId}
                />
            </div>
        );
    };

    /**
     * Render method for non-Nexus External IDs
     * @param externalId
     * @returns {JSX.Element}
     * @constructor
     */
    const RenderExternalTitleIds = externalId => {
        return (
            <div className={classnames('nexus-c-dynamic-form__field col-lg-6 col-12')}>
                <NexusField
                    id={externalId.name}
                    key={`${externalId.name}_key`}
                    name={externalId.name}
                    sectionID={sectionID}
                    isGridLayout={true}
                    isTitlePage={true}
                    label={calculateLabel(externalId.name)}
                    type="tenantData"
                    value={externalId.value}
                />
            </div>
        );
    };

    return <>{calculateExternalIds()}</>;
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
