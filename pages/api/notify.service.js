import { toast } from "react-toastify";

export const NotifyService = {
    toastMessage,
    info,
    error,
    warning,
    success
};

const options = {
    position: toast.POSITION.BOTTOM_RIGHT
}


function toastMessage() {
    toast.success('Success Notification !', {
        position: toast.POSITION.BOTTOM_RIGHT
    });
    toast('Toast is good', { hideProgressBar: true, autoClose: 3000, type: 'success' })
}

function info(message){
    toast(`${message}`, { hideProgressBar: true, autoClose: 3000, type: 'info' })
}

function warning(message){
    toast(`${message}`, { hideProgressBar: true, autoClose: 3000, type: 'warning' })
}

function error(message){
    toast(`${message}`, { hideProgressBar: true, autoClose: 3000, type: 'error' })
}

function success(message){
    toast(`${message}`, { hideProgressBar: true, autoClose: 3000, type: 'success' })
}
