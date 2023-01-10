import React, { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { faBan, faMagnifyingGlass, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { addUser, searchUser } from "../actions/api";
import { useDispatch } from 'react-redux'

export default function UserForm(props) {

    const dispatch = useDispatch()

    const [user, setUser] = useState({
        name: '',
        phone: ''
    });

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setUser({
            ...user,
            [name]: value
        });
    }

    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        dispatch(addUser(user.name, user.phone))
        setUser({ name: '', phone: '' })
    }, [dispatch, user])

    const handleSearch = useCallback((event) => {
        event.preventDefault()
        dispatch(searchUser({ name: user.name, phone: user.phone }))
    }, [dispatch, user])

    const handleCancel = () => {
        if (!props.fontlabel) {
            props.cancel()
        }
        setUser({ name: '', phone: '' })
    }

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h6>{props.fontlabel || 'Adding Form'}</h6>
                </div>
                <form className="m-3" onSubmit={props.fontlabel ? handleSearch : handleSubmit}>
                    <div className="d-flex justify-content me-5">
                        <div className="d-flex align-items-center">
                            <label htmlFor="name">Name</label>
                        </div>
                        <div className="d-flex col-sm-2">
                            <input type="text" className="form-control" id="name" name="name" placeholder="name"
                                onChange={handleInputChange} value={user.name} />
                        </div>
                        <div className="d-flex align-items-center">
                            <label htmlFor="phone">Phone</label>
                        </div>
                        <div className="d-flex col-sm-2">
                            <input type="text" className="form-control" id="phone" name="phone" placeholder="phone"
                                onChange={handleInputChange} value={user.phone} />
                        </div>
                        {props.submitLabel ?
                            <button type="submit" className="btn btn-info text-white"><FontAwesomeIcon icon={faMagnifyingGlass} />{props.submitLabel || ' save'}</button>
                            :
                            <button type="submit" className="btn btn-primary"><FontAwesomeIcon icon={faCircleCheck} />{props.submitLabel || ' save'}</button>
                        }
                        <button className="btn btn-warning text-white" onClick={handleCancel}><FontAwesomeIcon icon={props.submitLabel ? faRotateLeft : faBan} style={{ transform: 'rotate(90deg' }} />{props.submitLabel ? ' reset' : ' cancel'}</button>
                    </div>
                </form>
            </div>
        </div>
    )

}
