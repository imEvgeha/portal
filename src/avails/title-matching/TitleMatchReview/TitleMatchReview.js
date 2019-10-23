import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import BackNavigationByUrl from '../../../ui-elements/nexus-navigation/navigate-back-by-url/BackNavigationByUrl';
import {URL} from '../../../util/Common';
import {titleService} from '../../../containers/metadata/service/TitleService';
import {getColumnDefs, getTitles, getCombinedTitle} from '../titleMatchingSelectors';
import {createColumnDefs} from '../titleMatchingActions';
import { getRepositoryCell } from '../../utils';
import './TitleMatchReview.scss';

const TitleMatchReview = ({columnDefs, matchedTitles, match, history, getColumnDefs, combinedTitle}) => {
    const [titles, setTitles] = useState(Object.values(matchedTitles));
    const [mergedTitle, setMergedTitle] = useState(combinedTitle);

    const navigateToMatchPreview = () => {
        const {params} = match || {};
        const {rightId} = params || {};
        history.push(URL.keepEmbedded(`/avails/rights/${rightId}/title_matching`));
    };

    const getTitle = id => {
        return new Promise((resolve, reject) => {
            return titleService.getTitleById(id).then((response) => {
                resolve(response.data);
            }).catch(() => {
                reject('Unable to load Title Data');
            });
        });
    };

    useEffect(() => {
        const values = Object.values(matchedTitles);
        if (!values.length) {
            const titles = URL.getParamIfExists('idsToMerge').split(',');
            const combinedTitle = URL.getParamIfExists('combinedTitle');
            const getTitles = [];
            titles.forEach(id => {
                getTitles.push(getTitle(id));
            });
            getTitles.push(getTitle(combinedTitle));
            Promise.all(getTitles).then(values => {
                setMergedTitle(values.pop());
                setTitles(values);
            });
        }
    }, [matchedTitles]);

    useEffect(() => {
        if (!columnDefs.length) {
            getColumnDefs();
        }
    }, [columnDefs]);

    return (
        <div className="nexus-c-title-to-match-review">
            <BackNavigationByUrl
                title={'Title Matching Review'}
                onNavigationClick={navigateToMatchPreview}
            />
            {
                !!titles.length && (
                    <React.Fragment>
                        <NexusTitle>Matched Titles</NexusTitle>
                        <NexusGrid
                            columnDefs={[getRepositoryCell(), ...columnDefs]}
                            rowData={titles}
                        />
                    </React.Fragment>
                )
            }
            {
                !!mergedTitle.id && (
                    <React.Fragment>
                        <NexusTitle>Combined Title</NexusTitle>
                        <NexusGrid
                            columnDefs={[getRepositoryCell(), ...columnDefs]}
                            rowData={[mergedTitle]}
                        />
                    </React.Fragment>
                )
            }
        </div>
    );
};

TitleMatchReview.propTypes = {
    getColumnDefs: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
    matchedTitles: PropTypes.array,
    match: PropTypes.object,
    history: PropTypes.object,
    combinedTitle: PropTypes.object,
};

TitleMatchReview.defaultProps = {
    columnDefs: [],
    matchedTitles: [],
    match: null,
    history: null,
    combinedTitle: {},
};

const createMapStateToProps = () => {
    return (state) => ({
        columnDefs: getColumnDefs(state),
        matchedTitles: getTitles(state),
        combinedTitle: getCombinedTitle(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    getColumnDefs: () => dispatch(createColumnDefs())
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchReview); // eslint-disable-line