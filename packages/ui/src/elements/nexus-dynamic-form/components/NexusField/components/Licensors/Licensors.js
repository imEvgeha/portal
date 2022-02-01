import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {ERROR_TITLE, LICENSOR_ERROR} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/toastActions';
import {store} from '../../../../../../../../../src';
import {sortOptions} from '../../../../utils';
import './Licensors.scss';
import AddLicensorModal from './AddLincensorModal';

const Licensors = ({selectValues, data, isEdit, onChange}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const [licensors, setLicensors] = useState([]);
    const [licensorOptions, setLicensorOptions] = useState([]);

    useEffect(() => {
        setLicensors(data);
    }, [data]);

    useEffect(() => {
        if (selectValues) {
            const options = selectValues.licensor;
            let formattedOptions = options.map(opt => {
                return {
                    label: opt.value,
                    value: opt.value,
                    id: opt.id,
                };
            });
            formattedOptions = sortOptions(formattedOptions);
            setLicensorOptions(formattedOptions);
        }
    }, [selectValues]);

    const removeLicensor = index => {
        const updatedLicensors = [...licensors];
        updatedLicensors.splice(index, 1);
        setLicensors(updatedLicensors);
        onChange([...updatedLicensors]);
    };

    const handleAddLicensor = async values => {
        const found = licensors.find(item => values.licensor.id === item.id);

        if (found) {
            const errorToast = {
                summary: ERROR_TITLE,
                severity: 'error',
                isAutoDismiss: false,
                detail: LICENSOR_ERROR,
            };
            store.dispatch(addToast(errorToast));
        } else {
            const updatedLicensors = [...licensors];
            const newLicensor = {
                id: values.licensor.id,
                licensor: values.licensor.value,
                licensorTitleId: values.licensorTitleId,
            };
            updatedLicensors.push(newLicensor);
            setLicensors(updatedLicensors);
            onChange([...updatedLicensors]);
            closeModal();
        }
    };

    const openAddLicensorModal = () => {
        openModal(
            <AddLicensorModal
                handleAddLicensor={handleAddLicensor}
                closeModal={closeModal}
                licensorOptions={licensorOptions}
                licensors={licensors}
            />,
            {
                title: <div>Add Licensor</div>,
                width: 'medium',
            }
        );
    };

    return (
        <div>
            {licensors.map((licensor, index) => {
                return (
                    <div key={index} className="nexus-c-licensors">
                        <div className="nexus-c-licensors__licensor">
                            <span>Licensor:</span>
                            <span>{licensor.licensor}</span>
                        </div>
                        <div className="nexus-c-licensors__id">
                            <span>Licensor Title ID:</span>
                            <span>{licensor.licensorTitleId}</span>
                        </div>
                        {isEdit && (
                            <div className="nexus-c-licensors__buttons" onClick={() => removeLicensor(index)}>
                                <EditorCloseIcon size="medium" label="" />
                            </div>
                        )}
                    </div>
                );
            })}
            {isEdit && (
                <div>
                    <Button onClick={openAddLicensorModal}>+ Add Licensor</Button>
                </div>
            )}
        </div>
    );
};

Licensors.propTypes = {
    selectValues: PropTypes.object,
    data: PropTypes.array,
    isEdit: PropTypes.bool,
    onChange: PropTypes.func,
};

Licensors.defaultProps = {
    selectValues: {},
    data: [],
    isEdit: false,
    onChange: () => null,
};

export default Licensors;
