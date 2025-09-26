import React from 'react';
import rightCheckmark from '../../image/right_checkmark.svg';

function SuccessMsg() {
    return (
        <div>
            <div className='success_msg_container'>
                <div>
                    <img style={{ "pointerEvents": "all" }} src={rightCheckmark} alt="Success" />
                </div>
                <div className='green_msg'>
                    User Info submitted successfully !
                </div>
                <div>
                    <b> Please allow 24 hours for your edits to be processed and reflected.Thank you for your patience!</b>
                </div>
            </div>
        </div>
    );
}

export default SuccessMsg;