import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { faPencil, faTrashCan, faRepeat, faBan } from '@fortawesome/free-solid-svg-icons'

export default function UserItem(props) {

    const [user, setUser] = useState({
        name: props.user.name,
        phone: props.user.phone
    });

    const [edit, setEdit] = useState({
        isEdit: false
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

    const handleEdit = () => {
        setEdit({
            isEdit: true
        });
    }

    const handleCancel = () => {
        setEdit({
            isEdit: false
        });
    }

    const saveEdit = () => {
        props.update(user.name, user.phone)
        setEdit({
            isEdit: false
        });
    }

    return (
        <tr>
            <td>{props.no}</td>
            <td>
                {edit.isEdit ?
                    <input type="text" className="form-control" name="name" value={user.name} onChange={handleInputChange} />
                    :
                    user.name
                }
            </td>
            <td>
                {edit.isEdit ?
                    <input type="text" className="form-control" name="phone" value={user.phone} onChange={handleInputChange} />
                    :
                    user.phone
                }
            </td>
            {props.sent ?
                edit.isEdit ?
                    <td>
                        <button type="button" className="btn btn-primary mx-1" onClick={saveEdit}><FontAwesomeIcon icon={faCircleCheck} /> save</button>
                        <button className='btn btn-warning text-white' type='button' onClick={handleCancel}><FontAwesomeIcon icon={faBan} style={{ transform: 'rotate(90deg' }} /> cancel</button>
                    </td>
                    :
                    <td>
                        <button type="button" className="btn btn-success mx-1" onClick={handleEdit}><FontAwesomeIcon icon={faPencil} /> edit</button>
                        <button className='btn btn-danger' type='button' onClick={props.remove}><FontAwesomeIcon icon={faTrashCan} /> delete</button>
                    </td>
                :
                <td>
                    <button className='btn btn-warning' type='button' onClick={props.resend}><FontAwesomeIcon icon={faRepeat} /> resend</button>
                </td>
            }
        </tr >
    )

}