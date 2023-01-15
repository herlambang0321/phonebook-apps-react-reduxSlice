import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loadUser, addUser, updateUser, removeUser } from './userAPI';
import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

const initialState = {
    value: {
        data: [],
        params: {
            page: 1,
            totalPage: 0
        }
    },
    status: 'idle',
};

export const loadUserAsync = createAsyncThunk(
    'user/loadUser',
    async () => {
        const response = await loadUser();
        return { data: response.data.data.rows, page: response.data.data.page, totalPage: response.data.data.totalPage };
    }
);

export const addUserAsync = createAsyncThunk(
    'user/addUser',
    async ({ id, name, phone }) => {
        try {
            const response = await addUser(name, phone);
            return { success: true, id, user: response.data.data };
        } catch (err) {
            return { success: false, id }
        }
    }
);

export const updateUserAsync = createAsyncThunk(
    'user/updateUser',
    async ({ id, name, phone }) => {
        const response = await updateUser(id, name, phone);
        return { id, user: response.data.data };
    }
);

export const removeUserAsync = createAsyncThunk(
    'user/removeUser',
    async (id) => {
        const response = await removeUser(id);
        return { id, user: response.data.data };
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        add: (state, action) => {
            state.value = {
                ...state.value,
                data: [
                    ...state.value.data,
                    {
                        id: action.payload.id,
                        name: action.payload.name,
                        phone: action.payload.phone,
                        sent: true
                    }
                ]
            }
        },
        loadMore: (state, action) => {
            state.value = {
                data: [...state.value.data, ...action.payload.value.map(item => {
                    item.sent = true
                    return item
                })],
                params: action.payload.params
            }
        },
        searchUser: (state, action) => {
            state.value = {
                data: action.payload.value.map(item => {
                    item.sent = true
                    return item
                }),
                params: action.payload.params
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadUserAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    data: action.payload.data.map(item => {
                        item.sent = true
                        return item
                    }),
                    params: {
                        page: action.payload.page,
                        totalPage: action.payload.totalPage
                    }
                };
            })
            .addCase(addUserAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                if (action.payload.success) {
                    state.value = {
                        ...state.value,
                        data: [
                            ...state.value.data.map(item => {
                                if (item.id === action.payload.id) {
                                    return {
                                        id: action.payload.user.id,
                                        name: action.payload.user.name,
                                        phone: action.payload.user.phone,
                                        sent: true
                                    }
                                }
                                return item
                            })
                        ]
                    }
                } else {
                    state.value = {
                        ...state.value,
                        data: [
                            ...state.value.data.map(item => {
                                if (item.id === action.payload.id) {
                                    return { ...item, sent: false }
                                }
                                return item
                            })
                        ]
                    }
                }
            })
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...state.value,
                    data: [
                        ...state.value.data.map(item => {
                            if (item.id === action.payload.id) {
                                return {
                                    id: action.payload.user.id,
                                    name: action.payload.user.name,
                                    phone: action.payload.user.phone,
                                    sent: true
                                }
                            }
                            return item
                        })
                    ]
                }
            })
            .addCase(removeUserAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = {
                    ...state.value,
                    data: [
                        ...state.value.data.filter(item => item.id !== action.payload.id)
                    ]
                }
            })
    },
});

export const { add, loadMore, searchUser } = userSlice.actions;

export const selectUser = (state) => state.user.value.data;

export const create = (name, phone) => (dispatch, getState) => {
    const id = Date.now()
    if (!dispatch(searchUserData()) || !getState().user.value.params.query) {
        dispatch(add({ id, name, phone }))
        dispatch(addUserAsync({ id, name, phone }))
    }
};

export const loadmoreUser = () => async (dispatch, getState) => {
    try {
        let state = getState()
        if (state.user.value.params.page < state.user.value.params.totalPage) {
            let params = {
                ...state.user.value.params,
                page: state.user.value.params.page + 1
            }
            const { data } = await request.get('/phonebooks', { params });
            params = {
                ...params,
                totalPage: data.data.totalPage
            }
            dispatch(loadMore({ value: data.data.rows, params }))
        }
    } catch (err) {
        dispatch(err)
    }
};

export const searchUserData = (query) => async (dispatch, getState) => {
    let state = getState()
    let params = {
        ...state.user.value.params,
        ...query,
        page: 1
    }
    try {
        const { data } = await request.get('/phonebooks', { params })
        params = {
            ...params,
            totalPage: data.data.totalPage
        }
        dispatch(searchUser({ value: data.data.rows, params }))
    } catch (err) {
        dispatch(err)
    }

};

export default userSlice.reducer;
