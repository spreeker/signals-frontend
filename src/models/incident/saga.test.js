import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { takeLatest } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';

import { authCall, authPatchCall } from 'shared/services/api/api';
import {
  REQUEST_INCIDENT,
  PATCH_INCIDENT,
  REQUEST_ATTACHMENTS,
  REQUEST_DEFAULT_TEXTS,
} from './constants';
import {
  requestIncidentSuccess,
  requestIncidentError,
  patchIncidentSuccess,
  patchIncidentError,
  requestAttachmentsSuccess,
  requestAttachmentsError,
  requestDefaultTextsSuccess,
  requestDefaultTextsError,
} from './actions';
import watchIncidentModelSaga, {
  requestTermsURL,
  requestURL,
  fetchIncident,
  patchIncident,
  requestAttachments,
  requestDefaultTexts,
} from './saga';
import { requestHistoryList } from '../history/actions';

describe('models/incident/saga', () => {
  it('should watch incidentModelSaga', () => {
    testSaga(watchIncidentModelSaga)
      .next()
      .all([
        takeLatest(REQUEST_INCIDENT, fetchIncident),
        takeLatest(PATCH_INCIDENT, patchIncident),
        takeLatest(REQUEST_ATTACHMENTS, requestAttachments),
        takeLatest(REQUEST_DEFAULT_TEXTS, requestDefaultTexts),
      ])
      .next()
      .isDone();
  });

  describe('fetchIncident', () => {
    it('should call endpoint with filter data', () => {
      const id = 123456;
      const payload = id;
      const action = {
        payload,
      };

      return expectSaga(fetchIncident, action)
        .provide([[matchers.call.fn(requestURL)]])
        .call(authCall, `${requestURL}/${id}`)
        .silentRun();
    });

    it('should dispatch success', () => {
      const id = 678543;
      const action = { payload: id };
      const incident = { id, name: 'incident' };

      return expectSaga(fetchIncident, action)
        .provide([[matchers.call.fn(authCall), incident]])
        .put(requestIncidentSuccess(incident))
        .silentRun();
    });

    it('should dispatch failed', () => {
      const id = 678543;
      const action = { payload: id };
      const error = new Error('Whoops!!1!');

      return expectSaga(fetchIncident, action)
        .provide([[matchers.call.fn(authCall), throwError(error)]])
        .put(requestIncidentError(error))
        .silentRun();
    });
  });

  describe('patchIncident', () => {
    it('should call endpoint with filter data', () => {
      const id = 123456;
      const payload = {
        id,
        patch: {
          id,
        },
      };
      const action = {
        payload,
      };

      return expectSaga(patchIncident, action)
        .call(authPatchCall, `${requestURL}/${id}`, payload.patch)
        .silentRun();
    });

    it('should dispatch success', () => {
      const type = PATCH_INCIDENT;
      const id = 678543;
      const payload = {
        id,
        patch: {
          id,
        },
        type,
      };
      const action = {
        type,
        payload,
      };
      const incident = { id, name: 'incident' };

      return expectSaga(patchIncident, action)
        .provide([[matchers.call.fn(authPatchCall), incident]])
        .put(patchIncidentSuccess({ type, incident }))
        .put(requestHistoryList(id))
        .silentRun();
    });

    it('should dispatch failed', async () => {
      const id = 678543;
      const type = PATCH_INCIDENT;
      const payload = {
        type,
        patch: {
          id,
        },
      };
      const action = {
        payload,
      };
      const error = new Error('Whoops!!1!');
      const detail = 'Some error message';
      error.response = {
        status: 400,
        jsonBody: {
          detail,
        },
      };

      jest.spyOn(global, 'alert');

      await expectSaga(patchIncident, action)
        .provide([[matchers.call.fn(authPatchCall), throwError(error)]])
        .put(patchIncidentError({ type, error }))
        .silentRun();

      expect(global.alert).not.toHaveBeenCalled();

      error.response.status = 403;

      await expectSaga(patchIncident, action)
        .provide([[matchers.call.fn(authPatchCall), throwError(error)]])
        .put(patchIncidentError({ type, error }))
        .silentRun();

      expect(global.alert).toHaveBeenCalled();

      global.alert.mockRestore();
    });
  });

  describe('requestAttachments', () => {
    it('should call endpoint with filter data', () => {
      const id = 678543;
      const action = { payload: id };

      return expectSaga(requestAttachments, action)
        .call(authCall, `${requestURL}/${id}/attachments`)
        .silentRun();
    });

    it('should dispatch success', () => {
      const id = 678543;
      const action = { payload: id };
      const attachments = {
        results: [
          {
            location: 'https://8ee020dc6c5841455b34eef8ebce912a.jpg',
            is_image: true,
            created_at: '2019-08-07T10:40:16.708953+02:00',
          },
          {
            location: 'https://1f3852d0bc6daa97c265cc59818e8cde.jpg',
            is_image: true,
            created_at: '2019-08-07T10:40:16.708953+02:00',
          },
          {
            location: 'https://c23e93558ec3f6a3fe0d1de2019c1f58.jpg',
            is_image: true,
            created_at: '2019-08-07T10:40:16.708953+02:00',
          },
          {
            location: 'https://05959dccba37e64ffab0213307a242dc.jpg',
            is_image: true,
            created_at: '2019-08-07T10:40:16.708953+02:00',
          },
          {
            location: 'https://4794f36615ab0892f589cff0abf7dbbf.jpg',
            is_image: true,
            created_at: '2019-08-07T10:40:16.708953+02:00',
          },
        ],
      };

      return expectSaga(requestAttachments, action)
        .provide([[matchers.call.fn(authCall), attachments]])
        .put(requestAttachmentsSuccess(attachments.results.slice(0, 3)))
        .silentRun();
    });

    it('should dispatch failed', () => {
      const id = 678543;
      const action = { payload: id };
      const error = new Error('Whoops!!1!');

      return expectSaga(requestAttachments, action)
        .provide([[matchers.call.fn(authCall), throwError(error)]])
        .put(requestAttachmentsError())
        .silentRun();
    });
  });

  describe('requestDefaultTexts', () => {
    const payload = {
      main_slug: 'afval',
      sub_slug: 'overig-afval',
    };
    const action = {
      payload,
    };

    it('should call endpoint with filter data', () =>
      expectSaga(requestDefaultTexts, action)
        .provide([[matchers.call.fn(requestURL)]])
        .call(
          authCall,
          `${requestTermsURL}/${payload.main_slug}/sub_categories/${payload.sub_slug}/status-message-templates`
        )
        .silentRun());

    it('should dispatch success', () => {
      const templates = [
        {
          state: 'o',
          templates: [
            {
              title: 'Cras iaculis accumsan nulla, eu.',
              text:
                'Pellentesque et lacus ut tortor tempus rhoncus sit amet at odio. Nunc quam eros, pretium non felis ut, consequat vehicula.',
            },
            {
              title: 'Nullam at nulla non enim.',
              text:
                'Curabitur ullamcorper, augue efficitur pulvinar dapibus, leo augue euismod libero, sit amet pellentesque justo massa id arcu. Lorem ipsum dolor.',
            },
            {
              title: 'Morbi sed arcu vel urna.',
              text:
                'Nulla pretium consectetur augue, id fringilla nulla consequat ac. Morbi interdum magna in euismod vehicula. Nulla facilisi. Suspendisse tempus vitae.',
            },
          ],
        },
      ];
      return expectSaga(requestDefaultTexts, action)
        .provide([[matchers.call.fn(authCall), templates]])
        .put(requestDefaultTextsSuccess(templates))
        .silentRun();
    });

    it('should dispatch failed', () => {
      const error = new Error('Whoops!!1!');

      return expectSaga(requestDefaultTexts, action)
        .provide([[matchers.call.fn(authCall), throwError(error)]])
        .put(requestDefaultTextsError(error))
        .silentRun();
    });
  });
});
