import { race, take, put, select } from 'redux-saga/effects';
import { dep } from 'worona-deps';
import * as selectors from '../selectors';

function* waitForList({ listType, listId, page }) {
  const LIST_SUCCEED = dep('connection', 'actionTypes', 'LIST_SUCCEED');
  const LIST_FAILED = dep('connection', 'actionTypes', 'LIST_FAILED');
  yield race({
    succeed: take(
      action =>
        action.type === LIST_SUCCEED &&
        action.listType === listType &&
        action.listId === listId &&
        action.page === page
    ),
    failed: take(
      action =>
        action.type === LIST_FAILED &&
        action.listType === listType &&
        action.listId === listId &&
        action.page === page
    )
  });
}

function* waitForSingle({ singleType, singleId }) {
  const SINGLE_SUCCEED = dep('connection', 'actionTypes', 'SINGLE_SUCCEED');
  const SINGLE_FAILED = dep('connection', 'actionTypes', 'SINGLE_FAILED');
  yield race({
    succeed: take(
      action =>
        action.type === SINGLE_SUCCEED &&
        action.singleType === singleType &&
        action.singleId === singleId
    ),
    failed: take(
      action =>
        action.type === SINGLE_FAILED &&
        action.singleType === singleType &&
        action.singleId === singleId
    )
  });
}

export default function* saturnServerSaga({
  selected: { singleType, singleId, listType, listId, page }
}) {
  yield take(dep('build', 'actionTypes', 'SERVER_SAGAS_INITIALIZED'));
  const routeChangeSucceed = dep('connection', 'actions', 'routeChangeSucceed');
  const routeChangeRequested = dep('connection', 'actions', 'routeChangeRequested');

  if (listType) {
    const context = yield select(selectors.contexts.home);
    const action = { selected: { listType, listId, page }, context };
    yield put(routeChangeRequested(action));
    yield put(routeChangeSucceed(action));
    yield waitForList({ listType, listId, page });
  } else {
    const selected = { singleType, singleId };
    const action = { selected, context: selectors.contexts.single };
    yield put(routeChangeRequested(action));
    yield put(routeChangeSucceed(action));
    yield waitForSingle({ singleType, singleId });
  }
}
