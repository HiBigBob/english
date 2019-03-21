/* global fetch */

import { all, call, delay, put, take, takeLatest, select } from 'redux-saga/effects'
import es6promise from 'es6-promise'
import 'isomorphic-unfetch'

import { actionTypes, failure, loadDataSuccess, tickClock, loadUserSuccess } from './actions'

es6promise.polyfill()

function * runClockSaga () {
    yield take(actionTypes.START_CLOCK)
    while (true) {
        yield put(tickClock(false))
        yield delay(1000)
    }
}

function * loadUserSaga () {
    const token = yield select(state => state.token)
    try {
        const res = yield fetch('http://localhost:5000/user', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          },
        })
        const data = yield res.json()
        yield put(loadUserSuccess(data))
    } catch (err) {
        yield put(failure(err))
    }
}

function * loadDataSaga () {
    try {
        const res = yield fetch('https://jsonplaceholder.typicode.com/users')
        const data = yield res.json()
        yield put(loadDataSuccess(data))
    } catch (err) {
        yield put(failure(err))
    }
}

function * rootSaga () {
    yield all([
        call(runClockSaga),
        takeLatest(actionTypes.LOAD_DATA, loadDataSaga),
        takeLatest(actionTypes.LOAD_USER, loadUserSaga)
    ])
}

export default rootSaga
