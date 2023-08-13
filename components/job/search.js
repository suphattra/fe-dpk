import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { CardBasic, InputGroup, InputSelectGroup, InputGroupDate } from "../../components";
import { renderOptions } from "../../helpers/utils";
export default function Search({ handleSearch, handleReset, handleChange, searchParam, jobStatus, customerType, paymentStatus }) {
    const router = useRouter();
    return (
        <>
            <div className="md:container md:mx-auto">
                <div className="flex justify-end w-full max-w-screen pt-4" aria-label="Breadcrumb">
                    <button type="button"
                        onClick={() => { router.push('job-dpk/detail/create-job'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <PlusCircleIcon className="h-4 w-4 mr-2" />สร้างบันทึก
                    </button>
                </div>
                <CardBasic title="Search Criteria">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <InputGroupDate type="text" id="shipmentDateFrom" name="shipmentDateFrom" label="Shipment Date From:" onChange={handleChange} value={searchParam.shipmentDateFrom ? searchParam.shipmentDateFrom : ""} format="YYYY-MM-DD" />
                        <InputGroupDate type="text" id="shipmentDateTo" name="shipmentDateTo" label="Shipment Date To:" onChange={handleChange} value={searchParam.shipmentDateTo ? searchParam.shipmentDateTo : ""} format="YYYY-MM-DD" />
                        <InputGroup type="text" id="jobNo" name="jobNo" label="Job number:" onChange={handleChange} value={searchParam.jobNo} />
                        <InputGroup type="text" id="customerName" name="customerName" label="Sender Name:" onChange={handleChange} value={searchParam.customerName} />

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <InputGroup type="text" id="contactName" name="contactName" label="Recepient name:" onChange={handleChange} value={searchParam.contactName} />
                        <InputSelectGroup type="text" id="status" name="status" label="Status"
                            options={renderOptions(jobStatus, "configValue2", "configCode", "configValue")}
                            value={searchParam.status}
                            onChange={handleChange}
                        />
                        <InputSelectGroup type="text" id="customerType" name="customerType" label="Customer Type"
                            options={renderOptions(customerType, "configValue", "configCode")}
                            value={searchParam.customerType}
                            onChange={handleChange}
                        />
                        <InputSelectGroup type="text" id="paymentStatus" name="paymentStatus" label="Status Payment"
                            options={renderOptions(paymentStatus, "configValue", "configCode")}
                            value={searchParam.paymentStatus}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-center items-center overflow-y-auto p-4" >
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                            onClick={handleReset}>
                            Reset
                        </button>
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </CardBasic>
            </div>
        </>
    )
}

