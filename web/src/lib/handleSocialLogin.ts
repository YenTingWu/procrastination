import axios from 'axios';
import { API_BASE_URL } from 'src/config';
import type { SocialLoginType } from '@types';

export const handleSocialLogin = async (socialLoginType: SocialLoginType) => {
  try {
    const res = await axios({
      baseURL: API_BASE_URL,
      url: `/auth/${socialLoginType}/web`,
      method: 'POST',
    });
    window.location.href = res.data.url;
  } catch (err) {
    console.log(err);
  }
};
