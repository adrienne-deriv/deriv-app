import React from 'react';
import { observer } from 'mobx-react-lite';
import { reaction } from 'mobx';
import { useStores } from 'Stores';

/**
 *
 * @param {*} defaultState
 * @returns
 */
export const useStateWithModal = defaultState => {
    const { modal_store } = useStores();
    const [localState, setLocalState] = React.useState(defaultState);
    const [modalProps, setModalProps] = React.useState(undefined);

    React.useEffect(() => {
        if (modalProps) {
            Object.keys(modalProps).forEach(prop => {
                let modal_id = modalProps[prop];
                modal_store.passModalProps(modal_id, {
                    [prop]: localState,
                });
            });
        }
    }, [localState]);

    return propsToModals => {
        if (!modalProps) {
            setModalProps(propsToModals);
        }
        Object.keys(propsToModals).forEach(prop => {
            let modal_id = propsToModals[prop];
            modal_store.passModalProps(modal_id, {
                [prop]: localState,
            });
        });
        return [localState, setLocalState];
    };
};

const modals = {
    BuySellModal: React.lazy(() => import(/* webpackChunkName: "buy-sell-modal" */ './modals/buy-sell-modal.jsx')),
    FilterModal: React.lazy(() => import(/* webpackChunkName: "filter-modal" */ './modals/filter-modal')),
    QuickAddModal: React.lazy(() => import(/* webpackChunkName: "quick-add-modal" */ './modals/quick-add-modal.jsx')),
};

const ModalManager = () => {
    const { modal_store } = useStores();
    const [LazyModal, setLazyModal] = React.useState(null);

    React.useEffect(() => {
        const onUnmount = modal_store.onMount();

        const disposeLazyModalSetterReaction = reaction(
            () => modal_store.modal_id,
            () => {
                setLazyModal(modals[modal_store.modal_id]);
            }
        );

        return () => {
            disposeLazyModalSetterReaction();
            onUnmount();
        };
    }, []);

    if (modal_store.modal_id) {
        return (
            <React.Suspense fallback={null}>
                <LazyModal />
            </React.Suspense>
        );
    }

    return null;
};

export default observer(ModalManager);
