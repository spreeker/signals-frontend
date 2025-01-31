import {
  APPLY_FILTER,
  CLEAR_FILTER,
  EDIT_FILTER,
  FILTER_EDIT_CANCELED,
  GET_FILTERS_FAILED,
  GET_FILTERS_SUCCESS,
  GET_FILTERS,
  ORDERING_INCIDENTS_CHANGED,
  PAGE_INCIDENTS_CHANGED,
  REMOVE_FILTER_FAILED,
  REMOVE_FILTER_SUCCESS,
  REMOVE_FILTER,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  SAVE_FILTER,
  UPDATE_FILTER_FAILED,
  UPDATE_FILTER_SUCCESS,
  UPDATE_FILTER,
} from './constants';

export const getFiltersSuccess = payload => ({
  type: GET_FILTERS_SUCCESS,
  payload,
});

export const getFiltersFailed = payload => ({
  type: GET_FILTERS_FAILED,
  payload,
});

export const getFilters = () => ({
  type: GET_FILTERS,
});

export const removeFilter = payload => ({
  type: REMOVE_FILTER,
  payload,
});

export const removeFilterSuccess = payload => ({
  type: REMOVE_FILTER_SUCCESS,
  payload,
});

export const removeFilterFailed = payload => ({
  type: REMOVE_FILTER_FAILED,
  payload,
});

export const applyFilter = payload => ({
  type: APPLY_FILTER,
  payload,
});

export const editFilter = payload => ({
  type: EDIT_FILTER,
  payload,
});

export const filterSaved = payload => ({
  type: SAVE_FILTER,
  payload,
});

export const filterSaveFailed = payload => ({
  type: SAVE_FILTER_FAILED,
  payload,
});

export const filterSaveSuccess = payload => ({
  type: SAVE_FILTER_SUCCESS,
  payload,
});

export const filterUpdated = payload => ({
  type: UPDATE_FILTER,
  payload,
});

export const filterUpdatedSuccess = payload => ({
  type: UPDATE_FILTER_SUCCESS,
  payload,
});

export const filterUpdatedFailed = payload => ({
  type: UPDATE_FILTER_FAILED,
  payload,
});

export const filterCleared = () => ({
  type: CLEAR_FILTER,
});

export const filterEditCanceled = () => ({
  type: FILTER_EDIT_CANCELED,
});

export const pageIncidentsChanged = page => ({
  type: PAGE_INCIDENTS_CHANGED,
  payload: page,
});

export const orderingIncidentsChanged = ordering => ({
  type: ORDERING_INCIDENTS_CHANGED,
  payload: ordering,
});
