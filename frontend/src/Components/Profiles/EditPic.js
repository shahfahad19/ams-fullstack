/* eslint-disable no-console */
import axios from 'axios';
import React, { useContext, useState } from 'react';
import AppContext from '../Context/AppContext';
import Form, {
    FormControl,
    FormField,
    FormGroup,
    FormLabel,
    FormLabelAlt,
    FormSubmitBtn,
    FormTitle,
    FormWrapper,
} from '../Utils/Form';
import Alert from '../Utils/Alert';
const EditPic = () => {
    const ctx = useContext(AppContext);
    const [btnState, setBtnState] = useState('');
    const [error, setError] = useState();
    const [alert, setAlert] = useState({
        show: false,
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        try {
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        } catch (err) {
            /* empty */
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (image === null) {
            setError('Image required');
            return;
        } else {
            setError(null);
        }
        setAlert({
            show: false,
        });
        setBtnState('btn-loading');
        const formData = new FormData();
        formData.append('image', image);
        formData.append('user_id', ctx.userData._id);

        // Send a POST request to the PHP script
        await axios
            .post('https://ams-images.000webhostapp.com/upload_image.php', formData)
            .then((response) => {
                const imageUrl = response.data.url; // JSON response from the PHP script
                updateProfile(imageUrl);
            })
            .catch((error) => {
                const errorMessage = ctx.computeError(error);
                setAlert(ctx.errorAlert(errorMessage));
            });
        return;
    };

    const updateProfile = (photo) => {
        axios
            .patch(
                `${ctx.baseURL}/user/updateProfile`,
                { photo },
                {
                    credentials: 'include',
                }
            )
            .then((response) => {
                setBtnState('');
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Updated successfully!',
                });
                ctx.setUserData(response.data.data.user);
            })
            .catch((error) => {
                setBtnState('');
                setAlert({
                    show: true,
                    type: 'error',
                    text: ctx.computeError(error),
                });
            });
    };

    return (
        <FormWrapper>
            <Form onSubmit={handleSubmit}>
                <FormTitle>Update Photo</FormTitle>
                <FormGroup>
                    <FormField>
                        <FormLabel>Photo</FormLabel>
                        <FormControl>
                            <input
                                className='input-file input-file-lg'
                                type='file'
                                alt='Select Image'
                                accept='image/jpeg'
                                onChange={handleImageChange}
                            />
                        </FormControl>
                        {error && <FormLabelAlt>{error}</FormLabelAlt>}
                    </FormField>

                    {image !== null && (
                        <FormField>
                            <div className='flex justify-center'>
                                <img
                                    src={imagePreview || ''}
                                    className='w-48 h-48 rounded-full'
                                    alt='img'
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </FormField>
                    )}
                    <FormSubmitBtn className={btnState}>Update</FormSubmitBtn>
                </FormGroup>
            </Form>
            <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />
        </FormWrapper>
    );
};

export default EditPic;
