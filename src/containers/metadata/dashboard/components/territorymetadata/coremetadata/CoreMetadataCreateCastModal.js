import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';

const CAST = 'CAST';

class CoreMetadataCreateCastModal extends Component {
  render() {
    return (
      <Fragment>
        <Modal
          isOpen={this.props.isCastModalOpen}
          toggle={() => this.props.renderCastModal(CAST)}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader toggle={() => this.props.renderCastModal(CAST)}>
            Create Cast
          </ModalHeader>
          <ModalBody>
            <AvField type="select" name="castInputValue" id="exampleSelect" onChange={e => this.props.updateCastValue(e.target.value)}>
              <option value={''}>Select a Cast</option>
              <option>Firsname Lastname1</option>
              <option>Firsname Lastname2</option>
              <option>Firsname Lastname3</option>
              <option>Firsname Lastname4</option>
              <option>Firsname Lastname5</option>
            </AvField>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => this.props.addCast('actor')}>
              Save
            </Button>{' '}
            <Button color='secondary' onClick={() => this.props.renderCastModal(CAST)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

CoreMetadataCreateCastModal.propTypes = {
  className: PropTypes.string,
  renderCastModal: PropTypes.func,
  isCastModalOpen: PropTypes.bool,
  updateCastValue: PropTypes.func,
  addCast: PropTypes.func,
  castInputValue: PropTypes.string
};

export default CoreMetadataCreateCastModal;
