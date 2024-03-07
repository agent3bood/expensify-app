import type {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import type {OnyxEntry} from 'react-native-onyx';
import {withOnyx} from 'react-native-onyx';
import Button from '@components/Button';
import type {DropdownOption, WorkspaceDistanceRatesBulkActionType} from '@components/ButtonWithDropdownMenu/types';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import Icon from '@components/Icon';
import * as Expensicons from '@components/Icon/Expensicons';
import * as Illustrations from '@components/Icon/Illustrations';
import Modal from '@components/Modal';
import ScreenWrapper from '@components/ScreenWrapper';
import SelectionList from '@components/SelectionList';
import TableListItem from '@components/SelectionList/TableListItem';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import useWindowDimensions from '@hooks/useWindowDimensions';
import * as CurrencyUtils from '@libs/CurrencyUtils';
import Navigation from '@libs/Navigation/Navigation';
import type {CentralPaneNavigatorParamList} from '@navigation/types';
import AdminPolicyAccessOrNotFoundWrapper from '@pages/workspace/AdminPolicyAccessOrNotFoundWrapper';
import PaidPolicyAccessOrNotFoundWrapper from '@pages/workspace/PaidPolicyAccessOrNotFoundWrapper';
import {openPolicyDistanceRatesPage} from '@userActions/Policy';
import ButtonWithDropdownMenu from '@src/components/ButtonWithDropdownMenu';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type SCREENS from '@src/SCREENS';
import type Policy from '@src/types/onyx/Policy';
import type {CustomUnit, Rate} from '@src/types/onyx/Policy';

type RateForList = {
    value: string;
    text: string;
    keyForList: string;
    isSelected: boolean;
    rightElement: React.ReactNode;
};

type PolicyDistanceRatesPageOnyxProps = {
    /** Policy details */
    policy: OnyxEntry<Policy>;
};

type PolicyDistanceRatesPageProps = PolicyDistanceRatesPageOnyxProps & StackScreenProps<CentralPaneNavigatorParamList, typeof SCREENS.WORKSPACE.DISTANCE_RATES>;

function PolicyDistanceRatesPage({policy, route}: PolicyDistanceRatesPageProps) {
    const {isSmallScreenWidth} = useWindowDimensions();
    const styles = useThemeStyles();
    const theme = useTheme();
    const {translate} = useLocalize();
    const [selectedDistanceRates, setSelectedDistanceRates] = useState<Rate[]>([]);
    const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
    const dropdownButtonRef = useRef(null);

    const customUnit: CustomUnit | undefined = useMemo(
        () => (policy?.customUnits !== undefined ? policy?.customUnits[Object.keys(policy?.customUnits)[0]] : undefined),
        [policy?.customUnits],
    );
    const customUnitRates: Record<string, Rate> = useMemo(() => customUnit?.rates ?? {}, [customUnit]);

    useEffect(() => {
        openPolicyDistanceRatesPage(route.params.policyID);
    }, [route.params.policyID]);

    const distanceRatesList = useMemo<RateForList[]>(
        () =>
            Object.values(customUnitRates).map((value) => ({
                value: value.customUnitRateID ?? '',
                text: `${CurrencyUtils.convertAmountToDisplayString(value.rate, value.currency ?? CONST.CURRENCY.USD)} / ${translate(
                    `common.${customUnit?.attributes?.unit ?? CONST.CUSTOM_UNITS.DISTANCE_UNIT_MILES}`,
                )}`,
                keyForList: value.customUnitRateID ?? '',
                isSelected: selectedDistanceRates.find((rate) => rate.customUnitRateID === value.customUnitRateID) !== undefined,
                rightElement: (
                    <View style={styles.flexRow}>
                        <Text style={[styles.alignSelfCenter, !value.enabled && styles.textSupporting]}>
                            {value.enabled ? translate('workspace.distanceRates.enabled') : translate('workspace.distanceRates.disabled')}
                        </Text>
                        <View style={[styles.p1, styles.pl2]}>
                            <Icon
                                src={Expensicons.ArrowRight}
                                fill={theme.icon}
                            />
                        </View>
                    </View>
                ),
            })),
        [customUnit?.attributes?.unit, customUnitRates, selectedDistanceRates, styles.alignSelfCenter, styles.flexRow, styles.p1, styles.pl2, styles.textSupporting, theme.icon, translate],
    );

    const addRate = () => {
        Navigation.navigate(ROUTES.WORKSPACE_CREATE_DISTANCE_RATE.getRoute(route.params.policyID));
    };

    const openSettings = () => {
        // Navigation.navigate(ROUTES.WORKSPACE_DISTANCE_RATES_SETTINGS.getRoute(route.params.policyID));
    };

    const editRate = () => {
        // Navigation.navigate(ROUTES.WORKSPACE_EDIT_DISTANCE_RATE.getRoute(route.params.policyID, rateID));
    };

    const disableRates = () => {
        if (selectedDistanceRates.length !== customUnitRates.length) {
            // run enableWorkspaceDistanceRates for all selected rows
        }

        setIsWarningModalVisible(true);
    };

    const enableRates = () => {
        if (selectedDistanceRates.length !== customUnitRates.length) {
            // run enableWorkspaceDistanceRates for all selected rows
        }

        setIsWarningModalVisible(true);
    };

    const deleteRates = () => {
        if (selectedDistanceRates.length !== customUnitRates.length) {
            // run deleteWorkspaceDistanceRates for all selected rows
        }

        setIsWarningModalVisible(true);
    };

    const toggleRate = (rate: RateForList) => {
        if (selectedDistanceRates.find((selectedRate) => selectedRate.customUnitRateID === rate.value) !== undefined) {
            setSelectedDistanceRates((prev) => prev.filter((selectedRate) => selectedRate.customUnitRateID !== rate.value));
        } else {
            setSelectedDistanceRates((prev) => [...prev, customUnitRates[rate.value]]);
        }
    };

    const toggleAllRates = () => {
        if (selectedDistanceRates.length === Object.values(customUnitRates).length) {
            setSelectedDistanceRates([]);
        } else {
            setSelectedDistanceRates([...Object.values(customUnitRates)]);
        }
    };

    const getCustomListHeader = () => (
        <View style={[styles.flex1, styles.flexRow, styles.justifyContentBetween, styles.pl3, styles.pr9]}>
            <Text style={styles.searchInputStyle}>{translate('workspace.distanceRates.rate')}</Text>
            <Text style={[styles.searchInputStyle, styles.textAlignCenter]}>{translate('statusPage.status')}</Text>
        </View>
    );

    const getBulkActionsButtonOptions = () => {
        const options: Array<DropdownOption<WorkspaceDistanceRatesBulkActionType>> = [
            {
                text: translate(`workspace.distanceRates.${selectedDistanceRates.length <= 1 ? 'deleteRate' : 'deleteRates'}`),
                value: CONST.POLICY.DISTANCE_RATES_BULK_ACTION_TYPES.DELETE,
                icon: Expensicons.Trashcan,
                onSelected: deleteRates,
            },
        ];

        const enabledRates = selectedDistanceRates.filter((rate) => rate.enabled);
        if (enabledRates.length > 0) {
            options.push({
                text: translate(`workspace.distanceRates.${enabledRates.length <= 1 ? 'disableRate' : 'disableRates'}`),
                value: CONST.POLICY.DISTANCE_RATES_BULK_ACTION_TYPES.DISABLE,
                icon: Expensicons.DocumentSlash,
                onSelected: disableRates,
            });
        }

        const disabledRates = selectedDistanceRates.filter((rate) => !rate.enabled);
        if (disabledRates.length > 0) {
            options.push({
                text: translate(`workspace.distanceRates.${disabledRates.length <= 1 ? 'enableRate' : 'enableRates'}`),
                value: CONST.POLICY.DISTANCE_RATES_BULK_ACTION_TYPES.ENABLE,
                icon: Expensicons.DocumentSlash,
                onSelected: enableRates,
            });
        }

        return options;
    };

    const headerButtons = (
        <View style={[styles.w100, styles.flexRow, isSmallScreenWidth && styles.mb3]}>
            {selectedDistanceRates.length === 0 ? (
                <>
                    <Button
                        medium
                        text={translate('workspace.distanceRates.addRate')}
                        onPress={addRate}
                        style={[styles.mr3, isSmallScreenWidth && styles.flexGrow1]}
                        icon={Expensicons.Plus}
                        iconStyles={[styles.mr2]}
                        success
                    />

                    <Button
                        medium
                        text={translate('workspace.common.settings')}
                        onPress={openSettings}
                        style={[isSmallScreenWidth && styles.flexGrow1]}
                        icon={Expensicons.Gear}
                        iconStyles={[styles.mr2]}
                    />
                </>
            ) : (
                <ButtonWithDropdownMenu<WorkspaceDistanceRatesBulkActionType>
                    shouldAlwaysShowDropdownMenu
                    pressOnEnter
                    customText={`${selectedDistanceRates.length} ${translate('workspace.distanceRates.selected')}`}
                    buttonSize={CONST.DROPDOWN_BUTTON_SIZE.MEDIUM}
                    onPress={() => null}
                    options={getBulkActionsButtonOptions()}
                    buttonRef={dropdownButtonRef}
                    style={[isSmallScreenWidth && styles.flexGrow1]}
                    wrapperStyle={styles.w100}
                />
            )}
        </View>
    );

    return (
        <AdminPolicyAccessOrNotFoundWrapper policyID={route.params.policyID}>
            <PaidPolicyAccessOrNotFoundWrapper policyID={route.params.policyID}>
                <ScreenWrapper
                    includeSafeAreaPaddingBottom={false}
                    style={[styles.defaultModalContainer]}
                    testID={PolicyDistanceRatesPage.displayName}
                    shouldShowOfflineIndicatorInWideScreen
                >
                    <HeaderWithBackButton
                        icon={Illustrations.CarIce}
                        title={translate('workspace.common.distanceRates')}
                        shouldShowBackButton={isSmallScreenWidth}
                    >
                        {!isSmallScreenWidth && headerButtons}
                    </HeaderWithBackButton>
                    {isSmallScreenWidth && <View style={[styles.ph5]}>{headerButtons}</View>}
                    <View style={[styles.ph5, styles.pb5]}>
                        <Text style={[styles.textNormal, styles.colorMuted]}>{translate('workspace.distanceRates.centrallyManage')}</Text>
                    </View>
                    {/* <Text style={[styles.pl5, styles.pb2, styles.pt4, styles.textSupporting]}>{translate('workspace.distanceRates.centrallyManage')}</Text> */}
                    <SelectionList
                        canSelectMultiple
                        ListItem={TableListItem}
                        onSelectAll={toggleAllRates}
                        onCheckboxPress={toggleRate}
                        sections={[{data: distanceRatesList, indexOffset: 0, isDisabled: false}]}
                        onSelectRow={editRate}
                        showScrollIndicator
                        customListHeader={getCustomListHeader()}
                        listHeaderWrapperStyle={[styles.ph9, styles.pv3, styles.pb5]}
                    />
                    <Modal
                        type={CONST.MODAL.MODAL_TYPE.CENTERED_SMALL}
                        isVisible={isWarningModalVisible}
                        onClose={() => setIsWarningModalVisible(false)}
                    >
                        <View style={[styles.notSoFastPopoverWrapper]}>
                            <Text style={[styles.notSoFastPopoverTitle]}>{translate('workspace.distanceRates.oopsNotSoFast')}</Text>
                            <Text style={[styles.mt3]}>{translate('workspace.distanceRates.workspaceNeeds')}</Text>
                            <Button
                                text={translate('common.buttonConfirm')}
                                onPress={() => setIsWarningModalVisible(false)}
                                style={[styles.mt5]}
                            />
                        </View>
                    </Modal>
                </ScreenWrapper>
            </PaidPolicyAccessOrNotFoundWrapper>
        </AdminPolicyAccessOrNotFoundWrapper>
    );
}

PolicyDistanceRatesPage.displayName = 'PolicyDistanceRatesPage';

export default withOnyx<PolicyDistanceRatesPageProps, PolicyDistanceRatesPageOnyxProps>({
    policy: {
        key: ({route}) => `${ONYXKEYS.COLLECTION.POLICY}${route.params.policyID}`,
    },
})(PolicyDistanceRatesPage);
