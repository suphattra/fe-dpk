import { CardBasic, InputGroup, } from "../../components";

export default function Search({ handleSearch, handleReset, handleChange, searchParam }) {

    return (
        <>
            <CardBasic title="ข้อมูลพนักงาน" >

                <td className=" flex justify-end text-center whitespace-nowrap text-sm text-gray-500">

                    <button type="button"

                        className="flex justify-center inline-flex items-center rounded-md border border-gray-400 bg-g-600 px-6 py-1 pb-1.5 text-sm font-medium text-black shadow-sm hover:bg--700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                        สร้างรายงาน
                    </button>
                    <button type="button"
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                        เพิ่มพนักงาน
                    </button>
                </td>
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
        </>
    )
}