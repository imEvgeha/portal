import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Select from '@atlaskit/select';
import NexusTextArea from '@vubiquity-nexus/portal-ui/lib/elements/nexus-textarea/NexusTextArea';
import {getSortedData} from '@vubiquity-nexus/portal-utils/lib/Common';
import {connect} from 'react-redux';
import {countryOptionsSelector} from '../../../right-details/rightDetailsSelector';
import {BULK_SET_NOTE} from '../../constants';
import './BulkSet.scss';

const BulkSet = ({countryOptions, setTerritories, setKeywords}) => {
    const [options, setOptions] = useState([]);
    const [keywordsLocal, setKeywordsLocal] = useState('');

    useEffect(() => {
        if (options.length === 0) {
            setOptions(
                getSortedData(
                    countryOptions.map(c => ({value: c.countryCode, label: c.countryName})),
                    'label',
                    true
                )
            );
        }
    }, countryOptions);

    const onChange = value => {
        setKeywordsLocal(value);
        setKeywords(value);
    };

    return (
        <div className="bulk-set-territories">
            <div className="bulk-set-territories__label">Territories</div>
            <Select
                isMulti
                options={options}
                hideSelectedOptions
                placeholder="Select territories..."
                onChange={i => setTerritories(i)}
                className="bulk-set-territories__select-container"
                classNamePrefix="bulk-set-territories__select"
            />
            <div className="bulk-set-territories__label">Keywords</div>
            <NexusTextArea notesValue={keywordsLocal} onTextChange={onChange} />
            <div className="bulk-set-territories__note">{BULK_SET_NOTE}</div>
        </div>
    );
};

BulkSet.propTypes = {
    countryOptions: PropTypes.array,
    setTerritories: PropTypes.func.isRequired,
    setKeywords: PropTypes.func.isRequired,
};

BulkSet.defaultProps = {
    countryOptions: [],
};

const mapStateToProps = () => {
    return state => ({
        countryOptions: countryOptionsSelector(state),
    });
};

export default connect(mapStateToProps)(BulkSet);
