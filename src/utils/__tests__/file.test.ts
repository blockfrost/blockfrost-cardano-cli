import * as file from '../file';
import * as fs from 'fs';

// auto-mock fs
jest.mock('fs');

describe('file', () => {
  afterEach(() => {
    // @ts-ignore
    fs.writeFileSync.mockClear();
  });

  test('writeToFile', () => {
    file.writeToFile('path', 'data');
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith('path', 'data');
  });
});
