import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import UserItem from "../../components/UserItem"

import {
    loadUserAsync,
    selectUser,
    removeUserAsync,
    addUserAsync,
    loadmoreUser,
} from './userSlice';

export default function UserList(props) {

    const users = useSelector(selectUser)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadUserAsync())
    }, [dispatch]);

    const scrolled = (event) => {
        var element = event.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            dispatch(loadmoreUser())
        }
    }

    return (
        <div onScroll={scrolled} style={{ height: 200, overflowY: 'scroll' }}>
            <table className="table table-light table-striped mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => {
                        return (
                            <UserItem
                                key={user.id}
                                no={index + 1}
                                user={user}
                                sent={user.sent}
                                remove={() => dispatch(removeUserAsync(user.id))}
                                resend={() => dispatch(addUserAsync({ id: user.id, name: user.name, phone: user.phone }))}
                            />
                        )
                    })}
                </tbody>
            </table>
        </div >
    )

}
