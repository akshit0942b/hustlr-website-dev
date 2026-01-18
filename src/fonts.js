import localFont from 'next/font/local';
import { Ovo } from 'next/font/google';

export const theSeasons = localFont({
  src: [
    {
      path: '../public/fonts/FONTSPRINGDEMO-TheSeasonsLightRegular.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-the-seasons',
  display: 'swap',
  preload: true,
  fallback: ['serif'],
});

export const ovo = Ovo({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-ovo',
  display: 'swap',
}); 