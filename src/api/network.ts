import type { SendCodeReq, SendCodeRes, UploadRes } from '@/types/network';
import { post, upload } from '@/utils/request';

export const uploadFile = (filePath: string) =>
  upload<UploadRes>('/common/upload', { filePath, name: 'file' });

export const sendVerificationCode = (data: SendCodeReq) => post<SendCodeRes>('/sendCode', { data });
