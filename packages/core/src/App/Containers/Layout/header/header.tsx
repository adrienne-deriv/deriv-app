import React from 'react';
import { useLocation } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { makeLazyLoader, moduleLoader, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import { useOauth2 } from '@deriv/hooks';

const HeaderFallback = () => {
    return <div className={classNames('header')} />;
};

const DefaultHeader = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "default-header" */ './default-header')),
    () => <HeaderFallback />
)();

const DefaultHeaderWallets = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "default-header-wallets" */ './default-header-wallets')),
    () => <HeaderFallback />
)();

const DTraderHeader = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "dtrader-header" */ './dtrader-header')),
    () => <HeaderFallback />
)();

const DTraderHeaderWallets = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "dtrader-header-wallets" */ './dtrader-header-wallets')),
    () => <HeaderFallback />
)();

const TradersHubHeader = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "traders-hub-header" */ './traders-hub-header')),
    () => <HeaderFallback />
)();

const TradersHubHeaderWallets = makeLazyLoader(
    () =>
        moduleLoader(() => import(/* webpackChunkName: "traders-hub-header-wallets" */ './traders-hub-header-wallets')),
    () => <HeaderFallback />
)();

const Header = observer(() => {
    const { client, common } = useStore();
    const { accounts, has_wallet, is_logged_in, setAccounts, loginid, switchAccount, is_client_store_initialized } =
        client;
    const { is_from_tradershub_os } = common;
    const { pathname } = useLocation();
    const { isOauth2Enabled } = useOauth2({ handleLogout: () => Promise.resolve() });

    const is_wallets_cashier_route = pathname.includes(routes.wallets);

    const traders_hub_routes =
        [
            routes.traders_hub,
            routes.account,
            routes.cashier,
            routes.wallets_compare_accounts,
            routes.compare_cfds,
        ].includes(pathname) ||
        pathname.startsWith(routes.compare_cfds) ||
        is_wallets_cashier_route;

    const client_accounts = useReadLocalStorage('client.accounts');
    React.useEffect(() => {
        if (has_wallet && is_logged_in) {
            const accounts_keys = Object.keys(accounts ?? {});
            const client_accounts_keys = Object.keys(client_accounts ?? {});
            if (client_accounts_keys.length > accounts_keys.length) {
                setAccounts(
                    client_accounts as Record<string, ReturnType<typeof useStore>['client']['accounts'][number]>
                );
            }
        }
    }, [accounts, client_accounts, has_wallet, is_logged_in, loginid, setAccounts, switchAccount]);

    const loggedState = Cookies.get('logged_state');
    const clientAccounts = JSON.parse(localStorage.getItem('client.accounts') || '{}');
    const isClientAccountsPopulated = Object.keys(clientAccounts).length > 0;

    const willEventuallySSO = loggedState === 'true' && !isClientAccountsPopulated;
    const willEventuallySLO = loggedState === 'false' && isClientAccountsPopulated;
    if (isOauth2Enabled && (!is_client_store_initialized || willEventuallySSO || willEventuallySLO)) {
        return <HeaderFallback />;
    }

    if (is_logged_in) {
        let result;
        switch (true) {
            case pathname === routes.onboarding:
                result = null;
                break;
            case traders_hub_routes:
                result = has_wallet ? <TradersHubHeaderWallets /> : <TradersHubHeader />;
                break;
            case pathname.includes(routes.account):
                if (is_from_tradershub_os) {
                    result = <DTraderHeader />;
                } else {
                    result = has_wallet ? <DTraderHeaderWallets /> : <DTraderHeader />;
                }
                break;
            default:
                result = has_wallet ? <DTraderHeaderWallets /> : <DTraderHeader />;
                break;
        }
        return result;
    } else if (pathname === routes.onboarding) {
        return null;
    }
    return has_wallet ? <DefaultHeaderWallets /> : <DefaultHeader />;
});

export default Header;
