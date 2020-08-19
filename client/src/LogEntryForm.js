import React, {useState} from 'react';
import { useForm } from "react-hook-form";

import {createLogEntry} from './API'


const LogEntryForm = ({location, onClose}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        console.log(data);
        try {
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            await createLogEntry(data);
            onClose();
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
        }      
    }
    return (
        <div>
            <form className='entryForm' onSubmit={handleSubmit(onSubmit)}>
                {error ? <h3>{error}</h3> : null }
                <label htmlFor='title' >Title</label>
                <input name='title' required ref={register}/>
                <label htmlFor='comments' >Comments</label>
                <textarea name="comments" rows={3} ref={register}></textarea>
                <label htmlFor='description' >Description</label>
                <textarea name="description" rows={3} ref={register}></textarea>
                <label htmlFor='image' >Image</label>
                <input name='image' ref={register} />
                <label htmlFor='visitDate' >Visit Date</label>
                <input name='visitDate' type="date" required ref={register} />
                <button disabled={loading}> {loading ? 'Laoding' : 'Create Entry'}</button>
            </form>
            
        </div>
    )
}

export default LogEntryForm;
