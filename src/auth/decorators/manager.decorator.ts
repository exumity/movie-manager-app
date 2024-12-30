import { SetMetadata } from '@nestjs/common';

export const ONLY_MANAGER_KEY = 'onlyManager';
export const OnlyManager = () => SetMetadata(ONLY_MANAGER_KEY, true);
