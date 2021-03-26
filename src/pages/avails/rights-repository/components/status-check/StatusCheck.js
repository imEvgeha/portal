import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import {isEndDateExpired} from '../../../menu-actions/actions';
import {ELIGIBLE_RIGHT_STATUS, ELIGIBLE_STATUS} from '../../../pre-plan-actions/constants';
import {STATUS_CHECK_MSG} from '../../../selected-rights-actions/constants';
import {header} from './constants';
import './StatusCheck.scss';

const InValidData = ({data}) => <span className="nexus-c-status-check__table--invalid">{data}</span>;

const StatusCheck = ({nonEligibleTitles, onClose}) => {
    const dataRows =
        nonEligibleTitles &&
        nonEligibleTitles.map(content => {
            const {
                id,
                title,
                status,
                rightStatus,
                licensed,
                territory,
                updatedCatalogReceived,
                temporaryPriceReduction,
                end,
            } = content;
            const hasUnplannedTerritory = territory.filter(ter => !ter.selected).length;
            return {
                key: id,
                cells: [
                    {
                        key: `${id}-title`,
                        content: title,
                    },
                    {
                        key: `${id}-status`,
                        content: ELIGIBLE_STATUS.includes(status) ? status : <InValidData data={status} />,
                    },
                    {
                        key: `${id}-rightStatus`,
                        content: ELIGIBLE_RIGHT_STATUS.includes(rightStatus) ? (
                            rightStatus
                        ) : (
                            <InValidData data={rightStatus} />
                        ),
                    },
                    {
                        key: `${id}-licensed`,
                        content: licensed ? 'YES' : <InValidData data="NO" />,
                    },
                    {
                        key: `${id}-territory`,
                        content: hasUnplannedTerritory ? '' : <InValidData data="NONE" />,
                    },
                    {
                        key: `${id}-updatedCatalogReceived`,
                        content: updatedCatalogReceived ? <InValidData data="YES" /> : 'NO',
                    },
                    {
                        key: `${id}-temporaryPriceReduction`,
                        content: temporaryPriceReduction ? <InValidData data="YES" /> : 'NO',
                    },
                    {
                        key: `${id}-end`,
                        content: isEndDateExpired(end) ? <InValidData data={end} /> : end,
                    },
                ],
            };
        });
    return (
        <div className="nexus-c-status-check">
            <div className="nexus-c-status-check__message">{STATUS_CHECK_MSG}</div>
            {!!dataRows.length && (
                <div className="nexus-c-status-check__table">
                    <DynamicTable
                        head={header}
                        rows={dataRows}
                        rowsPerPage={5}
                        defaultPage={1}
                        loadingSpinnerSize="large"
                        isLoading={false}
                    />
                </div>
            )}

            <div className="nexus-c-status-check__btn-wrapper">
                <Button
                    appearance="primary"
                    onClick={onClose}
                    className="nexus-c-status-check__button"
                    isDisabled={false}
                >
                    OK
                </Button>
            </div>
        </div>
    );
};

InValidData.propTypes = {
    data: PropTypes.string,
};

InValidData.defaultProps = {
    data: '',
};

StatusCheck.propTypes = {
    nonEligibleTitles: PropTypes.array,
    onClose: PropTypes.func,
};

StatusCheck.defaultProps = {
    nonEligibleTitles: [],
    onClose: () => null,
};

export default StatusCheck;
