import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {uid} from 'react-uid';
import './ManualRightEntryFatalView.scss';

const SEVERITY_TYPE_FATAL = 'Fatal';

function ManualRightEntryFatalView({attachments, hidden}) {

    const [errorList, setErrorList] = useState([]);

    useEffect(() => {
        if(attachments) {
            console.log('ManualRightEntryFatalView', attachments)
            setErrorList(getListOfFatalErrors());
        }
    },[attachments]);

    const getListOfFatalErrors = () => {
        let errorList = [];
        attachments.forEach(attachment => {
            const {errorReports = []} = attachment;
            errorReports.forEach(report => {
                const {availSource = {}, validationErrors = []} = report;
                validationErrors.forEach(error => {
                    if (error.severityType === SEVERITY_TYPE_FATAL) {
                        const message = 'System could not process row: ' + availSource.availRow + '. ' + 'Field: ' + error.fieldName + ', has error - ' + error.message;
                        errorList.push(message);
                    }
                });
            });
        });
        return errorList;
    };

    const getRows = () => {
        return errorList.map((error, index) => {
            return <div key={uid(error, index)} className='nexus-c-manual-rights-entry__fatal_row'>{error}</div>;
        });
    };

    return (
        <React.Fragment>
            {!hidden &&
            <div className='nexus-c-manual-rights-entry__fatal_view'>
                {getRows()}
            </div>
            }
        </React.Fragment>
    );
}

ManualRightEntryFatalView.defaultProps = {
    hidden: false
};

ManualRightEntryFatalView.propTypes = {
    attachments: PropTypes.array,
    hidden: PropTypes.bool,
};

export default ManualRightEntryFatalView;