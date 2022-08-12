import React from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { SVGIcon } from '@utils/common';
import { theme } from '@styles/theme';
import { postImageApi } from '@api/image';

const DEFAULT_LIMIT_SIZE = 1024 * 1024 * 20;
interface IReviewImageUploadProps {
  limitUploadSize?: number
  onError(message: string): void
  onSuccess(successUrl: string): void
  onStart?(): void
  onFinish?(): void
  disabled?: boolean
}

export const ReviewImageUpload = ({
                                    limitUploadSize = DEFAULT_LIMIT_SIZE,
                                    onStart,
                                    onError,
                                    onSuccess,
                                    onFinish,
                                    disabled = false
                                  }: IReviewImageUploadProps) => {
  const onChangeFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if(onStart) onStart();
      const imageFile = (e.target.files || [])[0];
      if (!imageFile) return;
      if(imageFile.size > limitUploadSize || imageFile.name.length > 255) {
        return onError('사진은 1장 당 20MB 이하 (jpg, png), 파일명은 255자 이하만 등록 가능해요.');
      }
      const formData = new FormData();
      formData.append('media', imageFile, `/menu/review/origin/${imageFile.name}`);
      const imageLocation = await postImageApi(formData);
      onSuccess(imageLocation);
    } catch (e) {
      return onError('이미지 업로드에 실패했습니다.')
    } finally {
      e.target.value = '';
      if(onFinish) onFinish();
    }
  };

  return (
    <UploadInputWrapper>
      <TextInput
        width="100%"
        height="100%"
        padding="0"
        inputType="file"
        accept=".jpg, .jpeg, .png, .heif, .heic"
        disabled={disabled}
        eventHandler={onChangeFileHandler}
      />
      <div className="plusBtn">
        <SVGIcon name="plus18"/>
      </div>
    </UploadInputWrapper>
  )
}

const UploadInputWrapper = styled.label`
  position: relative;
  display: block;
  width: 72px;
  height: 72px;
  background-color: ${theme.greyScale6};
  border-radius: 8px;
  margin: 16px 0 48px 0;
  cursor: pointer;
  input {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }

  .plusBtn {
    position: absolute;
    left: 40%;
    top: 35%;
  }
`;