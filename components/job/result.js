import { EyeIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/router";
import Pagination from "../../components/Pagination";

export default function Result({ jobList, total, paginate, currentPage, callBack }) {
    const router = useRouter();
    const renderStatus = (status) => {
        let bg_color;
        switch (status) {
            case "NEW":
                bg_color = "bg-yellow-100";
                break;
            case "DELIVERING":
                bg_color = "bg-pink-100";
                break;
            case "GOING_TO_PICKUP":
                bg_color = "bg-purple-100";
                break;
            case "COMPLETE":
                bg_color = "bg-green-100";
                break;
            case "PENDING":
                bg_color = "bg-blue-100";
                break;
            case "CANCEL":
                bg_color = "bg-red-100";
                break;
            case "EMERGENCY":
                bg_color = "bg-orange-100";
                break;
            default:
                bg_color = "bg-gray-100";
        }
        return bg_color
    }
    const convertContactName = (data) => {
        if (data.length != 2) return ""
        return data[1].contactName;
    }
    return (
        <div className="md:container md:mx-auto">
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Shipment Date
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Job Number
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Start Date
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Sender Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Reciepient Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Job Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Customer Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Payment Status
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only"></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {jobList.map((job) => (
                                        <tr key={job.jobId}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {job.shipmentDate}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.jobNo}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.estStartTime}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.customerName}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{convertContactName(job.jobPoint)}</td>
                                            {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.jobPoint[1].contactName}</td> */}
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.jobTypeTxt}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.customerType}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex items-center rounded-md ${renderStatus(job.status)} px-2.5 py-0.5 text-sm font-medium text-black-400`}>
                                                    <svg className={`mr-1.5 h-2 w-2  `} fill="currentColor" viewBox="0 0 8 8">
                                                        <circle cx={4} cy={4} r={3} />
                                                    </svg>
                                                    {job.jobStatusDescTxt} ({job.jobStatusTxt})
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.paymentTxtTh}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <EyeIcon className="text-indigo-600 hover:text-indigo-900 h-6 w-6 cursor-pointer"
                                                    onClick={() => { router.push('job/detail/create-job?mode=view&id=' + job.jobId) }} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination totalPosts={total} currentPage={currentPage} postsPerPage={10} paginate={paginate} lengthList={jobList} />
                    </div>
                </div>
            </div>
        </div>
    )
}
