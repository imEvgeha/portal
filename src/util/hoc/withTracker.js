import React, {useEffect, useRef} from 'react';
import GoogleAnalytics from 'react-ga';
import {useLocation} from 'react-router-dom';
import {getConfig} from '../../config';

export function initializeTracker() {
    const googleAnalyticsId = getConfig('googleAnalytics.propertyId');

    if (googleAnalyticsId) {
        GoogleAnalytics.initialize(googleAnalyticsId);
    }
}

const withTracker = (WrappedComponent, options = {}) => {
    return props => {
        const location = useLocation();
        const previousLocation = useRef('');

        useEffect(() => {
            const page = location.pathname + location.search;
            previousLocation.current = page;
            trackPage(page);
        }, []);

        useEffect(() => {
            const nextPage = location.pathname + location.search;

            if (previousLocation.current !== nextPage) {
                previousLocation.current = nextPage;
                trackPage(nextPage);
            }
        }, [location]);

        const trackPage = page => {
            GoogleAnalytics.set({
                page,
                ...options,
            });

            GoogleAnalytics.pageview(page);
        };

        return <WrappedComponent location={location} {...props} />;
    };
};

export default withTracker;
