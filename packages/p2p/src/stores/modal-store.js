import { action, computed, observable, reaction, when } from 'mobx';
import BaseStore from 'Stores/base_store';
import BuySellModal from '../components/buy-sell/buy-sell-modal';
import React from 'react';

export default class ModalStore extends BaseStore {
    @observable current_modal = BuySellModal;
    @observable previous_modal = null;
    @observable is_modal_open = false;
    @observable modal_id = '';
    @observable modal_props = new Map();
    @observable modal_history = null;

    MODAL_TRANSITION_DURATION = 1000;

    constructor(root_store) {
        super(root_store);
        // reaction(
        //     () => this.is_modal_open,
        //     () => {
        //         // allow the current modal to hide first, while playing its animation
        //         this.setIsModalOpen(false);
        //         if (this.current_modal.length === 0 && this.previous_modal) {
        //             setPreviousModal('');
        //         } else if (current_modal && !previous_modal) {
        //             setPreviousModal({
        //                 id: general_store.modal_id,
        //                 history: general_store.modal_history,
        //             });
        //             setTimeout(() => {
        //                 // then only switch modal after the current modal has fully hidden and finished its closing animation with a specified allowed max timeout
        //                 // general_store.setModalId(general_store.modal_id); // check if this works, when user calls general_store.openModal(id) it already calls setModalId(id)
        //                 this.setModalId(this.current_modal);
        //                 this.setIsModalOpen(true);
        //                 // setCurrentModal(general_store.modal_id);
        //                 // general_store.setIsModalOpen(true);
        //             }, this.MODAL_TRANSITION_DURATION);
        //         } else {
        //         }
        //     }
        // );

        // only this reaction can alter modal_id
        // when(
        //     () => !this.is_modal_open,
        //     () => {
        //         // if (!this.current_modal) {

        //         // }
        //         console.log('MODA CLOSED?');
        //         setTimeout(() => {
        //             this.setModalId(this.current_modal);
        //         }, this.MODAL_TRANSITION_DURATION);
        //     }
        // );

        // when(
        //     () => this.is_modal_open,
        //     () => {
        //         console.log('MODAL');
        //         if (this.previous_modal) {
        //             setTimeout(() => {
        //                 this.setModalId(this.current_modal);
        //             }, this.MODAL_TRANSITION_DURATION);
        //         } else {
        //             // no other modals opened previously, so can safely just open this modal
        //             console.log('current modal', this.current_modal);
        //             // this.setModalId(this.current_modal);
        //             setTimeout(() => {
        //                 this.setModalId(this.current_modal);
        //             }, this.MODAL_TRANSITION_DURATION);
        //         }
        //     }
        // );
    }

    @computed
    get props() {
        if (!this.modal_props.has(this.current_modal)) {
            return {};
        }
        console.log('getting props: ', this.modal_props.get(this.current_modal));
        return this.modal_props.get(this.current_modal);
    }

    @action.bound
    setModalProps(modal_id, modal_props) {
        this.modal_props.set(modal_id, modal_props);
    }
    @action.bound
    setProps(props) {
        this.current_modal.props = props;

        // // console.log(typeof this.current_modal);
        // this.current_modal = React.cloneElement(this.current_modal, props);
    }

    @action.bound
    clearModalProps() {
        this.modal_props.clear();
    }

    @action.bound
    saveModalHistory() {
        const { general_store } = useStores();
        this.modal_history = general_store.formik_ref.current.values;
    }

    @action.bound
    passModalProps(modal_id, modal_props) {
        this.modal_props.set(modal_id, modal_props);
    }

    @action.bound
    setIsModalOpen(is_modal_open) {
        this.is_modal_open = is_modal_open;
    }

    @action.bound
    setCurrentModal(modal_id) {
        this.current_modal = modal_id;
    }

    @action.bound
    setModalId(modal_id) {
        this.modal_id = modal_id;
    }

    @action.bound
    setPreviousModal(modal_id) {
        this.previous_modal = modal_id;
    }

    @action.bound
    clearModalHistory() {
        this.modal_history = null;
    }

    // TODO: add another option later to pass in callback function
    @action.bound
    showModal(modal_id, should_save_history = false) {
        if (should_save_history) {
            this.saveModalHistory();
        }
        this.setPreviousModal(this.current_modal);
        this.setCurrentModal(BuySellModal);
        this.setIsModalOpen(true);
    }

    @action.bound
    hideModal() {
        // if (should_hide_all_modals) {
        //     this.setCurrentModal('');
        //     this.setPreviousModal('');
        //     // TODO: Do more cleanupss
        // } else {
        //     // this.setCurrentModal(this.previous_modal);
        //     // this.setPreviousModal('');
        //     this.setPreviousModal(this.current_modal);
        //     this.setCurrentModal('');
        //     this.setIsModalOpen(false);
        // }
        this.setCurrentModal('');
        this.setPreviousModal('');
        this.setIsModalOpen(false);
    }
}
