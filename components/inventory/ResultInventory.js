import { useRouter } from "next/router";
import { Fragment, useState } from 'react';
import Pagination from "../Pagination";
import { Dialog, Transition } from "@headlessui/react";
import LoadingOverlay from "react-loading-overlay";
import { BarsArrowDownIcon, BarsArrowUpIcon, CheckIcon, ChevronDoubleDownIcon } from "@heroicons/react/20/solid";
import ModalUpdateInventory from "./ModalUpdateInventory";
import moment from "moment";
import { InventoryService } from "../../pages/api/inventory.service";

export default function ResultInventory({ inventoryList, total, paginate, currentPage, callBack, onSort }) {
    const [showJobDetailForm, setShowJobDetailForm] = useState(false)
    const [timesheetDetail, setTimesheetDetail] = useState({})
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(true)
    const [open, setOpen] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [invCode, setInvCode] = useState(null)
    const [message, setMessage] = useState("")
    const onSetJobDetailModal = (value) => {
        setShowJobDetailForm(value)
    }
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const sortTable = async (name) => {
        onSort(name, sort)
    }
    const deleteInventory = async (event) => {
        if (event === 'Ok') {
            await InventoryService.deleteInv(invCode).then(res => {
                if (res.data.resultCode === 200) {
                    setConfirmDelete(false)
                    callBack()
                } else {
                }
            }).finally(() => {
                setConfirmDelete(false)
            }).catch(err => {
                setConfirmDelete(false)
                console.log(err)
            })
        } else {
            setConfirmDelete(false)
        }
    }
    async function onChangeStatus(event) {
        if (event === 'Ok') {
            await InventoryService.checkOperation(invCode).then(async res => {
                if (res.data.resultCode === 200) {
                    await InventoryService.deleteInv(invCode).then(res => {
                        if (res.data.resultCode === 200) {
                            setOpen(false)
                            callBack()
                        } else {
                        }
                    }).finally(() => {
                        setOpen(false)
                    }).catch(err => {
                        setOpen(false)
                        console.log(err)
                    })
                } else {
                    setMessage("รายการสินค้านี้มีรายการเบิกอยู่ โปรดตรวจสอบ Operation ที่มีการเบิกสินค้าอยู่ หากยืนยันที่จะลบสินค้า กดปุ่มยืนยัน")
                    setOpen(false)
                    setConfirmDelete(true)
                }
            }).finally(() => {
            }).catch(err => {
                console.log(err)
            })
        } else {
            setOpen(false)
            // callBack()
        }

    }
    return (
        <div className="md:container md:mx-auto">
            <LoadingOverlay active={loading}
                // className="h-[calc(100vh-4rem)]" 
                spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    // wrapper: {
                    //     overflowY: loading ? 'scroll' : 'scroll'
                    // }
                }}>
                <div className="mt-4 flex flex-col px-8">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-0 lg:px-0">
                            <table className="min-w-full divide-y divide-gray-300 border rounded-md">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">
                                            <div class="flex items-center cursor-pointer" onClick={() => { sortTable('inventoryCode'); setSort(!sort) }}>รหัส
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}
                                                {/* <svg class="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                                            </svg> */}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center cursor-pointer" onClick={() => { sortTable('inventoryName'); setSort(!sort) }}>ชื่อ
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center cursor-pointer" onClick={() => { sortTable('inventoryTradeName'); setSort(!sort) }}>ชื่อการค้า
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center cursor-pointer" onClick={() => { sortTable('inventoryType.value1'); setSort(!sort) }}>ประเภท
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">

                                            <div class="flex items-center cursor-pointer" onClick={() => { sortTable('unit'); setSort(!sort) }}>หน่วย
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center cursor-pointer" onClick={() => { sortTable('paymentType.value1'); setSort(!sort) }}>
                                                รูปแบบการจ่าย
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center cursor-pointer" onClick={() => { sortTable('amount'); setSort(!sort) }}>
                                                จำนวนคงเหลือ
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center cursor-pointer" onClick={() => { sortTable('importDate'); setSort(!sort) }}>
                                                นำเข้าล่าสุด
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only"></span>
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only"></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {inventoryList && inventoryList.length > 0 && inventoryList.map((item) => (
                                        <>
                                            <tr >
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {item.inventoryCode}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.inventoryName}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.inventoryTradeName}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.inventoryType?.value1}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.unit}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.paymentType?.value1}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.amount}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.importDate ? moment(item.importDate).format('DD/MM/YYYY') : ""}</td>

                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-2 text-right text-sm font-medium sm:pr-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer"
                                                        onClick={() => {
                                                            onSetJobDetailModal(true)
                                                            setTimesheetDetail(item)
                                                        }}
                                                    >
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                                    </svg>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setOpen(true); setInvCode(item.inventoryCode) }}
                                                        className="bg-white hover:bg-gray-100 border border-gray-200 font-medium text-gray-500 rounded-lg text-sm px-1 py-1 text-center inline-flex items-center mt-0 disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>

                                        </>
                                    ))}
                                </tbody>
                            </table>
                            {showJobDetailForm && <ModalUpdateInventory
                                open={showJobDetailForm}
                                setOpen={onSetJobDetailModal}
                                mode={"edit"}
                                callbackLoad={callBack}
                                inventoryCode={timesheetDetail.inventoryCode}
                            />}
                            <Pagination totalPosts={total} currentPages={currentPage} postsPerPage={10} paginate={paginate} lengthList={inventoryList} maxPage={Math.ceil(total / 10)} />
                        </div>
                    </div>
                </div>
                <Transition.Root show={open} >
                    <Dialog as="div" className="relative z-10" onClose={setOpen}>
                        <Transition.Child
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
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <div>
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:mt-5">
                                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                    ยืนยันการลบข้อมูล
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        คุณต้องการลบสินค้านี้ใช่หรือไม่ ?
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                                onClick={() => { onChangeStatus('Ok') }}
                                            >
                                                ยืนยัน
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                                onClick={() => { onChangeStatus('Cancel') }}
                                            >
                                                ยกเลิก
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
                <Transition.Root show={confirmDelete} >
                    <Dialog as="div" className="relative z-10" onClose={setConfirmDelete}>
                        <Transition.Child
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
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <div>
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:mt-5">
                                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                    ยืนยันการลบข้อมูล
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        {message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                                onClick={() => { deleteInventory('Ok') }}
                                            >
                                                ยืนยัน
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                                onClick={() => { deleteInventory('Cancel') }}
                                            >
                                                ยกเลิก
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </LoadingOverlay>

        </div>
    )
}


