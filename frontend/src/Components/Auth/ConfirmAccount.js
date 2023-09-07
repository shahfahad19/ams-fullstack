import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../Context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { AlertModal, ModalTitle, ModalWrapper } from '../Utils/Modal';
import Spinner from '../Utils/Spinner';

const ConfirmAccount = () => {
  const ctx = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [loading, isLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({
    show: false
  });
  useEffect(() => {
    axios
      .get(`${ctx.baseURL}/user/confirmAccount/${searchParams.get('token')}`)
      .then(() => {
        isLoading(false);
        setAlertModal({
          show: true,
          type: 'success',
          text: 'Account confirmed successfully'
        });
      })
      .catch((error) => {
        isLoading(false);
        setAlertModal({
          show: true,
          type: 'error',
          text: ctx.computeError(error)
        });
      });
  }, []);

  const alertModalHandler = () => ctx.navigate('/', { replace: true });
  return (
    <>
      {loading && (
        <ModalWrapper>
          <ModalTitle>Confirming Account</ModalTitle>
          <div className="flex justify-center mb-2">
            <Spinner />
          </div>
        </ModalWrapper>
      )}
      {alertModal.show && (
        <AlertModal type={alertModal.type} text={alertModal.text} handler={alertModalHandler} />
      )}
    </>
  );
};

export default ConfirmAccount;
