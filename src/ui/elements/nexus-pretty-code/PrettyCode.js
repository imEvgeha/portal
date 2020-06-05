import React from 'react';
import PropTypes from 'prop-types';
import { AkCodeBlock } from '@atlaskit/code';
import './PrettyCode.scss';

const PrettyCode = ({code, title, lang, stringify}) => {
    if(stringify){
        code = JSON.stringify(code, null, 2);
    }

    return (
        <div className='pretty-code'>
            <h2>{ title }</h2>

            <AkCodeBlock language={lang} text={code} />
        </div>
    );
};

PrettyCode.propTypes = {
    code: PropTypes.object,
    title: PropTypes.string,
    lang: PropTypes.string,
    stringify: PropTypes.bool
};

PrettyCode.defaultProps = {
    code: {},
    title: 'Event Message',
    lang: 'json',
    stringify: true
};

export default PrettyCode;
