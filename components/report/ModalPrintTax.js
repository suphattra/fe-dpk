import React, { useState, useEffect, useRef, useContext, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from "react-hook-form";
import { ReportService } from '../../pages/api/report.service';
import { NotifyService } from '../../pages/api/notify.service';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { CustomerService } from '../../pages/api/customer.service';
import { PrinterIcon } from '@heroicons/react/20/solid';

export default function ModalPrintTax(props) {
    const { open, setOpen, packages, jobDetail, page } = props;

    const createValidationSchema = () => {
        let ObjectSchema = {
            customerName: Yup.string().required('กรุณาระบุ Customer Name'),
            customerAddress: Yup.string().required('กรุณาระบุ Customer Address'),
            customerTaxId: Yup.string().required('กรุณาระบุ Customer Tax Id'),
        }
        return Yup.object().shape({ ...ObjectSchema });
    }
    const validationSchema = createValidationSchema();
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm(formOptions);
    useEffect(() => {

        async function fetchData() {
            let customerId = page === "PACKAGE" ? packages.customerId : jobDetail.customerId
            await getCustomerDetail(customerId)
        }
        fetchData();
    }, [])

    const getCustomerDetail = async (customerId) => {
        await CustomerService.getCustomerDetail(customerId).then(res => {
            if (res.data.resultCode === "20000") {
                // Set value to form
                let defaultValues = {};
                defaultValues.customerName = res.data.resultData.customer.fullName
                defaultValues.customerAddress = res.data.resultData.customer.taxAddress
                // defaultValues.customerAddress = res.data.resultData.customer.address ? res.data.resultData.customer.address : ""
                //     + ' ตำบล' + res.data.resultData.customer.subDistrictTh ? res.data.resultData.customer.subDistrictTh : ""
                //         + ' อำเภอ' + res.data.resultData.customer.districtTh ? res.data.resultData.customer.districtTh : ""
                //             + ' จังหวัด' + res.data.resultData.customer.provinceTh ? res.data.resultData.customer.provinceTh : ""
                //                 + ' รหัสไปรษณีย์ ' + res.data.resultData.customer.zipcode ? res.data.resultData.customer.zipcode : ""
                defaultValues.customerTaxId = res.data.resultData.customer.taxId ? res.data.resultData.customer.taxId : ''

                reset({ ...defaultValues }); //call reset useForm() hook
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const handlePrint = async (data, e) => {
        e.preventDefault()
        let body = {
            page: page,
            packageId: packages ? packages.packageId : "",
            jobId: jobDetail ? jobDetail.jobId : "",
            customerName: data.customerName,
            customerAddress: data.customerAddress,
            customerTaxId: data.customerTaxId
        }
        await ReportService.taxInvoice(body).then(res => {
            if (res.data.resultCode === "20000") {
                ReportService.printTaxInvoice(res.data.resultData.fileId).then(res => {
                    console.log(res)
                    var file = new Blob([res.data], { type: res.headers['content-type'] });
                    const fileURL = window.URL.createObjectURL(file);
                    let alink = document.createElement('a');
                    alink.href = fileURL;
                    var filename = res.headers.get("content-disposition");
                    if (filename && filename.indexOf('attachment') !== -1) {
                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        var matches = filenameRegex.exec(filename);
                        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                    }
                    alink.download = filename;
                    alink.click();
                })
            } else {
                NotifyService.error(res.data.developerMessage)
            }
        }).finally(() => {
        }).catch(err => {
            console.log(err)
        })
        // setOpen(false)
    }
    const cancelPrint = () => {
        //Set value to form
        let defaultValues = {};
        defaultValues.customerName = ''
        defaultValues.customerAddress = ''
        defaultValues.customerTaxId = ''

        reset({ ...defaultValues });
        setOpen(false)
    }
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all md:w-6/12 lg:w-6/12 lg:max-w-screen-xl">
                                <div>
                                    <div className="">
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 py-3 border-b">
                                            Print Tax Invoice
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <form className="pt-6 pb-8 mb-4" onSubmit={handleSubmit(handlePrint)} id="inputForm">
                                                <div className="mb-2">
                                                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-4">
                                                        <div className="mb-2">
                                                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 required">
                                                                Customer Name :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="customerName"
                                                                id="customerName"
                                                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm placeholder-gray-300"
                                                                {...register("customerName", { required: true })}
                                                            />
                                                            <div className="invalid-feedback font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.customerName?.message}</div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 required">
                                                                Customer Address :
                                                            </label>
                                                            <textarea
                                                                type="text"
                                                                name="customerAddress"
                                                                id="customerAddress"
                                                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm placeholder-gray-300"
                                                                {...register("customerAddress", { required: true })}
                                                            />
                                                            <div className="invalid-feedback font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.customerAddress?.message}</div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <label htmlFor="customerTaxId" className="block text-sm font-medium text-gray-700 required">
                                                                Customer Tax Id
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="customerTaxId"
                                                                id="customerTaxId"
                                                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm placeholder-gray-300"
                                                                {...register("customerTaxId", { required: true })}
                                                            />
                                                            <div className="invalid-feedback font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.customerTaxId?.message}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex  justify-center">
                                    <button
                                        type="button"
                                        className="inline-flex  justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-xs mr-2"
                                        onClick={handleSubmit(handlePrint)}
                                    >
                                        <PrinterIcon className="text-white-600 hover:text-white-900 h-4 w-4 mr-2" />  PRINT
                                    </button>
                                    {/* <button
                                        type="button"
                                        className="inline-flex  justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm mr-2"
                                        onClick={() => handlePrint()}
                                    >
                                        Preview
                                    </button> */}
                                    <button
                                        type="button"
                                        className="inline-flex  justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-xs mr-2"
                                        onClick={() => cancelPrint()}
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

