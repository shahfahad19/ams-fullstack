import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BackButton = (props) => {
  const navigate = useNavigate();

  const goBack = (event) => {
    event.preventDefault();
    navigate(props.to, { replace: true });
  };

  return (
    <>
      <br />
      <Link onClick={goBack} className={'text-sm ' + props.className}>
        &#8592; Back to {props.text}
      </Link>
    </>
  );
};

export default BackButton;
