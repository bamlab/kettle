import { KettleOptions, KettleValues, PartialKettleOptions } from './kettle.types';

const defaultOptions: KettleOptions = {
  replacePrefix: '__replace__',
  replaceSuffix: '__',
  ifPrefix: '__if__',
  ifSuffix: '__',
  endif: '__endif__',
};

export function getOptions(partialOptions: PartialKettleOptions): KettleOptions {
  return {
    ...defaultOptions,
    ...partialOptions,
  };
}

export function getStringValue(values: KettleValues, valueKey: string): string {
  const value = values[valueKey];
  if (typeof value !== typeof 'string')
    throw new Error(`[VALUE_IS_NOT_A_STRING] The value of "${valueKey}" is not a string`);
  // @ts-ignore value is always a string at this point
  return value;
}
