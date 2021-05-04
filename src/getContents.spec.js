const core = require('@actions/core');
const getContents = require('./getContents');

jest.mock('@actions/core');

describe('getContents', () => {
  afterEach(() => {
    core.getInput.mockReset();
  });

  test('returns content with token', () => {
    core.getInput.mockImplementation((varName) => {
      if (varName === 'registry') return 'localhost:4873';
      if (varName === 'token') return 'ghp_Z8DIB6FKaqHyb05vAy';
      if (varName === 'scope') return '@superhappyfun';
      return null;
    });

    expect(getContents()).toEqual(`//localhost:4873/:_authToken=ghp_Z8DIB6FKaqHyb05vAy
@superhappyfun:registry=localhost:4873`);
  });

  test('returns content without token', () => {
    core.getInput.mockImplementation((varName) => {
      if (varName === 'registry') return 'localhost:4873';
      if (varName === 'scope') return '@superhappyfun';
      return null;
    });

    expect(getContents()).toEqual(`@superhappyfun:registry=localhost:4873`);
  });

  test('returns content without token or scope', () => {
    core.getInput.mockImplementation((varName) => {
      if (varName === 'registry') return 'localhost:4873';
      return null;
    });

    expect(getContents()).toEqual(`registry=localhost:4873`);
  });
});
