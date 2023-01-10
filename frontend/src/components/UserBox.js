import React, { useState } from "react";
import UserForm from "../containers/UserForm";
import UserList from "../containers/UserList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default function UserBox(props) {

    const [add, setAdd] = useState({
        showAdd: false,
    });

    const hiddenAddUser = () => {
        setAdd({
            showAdd: false
        })
    }

    const showAddUser = () => {
        setAdd({
            showAdd: true
        })
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-header text-center">
                    <h1>Phone Book Apps</h1>
                </div>
            </div>
            <div className="card-body mt-3">
                {add.showAdd ? <UserForm cancel={hiddenAddUser} /> : <button type="submit" className="btn btn-primary" onClick={() => showAddUser()}><FontAwesomeIcon icon={faPlus} /> add</button>}
            </div>
            <div className="card-body mt-3">
                <UserForm
                    submitLabel=" search" fontlabel="Search Form"
                />
            </div>
            <UserList />
        </div>
    )

}