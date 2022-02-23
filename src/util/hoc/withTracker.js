import React, {Component} from 'react';
import PropTypes from 'prop-types';
import GoogleAnalytics from 'react-ga';
import {getConfig} from '../../config';

export function initializeTracker() {
    const googleAnalyticsId = getConfig('googleAnalytics.propertyId');

    if (googleAnalyticsId) {
        GoogleAnalytics.initialize(googleAnalyticsId);
    }
}

const withTracker = (WrappedComponent, options = {}) => {
    const trackPage = page => {
        GoogleAnalytics.set({
            page,
            ...options,
        });

        GoogleAnalytics.pageview(page);
    };

    class ComposedComponent extends Component {
        componentDidMount() {
            const {location} = this.props;
            const page = location.pathname + location.search;

            trackPage(page);
        }

        componentDidUpdate(prevProps) {
            const {location} = this.props;
            const {location: prevLocation} = prevProps;

            const currentPage = prevLocation.pathname + prevLocation.search;
            const nextPage = location.pathname + location.search;

            if (currentPage !== nextPage) {
                trackPage(nextPage);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    ComposedComponent.propTypes = {
        location: PropTypes.shape({
            pathname: PropTypes.string,
            search: PropTypes.string,
        }).isRequired,
    };

    return ComposedComponent;
};

export default withTracker;
