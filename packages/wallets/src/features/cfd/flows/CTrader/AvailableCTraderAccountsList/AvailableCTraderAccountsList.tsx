import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCreateOtherCFDAccount, useCtraderAccountsList } from '@deriv/api';
import { TradingAccountCard, WalletError } from '../../../../../components';
import {
    ModalStepWrapper,
    ModalWrapper,
    WalletButton,
    WalletButtonGroup,
    WalletText,
} from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../helpers/urls';
import useDevice from '../../../../../hooks/useDevice';
import CTrader from '../../../../../public/images/ctrader.svg';
import { PlatformDetails } from '../../../constants';
import { CFDSuccess } from '../../../screens';
import './AvailableCTraderAccountsList.scss';

const AvailableCTraderAccountsList: React.FC = () => {
    const { hide, show } = useModal();
    const { error, mutate, status } = useCreateOtherCFDAccount();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { isMobile } = useDevice();
    const history = useHistory();
    const { t } = useTranslation();

    const accountType = activeWallet?.is_virtual ? 'demo' : 'real';

    const onSubmit = () => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: 'all',
                platform: 'ctrader',
            },
        });
    };

    const renderButtons = useCallback(
        () => (
            <WalletButtonGroup isFlex isFullWidth>
                <WalletButton onClick={() => hide()} size='lg' text='Maybe later' variant='outlined' />
                <WalletButton
                    onClick={() => {
                        hide();
                        history.push('/wallets/cashier/transfer');
                    }}
                    size='lg'
                    text='Transfer funds'
                />
            </WalletButtonGroup>
        ),

        [hide, history]
    );

    const description =
        accountType === 'demo'
            ? t(
                  'Transfer virtual funds from your Demo Wallet to your {{platformTitle}} Demo account to practice trading.',
                  {
                      platformTitle: PlatformDetails.ctrader.title,
                  }
              )
            : t(
                  'Transfer funds from your {{currencyType}} Wallet to your {{platformTitle}} account to start trading.',
                  {
                      currencyType: activeWallet?.wallet_currency_type,
                      platformTitle: PlatformDetails.ctrader.title,
                  }
              );

    const leadingIcon = () => (
        <div
            className='wallets-available-ctrader__icon'
            onClick={() => {
                window.open(getStaticUrl('/deriv-ctrader'));
            }}
            // Fix sonarcloud issue
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    window.open(getStaticUrl('/deriv-ctrader'));
                }
            }}
        >
            <CTrader />
        </div>
    );

    const trailingButton = () => (
        <WalletButton
            color='primary-light'
            onClick={() => {
                onSubmit();
            }}
            text={t('Get')}
        />
    );

    const successComponent = useCallback(() => {
        if (isMobile) {
            return (
                <ModalStepWrapper renderFooter={renderButtons} title={' '}>
                    <CFDSuccess
                        description={description}
                        displayBalance={cTraderAccounts?.find(account => account.login)?.formatted_balance}
                        marketType='all'
                        platform='ctrader'
                        renderButton={renderButtons}
                        title={t('Your {{platformTitle}} {{accountType}} account is ready', {
                            accountType: accountType === t('demo') ? accountType : '',
                            platformTitle: PlatformDetails.ctrader.title,
                        })}
                    />
                    ;
                </ModalStepWrapper>
            );
        }
        return (
            <ModalWrapper>
                <CFDSuccess
                    description={description}
                    displayBalance={cTraderAccounts?.find(account => account.login)?.formatted_balance}
                    marketType='all'
                    platform='ctrader'
                    renderButton={renderButtons}
                    title={t('Your {{platformTitle}} {{accountType}} account is ready', {
                        accountType: accountType === t('demo') ? accountType : '',
                        platformTitle: PlatformDetails.ctrader.title,
                    })}
                />
            </ModalWrapper>
        );
    }, [accountType, cTraderAccounts, description, isMobile, renderButtons, t]);

    useEffect(() => {
        if (status === 'success') {
            show(successComponent());
        }
        if (status === 'error') {
            show(
                <WalletError
                    errorMessage={error?.error?.message ?? 'Something went wrong. Please try again'}
                    onClick={() => hide()}
                    title={error?.error?.message ?? 'Error'}
                />
            );
        }
    }, [error?.error?.message, hide, show, status, successComponent]);

    return (
        <div className='wallets-available-ctrader'>
            <TradingAccountCard leading={leadingIcon} trailing={trailingButton}>
                <div className='wallets-available-ctrader__details'>
                    <WalletText size='sm' weight='bold'>
                        {PlatformDetails.ctrader.title}
                    </WalletText>
                    <WalletText size='xs'>
                        {t('This account offers CFDs on a feature-rich trading platform.')}
                    </WalletText>
                </div>
            </TradingAccountCard>
        </div>
    );
};

export default AvailableCTraderAccountsList;
