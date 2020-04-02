import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'babel-polyfill';

configure({adapter: new Adapter()});

jest.mock('react-intl', () => {
    const reactIntl = require.requireActual('react-intl');
    const intl = reactIntl.createIntl({
        locale: 'en',
    });

    return {
        ...reactIntl,
        useIntl: () => intl,
    };
});