import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { BUY_SELL_MODAL, CANCEL_ADD_PAYMENT_METHOD_MODAL, QUICK_ADD_MODAL } from './modal-id';
import CancelAddPaymentMethodModal from 'Components/my-profile/payment-methods/add-payment-method/cancel-add-payment-method-modal';
import QuickAddModal from 'Components/my-ads/quick-add-modal';
import BuySellModal from 'Components/buy-sell/buy-sell-modal';
import { reaction } from 'mobx';

export const useModalManager = (...modals) => {
    const { modal_store } = useStores();

    React.useEffect(() => {
        modals.map(({ id, props }) => {
            Object.values(props).map(prop => {
                modal_store.setModalProps(id, prop());
            });
        });

        return modal_store.clearModalProps;
    }, []);

    // return { showModal: modal_store.showModal, hideModal: modal_store.hideModal };
    return null;
};

const ModalManager = () => {
    const { modal_store } = useStores();
    const [root, setRoot] = React.useState();

    React.useEffect(() => {
        const modal_root = document.getElementById('modal_root');
        if (modal_root) setRoot(modal_root);

        // only the views can decide to show a modal by calling general_store.setShouldShowModal(true)
    }, []);

    // // const mountToRoot = (children) => ReactDOM.createPortal(
    // //     <CancelAddPaymentMethodModal {...modal_store.getModalProps(modal_store.current_modal)} />,
    // //     root
    // // )

    // switch (modal_store.current_modal) {
    //     case BUY_SELL_MODAL:
    //         return <BuySellModal {...modal_store.props} />;
    //     case '':
    //     default:
    //         return null;
    // }

    console.log(typeof modal_store.current_modal);
    console.log(modal_store.current_modal);
    if (modal_store.current_modal && root) {
        return modal_store.current_modal();
    }
    return null;
};

export default observer(ModalManager);
