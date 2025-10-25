export const dynamic = 'force-static';

import { redirect } from 'next/navigation';

import { SING_UP_ROUTER } from '@/shared/constants/auth';

export default function Page(): never {
  redirect(SING_UP_ROUTER);
}
