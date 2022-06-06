import React, { useContext } from 'react'
import { checkoutcontext } from "../../pages/checkout";

function CheckOutDetailsEditForm() {

    const { name, setName, email, setEmail, phone, setPhone, address, setAddress } = useContext(checkoutcontext)
    return (
        <div>
            <form className='edit-prod-form m-auto mt-3'>
                <p className="black-title-lg">Please fill out all the details!</p>
                <label htmlFor='name'>name</label>
                <input autoFocus={true} id='name' type="text" className='form-control' value={name} onChange={evt => setName(evt.target.value)} />
                <label htmlFor='phone'>phone</label>
                <input id='phone' type="number" className='form-control' value={phone} onChange={(evt) => setPhone(evt.target.value)} />
                <label htmlFor='email'>email</label>
                <input id="email" type="text" className='form-control' value={email} onChange={evt => setEmail(evt.target.value)} />
                <label htmlFor='address'>address</label>
                <input id="address" type="text" className='form-control' value={address} onChange={evt => setAddress(evt.target.value)} />
            </form>
        </div>
    )
}

export default CheckOutDetailsEditForm