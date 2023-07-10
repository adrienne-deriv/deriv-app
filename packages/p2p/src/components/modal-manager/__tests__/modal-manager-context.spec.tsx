import React from 'react';
import { render } from '@testing-library/react';
import { TModalManagerContext } from 'Types';
import ModalManager from '../modal-manager';

let mock_modal_manager_state: TModalManagerContext;

function MockModal({ title, subtitle }: { title?: string; subtitle?: string }) {
    if (title && subtitle) {
        return (
            <div>
                BuySellModal with {title} and {subtitle}
            </div>
        );
    } else if (title) {
        return <div>BuySellModal with {title}</div>;
    }
    return <div>BuySellModal</div>;
}

jest.mock('Constants/modals', () => ({
    Modals: {
        BuySellModal: MockModal,
    },
}));

describe('<ModalManager />', () => {
    beforeEach(() => {
        mock_modal_manager_state = {
            is_modal_open: true,
            modal: {
                key: 'BuySellModal',
                props: {},
            },
            hideModal: jest.fn(),
            isCurrentModal: jest.fn(),
            modal_props: new Map(),
            previous_modal: null,
            showModal: jest.fn(),
            stacked_modal: null,
            useRegisterModalProps: jest.fn(),
        };
    });

    afterAll(() => {
        jest.resetModules();
        jest.resetAllMocks();
    });

    it('should throw an error if not wrapped with ModalManagerContextProvider component', () => {
        mock_modal_manager_state.modal = {
            key: 'BuySellModal',
            props: {},
        };

        expect(() =>
            render(
                <React.Fragment>
                    <ModalManager />
                </React.Fragment>
            )
        ).toThrowError();
    });
});
