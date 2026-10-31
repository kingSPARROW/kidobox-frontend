import React from 'react';
import { BrandLoadingScreen } from '@/components/brand-loading-screen';

export default function AdminLoading() {
  return (
    <BrandLoadingScreen
      fullScreen={true}
      message="Loading Merchant Store Console..."
      subMessage="KIDOBOX ADMIN"
    />
  );
}
