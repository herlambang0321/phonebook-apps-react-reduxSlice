const users = (state = {
    data: [],
    params: {
        page: 1,
        totalPage: 0
    }
}, action) => {
    switch (action.type) {
        case 'LOAD_USER_SUCCESS':
            return {
                data: action.users.map(item => {
                    item.sent = true
                    return item
                }),
                params: {
                    page: action.page,
                    totalPage: action.totalPage
                }
            }
        case 'LOADMORE_USER_SUCCESS':
            return {
                data: [...state.data, ...action.user.value.map(item => {
                    item.sent = true
                    return item
                })],
                params: action.user.params
            }
        case 'SEARCH_USER_SUCCESS':
            return {
                data: action.user.value.map(item => {
                    item.sent = true
                    return item
                }),
                params: action.user.params
            }
        case 'ADD_USER':
            return {
                ...state,
                data: [
                    ...state.data,
                    {
                        id: action.id,
                        name: action.name,
                        phone: action.phone,
                        sent: true
                    }
                ]
            }
        case 'ADD_USER_SUCCESS':
            return {
                ...state,
                data: [
                    ...state.data.map(item => {
                        if (item.id === action.id) {
                            return {
                                id: action.user.id,
                                name: action.user.name,
                                phone: action.user.phone,
                                sent: true
                            }
                        }
                        return item
                    })
                ]
            }
        case 'ADD_USER_FAILURE':
            return {
                ...state,
                data: [
                    ...state.data.map(item => {
                        if (item.id === action.id) {
                            return { ...item, sent: false }
                        }
                        return item
                    })
                ]
            }
        case 'UPDATE_USER_SUCCESS':
            return {
                ...state,
                data: [
                    ...state.data.map(item => {
                        if (item.id === action.id) {
                            return {
                                id: action.user.id,
                                name: action.user.name,
                                phone: action.user.phone,
                                sent: true
                            }
                        }
                        return item
                    })
                ]
            }
        case 'RESEND_USER_SUCCESS':
            return {
                ...state,
                data: [
                    ...state.data.map(item => {
                        if (item.id === action.id) {
                            return {
                                id: action.user.id,
                                name: action.user.name,
                                phone: action.user.phone,
                                sent: true
                            }
                        }
                        return item
                    })
                ]
            }
        case 'REMOVE_USER_SUCCESS':
            return {
                ...state,
                data: [
                    ...state.data.filter(item => item.id !== action.id)
                ]
            }
        case 'REMOVE_USER_FAILURE':
        case 'UPDATE_CONTACT_FAILURE':
        case 'LOADMORE_USER_FAILURE':
        case 'SEARCH_USER_FAILURE':
        case 'RESEND_USER_FAILURE':
        case 'LOAD_USER_FAILURE':
        default:
            return state
    }
}

export default users