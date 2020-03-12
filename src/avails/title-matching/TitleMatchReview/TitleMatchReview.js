import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import BackNavigationByUrl from '../../../ui-elements/nexus-navigation/navigate-back-by-url/BackNavigationByUrl';
import {URL} from '../../../util/Common';
import {titleService} from '../../../containers/metadata/service/TitleService';
import {getColumnDefs, getTitles, getCombinedTitle} from '../titleMatchingSelectors';
import {createColumnDefs} from '../titleMatchingActions';
import {getRepositoryCell} from '../../utils';
import DOP from '../../../util/DOP';
import './TitleMatchReview.scss';

const TitleMatchReview = ({columnDefs, matchedTitles, match, history, getColumnDefs, combinedTitle}) => {
    const [titles, setTitles] = useState(Object.values(matchedTitles));
    const [mergedTitles, setMergedTitles] = useState([combinedTitle]);

    const navigateToMatchPreview = () => {
        const {params} = match || {};
        const {rightId} = params || {};
        history.push(URL.keepEmbedded(`/avails/rights/${rightId}/title-matching`));
    };

    const getTitle = id => {
        return new Promise((resolve, reject) => {
            return titleService.getTitleById(id).then((response) => {
                const title = response.data;
                titleService.getEditorialMetadataByTitleId(id).then(({data}) => {
                    const founded = data.find(el => el.locale==='US' && (el.language ==='English' || el.language ==='en'));
                    if(founded) {
                        title['editorialGenres'] = founded.genres;
                    }
                    resolve(title);
                });
            }).catch(() => {
                reject('Unable to load Title Data');
            });
        });
    };

    const setCombinedTitleParents = (merged) => {
        const getTitles = [];
        if(merged.parentIds && merged.parentIds.length){
            merged.parentIds.forEach(parent => {
                getTitles.push(getTitle(parent.id));
            });
            Promise.all(getTitles).then(values => {
                setMergedTitles([...values, merged]);
            });
        }
    };

    const setParents = (list, merged) => {
        const titleList = [...list];
        const getTitles = [];
        let indexTrack = 0;
        const track = {};
        list.forEach(title => {
            if(title.parentIds && title.parentIds.length){
                title.parentIds.forEach((parent, i) => {
                    getTitles.push(getTitle(parent.id));
                    track[parent.id] = indexTrack + i;
                });
                indexTrack = indexTrack + 1 + title.parentIds.length;
            }
        });
        if(getTitles.length){
            Promise.all(getTitles).then(values => {
                values.forEach(parent => {
                    titleList.splice(track[parent.id], 0, parent);
                });
                setTitles(titleList);
            });
        }
        setCombinedTitleParents(merged);
    };

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
        }
        else{
            setParents(matchedTitlesValues, combinedTitle);
        }
    }, [matchedTitles]);

    useEffect(() => {
        if (!columnDefs.length) {
            getColumnDefs();
        }
    }, [columnDefs]);

    useEffect(() => {
        if(mergedTitles && mergedTitles[0] && mergedTitles[0].id){
            const {params} = match || {};
            const {rightId} = params || {};
            DOP.setErrorsCount(0);
            DOP.setData({
                match: {
                    rightId,
                    titleId: mergedTitles[0].id
                }
            });
        }
    }, [mergedTitles]);

    const deepCloneMatchedTitlesColumnDefs = cloneDeep(columnDefs);
    const deepCloneCombinedTitleColumnDefs = cloneDeep(columnDefs);

    const renderEpisodeAndSeasonNumber = params => {
        if(params.data.contentType === 'EPISODE') return params.data.episodic.episodeNumber;
        else if(params.data.contentType === 'SEASON') return params.data.episodic.seasonNumber;
        else return null;
    };

    const numOfEpisodeAndSeasonField = {
        colId: 'episodeAndSeasonNumber',
        field: 'episodeAndSeasonNumber',
        headerName: '-',
        valueFormatter: renderEpisodeAndSeasonNumber,
        width: 100
        
    };

    const onGridReady = (params) => {
        const {columnApi} = params;
        const contentTypeIndex = deepCloneMatchedTitlesColumnDefs.findIndex(e => e.field === 'contentType');
        columnApi.moveColumn('episodeAndSeasonNumber', contentTypeIndex + 2); // +1 indicates 1 column pinned on the left side
    };
    return (
        <div className="nexus-c-title-to-match-review">
            <BackNavigationByUrl
                title="Title Matching Review"
                onNavigationClick={navigateToMatchPreview}
            />
            {
                !!titles.length && (
                    <>
                        <NexusTitle isSubTitle>Matched Titles</NexusTitle>
                        <NexusGrid
                            onGridEvent={onGridReady}
                            columnDefs={[getRepositoryCell(), numOfEpisodeAndSeasonField, ...deepCloneMatchedTitlesColumnDefs]}
                            rowData={titles}
                        />
                    </>
                )
            }
            {
                !!mergedTitles[0].id && (
                    <>
                        <NexusTitle isSubTitle>Combined Title</NexusTitle>
                        <NexusGrid
                            onGridEvent={onGridReady}
                            columnDefs={[getRepositoryCell(), numOfEpisodeAndSeasonField, ...deepCloneCombinedTitleColumnDefs]}
                            rowData={mergedTitles}
                        />
                    </>
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