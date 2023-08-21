import { useRouter } from "next/router";
import {  useState } from 'react';
// import Pagination from "../Pagination";
import moment from "moment";
import ModalUpdateTimesheet from "./ModalUpdateTimesheet";
import { OperationsService } from "../../pages/api/operations.service";
import LoadingOverlay from "react-loading-overlay";

export default function ResultTimeSheet({ operationsList, total, paginate, currentPage, callBack }) {
    const [showJobDetailForm, setShowJobDetailForm] = useState(false)
    const [timesheetDetail, setTimesheetDetail] = useState({})
    const [loading, setLoading] = useState(false)
    const onSetJobDetailModal = (value) => {
        setShowJobDetailForm(value)
    }
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const renderbadgeStatus = (status, code) => {
        let buttonColor;
        let text_color;
        switch (code) {
            case "MD0029":
                buttonColor = 'bg-red-100 border-red-300';
                text_color = "text-red-800"
                break;
            case "MD0028":
                buttonColor = "bg-green-100 border-green-300";
                text_color = "text-green-800"
                break;
            case "MD0027":
                buttonColor = "bg-yellow-100 border-yellow-300";
                text_color = "text-yellow-800"
                break;
            default:
                buttonColor = "bg-gray-100 border-gray-300";
                text_color = "text-gray-800"
        }
        return <span className={classNames(buttonColor, text_color, "inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium ")}>{status}</span>
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


    return (
        <div className="md:container md:mx-auto">
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                                                พนักงาน
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                แปลงใหญ่
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                แปลงย่อย
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                งาน
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                จำนวน
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                ค่าแรง
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                OT
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                วัน/เดือน/ปี
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                สถานะงาน
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only"></span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {operationsList && operationsList.length > 0 && operationsList.map((job) => (
                                            <>
                                                <tr >
                                                    <td className="text-center whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {job.employee.firstName}   {job.employee.lastName}
                                                    </td>
                                                    <td className="text-centerwhitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.mainBranch.branchName}</td>
                                                    <td className="text-center whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.subBranch.branchName}</td>
                                                    <td className="text-center whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.task.value1}</td>
                                                    <td className="text-center whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.taskAmount}</td>
                                                    <td className="text-center whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.taskPaymentRate}</td>
                                                    <td className="text-center whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className={`inline-flex items-center rounded-md  px-2.5 py-0.5 text-sm font-medium text-black-400`}>
                                                            <svg className={`mr-1.5 h-2 w-2  `} fill="currentColor" viewBox="0 0 8 8">
                                                            </svg>
                                                            {job.otAmount} * {job.otRate}
                                                        </span>
                                                    </td>
                                                    <td className="text-center whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.startDate ? moment(job.startDate).format('DD/MM/YYYY') : ""}</td>

                                                    <td className="text-center whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {job.operationStatus ? renderbadgeStatus(job.operationStatus.value1, job.operationStatus.code) : ""}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" 
                                                        onClick={() => {
                                                            // onSetJobDetailModal(true)
                                                            getOperationDetail(job.operationCode)
                                                            // setTimesheetDetail(job)
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
                            </div>
                            {showJobDetailForm && <ModalUpdateTimesheet
                                open={showJobDetailForm}
                                setOpen={onSetJobDetailModal}
                                mode={"edit"}
                                timesheet={timesheetDetail}
                                                />}
                            {/* <Pagination totalPosts={total} currentPage={currentPage} postsPerPage={10} paginate={paginate} lengthList={operationsList} /> */}
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        </div>
    )
}


