import moment from 'moment';

import mapValues from '../map-values';
import mapPaths from '../map-paths';

import mapControlsToParams from './index';

jest.mock('moment');
jest.mock('../map-values');
jest.mock('../map-paths');

describe('The map controls to params service', () => {
  const defaultValues = {
    reporter: {},
    status: {
      state: 'm',
      extra_properties: {},
    },
  };

  beforeEach(() => {
    mapValues.mockImplementation(params => params);
    mapPaths.mockImplementation(params => params);
  });

  it('should map status by default', () => {
    expect(mapControlsToParams({}, {})).toEqual(defaultValues);
  });

  it('should map date: Nu', () => {
    moment.mockImplementation(() => ({
      format: () => '2018-07-21T12:34:00+02:00',
    }));

    expect(mapControlsToParams({
      incident_time_hours: 12,
      incident_time_minutes: 34,
      datetime: {
        id: 'Nu',
        label: 'Nu',
      },
    }, {})).toEqual({
      ...defaultValues,
      incident_date_start: '2018-07-21T12:34:00+02:00',
    });
  });

  it('should map date: Vandaag', () => {
    moment.mockImplementation(() => ({
      format: () => '2018-07-21T10:21:00+02:00',
    }));

    expect(mapControlsToParams({
      incident_time_hours: 10,
      incident_time_minutes: 21,
      incident_date: 'Vandaag',
    }, {})).toEqual({
      ...defaultValues,
      incident_date_start: '2018-07-21T10:21:00+02:00',
    });
  });

  it('should map date: fixed date', () => {
    moment.mockImplementation(() => ({
      format: () => '2018-07-02T09:05:00+02:00',
    }));

    expect(mapControlsToParams({
      incident_time_hours: 9,
      incident_time_minutes: 5,
      incident_date: '2018-04-02',
    }, {})).toEqual({
      ...defaultValues,
      incident_date_start: '2018-07-02T09:05:00+02:00',
    });
  });

  it('should expect to receive values from paths and values services', () => {
    mapValues.mockImplementation(params => ({ ...params, varFromMapValues: 'foo' }));
    mapPaths.mockImplementation(params => ({ ...params, varFromMapPaths: 'bar' }));

    expect(mapControlsToParams({}, {})).toEqual({
      ...defaultValues,
      varFromMapValues: 'foo',
      varFromMapPaths: 'bar',
    });
  });
});
