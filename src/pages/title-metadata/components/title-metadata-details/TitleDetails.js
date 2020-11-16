import React from 'react';
import PropTypes from 'prop-types';
import NexusDynamicForm from '../../../../ui/elements/nexus-dynamic-form/NexusDynamicForm';
import TitleDetailsHeader from './components/TitleDetailsHeader';
import './TitleDetails.scss';
import schema from './schema.json';

const TitleDetails = props => {
    return (
        <div className="nexus-c-title-details">
            <TitleDetailsHeader />
            <NexusDynamicForm schema={schema} />
        </div>
    );
};

export default TitleDetails;
