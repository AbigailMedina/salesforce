
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

const showToast = (title, message, variant, thisArg) => {
    const errToast = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
    })
    thisArg.dispatchEvent(errToast);
}

export {showToast};