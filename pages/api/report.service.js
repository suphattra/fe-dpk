import { http } from './nxrider/http.endpoint.nxrider';

export const ReportService = {
    taxInvoice,
    printTaxInvoice
};

async function taxInvoice(data) {
    try {
        return http.post(`/nx/v1/report/gen-tax-invoice`, data);
    } catch (err) {
        console.log(err)
    }
}

async function printTaxInvoice(param, query) {
    try {
        return http.getfile(`/nx/v1/report/tax-invoice/${param}`, query);
    } catch (err) {
        console.log(err)
    }
}