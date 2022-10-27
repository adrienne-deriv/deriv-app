import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import BuySellModal from './modals/buy-sell-modal.jsx';

export const useStateWithModal = defaultState => {
    const { modal_store } = useStores();
    const [localState, setLocalState] = React.useState(defaultState);

    React.useEffect(() => {
        // update props to modal store here
    }, [localState]);

    return propsToModals => {
        Object.keys(propsToModals).forEach(prop => {
            let modal_id = propsToModals[prop];
            modal_store.passProps(modal_id, {
                [prop]: localState,
            });
        });
        return [localState, setLocalState];
    };
};

const ModalManager = () => {
    const { modal_store } = useStores();

    React.useEffect(() => {
        const onUnmount = modal_store.onMount();

        return onUnmount;
    }, []);

    if (modal_store.modal_id) {
        return <BuySellModal />;
    }

    return null;
};

export default observer(ModalManager);
