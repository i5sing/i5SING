/**
 * Created by feng on 24/12/2016.
 */

export const DARWIN = 'darwin';
export const WIN32 = 'win32';

export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';

export function isWindows() {
    return process.platform === 'win32';
}

export function isMacOS() {
    return process.platform === 'darwin';
}

export function getSystem() {
    return process.platform;
}

export function getNodeENV() {
    return process.env.NODE_ENV;
}