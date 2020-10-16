import React, {Component} from 'react';
import PropTypes from 'prop-types';

class EditPage extends Component {
    render() {
        return <> {this.props.children}</>;
    }
}

EditPage.propTypes = {
    children: PropTypes.object.isRequired,
};

export default EditPage;
