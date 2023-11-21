import React, {memo} from 'react';
import ImageView from '@components/ImageView';
import PressableWithoutFeedback from '@components/Pressable/PressableWithoutFeedback';
import withLocalize, {withLocalizePropTypes} from '@components/withLocalize';
import compose from '@libs/compose';
import useThemeStyles from '@styles/useThemeStyles';
import CONST from '@src/CONST';
import * as Constants from './Constants';
import {attachmentViewImageDefaultProps, attachmentViewImagePropTypes} from './propTypes';

const propTypes = {
    ...attachmentViewImagePropTypes,
    ...withLocalizePropTypes,
};

function AttachmentViewImage({source, file, isAuthTokenRequired, isUsedInCarousel, isFocused, loadComplete, onPress, isImage, onScaleChanged, translate}) {
    const styles = useThemeStyles();
    const zoomRange = isUsedInCarousel ? Constants.carouselZoomRange : Constants.modalZoomRange;

    const children = (
        <ImageView
            onScaleChanged={onScaleChanged}
            url={source}
            fileName={file.name}
            isAuthTokenRequired={isImage && isAuthTokenRequired}
            isUsedInCarousel={isUsedInCarousel}
            isActive={isFocused}
            zoomRange={zoomRange}
        />
    );

    return onPress ? (
        <PressableWithoutFeedback
            onPress={onPress}
            disabled={loadComplete}
            style={[styles.flex1, styles.flexRow, styles.alignSelfStretch]}
            role={CONST.ACCESSIBILITY_ROLE.IMAGEBUTTON}
            accessibilityLabel={file.name || translate('attachmentView.unknownFilename')}
        >
            {children}
        </PressableWithoutFeedback>
    ) : (
        children
    );
}

AttachmentViewImage.propTypes = propTypes;
AttachmentViewImage.defaultProps = attachmentViewImageDefaultProps;
AttachmentViewImage.displayName = 'AttachmentViewImage';

export default compose(memo, withLocalize)(AttachmentViewImage);
