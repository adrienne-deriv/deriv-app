import React from 'react';
import { useSafeState } from '@deriv/components';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return/page-return.jsx';
import Verification from 'Components/verification/verification.jsx';
import RateChangeModal from 'Components/buy-sell/rate-change-modal.jsx';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import BuySellHeader from './buy-sell-header.jsx';
// import BuySellModal from './buy-sell-modal.jsx';
import BuySellTable from './buy-sell-table.jsx';
import FilterModal from './filter-modal';
import './buy-sell.scss';
import { useModalManager } from 'Components/modals/modal-manager';
import { BUY_SELL_MODAL } from '../modals/modal-id.js';

const BuySell = () => {
    const { buy_sell_store, modal_store } = useStores();
    const [is_toggle_visible, setIsToggleVisible] = useSafeState(true);
    const previous_scroll_top = React.useRef(0);
    // Q: Will passing observables through arguments/objects be observed later?
    // useModalManager({
    //     id: BUY_SELL_MODAL,
    //     props: observable.object({
    //         selected_ad: () => buy_sell_store.selected_ad_state,
    //         // should_show_popup: modal_store.is_modal_open,
    //         // setShouldShowPopup: should_show_popup => {
    //         //     if (should_show_popup) {
    //         //         modal_store.showModal(BUY_SELL_MODAL);
    //         //     } else {
    //         //         modal_store.hideModal(BUY_SELL_MODAL);
    //         //     }
    //         // },
    //         table_type: () => buy_sell_store.table_type,
    //     }),
    // });
    modal_store.setProps({
        selected_ad: buy_sell_store.selected_ad_state,
        table_type: buy_sell_store.table_type,
        setShouldShowPopup: should_show_popup => {
            if (should_show_popup) {
                modal_store.showModal(BUY_SELL_MODAL);
            } else {
                modal_store.hideModal(BUY_SELL_MODAL);
            }
        },
    });

    React.useEffect(() => {
        const disposeIsListedReaction = buy_sell_store.registerIsListedReaction();
        const disposeAdvertIntervalReaction = buy_sell_store.registerAdvertIntervalReaction();

        return () => {
            disposeIsListedReaction();
            disposeAdvertIntervalReaction();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onScroll = event => {
        if (!buy_sell_store.show_advertiser_page) {
            if (event.target.scrollTop !== previous_scroll_top.current) {
                const is_scrolling_down = event.target.scrollTop > previous_scroll_top.current;
                setIsToggleVisible(!is_scrolling_down);
            }

            previous_scroll_top.current = event.target.scrollTop;
        }
    };

    if (buy_sell_store.should_show_verification) {
        return (
            <React.Fragment>
                <PageReturn onClick={buy_sell_store.hideVerification} page_title={localize('Verification')} />
                <Verification />
            </React.Fragment>
        );
    }

    return (
        <div className='buy-sell'>
            <FilterModal />
            <BuySellHeader
                is_visible={is_toggle_visible}
                table_type={buy_sell_store.table_type}
                setTableType={buy_sell_store.setTableType}
            />
            <BuySellTable
                key={buy_sell_store.table_type}
                is_buy={buy_sell_store.table_type === buy_sell.BUY}
                setSelectedAdvert={buy_sell_store.setSelectedAdvert}
                showAdvertiserPage={buy_sell_store.showAdvertiserPage}
                onScroll={onScroll}
            />
            {/* <BuySellModal
                selected_ad={buy_sell_store.selected_ad_state}
                should_show_popup={buy_sell_store.should_show_popup}
                setShouldShowPopup={buy_sell_store.setShouldShowPopup}
                table_type={buy_sell_store.table_type}
            /> */}
            <RateChangeModal onMount={buy_sell_store.setShouldShowPopup} />
        </div>
    );
};

BuySell.propTypes = {
    error_message: PropTypes.string,
    hideAdvertiserPage: PropTypes.func,
    hideVerification: PropTypes.func,
    is_submit_disabled: PropTypes.bool,
    navigate: PropTypes.func,
    onCancelClick: PropTypes.func,
    onChangeTableType: PropTypes.func,
    onConfirmClick: PropTypes.func,
    params: PropTypes.object,
    selected_ad_state: PropTypes.object,
    setErrorMessage: PropTypes.func,
    setIsSubmitDisabled: PropTypes.func,
    setSelectedAdvert: PropTypes.func,
    should_show_popup: PropTypes.bool,
    should_show_verification: PropTypes.bool,
    show_advertiser_page: PropTypes.bool,
    showAdvertiserPage: PropTypes.func,
    submitForm: PropTypes.func,
    table_type: PropTypes.string,
};

export default observer(BuySell);
