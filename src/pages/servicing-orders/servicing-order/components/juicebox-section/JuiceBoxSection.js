import React, {useState} from 'react';
import PropTypes from "prop-types";
import { HelperMessage } from '@atlaskit/form';
import Textfield from "@atlaskit/textfield";

const JuiceBoxSection = ({language}) => {
    const [lang, setLang] = useState(language);


    return (
        <div>
            <h2>JuiceBox Fulfillment Order</h2>
            <label htmlFor="jb-lang">Language</label>
            <Textfield
                name="juicebox-lang"
                id="jb-lang"
                value={lang}
                onChange={e => setLang(e.target.value)}
            />
            <HelperMessage>
                Type to change language
            </HelperMessage>
        </div>

    )
}

JuiceBoxSection.propTypes = {
    language: PropTypes.string,
};

JuiceBoxSection.defaultProps = {
    language: '',
};

export default JuiceBoxSection;
