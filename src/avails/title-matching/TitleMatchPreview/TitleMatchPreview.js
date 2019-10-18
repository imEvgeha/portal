import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import NexusTitle from '../../../ui-elements/nexus-title/NexusTitle';
import NexusGrid from '../../../ui-elements/nexus-grid/NexusGrid';
import BackNavigationByUrl from '../../../ui-elements/nexus-navigation/navigate-back-by-url/BackNavigationByUrl';
import {URL} from '../../../util/Common';
import {titleService} from '../../../containers/metadata/service/TitleService';
import {getColumnDefs, getTitles} from '../titleMatchingSelectors';
import {createColumnDefs} from '../titleMatchingActions';
import { getRepositoryCell } from '../../utils';
import './TitleMatchPreview.scss';

const TitleMatchPreview = ({columnDefs, matchedTitles, match, history, getColumnDefs}) => {
    const [titles, setTitles] = useState(Object.values(matchedTitles));

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
            const titles = URL.getParamIfExists('matches').split(',');
            const getTitles = [];
            titles.forEach(id => {
                getTitles.push(getTitle(id));
            });
            Promise.all(getTitles).then(values => {
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
        <div className="nexus-c-title-to-match-preview">
            <BackNavigationByUrl
                title={'Title Matching Preview'}
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
        </div>
    );
};

TitleMatchPreview.propTypes = {
    getColumnDefs: PropTypes.func.isRequired,
    columnDefs: PropTypes.array,
    matchedTitles: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
};

TitleMatchPreview.defaultProps = {
    columnDefs: [],
    matchedTitles: {},
    match: null,
    history: null,
};

const createMapStateToProps = () => {
    return (state) => ({
        columnDefs: getColumnDefs(state),
        matchedTitles: getTitles(state),
    });
};

const mapDispatchToProps = (dispatch) => ({
    getColumnDefs: () => dispatch(createColumnDefs())
});

export default connect(createMapStateToProps, mapDispatchToProps)(TitleMatchPreview); // eslint-disable-line