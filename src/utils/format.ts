import sStringify from 'safe-stable-stringify';

export const stringToBigInt = (value: string | null) => (value ? BigInt(value) : value);

export const stringify = (obj: any) => sStringify(obj, undefined, 4); // safe-stable-stringify properly stringifies BigInt

export const stripQuotes = (str: string) => {
  if (typeof str === 'string' && str[0] === '"' && str[str.length - 1] === '"') {
    return str.slice(1, -1);
  }

  return str;
};
