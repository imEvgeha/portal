import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DropdownMenu from '@atlaskit/dropdown-menu';
import {connect} from 'react-redux';
import {CREATE_REPORT} from './constants';
import './AvailsTableReleaseReport.scss';

const AvailsTableReleaseReport = ({}) => {
    const onCreate = () => {};

    return (
        <div className="nexus-c-right-repository-release-report">
            <DropdownMenu className="nexus-c-button" trigger="New Release Report" triggerType="button">
                <div className="nexus-c-right-repository-release-report-content">
                    <Button
                        className="nexus-c-right-repository-release-report-content__btn"
                        onClick={onCreate}
                        appearance="primary"
                    >
                        {CREATE_REPORT}
                    </Button>
                </div>
            </DropdownMenu>
        </div>
    );
};

AvailsTableReleaseReport.propTypes = {};

AvailsTableReleaseReport.defaultProps = {};

const mapStateToProps = () => {};

export default connect(mapStateToProps)(AvailsTableReleaseReport);
