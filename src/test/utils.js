import React from 'react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@datapunt/asc-ui';
import MatchMediaMock from 'match-media-mock';
import { IntlProvider } from 'react-intl';
import Immutable from 'immutable';

import configureStore from '../configureStore';

const history = createMemoryHistory();

// set a default screenwidth of 2560 pixels
const mmm = MatchMediaMock.create();

mmm.setConfig({ type: 'screen', width: 2560 });

// eslint-disable-next-line no-undef
Object.defineProperty(global.window, 'matchMedia', {
  value: mmm,
  writable: true,
});

export const testActionCreator = (action, actionType, payload) => {
  const expected = {
    type: actionType,
    payload,
  };
  expect(action(payload)).toEqual(expected);
};

export const getContext = state => {
  const store = {
    dispatch: jest.fn(),
    getState: () => state,
    replaceReducer: jest.fn(),
    runSaga: jest.fn(),
    subscribe: jest.fn(),
    injectedReducers: {},
    injectedSagas: {},
  };

  return { store };
};

export const store = configureStore(Immutable.Map(), history);

export const withAppContext = Component => (
  <ThemeProvider>
    <Provider store={store}>
      <ConnectedRouter history={history}>{Component}</ConnectedRouter>
    </Provider>
  </ThemeProvider>
);

// eslint-disable-next-line
export const withCustomAppContext = (Component) => ({ themeCfg = {}, storeCfg = {}, routerCfg = {} }) => (
  <ThemeProvider {...themeCfg}>
    <Provider store={store} {...storeCfg}>
      <ConnectedRouter history={history} {...routerCfg}>
        {Component}
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>
);

// eslint-disable-next-line
export const withIntlAppContext = (Component, messages, locale='nl') => (
  <ThemeProvider>
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages}>
        <ConnectedRouter history={history}>{Component}</ConnectedRouter>
      </IntlProvider>
    </Provider>
  </ThemeProvider>
);
