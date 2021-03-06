export const actionTypes = {
    FAILURE: 'FAILURE',
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT',
    RESET: 'RESET',
    LOAD_DATA: 'LOAD_DATA',
    LOAD_DATA_SUCCESS: 'LOAD_DATA_SUCCESS',
    START_CLOCK: 'START_CLOCK',
    TICK_CLOCK: 'TICK_CLOCK',
    LOAD_USER: 'LOAD_USER',
    LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
    SET_TOKEN: 'SET_TOKEN',
    GET_TOKEN: 'GET_TOKEN',
}

export function failure (error) {
    return {
        type: actionTypes.FAILURE,
        error
    }
}

export function increment () {
    return { type: actionTypes.INCREMENT }
}

export function decrement () {
    return { type: actionTypes.DECREMENT }
}

export function reset () {
    return { type: actionTypes.RESET }
}

export function loadData () {
    return { type: actionTypes.LOAD_DATA }
}

export function loadUser () {
    return { type: actionTypes.LOAD_USER }
}

export function loadUserSuccess (data) {
    return {
        type: actionTypes.LOAD_USER_SUCCESS,
        data
    }
}

export function getToken (data) {
    return {
        type: actionTypes.GET_TOKEN,
        data
    }
}

export function setToken (data) {
    return {
        type: actionTypes.SET_TOKEN,
        data
    }
}

export function loadDataSuccess (data) {
    return {
        type: actionTypes.LOAD_DATA_SUCCESS,
        data
    }
}

export function startClock () {
    return { type: actionTypes.START_CLOCK }
}

export function tickClock (isServer) {
    return {
        type: actionTypes.TICK_CLOCK,
        light: !isServer,
        ts: Date.now()
    }
}
