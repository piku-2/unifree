'use client';

import { useEffect, useState } from 'react';

const IN_APP_KEYWORDS = [
  'line/',
  'instagram',
  'fbav',
  'fban',
  'facebook',
  'twitter',
  'micromessenger',
  'snapchat',
  'pinterest',
  'kakaotalk',
  'kakaostory',
  'naver(inapp)?',
  'gsa/',
  'discord',
  'slack',
];

const IN_APP_REGEX = new RegExp(IN_APP_KEYWORDS.join('|'), 'i');

export const isInAppBrowser = (userAgent: string): boolean => {
  const ua = userAgent.toLowerCase();
  const hasKnownClient = IN_APP_REGEX.test(ua);
  const isAndroidWebView = ua.includes('; wv;') || (ua.includes('version/') && ua.includes('chrome/'));
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isIosWebView = isIos && !ua.includes('safari');

  return hasKnownClient || isAndroidWebView || isIosWebView;
};

export const useInAppBrowser = () => {
  const [userAgent, setUserAgent] = useState<string>('');
  const [checked, setChecked] = useState(true);
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') {
      return;
    }

    const currentUserAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
    setUserAgent(currentUserAgent);
    setInApp(isInAppBrowser(currentUserAgent));
    setChecked(true);
  }, []);

  return {
    isInAppBrowser: inApp,
    checked,
    userAgent,
  };
};
