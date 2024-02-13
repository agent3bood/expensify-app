import React from 'react';
import type {OnyxEntry} from 'react-native-onyx';
import {withOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import StatePicker from '@components/StatePicker';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useReimbursementAccountStepFormSubmit from '@hooks/useReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type {ReimbursementAccount} from '@src/types/onyx';
import type * as OnyxCommon from '@src/types/onyx/OnyxCommon';
import type {ReimbursementAccountDraftValues} from '@src/types/onyx/ReimbursementAccountDraft';

type IncorporationStateBusinessOnyxProps = {
    /** Reimbursement account from ONYX */
    reimbursementAccount: OnyxEntry<ReimbursementAccount>;
};

type IncorporationStateBusinessProps = IncorporationStateBusinessOnyxProps & SubStepProps;

const COMPANY_INCORPORATION_STATE_KEY = CONST.BANK_ACCOUNT.BUSINESS_INFO_STEP.INPUT_KEY.INCORPORATION_STATE;
const STEP_FIELDS = [COMPANY_INCORPORATION_STATE_KEY];

const validate = (values: ReimbursementAccountDraftValues): OnyxCommon.Errors => ValidationUtils.getFieldRequiredErrors(values, STEP_FIELDS);

function IncorporationStateBusiness({reimbursementAccount, onNext, isEditing}: IncorporationStateBusinessProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const defaultCompanyIncorporationState = reimbursementAccount?.achData?.incorporationState ?? '';

    const handleSubmit = useReimbursementAccountStepFormSubmit({
        fieldIds: STEP_FIELDS,
        isEditing,
        onNext,
    });

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            validate={validate}
            onSubmit={handleSubmit}
            style={[styles.mh0, styles.flexGrow1]}
            submitButtonStyles={[styles.p5, styles.mb0]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL, styles.ph5]}>{translate('businessInfoStep.pleaseSelectTheStateYourCompanyWasIncorporatedIn')}</Text>
            <InputWrapper
                InputComponent={StatePicker}
                inputID={COMPANY_INCORPORATION_STATE_KEY}
                label={translate('businessInfoStep.incorporationState')}
                defaultValue={defaultCompanyIncorporationState}
                shouldSaveDraft={!isEditing}
                wrapperStyle={[styles.ph5, styles.mt3]}
            />
        </FormProvider>
    );
}

IncorporationStateBusiness.displayName = 'IncorporationStateBusiness';

export default withOnyx<IncorporationStateBusinessProps, IncorporationStateBusinessOnyxProps>({
    reimbursementAccount: {
        key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
    },
})(IncorporationStateBusiness);