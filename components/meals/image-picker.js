'use client'
import Image from 'next/image';


import { useRef, useState } from 'react'
import classes from './image-picker.module.css'

export default function ImagePicker({ label, name }) {
    const [pickedImage, setPickedImage] = useState();
    const imageInputRef = useRef();

    function handlePickClick() {
        imageInputRef.current.click();
    }

    function handleImageChange(event) {
        const file = event.target.files[0];

        if (!file) {
            setPickedImage(null);
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {
            setPickedImage(fileReader.result);
        }

        fileReader.readAsDataURL(file);
    }

    return (
        <div className={classes.picker}>
            <label htmlFor={name}>{label}</label>
            <div className={classes.controls}>
                <div className={classes.preview}>
                    {!pickedImage && <p>No image picked yet.</p>}
                    {pickedImage && <Image 
                    src={pickedImage} 
                    alt='The image selected by the user.'
                    fill
                    />}
                </div>
                <input
                    className={classes.input}
                    type='file'
                    id={name}
                    name={name}
                    onChange={handleImageChange}
                    ref={imageInputRef}
                    accept='image/png, image/jpeg'
                    required
                />
                <button onClick={handlePickClick} className={classes.button} type='button'>
                    Pick an Image
                </button>
            </div>
        </div>
    )
}