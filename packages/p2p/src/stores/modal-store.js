import { action, computed, makeObservable, observable, reaction } from 'mobx';
import BaseStore from 'Stores/base_store';

export default class ModalStore extends BaseStore {
    modal_id = '';
    current_modal = '';
    is_modal_open = false;
    modal_history = null;
    previous_modal = '';

    cleanupFn = null;
    modal_props = observable.map(new Map());
    should_switch_modal = false;
    MODAL_TRANSITION_DELAY = 50;

    constructor(root_store) {
        super(root_store);

        makeObservable(this, {
            current_modal: observable,
            is_modal_open: observable,
            modal_id: observable,
            // modal_props: observable.map,
            modal_history: observable,
            previous_modal: observable,

            props: computed,
            history: computed,
            initial_values: computed,
            clearHistory: action.bound,
            onMount: action.bound,
            setCurrentModal: action.bound,
            setIsModalOpen: action.bound,
            setModalId: action.bound,
            passModalProps: action.bound,
            setPreviousModal: action.bound,
            showModal: action.bound,
            hideModal: action.bound,
        });
    }

    get history() {
        return this.modal_history;
    }

    get props() {
        return this.modal_props.get(this.current_modal);
    }

    get has_history() {
        return this.modal_history !== null;
    }

    get initial_values() {
        // let ret = this.modal_history;
        // // if (this.modal_history) {
        // //     console.log('RESET MODAL HISTORY');
        // //     this.setModalHistory(null);
        // // }
        return this.modal_history.values;
    }

    clearHistory() {
        this.setModalHistory(null);
    }

    onMount() {
        // only this reaction can modify is_modal_open and modal_id, NO ONE ELSE CAN DO IT!
        const disposer = reaction(
            () => this.current_modal,
            () => {
                if (this.is_modal_open) {
                    if (typeof this.cleanupFn === 'function') {
                        this.cleanupFn();
                    }
                    // case 1: there is a current modal being shown, and they want to show another modal
                    if (this.should_switch_modal) {
                        this.setIsModalOpen(false);
                        setTimeout(() => {
                            this.setModalId(this.current_modal);
                            this.setIsModalOpen(true);
                        }, this.MODAL_TRANSITION_DELAY);
                    } else {
                        this.setIsModalOpen(false);
                        this.setModalId('');
                    }
                } else {
                    if (this.should_switch_modal) {
                        // / case 2: there is a previous modal that was shown, switch to that previous modal and reset previous modal state
                        this.setIsModalOpen(false);
                        setTimeout(() => {
                            this.setModalId(this.current_modal);
                            this.setIsModalOpen(true);
                        }, this.MODAL_TRANSITION_DELAY);
                    } else {
                        console.log('here?', this.current_modal);
                        this.setModalId(this.current_modal);
                        this.setIsModalOpen(true);
                    }
                }
            }
        );

        return disposer;
    }

    setCurrentModal(modal_id) {
        this.current_modal = modal_id;
    }

    setIsModalOpen(is_modal_open) {
        this.is_modal_open = is_modal_open;
    }

    setModalHistory(modal_history) {
        this.modal_history = modal_history;
    }

    setModalId(modal_id) {
        this.modal_id = modal_id;
    }

    passModalProps(modal_id, modal_props) {
        if (this.modal_props.has(modal_id)) {
            let prop = this.modal_props.get(modal_id);
            this.modal_props.set(modal_id, {
                ...prop,
                ...modal_props,
            });
        } else {
            this.modal_props.set(modal_id, modal_props);
        }
    }

    setPreviousModal(modal_id) {
        this.previous_modal = modal_id;
    }

    showModal(modal_id, should_save_history = false) {
        if (should_save_history) {
            const { general_store } = this.root_store;
            console.log('form state', general_store.form_state);
            this.setModalHistory(general_store.formik_ref);
        }
        // case 1: there is a current modal being shown, and they want to show another modal
        if (this.current_modal) {
            console.log('there is a modal!');
            this.should_switch_modal = true;
            this.setPreviousModal(this.current_modal);
            this.setCurrentModal(modal_id);
        } else {
            this.setCurrentModal(modal_id);
        }
    }

    hideModal(cleanupFn) {
        // case 1: there is no previous modal and only 1 modal is shown
        if (cleanupFn) this.cleanupFn = cleanupFn;

        if (this.previous_modal === '') {
            this.setCurrentModal('');
        } else {
            // case 2: there is a previous modal that was shown, switch to that previous modal and reset previous modal state
            this.should_switch_modal = true;
            this.setCurrentModal(this.previous_modal);
            this.setPreviousModal('');
        }
    }

    // better than just hideModal(should_clear_history = false, cleanupFn)
    hideModalAndClearHistory(cleanupFn) {
        this.clearHistory();
        this.hideModal(cleanupFn);
    }
}
