import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import { SpinnerWithText } from '../../Utils/Spinner';

const BatchInviteLink = () => {
  const [batch] = useOutletContext();
  const batchLink = batch ? `https://amsapp.vercel.app/signup?code=${batch.batchCode}` : '';

  function formChanged() {}

  const shareLink = async () => {
    await navigator.share({
      title: 'SignUp in AMS App',
      text: 'Click the following link to signup for Attendance Managment System',
      url: batchLink
    });
  };

  const copyLink = () => {
    if (batch.batchCode === undefined) return;
    navigator.clipboard.writeText(batchLink);
  };

  return (
    <div className="pb-20">
      <SubSectionHeader text="Invite Link" />
      {batch && (
        <div className="flex flex-col md:flex-row md:space-x-10 my-4 space-y-5 md:space-y-0 items-center justify-center">
          <div className="md:block">
            <img
              src={` https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${batchLink}`}
              alt="QR"
            />
          </div>
          <div className="flex flex-col text-sm md:text-lg">
            <div>
              Share the code <span className="code font-bold text-primary">{batch.batchCode}</span>{' '}
              with students
            </div>
            <div className="divider divider-horizontal sm:w-72 md:w-80">OR</div>

            <div>Share the link below</div>
            <div className="input-group flex flex-col items-center mt-2">
              <div className="w-full">
                <input
                  id="link"
                  onChange={formChanged}
                  value={batch.batchCode ? batchLink : '...'}
                  className="input input-sm md:input-md w-full rounded-none"
                  disabled
                />
              </div>
              <div className="w-full">
                <button
                  className="btn btn-primary btn-sm md:btn-md w-1/2 rounded-none"
                  onClick={copyLink}>
                  Copy
                </button>
                <button
                  className="btn btn-success btn-sm md:btn-md w-1/2 rounded-none"
                  onClick={shareLink}>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!batch && <SpinnerWithText>Fetching batch info...</SpinnerWithText>}
    </div>
  );
};

export default BatchInviteLink;
