import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CardBasic, InputGroup, InputSelectGroup } from "../../components";
import { renderConfigOptions } from "../../helpers/utils";
import { MasterService } from "../../pages/api/master.service";

export default function Search({ handleSearch, handleReset, handleChange, searchParam }) {
    const router = useRouter();
    const data = {}
    const [customerType, setCustomerType] = useState([])
    const [paymentType, setPayment] = useState([])
    useEffect(() => {
        getConfig('CUSTOMER_TYPE')
        getConfig('PAYMENT_TYPE')
    }, [])

    const getConfig = async (configCategory) => {
        let paramquery = {
            configCategory: configCategory,
            configCode: '',
            status: ''
        }
        await MasterService.getConfig(paramquery).then(res => {
            if (res.data.resultCode === "20000") {
                if (configCategory === 'CUSTOMER_TYPE') setCustomerType(res.data.resultData.configs)
                if (configCategory === 'PAYMENT_TYPE') setPayment(res.data.resultData.configs)
            } else {
                if (configCategory === 'CUSTOMER_TYPE') setCustomerType([])
                if (configCategory === 'PAYMENT_TYPE') setPayment([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <>
            <div className="md:container md:mx-auto">

                <div className="flex justify-end w-full max-w-screen pt-4" aria-label="Breadcrumb">
                    <button type="button"
                        onClick={() => { router.push('customer/detail/customer-detail?mode=create'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <PlusCircleIcon className="h-4 w-4 mr-2" />NEW
                    </button>
                </div>
                <CardBasic title="Search Criteria">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <InputGroup type="text" id="phone" name="phone" label="Phone:" onChange={handleChange} value={searchParam.phone} />
                        <InputGroup type="text" id="name" name="name" label="Customer Name:" onChange={handleChange} value={searchParam.name} />
                        <InputSelectGroup type="select" id="customerType" name="customerType" label="Customer Type:"
                            value={searchParam.customerType}
                            onChange={handleChange}
                            options={renderConfigOptions(customerType)} />
                        <InputSelectGroup type="select" id="status" name="status" label="Status"
                            value={searchParam.status}
                            onChange={handleChange}
                            options={[{ name: 'All', value: '' }, { name: 'Active', value: 'A' }, { name: 'Suspend', value: 'S' }]} />
                    </div>
                    <div className="flex justify-center items-center overflow-y-auto py-2" >
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