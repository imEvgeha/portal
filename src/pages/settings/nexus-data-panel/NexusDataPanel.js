import React from 'react';
import PropTypes from 'prop-types';
import {ScrollPanel} from 'primereact/scrollpanel';
import './NexusDataPanel.scss';

const NexusDataPanel = ({header, data, itemTemplate, footer}) => {
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
                <div className="row header">
                    <div className="col-12">{header}</div>
                </div>
            )}

            <div className="row content">
                <div className="col-12">{renderItems()}</div>
                <div>LOAD MORE</div>
            </div>

            {footer && (
                <div className="row footer">
                    <div className="col-12">
                        <div>{footer}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

NexusDataPanel.propTypes = {
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    itemTemplate: PropTypes.func,
    footer: PropTypes.string,
};

NexusDataPanel.defaultProps = {
    header: '',
    data: [],
    itemTemplate: undefined,
    footer: '',
};

export default NexusDataPanel;
