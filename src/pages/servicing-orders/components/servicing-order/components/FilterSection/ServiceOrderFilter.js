import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button/dist/cjs/components/Button';
import Modal, {ModalTransition} from '@atlaskit/modal-dialog';
import moment from 'moment';
import Select from '@atlaskit/select/dist/cjs/Select';
import './ServiceOrderFilter.scss';

 const SOFilter = ({orderDetails}) => {
    const [isModal, setIsModal] = useState(false);
    const toggleModal = () => setIsModal(!isModal);
    const actions = [
        { text: 'Close', onClick: toggleModal }
    ];
    return(
        <div className='so-panel-filter-detail'>
            <span className='so nexus-c-table-toolbar__title--is-active'>Customer: {orderDetails.customer}</span>
            <p className='so nexus-c-table-toolbar__title--is-active'>Order ID: {orderDetails.soID}</p>
            <Button onClick={toggleModal}>Partner Request</Button>
            <ModalTransition>
                {isModal && (
                    <Modal actions={actions} onClose={toggleModal}>
                        <div className='so-panel-filter-detail__modal'>
                            <h2 className='so nexus-c-table-toolbar__title--is-active'>Partner Request</h2>
                            <p className='so nexus-c-table-toolbar__title--is-active'>Studio: {orderDetails.customer}</p>
                            <p className='so nexus-c-table-toolbar__title--is-active'>MSS Order Details: {orderDetails.soID}</p>
                            <p className='so nexus-c-table-toolbar__title--is-active'>Created Date: {orderDetails.creationDate? moment(orderDetails.creationDate).format('MMM Do YYYY, h:mm:ss a') : null}</p>
                            <p className='so nexus-c-table-toolbar__title--is-active'>Created by: {orderDetails.createdBy}</p>
                        </div>
                    </Modal>
                )}
            </ModalTransition>
            <Select
                //TBD - content will come from api call
                options={[
                    { value: 'OPTION 1', label: 'OPTION 1 (TBD)' },
                    { value: 'OPTION 2', label: 'OPTION 2 (TBD)' },
                ]}
                value='SELECT STATUS'
                /*onChange={}*/
            />
        </div>
    );
};

SOFilter.propTypes = {
    customer: PropTypes.string,
    soID: PropTypes.string,
    creationDate: PropTypes.string,
    createdBy: PropTypes.string
};
SOFilter.defaultProps = {
    customer: '',
    soID: '',
    creationDate: '',
    createdBy: '',
};
export default SOFilter;