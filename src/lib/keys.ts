import { generateHMACKey, exportHMAC } from './oidc';

const keys = [await generateHMACKey(), await generateHMACKey()];
const exportedKeys = [await exportHMAC(keys[0]), await exportHMAC(keys[1])];

export const getKeys = () => {
    return keys;
};

export const getKey = () => {
    return keys[0];
};

export const getExportedKeys = () => {
    return exportedKeys;
};
