import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {uid} from 'react-uid';
import './ManualRightEntryFatalView.scss';

const SEVERITY_TYPE_FATAL = 'Fatal';

const ManualRightEntryFatalView = ({attachments, hidden}) => {
    const [errorList, setErrorList] = useState([]);
    const [viewHeight, setViewHeight] = useState();

    const containerRef = useRef();

    useEffect(() => {
        if (containerRef.current) {
            const offsetTop = containerRef.current.getBoundingClientRect().top;
            setViewHeight(window.innerHeight - offsetTop - 10);
        }
    }, [containerRef.current]);

    useEffect(() => {
        if (attachments) {
            setErrorList(getListOfFatalErrors());
        }
    }, [attachments]);

    const getListOfFatalErrors = () => {
        const errorList = [];
        attachments.forEach(attachment => {
            const {errorReports = []} = attachment;
            errorReports &&
                errorReports.forEach(report => {
                    const {availSource = {}, validationErrors = []} = report;
                    let message = 'System could not process row: ' + availSource.availRow + '.';
                    let areFatalErrorsAppear = false;
                    validationErrors.forEach(error => {
                        if (error.severityType === SEVERITY_TYPE_FATAL) {
                            areFatalErrorsAppear = true;
                            message += " The field '" + error.fieldName + "' has error - " + error.message + '.';
                        }
                    });
                    if (areFatalErrorsAppear) {
                        errorList.push(message);
                    }
                });
        });
        return errorList;
    };

    const getRows = () => {
        return errorList.map((error, index) => {
            return (
                <div key={uid(error, index)} className="nexus-c-manual-rights-entry__fatal_row">
                    {error}
                </div>
            );
        });
    };

    return (
        <>
            {' '}
            {!hidden && (
                <div
                    ref={containerRef}
                    style={{height: viewHeight}}
                    className="nexus-c-manual-rights-entry__fatal_view"
                >
                    {getRows()}
                </div>
            )}
        </>
    );
};

ManualRightEntryFatalView.defaultProps = {
    hidden: false,
    attachments: [],
};

ManualRightEntryFatalView.propTypes = {
    attachments: PropTypes.array,
    hidden: PropTypes.bool,
};

export default ManualRightEntryFatalView;
