import { testActionCreator } from 'test/utils';

import * as constants from '../constants';
import * as actions from '../actions';

describe('signals/incident-management/actions', () => {
  it('should dispatch getFiltersSuccess action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.getFiltersSuccess, constants.GET_FILTERS_SUCCESS, payload);
  });

  it('should dispatch getFiltersFailed action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.getFiltersFailed, constants.GET_FILTERS_FAILED, payload);
  });

  it('should dispatch getFilters action', () => {
    testActionCreator(actions.getFilters, constants.GET_FILTERS);
  });

  it('should dispatch removeFilter action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.removeFilter, constants.REMOVE_FILTER, payload);
  });

  it('should dispatch removeFilterSuccess action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.removeFilterSuccess, constants.REMOVE_FILTER_SUCCESS, payload);
  });

  it('should dispatch removeFilterFailed action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.removeFilterFailed, constants.REMOVE_FILTER_FAILED, payload);
  });

  it('should dispatch applyFilter action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.applyFilter, constants.APPLY_FILTER, payload);
  });

  it('should dispatch editFilter action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.editFilter, constants.EDIT_FILTER, payload);
  });

  it('should dispatch filterSaved action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterSaved, constants.SAVE_FILTER, payload);
  });

  it('should dispatch filterSaveFailed action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterSaveFailed, constants.SAVE_FILTER_FAILED, payload);
  });

  it('should dispatch filterSaveSuccess action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterSaveSuccess, constants.SAVE_FILTER_SUCCESS, payload);
  });

  it('should dispatch filterUpdated action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterUpdated, constants.UPDATE_FILTER, payload);
  });

  it('should dispatch filterUpdatedSuccess action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterUpdatedSuccess, constants.UPDATE_FILTER_SUCCESS, payload);
  });

  it('should dispatch filterUpdatedFailed action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterUpdatedFailed, constants.UPDATE_FILTER_FAILED, payload);
  });

  it('should dispatch filterCleared action', () => {
    testActionCreator(actions.filterCleared, constants.CLEAR_FILTER);
  });

  it('should dispatch filterEditCanceled action', () => {
    testActionCreator(actions.filterEditCanceled, constants.FILTER_EDIT_CANCELED);
  });

  it('should dispatch pageIncidentsChanged action', () => {
    const page = 9;
    testActionCreator(actions.pageIncidentsChanged, constants.PAGE_INCIDENTS_CHANGED, page);
  });

  it('should dispatch orderingIncidentsChanged action', () => {
    const ordering = 'order-from-asc-to-desc';
    testActionCreator(actions.orderingIncidentsChanged, constants.ORDERING_INCIDENTS_CHANGED, ordering);
  });
});
