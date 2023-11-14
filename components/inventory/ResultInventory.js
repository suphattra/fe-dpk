import { useRouter } from "next/router";
import { useState } from 'react';
import Pagination from "../Pagination";
import { OperationsService } from "../../pages/api/operations.service";
import LoadingOverlay from "react-loading-overlay";
import { BarsArrowDownIcon, BarsArrowUpIcon, ChevronDoubleDownIcon } from "@heroicons/react/20/solid";
import ModalUpdateInventory from "./ModalUpdateInventory";

export default function ResultInventory({ inventoryList, total, paginate, currentPage, callBack, onSort }) {
    const [showJobDetailForm, setShowJobDetailForm] = useState(false)
    const [timesheetDetail, setTimesheetDetail] = useState({})
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(true)
    const onSetJobDetailModal = (value) => {
        setShowJobDetailForm(value)
    }
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const getOperationDetail = async (operationCode) => {
        setLoading(true)
        await OperationsService.getOperationsDetail(operationCode).then(res => {
            if (res.data.resultCode === 200) {
                console.log(res.data.resultData)
                setTimesheetDetail(res.data.resultData[0])
                onSetJobDetailModal(true)
            } else {
                setTimesheetDetail({})
            }
            setLoading(false)
        }).catch(err => {
            console.log("==> list job3")
            setLoading(false)
        })
    }
    const sortTable = async (name) => {
        onSort(name, sort)
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
                                            <div class="flex items-center " onClick={() => { sortTable('branchType.branchName'); setSort(!sort) }}>รหัส
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}
                                                {/* <svg class="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                                            </svg> */}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center" onClick={() => { sortTable('mainBranch.value1'); setSort(!sort) }}>ชื่อ
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center" onClick={() => { sortTable('subBranch.branchName'); setSort(!sort) }}>ประเภท
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">

                                            <div class="flex items-center" onClick={() => { sortTable('supervisor.firstName'); setSort(!sort) }}>หน่วย
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center" onClick={() => { sortTable('areaSize'); setSort(!sort) }}>
                                                รูปแบบการจ่าย
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center" onClick={() => { sortTable('areaSize'); setSort(!sort) }}>
                                                จำนวนคงเหลือ
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            <div class="flex items-center" onClick={() => { sortTable('areaSize'); setSort(!sort) }}>
                                                นำเข้าล่าสุด
                                                {sort ? <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" /> : <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />}

                                            </div>
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
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.inventoryType?.value1}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.unit}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.paymentType?.value1}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.amount}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.importDate}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer"
                                                        onClick={() => {
                                                            onSetJobDetailModal(true)
                                                            setTimesheetDetail(item)
                                                        }}
                                                    >
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                                    </svg>
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
                            <Pagination totalPosts={total} currentPage={currentPage} postsPerPage={10} paginate={paginate} lengthList={inventoryList} />
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        </div>
    )
}


