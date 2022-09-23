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
    const calculateLabelForTitleIDs = externalId => {
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

    const calculateLabelForIDs = externalId => {
        switch (externalId) {
            case 'movida':
            case 'movidaTitleId':
            case 'movidaId':
                return 'Movida ID';
            case 'movida-uk':
                return 'Movida Int ID';
            case 'vz':
            case 'vzId':
            case 'vzTitleId':
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
        if (title && title?.systemExternalIds) {
            // Nexus titles
            if (isNexusTitle(title.id)) {
                return title.systemExternalIds.map(externalId => RenderNexusTitleExternalIds(externalId));
            }
            // non-Nexus titles have different schema
            return title.systemExternalIds.map(externalId => RenderExternalTitleIds(externalId));
        }
    };

    /**
     * Render method for Nexus Titles External IDs
     * Renders two NexusFields for TitleID(number) and ID of title(string)
     * @param externalId
     * @returns {JSX.Element}
     * @constructor
     */
    const RenderNexusTitleExternalIds = externalId => {
        return (
            <>
                {/* Show the ID as a number */}
                <div className={classnames('nexus-c-dynamic-form__field col-lg-6 col-12')}>
                    <NexusField
                        id={externalId.externalId}
                        key={`${externalId.externalId}_key`}
                        name={externalId.externalSystem}
                        sectionID={sectionID}
                        isGridLayout={true}
                        isTitlePage={true}
                        label={calculateLabelForTitleIDs(externalId.externalSystem)}
                        type="tenantData"
                        value={externalId.externalTitleId}
                    />
                </div>
                {/* Show Also the IDs - titl_ascd_123 */}
                <div className={classnames('nexus-c-dynamic-form__field col-lg-6 col-12')}>
                    <NexusField
                        id={externalId.externalId}
                        key={`${externalId.externalId}_key_${externalId.titleId}`}
                        name={externalId.externalSystem}
                        sectionID={sectionID}
                        isGridLayout={true}
                        isTitlePage={true}
                        label={calculateLabelForIDs(externalId.externalSystem)}
                        type="tenantData"
                        value={externalId.titleId}
                    />
                </div>
            </>
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
                    label={calculateLabelForTitleIDs(externalId.name)}
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
