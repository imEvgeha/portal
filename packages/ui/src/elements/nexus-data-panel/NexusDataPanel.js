import React from 'react';
import PropTypes from 'prop-types';
import {BlockUI} from 'primereact/blockui';
import {ProgressSpinner} from 'primereact/progressspinner';
import './NexusDataPanel.scss';

const NexusDataPanel = ({header, data, itemTemplate, footer, loading, contentFooter}) => {
    const defaultItemTemplate = item => {
        return (
            <div className="row">
                <div className="col-12">{item}</div>
            </div>
        );
    };

    const renderItems = () => {
        if (Array.isArray(data)) {
            return data.map(item => {
                if (itemTemplate) {
                    return itemTemplate(item);
                }
                return defaultItemTemplate(item);
            });
        }
    };

    return (
        <div className="nexus-c-data-panel h-100 d-flex flex-column">
            {header && (
                <div className="row nexus-c-header mb-2">
                    <div className="col-12">{header}</div>
                </div>
            )}

            <div className={`row nexus-c-content ${loading ? '' : 'nexus-c-overflow'}`}>
                <div className="col-12">
                    <BlockUI blocked={loading}>{renderItems()}</BlockUI>
                    {!!contentFooter && contentFooter}
                    {loading && (
                        <div className={Array.isArray(data) && data.length ? 'nexus-c-loading-wrapper' : 'text-center'}>
                            <ProgressSpinner
                                className="nexus-c-data-panel__spinner"
                                strokeWidth="4"
                                animationDuration=".5s"
                            />
                        </div>
                    )}
                </div>
            </div>

            {!!footer && footer}
        </div>
    );
};

NexusDataPanel.propTypes = {
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    itemTemplate: PropTypes.func,
    footer: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    contentFooter: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    loading: PropTypes.bool,
};

NexusDataPanel.defaultProps = {
    header: '',
    data: [],
    itemTemplate: undefined,
    footer: undefined,
    contentFooter: undefined,
    loading: false,
};

export default NexusDataPanel;
