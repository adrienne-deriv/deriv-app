// import { makeLazyLoader } from '@deriv/shared';
// import React from 'react';
// import Loadable from 'react-loadable';
import BuySellModal from 'Components/buy-sell/buy-sell-modal.jsx';

// const loadModal = modalPath => {
//     // Cannot find module
//     return React.lazy(() => import(`${__dirname}/${modalPath}`));
// };

// const modals = {
//     BuySellModal: loadModal('../buy-sell/buy-sell-modal.jsx'),
//     CancelAddPaymentMethodModal: loadModal(
//         "../my-profile/payment-methods/add-payment-method/cancel-add-payment-method-modal.jsx'"
//     ),
// };

// TODO: Load these lazily using React.lazy
const modals = {
    BuySellModal,
};

export default modals;
