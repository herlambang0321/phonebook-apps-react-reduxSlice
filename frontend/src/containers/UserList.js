import React, { useCallback, useEffect } from "react";
import { loadUser, removeUser, resendUser, updateUser, loadmoreUser } from "../actions/api";
import UserItem from "../components/UserItem"
import { useSelector, useDispatch } from 'react-redux'

export default function UserList(props) {

    const users = useSelector((state) => state.users.data)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadUser())
    }, [dispatch]);

    const scrolled = useCallback((event) => {
        var element = event.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            dispatch(loadmoreUser())
        }
    }, [dispatch])

    return (
        <div onScroll={scrolled} style={{ height: 200, overflowY: 'scroll' }}>
            <table className="table table-striped mt-3">
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
                                update={(name, phone) => dispatch(updateUser(user.id, name, phone))}
                                remove={() => dispatch(removeUser(user.id))}
                                resend={() => dispatch(resendUser(user.id, user.name, user.phone))}
                            />
                        )
                    })}
                </tbody>
            </table>
        </div >
    )

}
