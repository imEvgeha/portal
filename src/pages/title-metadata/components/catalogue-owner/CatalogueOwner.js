import React from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import {CATALOGUE_OWNER_OPTIONS, CATALOGUE_OWNER_DROPDOWN_PLACEHOLDER} from '../../constants';
import './CatalogueOwner.scss';

const CatalogueOwner = ({setCatalogueOwner}) => {
    return (
        <div className="nexus-c-catalogue-owner">
            <Select
                className="nexus-c-catalogue-owner-select"
                classNamePrefix="nexus-select"
                options={CATALOGUE_OWNER_OPTIONS}
                defaultValue={CATALOGUE_OWNER_OPTIONS[0]}
                placeholder={CATALOGUE_OWNER_DROPDOWN_PLACEHOLDER}
                onChange={val => setCatalogueOwner(val.value)}
            />
        </div>
    );
};

CatalogueOwner.propTypes = {
    setCatalogueOwner: PropTypes.func.isRequired,
};

export default CatalogueOwner;
