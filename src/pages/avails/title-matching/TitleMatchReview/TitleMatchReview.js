import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import BackNavigationByUrl from '@vubiquity-nexus/portal-ui/lib/elements/nexus-navigation/navigate-back-by-url/BackNavigationByUrl';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {cloneDeep} from 'lodash';
import {connect} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {NexusGrid, NexusTitle} from '../../../../ui/elements';
import {titleService} from '../../../legacy/containers/metadata/service/TitleService';
import {getRepositoryCell} from '../../utils';
import {createColumnDefs} from '../titleMatchingActions';
import {getColumnDefs, getCombinedTitle, getTitles} from '../titleMatchingSelectors';
import './TitleMatchReview.scss';

const TitleMatchReview = ({columnDefs, matchedTitles, getColumnDefs, combinedTitle}) => {
    const [titles, setTitles] = useState(Object.values(matchedTitles));
    const [mergedTitles, setMergedTitles] = useState([combinedTitle]);
    const navigate = useNavigate();
    const routeParams = useParams();

    const navigateToMatchPreview = () => {
        const {rightId} = routeParams;
        navigate(URL.keepEmbedded(`/avails/rights/${rightId}/title-matching`));
    };

    const getTitle = id => {
        return new Promise((resolve, reject) => {
            return titleService
                .getTitleById(id)
                .then(response => {
                    const title = response;
                    titleService.getEditorialMetadataByTitleId(id).then(data => {
                        const founded = data.find(
                            el => el.locale === 'US' && (el.language === 'English' || el.language === 'en')
                        );
                        if (founded) {
                            title['editorialGenres'] = founded.genres;
                        }
                        resolve(title);
                    });
                })
                .catch(() => {
                    reject(new Error('Unable to load Title Data'));
                });
        });
    };

    const setCombinedTitleParents = useCallback(merged => {
        const getTitles = [];
        if (merged.parentIds && merged.parentIds.length) {
            merged.parentIds.forEach(parent => {
                getTitles.push(getTitle(parent.id));
            });
            Promise.all(getTitles).then(values => {
                setMergedTitles([...values, merged]);
            });
        }
    }, []);

    const setParents = useCallback(
        (list, merged) => {
            const titleList = [...list];
            const getTitles = [];
            let indexTrack = 0;
            const track = {};
            list.forEach(title => {
                if (title.parentIds && title.parentIds.length) {
                    title.parentIds.forEach((parent, i) => {
                        getTitles.push(getTitle(parent.id));
                        track[parent.id] = indexTrack + i;
                    });
                    indexTrack = indexTrack + 1 + title.parentIds.length;
                }
            });
            if (getTitles.length) {
                Promise.all(getTitles).then(values => {
                    values.forEach(parent => {
                        titleList.splice(track[parent.id], 0, parent);
                    });
                    setTitles(titleList);
                });
            }
            setCombinedTitleParents(merged);
        },
        [setCombinedTitleParents]
    );

    useEffect(() => {
        const matchedTitlesValues = Object.values(matchedTitles);
        if (!matchedTitlesValues.length) {
            const getTitles = [];
            let titles = URL.getParamIfExists('idsToMerge');
            titles = titles.length ? titles.split(',') : [];
            const combinedTitle = URL.getParamIfExists('combinedTitle');
            titles.forEach(id => {
                getTitles.push(getTitle(id));
            });
            getTitles.push(getTitle(combinedTitle));
            Promise.all(getTitles).then(values => {
                const merged = values.pop();
                setMergedTitles([merged]);
                setTitles(values);
                setParents(values, merged);
            });
        } else {
            setParents(matchedTitlesValues, combinedTitle);
        }
    }, [combinedTitle, matchedTitles, setParents]);

    useEffect(() => {
        if (!columnDefs.length) {
            getColumnDefs();
        }
    }, [columnDefs, getColumnDefs]);

    useEffect(() => {
        if (mergedTitles && mergedTitles[0] && mergedTitles[0].id) {
            const {rightId} = routeParams;
            DOP.setErrorsCount(0);
            DOP.setData({
                match: {
                    rightId,
                    titleId: mergedTitles[0].id,
                },
            });
        }
    }, [routeParams, mergedTitles]);

    const deepCloneMatchedTitlesColumnDefs = cloneDeep(columnDefs);
    const deepCloneCombinedTitleColumnDefs = cloneDeep(columnDefs);

    const renderEpisodeAndSeasonNumber = params => {
        if (params.data.contentType === 'EPISODE') {
            return params.data.episodic.episodeNumber;
        } else if (params.data.contentType === 'SEASON') {
            return params.data.episodic.seasonNumber;
        }
        return null;
    };

    const numOfEpisodeAndSeasonField = {
        colId: 'episodeAndSeasonNumber',
        field: 'episodeAndSeasonNumber',
        headerName: '-',
        valueFormatter: renderEpisodeAndSeasonNumber,
        width: 100,
    };

    const onGridReady = params => {
        const {columnApi} = params;
        const contentTypeIndex = deepCloneMatchedTitlesColumnDefs.findIndex(e => e.field === 'contentType');
        const PINNED_COLUMNS_NUMBER = 2;
        columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + PINNED_COLUMNS_NUMBER);
    };
    return (
        <div className="nexus-c-title-to-match-review">
            <BackNavigationByUrl title="Title Matching Review" onNavigationClick={navigateToMatchPreview} />
            {!!titles.length && (
                <>
                    <NexusTitle isSubTitle>Matched Titles</NexusTitle>
                    <NexusGrid
                        onGridEvent={onGridReady}
                        columnDefs={[
                            getRepositoryCell(),
                            numOfEpisodeAndSeasonField,
                            ...deepCloneMatchedTitlesColumnDefs,
                        ]}
                        rowData={titles}
                    />
                </>
            )}
            {!!mergedTitles[0].id && (
                <>
                    <NexusTitle isSubTitle>Combined Title</NexusTitle>
                    <NexusGrid
                        onGridEvent={onGridReady}
                        columnDefs={[
                            getRepositoryCell(),
                            numOfEpisodeAndSeasonField,
                            ...deepCloneCombinedTitleColumnDefs,
                        ]}
                        rowData={mergedTitles}
                    />
                </>
            )}
        </div>
    );
};

TitleMatchReview.propTypes = {
    getColumnDefs: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
    matchedTitles: PropTypes.array,
    combinedTitle: PropTypes.object,
};

TitleMatchReview.defaultProps = {
    columnDefs: [],
    matchedTitles: [],
    combinedTitle: {},
};

const createMapStateToProps = () => {
    return state => ({
        columnDefs: getColumnDefs(state),
        matchedTitles: getTitles(state),
        combinedTitle: getCombinedTitle(state),
    });
};

const mapDispatchToProps = dispatch => ({
    getColumnDefs: () => dispatch(createColumnDefs()),
});

// eslint-disable-next-line
export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchReview);
