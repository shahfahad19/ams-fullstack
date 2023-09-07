import React from 'react';
import { useRouteError } from 'react-router-dom';
import Header from '../Components/Main/Header';

export default function Error() {
  const error = useRouteError();

  return (
    <div className="h-screen">
      <Header />
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <p className="text-error font-bold">
            <span className="text-6xl">{error.status}</span>
            <br />
            <span className="text-2xl">{error.statusText}</span>
          </p>
          <p className="font-semibold mt-5">{error.data && error.data}</p>
        </div>
      </div>
    </div>
  );
}
