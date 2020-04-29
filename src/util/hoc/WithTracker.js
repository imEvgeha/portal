import React, { Component, } from 'react';
import GoogleAnalytics from 'react-ga';

const googleAnalyticsId = process.env.GA_ACCOUNT_ID;

if(googleAnalyticsId){
    GoogleAnalytics.initialize(googleAnalyticsId);
}

const withTracker = (WrappedComponent, options = {}) => {
    const trackPage = page => {
        if(googleAnalyticsId) {
            GoogleAnalytics.set({
                page,
                ...options,
            });

            // eslint-disable-next-line
            // console.log('track pageview ' + page);

            GoogleAnalytics.pageview(page);
        }
    };

    // eslint-disable-next-line
    const HOC = class extends Component {
        componentDidMount() {
            // eslint-disable-next-line
            const page = this.props.location.pathname + this.props.location.search;
            trackPage(page);
        }

        componentDidUpdate(prevProps) {
            const currentPage =
                prevProps.location.pathname + prevProps.location.search;
            const nextPage =
                this.props.location.pathname + this.props.location.search;

            if (currentPage !== nextPage) {
                trackPage(nextPage);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };

    return HOC;
};

export default withTracker;