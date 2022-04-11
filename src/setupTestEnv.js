import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

configure({adapter: new Adapter()});

// Catches unhandledRejection error thrown by nodejs 15
// eslint-disable-next-line no-empty-function
process.on('unhandledRejection', (reason, promise) => {});

jest.mock('react-intl', () => {
    const reactIntl = jest.requireActual('react-intl');
    const intl = reactIntl.createIntl({
        locale: 'en',
    });

    return {
        ...reactIntl,
        useIntl: () => intl,
    };
});

export const mockNavigate = jest.fn();
export const mockSubstring = jest.fn();

jest.mock('react-router-dom', () => {
    const r = jest.requireActual('react-router-dom');

    return {
        ...r,
        useNavigate: () => mockNavigate,
        useLocation: () => ({
            search: {
                substring: mockSubstring,
            },
        }),
        useParams: () => ({}),
    };
});
