import React, { FC, useMemo } from 'react';
import * as Yup from 'yup';
import { useAuthentication, usePOA, usePOI } from '@deriv/api';
import { ModalStepWrapper, WalletButton } from '../../../../components/Base';
import { FlowProvider, TFlowProviderContext } from '../../../../components/FlowProvider';
import { Loader } from '../../../../components/Loader';
import { useModal } from '../../../../components/ModalProvider';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { ManualDocumentUpload, PersonalDetails, ResubmitPOA } from '../../../accounts/screens';
import { IDVDocumentUpload } from '../../../accounts/screens/IDVDocumentUpload';
import { MT5PasswordModal } from '../../modals';
import { Onfido } from '../../screens';

const Loading = () => {
    return (
        <div style={{ height: 400, width: 600 }}>
            <Loader />
        </div>
    );
};

const Password = () => {
    return <div style={{ fontSize: 60, height: 400, width: 600 }}>Password screen</div>;
};

// TODO: Replace these mock components with the screens
const screens = {
    idvScreen: <IDVDocumentUpload />,
    loadingScreen: <Loading />,
    manualScreen: <ManualDocumentUpload />,
    onfidoScreen: <Onfido />,
    passwordScreen: <Password />,
    personalDetailsScreen: <PersonalDetails />,
    poaScreen: <ResubmitPOA />,
};

type TVerificationProps = {
    marketType: TMarketTypes.All;
    platform: TPlatforms.All;
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

const Verification: FC<TVerificationProps> = ({ marketType, platform, selectedJurisdiction }) => {
    const { data: poiStatus, isSuccess: isSuccessPOIStatus } = usePOI();
    const { data: poaStatus, isSuccess: isSuccessPOAStatus } = usePOA();
    const { data: authenticationData } = useAuthentication();
    const { hide, show } = useModal();

    const isLoading = useMemo(() => {
        return !isSuccessPOIStatus || !isSuccessPOAStatus;
    }, [isSuccessPOIStatus, isSuccessPOAStatus]);

    const hasAttemptedPOA = poaStatus?.has_attempted_poa || true;
    const needPersonalDetails = true;

    const initialScreenId: keyof typeof screens = useMemo(() => {
        const service = poiStatus?.current?.service as keyof THooks.POI['services'];

        if (isSuccessPOIStatus && poiStatus?.services) {
            const serviceStatus = poiStatus.services?.[service];

            if (!isSuccessPOIStatus) return 'loadingScreen';
            if (serviceStatus === 'pending' || serviceStatus === 'verified') {
                if (authenticationData?.is_poa_needed && !hasAttemptedPOA) return 'poaScreen';
                if (needPersonalDetails) return 'personalDetailsScreen';
                return 'passwordScreen';
            }
            if (service === 'idv') return 'idvScreen';
            if (service === 'onfido') return 'onfidoScreen';
            if (service === 'manual') return 'manualScreen';
        }
        return 'loadingScreen';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        hasAttemptedPOA,
        needPersonalDetails,
        authenticationData?.is_poa_needed,
        poiStatus,
        poiStatus?.services,
        poiStatus?.current?.service,
        isSuccessPOIStatus,
    ]);

    const isNextDisabled = ({ currentScreenId, errors }: TFlowProviderContext<typeof screens>) => {
        const isVerified = (...fields: string[]) => {
            return fields.every(field => !errors[field]);
        };
        switch (currentScreenId) {
            case 'idvScreen':
                return !isVerified('dateOfBirth', 'documentNumber', 'firstName', 'lastName');
            default:
                return false;
        }
    };

    const nextFlowHandler = ({ currentScreenId, switchScreen }: TFlowProviderContext<typeof screens>) => {
        if (['idvScreen', 'onfidoScreen', 'manualScreen'].includes(currentScreenId)) {
            if (hasAttemptedPOA) {
                switchScreen('poaScreen');
            } else if (needPersonalDetails) {
                switchScreen('personalDetailsScreen');
            } else {
                switchScreen('passwordScreen');
            }
        } else if (currentScreenId === 'poaScreen') {
            if (needPersonalDetails) {
                switchScreen('personalDetailsScreen');
            }
        } else if (currentScreenId === 'personalDetailsScreen') {
            show(<MT5PasswordModal marketType={marketType} platform={platform} />);
        } else {
            hide();
        }
    };

    // NOTE: These are test validations for input fields, add the correct validators here for different screens
    const validationSchema = Yup.object().shape({
        dateOfBirth: Yup.date().required(),
        documentNumber: Yup.string()
            .min(16, 'Please enter the correct format. Example: 1234567890123456')
            .matches(/^[aA-zZ\s]+$/, 'Letters, spaces, periods, hyphens, apostrophes only.')
            .required(),
        firstName: Yup.string()
            .min(1)
            .max(10, 'First name can only have at max 10 characters')
            .required('This field is required'),
        lastName: Yup.string().min(1).max(20).required(),
    });

    return (
        <FlowProvider
            initialScreenId={initialScreenId}
            initialValues={{
                selectedJurisdiction,
            }}
            screens={screens}
            validationSchema={validationSchema}
        >
            {context => {
                return (
                    <ModalStepWrapper
                        renderFooter={() => {
                            return (
                                <WalletButton
                                    disabled={isNextDisabled(context)}
                                    isLoading={isLoading}
                                    onClick={() => nextFlowHandler(context)}
                                    size='lg'
                                    text='Next'
                                />
                            );
                        }}
                        title='Add a real MT5 account'
                    >
                        {context.WalletScreen}
                    </ModalStepWrapper>
                );
            }}
        </FlowProvider>
    );
};

export default Verification;
