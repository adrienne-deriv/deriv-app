import React from 'react';

export const lazyModals = {
    BuySellModal: React.lazy(() => import(/* webpackMode: "eager" */ './buy-sell-modal.jsx')),
    FilterModal: React.lazy(() => import(/* webpackMode: "eager" */ './filter-modal')),
    QuickAddModal: React.lazy(() => import(/* webpackMode: "eager" */ './quick-add-modal.jsx')),
    CancelAddPaymentMethodModal: React.lazy(() =>
        import(/* webpackMode: "eager" */ './cancel-add-payment-method-modal.jsx')
    ),
};

export const modals = Object.keys(lazyModals);
