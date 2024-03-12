import React from 'react';
import { useAdvertiserStats, useDevice, usePoiPoaStatus } from '@/hooks';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfile from '../MyProfile';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <div id='v2_modal_root' />
        {children}
    </APIProvider>
);

jest.mock('use-query-params', () => ({
    ...jest.requireActual('use-query-params'),
    useQueryParams: jest.fn().mockReturnValue([{}, jest.fn()]),
}));

jest.mock('@/components/Verification', () => ({
    Verification: jest.fn(() => <div>Verification</div>),
}));
jest.mock('@/components/Modals/NicknameModal', () => ({
    NicknameModal: jest.fn(({ isModalOpen }) => {
        if (isModalOpen) return <div>NicknameModal</div>;
        return <></>;
    }),
}));
jest.mock('../../MyProfileContent', () => ({
    MyProfileContent: jest.fn(() => <div>MyProfileContent</div>),
}));
jest.mock('../../MyProfileStats', () => ({
    MyProfileStats: jest.fn(() => <div>MyProfileStatsScreen</div>),
}));
jest.mock('../../MyProfileAdDetails', () => ({
    MyProfileAdDetails: jest.fn(() => <div>MyProfileAdDetailsScreen</div>),
}));
jest.mock('../../MyProfileCounterparties', () => ({
    MyProfileCounterparties: jest.fn(() => <div>MyProfileCounterpartiesScreen</div>),
}));
jest.mock('../../PaymentMethods', () => ({
    PaymentMethods: jest.fn(() => <div>PaymentMethodsScreen</div>),
}));
jest.mock('../MyProfileMobile', () => ({
    __esModule: true,
    default: jest.fn(() => <div>MyProfileMobile</div>),
}));

const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;
const mockUsePoiPoaStatus = usePoiPoaStatus as jest.MockedFunction<typeof usePoiPoaStatus>;
const mockUseAdvertiserStats = useAdvertiserStats as jest.MockedFunction<typeof useAdvertiserStats>;
jest.mock('@/hooks', () => ({
    useAdvertiserStats: jest.fn().mockReturnValue({
        data: {
            fullName: 'Jane Done',
        },
        failureReason: undefined,
        isLoading: false,
    }),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
    usePoiPoaStatus: jest.fn().mockReturnValue({
        data: {
            isP2PPoaRequired: false,
            isPoaVerified: true,
            isPoiVerified: true,
        },
        isLoading: false,
    }),
    useQueryString: jest.fn(() => ({
        queryString: {},
        setQueryString: jest.fn(),
    })),
}));

describe('MyProfile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render the loader component when data is not ready', () => {
        (mockUseAdvertiserStats as jest.Mock).mockReturnValueOnce({
            isLoading: true,
        });
        render(<MyProfile />, { wrapper });
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });
    it('should render the verification component if user has not completed POI ', () => {
        (mockUsePoiPoaStatus as jest.Mock).mockReturnValueOnce({
            data: { isPoaVerified: true, isPoiVerified: false },
            isLoading: false,
        });

        render(<MyProfile />, { wrapper });
        expect(screen.getByText('Verification')).toBeInTheDocument();
    });
    it('should render the verification component if user has not completed  POA', () => {
        (mockUsePoiPoaStatus as jest.Mock).mockReturnValueOnce({
            data: { isPoaVerified: false, isPoiVerified: true },
            isLoading: false,
        });

        render(<MyProfile />, { wrapper });
        expect(screen.getByText('Verification')).toBeInTheDocument();
    });
    it('should show the nickname modal if user has completed POI or POA for the first time', () => {
        (mockUsePoiPoaStatus as jest.Mock).mockReturnValueOnce({
            data: { isPoaVerified: true, isPoiVerified: true },
            isLoading: false,
        });

        (mockUseAdvertiserStats as jest.Mock).mockReturnValueOnce({
            data: {
                fullName: 'Jane Doe',
            },
            failureReason: 'Failure',
            isLoading: false,
        });

        render(<MyProfile />, { wrapper });
        expect(screen.getByText('NicknameModal')).toBeInTheDocument();
    });
    it('should render the tabs and correct screens', () => {
        render(<MyProfile />, { wrapper });
        expect(screen.getByText('MyProfileStatsScreen')).toBeInTheDocument();

        const paymentMethodsBtn = screen.getByRole('button', {
            name: 'Payment methods',
        });
        userEvent.click(paymentMethodsBtn);
        expect(screen.getByText('PaymentMethodsScreen')).toBeInTheDocument();
    });
    it('should render the mobile view', () => {
        (mockUseDevice as jest.Mock).mockReturnValueOnce({
            isMobile: true,
        });

        render(<MyProfile />, { wrapper });
        expect(screen.getByText('MyProfileMobile')).toBeInTheDocument();
    });
});
