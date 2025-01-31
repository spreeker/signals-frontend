import { createBrowserHistory } from 'history';
import {
  initAuth,
  login,
  logout,
  getReturnPath,
  getOauthDomain,
  getAuthHeaders,
  isAuthenticated,
  getScopes,
  getName,
  authenticate,
} from './auth';
import queryStringParser from './services/query-string-parser/query-string-parser';
import stateTokenGenerator from './services/state-token-generator/state-token-generator';
import parseAccessToken from './services/access-token-parser/access-token-parser';

jest.mock('./services/query-string-parser/query-string-parser');
jest.mock('./services/state-token-generator/state-token-generator');
jest.mock('./services/access-token-parser/access-token-parser');

const history = createBrowserHistory();

describe('The auth service', () => {
  const noop = () => {};

  let queryObject;
  let savedAccessToken;
  let savedReturnPath;
  let savedStateToken;
  let savedOauthDomain;
  let stateToken;

  beforeEach(() => {
    global.localStorage.getItem.mockImplementation(key => {
      switch (key) {
        case 'accessToken':
          return savedAccessToken;
        case 'stateToken':
          return savedStateToken;
        case 'returnPath':
          return savedReturnPath;
        case 'oauthDomain':
          return savedOauthDomain;
        default:
          return '';
      }
    });

    jest.spyOn(global.history, 'replaceState').mockImplementation(noop);
    jest.spyOn(global.location, 'assign').mockImplementation(noop);
    jest.spyOn(global.location, 'reload').mockImplementation(noop);

    queryStringParser.mockImplementation(() => queryObject);
    stateTokenGenerator.mockImplementation(() => stateToken);

    queryObject = {};
    stateToken = '123StateToken';
    savedStateToken = '';
    savedReturnPath = '';
    savedAccessToken = '';
  });

  afterEach(() => {
    global.history.replaceState.mockRestore();
    global.location.assign.mockRestore();
    global.location.reload.mockRestore();

    global.localStorage.removeItem.mockReset();
    global.localStorage.setItem.mockReset();
  });

  describe('init funtion', () => {
    describe('receiving response errors from the auth service', () => {
      it('throws an error', () => {
        const queryString =
          '?error=invalid_request&error_description=invalid%20request';

        const url = `https://data.amsterdam.nl/${queryString}`;
        history.push(url);

        queryObject = {
          error: 'invalid_request',
          error_description: 'invalid request',
        };

        expect(() => {
          initAuth();
        }).toThrow(
          'Authorization service responded with error invalid_request [invalid request] ' +
            '(The request is missing a required parameter, includes an invalid parameter value, ' +
            'includes a parameter more than once, or is otherwise malformed.)'
        );
        expect(queryStringParser).toHaveBeenCalledWith(queryString);
      });

      it('throws an error without a description in the query string', () => {
        queryObject = {
          error: 'invalid_request',
        };

        expect(() => {
          initAuth();
        }).toThrow();
      });

      it('removes the state token from the session storage', () => {
        queryObject = {
          error: 'invalid_request',
        };

        expect(() => {
          initAuth();
        }).toThrow();
        expect(global.localStorage.removeItem).toHaveBeenCalledWith(
          'stateToken'
        );
      });

      it('does not handle any errors without an error in the query string', () => {
        queryObject = {};

        expect(() => {
          initAuth();
        }).not.toThrow();
        expect(global.localStorage.removeItem).not.toHaveBeenCalledWith(
          'stateToken'
        );
      });

      it('does not handle any errors without a query string', () => {
        queryObject = undefined;

        expect(() => {
          initAuth();
        }).not.toThrow();
        expect(global.localStorage.removeItem).not.toHaveBeenCalledWith(
          'stateToken'
        );
      });
    });

    describe('receiving a successful callback from the auth service', () => {
      it('throws an error when the state token received does not match the one saved', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=36000&state=invalidStateToken';
        global.location.hash = `${queryString}`;
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: 'invalidStateToken',
        };
        savedStateToken = '123StateToken';

        expect(() => {
          initAuth();
        }).toThrow(
          'Authenticator encountered an invalid state token (invalidStateToken)'
        );
        expect(queryStringParser).toHaveBeenLastCalledWith(`#${queryString}`);
      });

      it('Updates the session storage', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=36000&state=123StateToken';
        global.location.hash = queryString;
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: '123StateToken',
        };
        savedStateToken = '123StateToken';
        savedReturnPath = '/path/leading/back';

        initAuth();
        expect(global.localStorage.setItem).toHaveBeenCalledWith(
          'accessToken',
          '123AccessToken'
        );
        expect(global.localStorage.getItem).toHaveBeenCalledWith(
          'returnPath'
        );
        expect(global.localStorage.removeItem).toHaveBeenCalledWith(
          'returnPath'
        );
        expect(global.localStorage.removeItem).toHaveBeenCalledWith(
          'stateToken'
        );
      });

      it('Works when receiving unexpected parameters', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&expires_in=36000&state=123StateToken&extra=sauce';
        global.location.hash = queryString;
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          expires_in: '36000',
          state: '123StateToken',
          extra: 'sauce',
        };
        savedStateToken = '123StateToken';
        savedReturnPath = '/path/leading/back';

        initAuth();
        expect(global.localStorage.setItem).toHaveBeenCalledWith(
          'accessToken',
          '123AccessToken'
        );
      });

      it('Does not work when a parameter is missing', () => {
        const queryString =
          '?access_token=123AccessToken&token_type=token&state=123StateToken';
        global.location.hash = queryString;
        queryObject = {
          access_token: '123AccessToken',
          token_type: 'token',
          state: '123StateToken',
        };
        savedStateToken = '123StateToken';

        initAuth();
        expect(global.localStorage.setItem).not.toHaveBeenCalledWith(
          'accessToken',
          '123AccessToken'
        );
        expect(global.localStorage.removeItem).not.toHaveBeenCalledWith(
          'returnPath'
        );
        expect(global.localStorage.removeItem).not.toHaveBeenCalledWith(
          'stateToken'
        );
      });
    });
  });

  describe('Login process', () => {
    it('throws an error when the crypto library is not supported by the browser', () => {
      stateToken = '';
      expect(() => {
        login();
      }).toThrow('crypto library is not available on the current browser');
    });

    it('Updates the session storage', () => {
      const hash = '#?the=current-hash';
      global.location.hash = hash;

      login();

      expect(global.localStorage.removeItem).toHaveBeenCalledWith(
        'accessToken'
      );
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'returnPath',
        hash
      );
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'stateToken',
        stateToken
      );
    });

    it('Redirects to the auth service', () => {
      const url = 'https://data.amsterdam.nl/the/current/path';
      history.push(url);

      login();

      expect(window.location.assign).toHaveBeenCalledWith(
        'https://acc.api.data.amsterdam.nl/' +
          'oauth2/authorize?idp_id=datapunt&response_type=token&client_id=sia' +
          '&scope=SIG%2FALL' +
          '&state=123StateToken&redirect_uri=http%3A%2F%2Flocalhost%2Fmanage%2Fincidents'
      );
    });
  });

  describe('Logout process', () => {
    it('Removes the access token from the session storage', () => {
      logout();
      expect(global.localStorage.removeItem).toHaveBeenCalledWith(
        'accessToken'
      );
    });

    it('Reloads the app', () => {
      logout();
      expect(global.location.reload).toHaveBeenCalledWith();
    });
  });

  describe('Retrieving the return path', () => {
    it('returns the return path after initialized with a successful callback', () => {
      queryObject = {
        access_token: '123AccessToken',
        token_type: 'token',
        expires_in: '36000',
        state: '123StateToken',
      };
      savedStateToken = '123StateToken';
      savedReturnPath = '/path/leading/back';

      initAuth();
      expect(getReturnPath()).toBe(savedReturnPath);
    });

    it('returns an empty string when the callback was unsuccessful', () => {
      initAuth();
      expect(getReturnPath()).toBe('');
    });

    it('returns an empty string when there was an error callback', () => {
      queryObject = {
        error: 'invalid_request',
      };

      expect(() => {
        initAuth();
      }).toThrow();
      expect(getReturnPath()).toBe('');
    });

    it('returns an empty string without any callback', () => {
      expect(getReturnPath()).toBe('');
    });
  });

  describe('Retrieving the auth headers', () => {
    it('Creates an object defining the headers', () => {
      savedAccessToken = '123AccessToken';
      initAuth();
      const authHeaders = getAuthHeaders();

      expect(authHeaders).toEqual({
        Authorization: 'Bearer 123AccessToken',
      });
    });

    it('Creates an object defining no headers when no access token', () => {
      initAuth();
      const authHeaders = getAuthHeaders();

      expect(authHeaders).toEqual({});
    });
  });

  describe('Retrieving the auth domain', () => {
    it('returns the auth domain', () => {
      savedOauthDomain = 'datapunt';
      const oauthDomain = getOauthDomain();

      expect(oauthDomain).toEqual('datapunt');
    });
  });

  describe('isAuthenticated', () => {
    it('checks for logged in status', () => {
      savedAccessToken = '123AccessToken';

      expect(isAuthenticated()).toEqual(true);
    });
    it('checks for logged out status', () => {
      savedAccessToken = '';

      expect(isAuthenticated()).toEqual(false);
    });
  });

  describe('getScopes', () => {
    it('should return a an empty array', () => {
      parseAccessToken.mockImplementation(() => ({}));

      savedAccessToken = '123AccessToken';
      initAuth();
      const scopes = getScopes();

      expect(scopes).toEqual([]);
    });

    it('should return the scopes', () => {
      parseAccessToken.mockImplementation(() => ({
        scopes: ['SIG/ALL'],
      }));

      savedAccessToken = '123AccessToken';
      initAuth();
      const scopes = getScopes();

      expect(scopes).toEqual(['SIG/ALL']);
    });
  });

  describe('getName', () => {
    it('should return a an empty string', () => {
      parseAccessToken.mockImplementation(() => ({}));

      savedAccessToken = '123AccessToken';
      initAuth();
      const name = getName();

      expect(name).toEqual('');
    });

    it('should return the scopes', () => {
      parseAccessToken.mockImplementation(() => ({
        name: 'Jan Klaasen',
      }));

      savedAccessToken = '123AccessToken';
      initAuth();
      const name = getName();

      expect(name).toEqual('Jan Klaasen');
    });
  });

  describe('authenticate', () => {
    it('should authenticate with credentials with accessToken', () => {
      parseAccessToken.mockImplementation(() => ({
        name: 'Jan Klaasen',
        scopes: ['SIG/ALL'],
      }));
      savedAccessToken = '123AccessToken';

      expect(authenticate()).toEqual({
        userName: 'Jan Klaasen',
        userScopes: ['SIG/ALL'],
        accessToken: '123AccessToken',
      });
    });

    it('should not authenticate without accessToken', () => {
      parseAccessToken.mockImplementation(() => ({
        name: 'Jan Klaasen',
        scopes: ['SIG/ALL'],
      }));

      expect(authenticate()).toEqual(null);
    });
  });
});
