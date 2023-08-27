import Router from "next/router";
import { CardBasic, InputGroup, } from "../../components";

export default function Search({ handleSearch, handleReset, handleChange, searchParam }) {

    return (
        <>
            <div className="md:container md:mx-auto">
                <div className="flex justify-end w-full max-w-screen pt-4" aria-label="Breadcrumb">

                    <button
                        type="button"
                        className="flex justify-center inline-flex items-center rounded-md border border-gray-400 bg-g-600 px-6 py-1 pb-1.5 text-sm font-medium text-black shadow-sm hover:bg--700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                            <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
                        </svg>
                        สร้างรายงาน

                    </button>
                    <button type="button"
                        onClick={() => { Router.push('employee/detail/employee-detail'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                        เพิ่มพนักงาน

                    </button>

                </div>
                <CardBasic title="ข้อมูลพนักงาน" >

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center justify-end">
                            คำค้นหา
                        </div>
                        <div className="flex items-center">
                            <InputGroup type="text" id="name" name="name" onChange={handleChange} value={searchParam.name} />
                        </div>
                        <div className="flex justify-flex-start items-center overflow-y-auto p-4" >

                            <button type="button"
                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
                                onClick={handleSearch}
                            >
                                ค้นหา
                            </button>
                            <button type="button"
                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                onClick={handleReset}
                            >
                                ล้าง
                            </button>

                        </div>
                    </div>
                </CardBasic>
            </div>
        </>
    )
}