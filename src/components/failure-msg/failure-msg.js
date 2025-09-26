import React from 'react';
import rightCheckmark from '../../image/error_info.svg';

function FailureMsg() {
    return (
        <div>
            <div className='error_msg_container'>
                <div className='red_msg error_user_info_container'>
                    <img style={{ "pointerEvents": "all" }} src={rightCheckmark} alt="Success" />
                    User Info submittion failed !
                </div>
                <div>
                    <b> Please contact technical support team. </b>
                </div>
            </div>
        </div>
    );
}

export default FailureMsg;