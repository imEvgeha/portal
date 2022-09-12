import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {MultiSelect} from '@portal/portal-components';
import NexusTextArea from '@vubiquity-nexus/portal-ui/lib/elements/nexus-textarea/NexusTextArea';
import {getSortedData} from '@vubiquity-nexus/portal-utils/lib/Common';
import {connect} from 'react-redux';
import {countryOptionsSelector} from '../../../right-details/rightDetailsSelector';
import {BULK_SET_NOTE} from '../../constants';
import './BulkSet.scss';

const BulkSet = ({countryOptions, setTerritories, setKeywords}) => {
    const [options, setOptions] = useState([]);
    const [keywordsLocal, setKeywordsLocal] = useState('');
    const [selectedTerritories, setSelectedTerritories] = useState([]);

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
            <MultiSelect
                id="ddlTerritories"
                labelProps={{
                    label: 'Territories',
                    stacked: true,
                    shouldUpper: true,
                }}
                filter={true}
                value={selectedTerritories.map(t => t.value)}
                options={options}
                columnClass="col-12"
                className="bulk-set-territories__select-container"
                placeholder="Select territories..."
                onChange={e => {
                    const values = options.filter(t => e.value.includes(t.value));
                    setSelectedTerritories(values || []);
                    setTerritories(values);
                }}
            />

            <div className="bulk-set-territories__label">Keywords</div>
            <NexusTextArea notesValue={keywordsLocal} onTextChange={onChange} />
            <div className="bulk-set-territories__note">{BULK_SET_NOTE}</div>
        </div>
    );
};

BulkSet.propTypes = {
    countryOptions: PropTypes.array,
    setTerritories: PropTypes.func,
    setKeywords: PropTypes.func,
};

BulkSet.defaultProps = {
    countryOptions: [],
    setTerritories: () => null,
    setKeywords: () => null,
};

const mapStateToProps = () => {
    return state => ({
        countryOptions: countryOptionsSelector(state),
    });
};

export default connect(mapStateToProps)(BulkSet);
