import React, { FC, PropsWithChildren } from 'react';
import { ModalStepWrapper } from '../../../../components/Base/ModalStepWrapper';
import InstallationAppleIcon from '../../../../public/images/ic-installation-apple.svg';
import InstallationGoogleIcon from '../../../../public/images/ic-installation-google.svg';
import InstallationHuaweiIcon from '../../../../public/images/ic-installation-huawei.svg';
import './ModalTradeWrapper.scss';
import { WalletText } from '../../../../components/Base';
import QRCode from 'qrcode.react';
import useDevice from '../../../../hooks/useDevice';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { PlatformToTitleMapper } from '../../constants';

const MT5ToLinkMapper = {
    android: 'https://download.mql5.com/cdn/mobile/mt5/android?server=Deriv-Demo,Deriv-Server,Deriv-Server-02',
    huawei: 'https://appgallery.huawei.com/#/app/C102015329',
    ios: 'https://download.mql5.com/cdn/mobile/mt5/ios?server=Deriv-Demo,Deriv-Server,Deriv-Server-02',
};

const LinksMapper: Record<
    TPlatforms.All,
    {
        android: string;
        huawei?: string;
        ios: string;
    }
> = {
    ctrader: {
        android: 'https://play.google.com/store/apps/details?id=com.deriv.ct',
        ios: 'https://apps.apple.com/cy/app/ctrader/id767428811',
    },
    derivez: {
        android: 'https://play.google.com/store/apps/details?id=com.deriv.app&pli=1',
        huawei: 'https://appgallery.huawei.com/#/app/C103801913',
        ios: 'https://apps.apple.com/my/app/deriv-go/id1550561298',
    },
    dxtrade: {
        android: 'https://play.google.com/store/apps/details?id=com.deriv.dx',
        huawei: 'https://appgallery.huawei.com/app/C104633219',
        ios: 'https://apps.apple.com/us/app/deriv-x/id1563337503',
    },
    mt5: {
        android: 'https://download.mql5.com/cdn/mobile/mt5/android?server=Deriv-Demo,Deriv-Server,Deriv-Server-02',
        huawei: 'https://appgallery.huawei.com/#/app/C102015329',
        ios: 'https://download.mql5.com/cdn/mobile/mt5/ios?server=Deriv-Demo,Deriv-Server,Deriv-Server-02',
    },
};

const PlatformToLinkMapper: Record<TPlatforms.All, string> = {
    ctrader: 'https://onelink.to/hyqpv7',
    derivez: 'https://onelink.to/bkdwkd',
    dxtrade: 'https://onelink.to/grmtyx',
    mt5: 'https://onelink.to/grmtyx',
};

const AppToIconMapper: Record<string, React.ComponentType<React.SVGAttributes<SVGElement>>> = {
    android: InstallationGoogleIcon,
    huawei: InstallationHuaweiIcon,
    ios: InstallationAppleIcon,
};

type TModalTradeWrapper = {
    marketType?: TMarketTypes.All;
    platform: TPlatforms.MT5 | TPlatforms.OtherAccounts;
};

const ModalTradeWrapper: FC<PropsWithChildren<TModalTradeWrapper>> = ({ children, platform }) => {
    const { isDesktop } = useDevice();

    return (
        <ModalStepWrapper
            renderFooter={() => {
                return (
                    <div className='wallets-modal-trade-wrapper__footer'>
                        <WalletText align='center' size='sm' weight='bold'>
                            Download Deriv MT5 on your phone to trade with the Deriv MT5 account
                        </WalletText>
                        <div className='wallets-modal-trade-wrapper__footer-installations'>
                            <div className='wallets-modal-trade-wrapper__footer-installations-icons'>
                                {Object.keys(LinksMapper[platform]).map((app, i) => {
                                    const AppIcon = AppToIconMapper[app];
                                    const appLink = LinksMapper[platform][app as 'android' | 'huawei' | 'ios'];
                                    return <AppIcon key={`${app}-${i}`} onClick={() => window.open(appLink)} />;
                                })}
                            </div>
                            {isDesktop && (
                                <div className='wallets-modal-trade-wrapper__footer-installations-qr'>
                                    <QRCode size={80} value={PlatformToLinkMapper[platform]} />
                                    <WalletText align='center' size='xs'>
                                        Scan the QR code to download Deriv {PlatformToTitleMapper[platform]}
                                    </WalletText>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }}
            shouldFixedFooter={isDesktop}
            title='Trade'
        >
            {children}
        </ModalStepWrapper>
    );
};

export default ModalTradeWrapper;
