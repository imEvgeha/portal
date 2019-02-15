import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class EditPage extends Component {
    render() {
        return (
            <Fragment>
                { this.props.children }
            </Fragment>
        );
    }
}

EditPage.propTypes = {
    children: PropTypes.array
};

export default EditPage;