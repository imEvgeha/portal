import React from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import {IntlProvider} from 'react-intl';

const CustomIntlProvider = ({children, getLocale}) => {
    return (
        <IntlProvider locale={getLocale.locale}>
            <React.Fragment>
                {children}
            </React.Fragment>
        </IntlProvider>
    );
};

CustomIntlProvider.propTypes = {
    children: PropTypes.node.isRequired,
    getLocale: PropTypes.object    
};

CustomIntlProvider.defaultProps = {
    getLocale: null,
};

const mapStateToProps = state => {
    return { getLocale: state.localeReducer };
};

export default connect(mapStateToProps)(CustomIntlProvider);

