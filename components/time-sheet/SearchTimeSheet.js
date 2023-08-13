import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { CardBasic, InputGroup, InputSelectGroup, InputGroupDate } from "../../components";
import { renderOptions } from "../../helpers/utils";
export default function SearchTimeSheet({ handleSearch, handleReset, handleChange, searchParam, jobStatus, customerType, paymentStatus }) {
    const router = useRouter();
    return (
        <>
            <div className="md:container md:mx-auto">

                <div className="flex justify-end w-full max-w-screen pt-4" aria-label="Breadcrumb">
                    <div className="block justify-left w-full pt-4">
                        บันทึกการทำงาน
                    </div>
                    <button type="button"
                        onClick={() => { router.push('job/detail/create-job'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                        สร้างรายงาน
                    </button>
                    <button type="button"
                        onClick={() => { router.push('job-dpk/detail/create-job'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium  shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                        ตารางงาน
                    </button>
                    <button type="button"
                        onClick={() => { router.push('job-dpk/detail/create-job'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                        สร้างบันทึก
                    </button>
                </div>
                <CardBasic >
                    <div className="flex justify-center grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">

                        <InputSelectGroup type="text" id="status" name="status" label="แปลงใหญ่"
                            options={renderOptions(jobStatus, "configValue2", "configCode", "configValue")}
                            value={searchParam.status}
                            onChange={handleChange}
                        />
                        <InputSelectGroup type="text" id="customerType" name="customerType" label="แปลงย่อย"
                            options={renderOptions(customerType, "configValue", "configCode")}
                            value={searchParam.customerType}
                            onChange={handleChange}
                        />
                        <InputSelectGroup type="text" id="paymentStatus" name="paymentStatus" label="สถานะงาน"
                            options={renderOptions(paymentStatus, "configValue", "configCode")}
                            value={searchParam.paymentStatus}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">

                        {/* <InputGroup type="text" id="contactName" name="contactName" label="Recepient name:" onChange={handleChange} value={searchParam.contactName} /> */}
                        <InputSelectGroup type="text" id="status" name="status" label="พนักงาน"
                            options={renderOptions(jobStatus, "configValue2", "configCode", "configValue")}
                            value={searchParam.status}
                            onChange={handleChange}
                        />
                        <InputSelectGroup type="text" id="status" name="status" label="งาน"
                            options={renderOptions(jobStatus, "configValue2", "configCode", "configValue")}
                            value={searchParam.status}
                            onChange={handleChange}
                        />
                        <InputGroupDate type="text" id="shipmentDateTo" name="shipmentDateTo" label="วัน/เเดือน/ปี" onChange={handleChange} value={searchParam.shipmentDateTo ? searchParam.shipmentDateTo : ""} format="YYYY-MM-DD" />
                    </div>
                    <div className="flex justify-center items-center overflow-y-auto p-4" >
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                            onClick={handleReset}>
                            ล้าง
                        </button>
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={handleSearch}>
                            ค้นหา
                        </button>
                    </div>
                </CardBasic>
            </div>
        </>
    )
}

