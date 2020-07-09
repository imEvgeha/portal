import {typography} from '@atlaskit/theme';
import styled from 'styled-components';

/**
 * A component that utilizes atlaskit typography styles.
 * Heading style values come from https://atlassian.design/guidelines/product/foundations/typography
 * @param {h100|h200|h300|h400|h500|h600|h700|h800|h900} size - the desired heading style from smallest to largest
 */
const Heading = styled.div`
    ${props => typography[props.size]()};
`;

export default Heading;
