import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {NexusModalContext} from '../../nexus-modal/NexusModal';
import {buildSection} from '../utils';
import {VIEWS} from '../constants';
import './NexusArray.scss';

const NexusArray = ({name, view, data, fields, getValues, ...props}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const renderObject = (object, index) => {
        return (
            <div key={index} onClick={() => openEditModal(index)} className="nexus-c-array__object">
                {buildSection(fields, getValues, view, data[index] || {})}
            </div>
        );
    };

    const modalContent = index => {
        return (
            <div key={index} className="nexus-c-array__modal">
                {buildSection(fields, getValues, view, data[index] || {})}
            </div>
        );
    };

    const openEditModal = index => {
        const actions = [
            {
                text: 'Cancel',
                onClick: () => {
                    closeModal();
                },
            },
        ];
        openModal(modalContent(index), {title: 'Territory Data', width: 'small', actions});
    };

    return <div className="nexus-c-array">{data.map((o, index) => renderObject(o, index))}</div>;
};

NexusArray.propTypes = {
    name: PropTypes.string.isRequired,
    view: PropTypes.string,
    data: PropTypes.array,
    fields: PropTypes.object,
    getValues: PropTypes.func,
};

NexusArray.defaultProps = {
    view: VIEWS.VIEW,
    data: [],
    fields: {},
    getValues: undefined,
};

export default NexusArray;
