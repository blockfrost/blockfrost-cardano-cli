import { PathLike, writeFileSync } from 'fs';
import { ERROR } from '../constants/errors';

export const writeToFile = (
  filePath: PathLike | number,
  data: string | NodeJS.ArrayBufferView,
): void => {
  try {
    writeFileSync(filePath, data);
  } catch {
    throw new Error(`${ERROR.FILE_WRITE_FAIL}: ${filePath}`);
  }
};
