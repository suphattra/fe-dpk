import Layout from "../../layouts"
import LoadingOverlay from "react-loading-overlay"
import { useForm } from "react-hook-form";
import { CardBasic, InputGroup, InputGroupDate, InputRadioGroup, InputSelectGroup } from "../../components";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import { useRouter } from "next/router";
import { renderOptions } from "../../helpers/utils";
import CardTimesheet from "../../components/time-sheet/CardTimesheet";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import Breadcrumbs from "../../components/Breadcrumbs";
const initial = {
    jobDetail: {}
}
export default function DetailOperation() {
    const breadcrumbs = [{ index: 1, href: '/job', name: 'บันทึกการทำงาน' }, { index: 2, href: '/job', name: 'สร้างบันทึก' }]
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const [mode, setMode] = useState(router.query["mode"])
    const [jobDetail, setJobDetail] = useState(initial.jobDetail)
    const [timeSheetForm, setTimeSheetForm] = useState([{
        index: 1,
        startDate: "",
        employee: {},
        mainBranch: {},
        subBranch: {},
        task: {}
    }, {
        index: 2,
        startDate: "",
        employee: {},
        mainBranch: {},
        subBranch: {},
        task: {}
    }])
    const createValidationSchema = () => {
    }
    const validationSchema = createValidationSchema();
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm(formOptions);
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const submitOrderJobEntry = async (data) => {
    }
    const onChange = async (evt) => {
    }
    const insertAddOnService = async () => {
        if (timeSheetForm.length === 10) {
            // setErrAddOnService("สามารถเพิ่มสูงสุด 10 รายการ")
            return
        }
        let newService = {
            index: timeSheetForm.length + 1,
            startDate: "",
            employee: {},
            mainBranch: {},
            subBranch: {},
            task: {}
        }
        setTimeSheetForm((timeSheet) => [...timeSheet, newService]);
    }
    return (
        <Layout>
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
                <Breadcrumbs title="Job Detail" breadcrumbs={breadcrumbs} />
                <div className="md:container md:mx-auto">
                    <form className="space-y-4" onSubmit={handleSubmit(submitOrderJobEntry)} id='inputForm'>
                        {timeSheetForm && timeSheetForm.map((timeSheet, index) => {
                            return (
                                <CardTimesheet timeSheet={timeSheet} />
                            )
                        })}
                    </form>
                    <div className="flex flex-row-reverse pt-4">
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-indigo-800 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-80"
                            onClick={insertAddOnService} >
                            <PlusCircleIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                            เพิ่มบันทึก
                        </button>
                    </div>
                    <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
                        <div className="flex justify-center items-center overflow-y-auto p-4" >
                            <div className="flex justify-center items-center">
                                <button type="button"
                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                // onClick={handleReset}
                                >
                                    ยกเลิก
                                </button>
                                <button type="button"
                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                // onClick={handleSearch}
                                >
                                    บันทึก
                                </button>
                            </div>
                        </div>

                    </footer>

                </div>
            </LoadingOverlay >
        </Layout >
    )
}