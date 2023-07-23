import { EyeIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/router";
import { useState } from "react";
import Pagination from "../Pagination";

export default function Result({ packageList, total, currentPage, paginate, searchParam }) {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const renderbadgeStatus = (status) => {
        let bg_color;
        let text_color;
        switch (status) {
            case "Consumed":
                bg_color = "bg-green-100";
                text_color = "text-green-800"
                break;
            case "Depleted":
                bg_color = "bg-red-100";
                text_color = "text-red-800"
                break;
            default:
                bg_color = "bg-gray-100";
                text_color = "text-gray-800"
        }
        return <span className={classNames(bg_color, text_color, "inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium ")}>{status}</span>
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
                                            Package Code
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Day Left
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                            Customer Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                            Trip Per Day
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                            Trip Used Today
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                            Point Left
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                            Point Used Today
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {packageList.map((packages) => (
                                        <tr key={packages.packageCode}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {packages.packageCode}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{packages.dayleft}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{packages.packageType}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{packages.customerFullName}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{packages.tripLimit}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{packages.tripUseToday}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{packages.pointLeft}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{packages.pointUseToday}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{renderbadgeStatus(packages.status)}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <EyeIcon className="text-indigo-600 hover:text-indigo-900 h-6 w-6 cursor-pointer"
                                                    onClick={() => { router.push('package/detail/detail-package?mode=view&id=' + packages.packageId + '&effectiveDate=' + searchParam.effectiveDate); }} /><span className="sr-only">, {packages.name}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination totalPosts={total} currentPage={currentPage} postsPerPage={10} paginate={paginate} lengthList={packageList} />
                    </div>
                </div>
            </div>
        </div>
    )
}
