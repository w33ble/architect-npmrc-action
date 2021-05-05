const core = require('@actions/core');
const getContents = require('./getContents');

jest.mock('@actions/core');

describe('getContents', () => {
  afterEach(() => {
    core.getInput.mockReset();
  });

  test('returns content with registry', () => {
    core.getInput.mockImplementation((varName) => {
      if (varName === 'registry') return 'https://registry.npmjs.org';
      return null;
    });

    expect(getContents()).toEqual(`registry=https://registry.npmjs.org/`);
  });

  test('returns content with registry and scope', () => {
    core.getInput.mockImplementation((varName) => {
      if (varName === 'registry') return 'https://npm.pkg.github.com/';
      if (varName === 'scope') return '@superhappyfun';
      return null;
    });

    expect(getContents()).toEqual(`@superhappyfun:registry=https://npm.pkg.github.com/`);
  });

  test('returns content with registry, scope, and token', () => {
    core.getInput.mockImplementation((varName) => {
      if (varName === 'registry') return 'http://localhost:4873';
      if (varName === 'token') return 'ghp_Z8DIB6FKaqHyb05vAy';
      if (varName === 'scope') return '@superhappyfun';
      return null;
    });

    expect(getContents()).toEqual(`//localhost:4873/:_authToken=ghp_Z8DIB6FKaqHyb05vAy
@superhappyfun:registry=http://localhost:4873/`);
  });
});
