import React from 'react';
import { mount } from 'enzyme';
import { render, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import App, { AppContainer, mapDispatchToProps } from './index';
import { REQUEST_CATEGORIES } from './constants';

jest.mock('components/MapInteractive');

describe('<App />', () => {
  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<App />));

    const props = tree.find(AppContainer).props();

    expect(props.requestCategoriesAction).not.toBeUndefined();
  });

  it('should render correctly', () => {
    const { getByTestId } = render(
      withAppContext(<AppContainer requestCategoriesAction={() => {}} />),
    );

    expect(getByTestId('siteFooter')).toBeTruthy();
    expect(getByTestId('siteHeader')).toBeTruthy();
  });

  it('should render the correct theme', () => {
    global.localStorage.getItem.mockImplementation(() => undefined);

    const { queryByTestId, rerender } = render(
      withAppContext(<AppContainer requestCategoriesAction={() => {}} />),
    );

    expect(queryByTestId('signalsThemeProvider')).not.toBeNull();

    cleanup();

    global.localStorage.getItem.mockImplementation(() => '42');

    rerender(
      withAppContext(<AppContainer requestCategoriesAction={() => {}} />),
    );

    expect(queryByTestId('signalsThemeProvider')).toBeNull();
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      // For the `mapDispatchToProps`, call it directly but pass in
      // a mock function and check the arguments passed in are as expected
      mapDispatchToProps(dispatch).requestCategoriesAction();
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_CATEGORIES });
    });
  });
});
