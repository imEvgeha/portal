import React from 'react';
import PropTypes from 'prop-types';
import {IntlProvider} from 'react-intl';
import {connect} from 'react-redux';

const CustomIntlProvider = ({children, getLocale}) => <IntlProvider locale={getLocale.locale}>{children}</IntlProvider>;

CustomIntlProvider.propTypes = {
    children: PropTypes.node.isRequired,
    getLocale: PropTypes.object,
};

CustomIntlProvider.defaultProps = {
    getLocale: null,
};

const mapStateToProps = state => {
    return {getLocale: state.locale};
};

export default connect(mapStateToProps)(CustomIntlProvider);
