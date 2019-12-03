import React from 'react';
import Icon from '@atlaskit/icon';

const navLogoSvg = () => (
    <svg version="1.1"
         viewBox="0 0 40 40" style={{enableBackground:'new 0 0 40 40'}}>
        <g id="Layer_2" className="st0" style={{display: 'none'}}>
            <polygon className="st1" style={{display: 'inline', fill: '#ff5200'}} points="4.83,7.95 20,33.02 34.99,7.95"/>
        </g>
        <g id="Layer_1">
            <path className="st2"
                  style={{fill: '#ff5200'}}
              d="M29,35H11c-3.31,0-6-2.69-6-6V11c0-3.31,2.69-6,6-6h18c3.31,0,6,2.69,6,6v18C35,32.31,32.31,35,29,35z"/>
            <g>
                <path className="st3" style={{fill: '#ffffff'}}d="M14.98,11.8c0.05,0.46,0.08,0.96,0.11,1.51c0.02,0.55,0.04,1.01,0.04,1.37h0.07
                    c0.48-0.98,1.26-1.78,2.34-2.39s2.22-0.92,3.42-0.92c2.13,0,3.73,0.64,4.8,1.91c1.07,1.27,1.6,2.95,1.6,5.04v10.32h-2.45v-9.31
                    c0-0.89-0.07-1.69-0.22-2.41c-0.14-0.72-0.39-1.34-0.74-1.85c-0.35-0.52-0.82-0.92-1.4-1.21c-0.59-0.29-1.33-0.43-2.21-0.43
                    c-0.65,0-1.28,0.13-1.89,0.4c-0.61,0.26-1.16,0.67-1.64,1.2s-0.86,1.22-1.15,2.05c-0.29,0.83-0.43,1.8-0.43,2.93v8.63h-2.45V15.5
                    c0-0.46-0.01-1.04-0.04-1.76s-0.06-1.37-0.11-1.94H14.98z"/>
            </g>
        </g>
    </svg>
);

const NexusNavIcon = () => <Icon glyph={navLogoSvg} label="Custom icon" size="xlarge" />;


export default NexusNavIcon;