'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        initData?: string;
        [key: string]: any;
      };
    };
  }
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  router.push('/signup');
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      // Add code to set webApp as window.Telegram.WebApp
      console.log("Telegram app ready", window.Telegram);
    }
  }, []);
    return null;
}
