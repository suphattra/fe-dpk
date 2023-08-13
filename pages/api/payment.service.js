import { http } from './dpk/http.endpoint.dpk';
let Omise = null
let paymentResult = null
export const PaymentService = {
    initial(_omise) {
        if (_omise) {
            Omise = _omise
        } else {
            Omise = window.Omise
            Omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || "pkey_test_5te08cxtsk2cku77r0b")
        }

        paymentResult = null
    },
    confirmCharges,
    polling,
    getPaymentResult
};
async function confirmCharges(jobId, amount) {
    if (!Omise) { PaymentService.initial() }
    const amountParam = amount * 100
    const reqCreateSource = {
        "amount": amountParam,
        "currency": "THB"
    }

    let promise = new Promise((resolve, reject) => {
        Omise.createSource('promptpay', reqCreateSource, function (statusCode, response) {
            let sourceResp = response
            if (statusCode == 200) {
                resolve(sourceResp)
            } else {
                console.log(`Error, Create source HTTP Code: ${statusCode}`)
                reject(new Error(sourceResp.message))
            }
        });
    });

    const resultSource = await promise

    let reqCreateCharge = {
        "sourceId": resultSource.id,
        "currency": "THB",
        "amount": amountParam,
        "jobId": jobId,
    }
    try {
        return http.post(`/nx/v1/payment/charges`, reqCreateCharge);
    } catch (err) {
        console.log(err)
    }
}

async function pollingBK(chargeId) {
    try {
        const response = http.get(`/nx/v1/payment/charges/${chargeId}/status`);
        if (response.status == 502) {
            // Status 502 is a connection timeout error,
            // may happen when the connection was pending for too long,
            // and the remote server or a proxy closed it
            // let's reconnect
            await PaymentService.polling(chargeId);

        } else if (response.status != 200) {
            // An error - let's show it
            // showMessage(response.statusText);
            // Reconnect in one second
            await new Promise(resolve => setTimeout(resolve, 3000));
            await PaymentService.polling(chargeId);

        } else if (response.status == 200) {

            const respPayload = await response.json()
            console.log(`polling response : ${JSON.stringify(respPayload)}`)

            const resultCode = respPayload.resultCode
            const resultData = respPayload.resultData
            const { chargeId, failureMessage, paymentId, status } = resultData.paymentStatus
            paymentResult = status

            console.log(`paymentResult : ${paymentResult}`)

            if (resultData?.paymentStatus?.status === "pending") {
                // Call subscribe() again to get the next message
                await new Promise(resolve => setTimeout(resolve, 3000));
                await PaymentService.polling(chargeId);

            } else {
                //status === "successful"
                //status === "failed"
                //Success
                return Promise.resolve(paymentResult)
            }

        }
    } catch (err) {
        console.log(err)
    }




}

async function polling(chargeId) {
    try {
        return http.get(`/nx/v1/payment/charges/${chargeId}/status`);
    } catch (err) {
        console.log(err)
    }
}

async function getPaymentResult() {
    return paymentResult
}