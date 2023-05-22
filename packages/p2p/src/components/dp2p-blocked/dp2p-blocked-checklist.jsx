import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Checklist } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from '../i18next';
import './dp2p-blocked-checklist.scss';

const Dp2pBlockedChecklist = () => {
    const { general_store } = useStores();
    const history = useHistory();

    if (general_store.is_high_risk && !general_store.is_blocked) {
        const checklist_items = [
            {
                content: localize('Complete the financial assessment form'),
                status: 'action',
                onClick: () =>
                    history.push({
                        pathname: routes.financial_assessment,
                    }),
            },
        ];

        return (
            <div className='dp2p-blocked-checklist__container'>
                <Checklist className='dp2p-blocked-checklist' items={checklist_items} />
            </div>
        );
    }

    return null;
};

export default observer(Dp2pBlockedChecklist);
