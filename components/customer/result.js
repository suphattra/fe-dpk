import { CheckIcon, EyeIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/router";
import Pagination from "../Pagination";


export default function Result({ customerList, total, paginate, currentPage, callBack }) {
    const router = useRouter();
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
                                            Register Date
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Customer Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Phone Number
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Customer Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Email
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
                                    {customerList.map((person) => (
                                        <tr key={person.email}>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{person.registerDate}</td>
                                            <td className="whitespace-nowrap py-3 pl-4 text-sm text-gray-700">
                                                {person.fullName}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{person.phoneNo}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{person.customerTypeTxt}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{person.email}</td>
                                            {/* recordStatus */}
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 text-center">
                                                <span className={`inline-flex items-center rounded-md ${person.recordStatus === 'A' ? 'bg-green-100' : 'bg-red-100'} px-2.5 py-0.5 text-sm font-medium text-black-400`}>
                                                    <svg className={`mr-1.5 h-2 w-2  ${person.recordStatus === 'A' ? 'text-green-400' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 8 8">
                                                        <circle cx={4} cy={4} r={3} />
                                                    </svg>
                                                    {person.recordStatus === 'A' ? 'Active' : 'Suspend'}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <EyeIcon className="text-indigo-600 hover:text-indigo-900 h-6 w-6 cursor-pointer"
                                                    onClick={() => { router.push('customer/detail/customer-detail?mode=view&id=' + person.customerId); }} />
                                                <span className="sr-only">, {person.name}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination totalPosts={total} currentPage={currentPage} postsPerPage={10} paginate={paginate} lengthList={customerList} />
                    </div>
                </div>
            </div>
        </div >
    )
}
