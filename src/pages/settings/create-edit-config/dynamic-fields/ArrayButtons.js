import React from 'react';
import {Button} from 'primereact/button';

export const arrayElementButtons = (index, fieldsLength, onAdd, onRemove, shouldAddMargin = false) => {
    return (
        <div className={`col-2 text-center ${shouldAddMargin ? 'nexus-c-col-margin-bottom' : ''}`}>
            {fieldsLength > 1 && (
                <Button
                    className="p-button-text"
                    icon="pi pi-trash"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove();
                    }}
                />
            )}
        </div>
    );
};
