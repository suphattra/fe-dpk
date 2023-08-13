import { EyeIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/router";
import Pagination from "../../components/Pagination";

export default function ResultTimeSheet({ jobList, total, paginate, currentPage, callBack }) {
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
                                            พนักงาน
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            แปลงใหญ่
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            แปลงย่อย
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            งาน
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            จำนวน
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            ค่าแรง
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            OT
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            วัน/เดือน/ปี
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            สถานะงาน
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only"></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {/* {jobList.map((job) => ( */}
                                    <tr >
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            ทอมมี่-ชาย/2
                                            {/* {job.shipmentDate} */}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">ทรัพย์ประเมิน</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">ทุเรียน</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">ฉีดดิน</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">-</td>
                                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.jobPoint[1].contactName}</td> */}
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">400</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">40*5</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className={`inline-flex items-center rounded-md  px-2.5 py-0.5 text-sm font-medium text-black-400`}>
                                                <svg className={`mr-1.5 h-2 w-2  `} fill="currentColor" viewBox="0 0 8 8">
                                                    {/* { <circle cx={4} cy={4} r={3} /> } */}

                                                </svg>
                                                1 เม.ย 66
                                                {/* {job.jobStatusDescTxt} ({job.jobStatusTxt}) */}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <button type="button"
                                                className="flex justify-center inline-flex items-center rounded-md border border-gray-500 bg-white-600 px-6 py-1 pb-1.5 text-sm font-medium text-black shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                            // onClick={handleReset}
                                            >
                                                รออนุมัติ
                                            </button>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                            </svg>

                                            {/* <EyeIcon className="text-indigo-600 hover:text-indigo-900 h-6 w-6 cursor-pointer"
                                                onClick={() => { router.push('job/detail/create-job?mode=view&id=') }} /> */}
                                        </td>
                                    </tr>
                                    <tr >
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            ปีโป้-ชาย/2
                                            {/* {job.shipmentDate} */}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">เขาหอม</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">ทุเรียน</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">ฉีดดินทุเรียน</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">-</td>
                                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.jobPoint[1].contactName}</td> */}
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">400</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">-</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className={`inline-flex items-center rounded-md  px-2.5 py-0.5 text-sm font-medium text-black-400`}>
                                                <svg className={`mr-1.5 h-2 w-2  `} fill="currentColor" viewBox="0 0 8 8">
                                                    {/* { <circle cx={4} cy={4} r={3} /> } */}

                                                </svg>
                                                1 เม.ย 66
                                                {/* {job.jobStatusDescTxt} ({job.jobStatusTxt}) */}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <button type="button"
                                                className="flex justify-center inline-flex items-center rounded-md border border-green-700 bg-white-600 px-6 py-1 pb-1.5 text-sm font-medium text-green shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mr-2"
                                            // onClick={handleReset}
                                            // style="border-color: green;"
                                            >
                                                อนุมัติแแล้ว
                                            </button>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                            </svg>

                                            {/* <EyeIcon className="text-indigo-600 hover:text-indigo-900 h-6 w-6 cursor-pointer"
                                                onClick={() => { router.push('job/detail/create-job?mode=view&id=') }} /> */}
                                        </td>
                                    </tr>
                                    <tr >
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            โมน-ญ/8
                                            {/* {job.shipmentDate} */}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">เขาหอม</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">ปู่</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">โยงผ้าใบ</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">1</td>
                                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.jobPoint[1].contactName}</td> */}
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">-</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">-</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className={`inline-flex items-center rounded-md  px-2.5 py-0.5 text-sm font-medium text-black-400`}>
                                                <svg className={`mr-1.5 h-2 w-2  `} fill="currentColor" viewBox="0 0 8 8">
                                                    {/* { <circle cx={4} cy={4} r={3} /> } */}

                                                </svg>
                                                1 เม.ย 66
                                                {/* {job.jobStatusDescTxt} ({job.jobStatusTxt}) */}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <button type="button"
                                                className="flex justify-center inline-flex items-center rounded-md border border-gray-500 bg-white-600 px-6 py-1 pb-1.5 text-sm font-medium text-black shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                            // onClick={handleReset}
                                            >
                                                รออนุมัติ
                                            </button>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                            </svg>

                                            {/* <EyeIcon className="text-indigo-600 hover:text-indigo-900 h-6 w-6 cursor-pointer"
                                                onClick={() => { router.push('job/detail/create-job?mode=view&id=') }} /> */}
                                        </td>
                                    </tr>
                                    {/* // ))} */}
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


