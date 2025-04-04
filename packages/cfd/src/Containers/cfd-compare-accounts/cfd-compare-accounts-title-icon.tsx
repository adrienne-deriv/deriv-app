import React from 'react';

import { Popover, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

import { TCompareAccountsCard } from 'Components/props.types';

import TradigPlatformIconProps from '../../Assets/svgs/trading-platform';
import { CFD_PLATFORMS, MARKET_TYPE_SHORTCODE } from '../../Helpers/cfd-config';
import {
    generateMarketTypeShortcode,
    getAccountCardTitle,
    getAccountIcon,
    getMarketType,
} from '../../Helpers/compare-accounts-config';

const CFDCompareAccountsTitleIcon = ({ trading_platforms, is_eu_user, is_demo }: TCompareAccountsCard) => {
    const { isDesktop } = useDevice();
    const market_type =
        is_eu_user && trading_platforms.market_type === 'financial'
            ? 'CFDs' // this is for backwards compatibility with BE
            : getMarketType(trading_platforms);

    const market_type_shortcode = generateMarketTypeShortcode(trading_platforms, market_type);

    const jurisdiction_card_icon =
        trading_platforms.platform === CFD_PLATFORMS.DXTRADE || trading_platforms.platform === CFD_PLATFORMS.CTRADER
            ? getAccountIcon(trading_platforms.platform)
            : getAccountIcon(market_type, trading_platforms.product);
    const jurisdiction_card_title =
        trading_platforms.platform === CFD_PLATFORMS.DXTRADE || trading_platforms.platform === CFD_PLATFORMS.CTRADER
            ? getAccountCardTitle(trading_platforms.platform, is_demo)
            : getAccountCardTitle(market_type_shortcode, is_demo);
    const labuan_jurisdiction_message = (
        <Text as='p' size={isDesktop ? 'xxs' : 'xxxs'} align='left'>
            {localize('This account gives you direct market price access and tighter spreads.')}
        </Text>
    );

    return (
        <React.Fragment>
            <div className={'compare-cfd-account-icon-title'}>
                <TradigPlatformIconProps icon={jurisdiction_card_icon} size={48} />
                <div className='compare-cfd-account-icon-title__separator'>
                    <Text as='h1' weight='bold' size='xs' align='center'>
                        {jurisdiction_card_title}
                    </Text>
                    {market_type_shortcode === MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN && (
                        <Popover
                            alignment='bottom'
                            className='compare-cfd-account-labuan-tooltip'
                            classNameBubble='compare-cfd-account-labuan-tooltip--msg'
                            icon='info'
                            disable_message_icon
                            is_bubble_hover_enabled
                            message={labuan_jurisdiction_message}
                            zIndex={9999}
                        />
                    )}
                </div>
            </div>
            <div className='compare-cfd-account-underline' />
        </React.Fragment>
    );
};

export default CFDCompareAccountsTitleIcon;
