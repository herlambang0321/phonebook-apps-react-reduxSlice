import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

const loadUserSuccess = (users, page, totalPage) => ({
    type: 'LOAD_USER_SUCCESS',
    users,
    page,
    totalPage
})

const loadUserFailure = () => ({
    type: 'LOAD_USER_FAILURE'
})

export const loadUser = () => {
    return async (dispatch, getState) => {
        try {
            const { data } = await request.get('/phonebooks', { params: getState().users.params })
            dispatch(loadUserSuccess(data.data.rows, data.data.page, data.data.totalPage))
        } catch (err) {
            dispatch(loadUserFailure(err))
        }
    }
}

const loadmoreUserSuccess = (user) => ({
    type: 'LOADMORE_USER_SUCCESS',
    user
})

const loadmoreUserFailure = () => ({
    type: 'LOADMORE_USER_FAILURE'
})

export const loadmoreUser = () => {
    return async (dispatch, getState) => {
        try {
            let state = getState()
            if (state.users.params.page < state.users.params.totalPage) {
                let params = {
                    ...state.users.params,
                    page: state.users.params.page + 1
                }
                const { data } = await request.get('/phonebooks', { params });
                params = {
                    ...params,
                    totalPage: data.data.totalPage
                }
                dispatch(loadmoreUserSuccess({ value: data.data.rows, params }))
            }
        } catch (err) {
            dispatch(loadmoreUserFailure(err))
        }
    }
}

const searchUserSuccess = (user) => ({
    type: 'SEARCH_USER_SUCCESS',
    user
})

const searchUserFailure = () => ({
    type: 'SEARCH_USER_FAILURE'
})

export const searchUser = (query) => {
    return async (dispatch, getState) => {
        let state = getState()
        let params = {
            ...state.users.params,
            ...query,
            page: 1
        }
        try {
            const { data } = await request.get('/phonebooks', { params })
            params = {
                ...params,
                totalPage: data.data.totalPage
            }
            dispatch(searchUserSuccess({ value: data.data.rows, params }))
        } catch (err) {
            dispatch(searchUserFailure())
        }
    }
}

const addUserSuccess = (id, user) => ({
    type: 'ADD_USER_SUCCESS',
    id,
    user
})

const addUserFailure = (id) => ({
    type: 'ADD_USER_FAILURE',
    id
})

const addUserRedux = (id, name, phone) => ({
    type: 'ADD_USER',
    id,
    name,
    phone
})

export const addUser = (name, phone) => {
    const id = Date.now()
    return async (dispatch, getState) => {
        if (!dispatch(searchUser()) || !getState().users.params.query) {
            dispatch(addUserRedux(id, name, phone))
        }
        try {
            const { data } = await request.post('/phonebooks', { name, phone });
            dispatch(addUserSuccess(id, data.data))
        } catch (err) {
            dispatch(addUserFailure(id))
        }
    }
}

const updateUserSuccess = (id, user) => ({
    type: 'UPDATE_USER_SUCCESS',
    id,
    user
})

const updateUserFailure = () => ({
    type: 'UPDATE_USER_FAILURE'
})

export const updateUser = (id, name, phone) => {
    return async (dispatch) => {
        try {
            const { data } = await request.put(`/phonebooks/${id}`, { name, phone });
            dispatch(updateUserSuccess(id, data.data))
        } catch (err) {
            dispatch(updateUserFailure(id))
        }
    }
}

const removeUserSuccess = (id) => ({
    type: 'REMOVE_USER_SUCCESS',
    id
})

const removeUserFailure = () => ({
    type: 'REMOVE_USER_FAILURE'
})

export const removeUser = (id) => {
    return async (dispatch) => {
        try {
            await request.delete(`/phonebooks/${id}`);
            dispatch(removeUserSuccess(id))
        } catch (err) {
            dispatch(removeUserFailure(err))
        }
    }
}

const resendUserSuccess = (id, user) => ({
    type: 'RESEND_USER_SUCCESS',
    id,
    user
})

const resendUserFailure = () => ({
    type: 'RESEND_USER_FAILURE'
})

export const resendUser = (id, name, phone) => {
    return async (dispatch) => {
        try {
            const { data } = await request.post('/phonebooks', { name, phone });
            dispatch(resendUserSuccess(id, data.data))
        } catch (err) {
            dispatch(resendUserFailure(err))
        }
    }
}