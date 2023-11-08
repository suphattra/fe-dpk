import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import Breadcrumbs from "../../../components/Breadcrumbs";
import CardEmployee from "../../../components/employee/CardEmployee";
import Layout from "../../../layouts";
import { useRouter } from "next/router";
import moment from "moment";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { EmployeeService } from "../../api/employee.service";

LoadingOverlay.propTypes = undefined
export default function EmployeeDetail() {
    const breadcrumbs = [{ index: 1, href: '/employee', name: 'บันทึกการทำงาน' }, { index: 2, href: '/employee', name: 'สร้างบันทึก' }]
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const [addEmployeeForm, setAddEmployeeForm] = useState([{
        index: 1,
        startDate: moment(new Date).format('YYYY-MM-DD'),
        title: {},
        // mainBranch: "",
        // subBranch: "",
        // task: "",
        // inventory: "",
        // wageType: "",
        // operationStatus: ""
    }])
    const createValidationSchema = () => {
    }
    const validationSchema = createValidationSchema();
    // const formOptions = { resolver: yupResolver(validationSchema) };
    // const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm(formOptions);
    // function classNames(...classes) {
    //     return classes.filter(Boolean).join(' ')

    
    // }
    // const handleSave = async () => {

    // }

    const handleSave = async () => {
     
            await EmployeeService.createEmployee(dataList).then(res => {
                if (res.data.resultCode === 200) {
                    NotifyService.success('บันทึกข้อมูลเรียบร้อยเเล้ว')
                    // window.location.reload()
                    setOpen(false)
                    callbackLoad()
                } else {
                    NotifyService.error(res.data.message)
                }
            })
        
    }
    // const onChange = (e, index, name,) => {
    //     console.log('dddddddddddddd', e, index, name)
    //     let _newValue = [...addEmployeeForm]
    //     _newValue[index][name] = e.target.value
    //     setAddEmployeeForm(_newValue)
    // }

    const onChange = (e, index, name) => {
        console.log('dddddddddddddd', e, index, name);
    
        let _newValue = [...addEmployeeForm];
        
        // ตรวจสอบว่า _newValue[index] ไม่เป็น undefined
        if (_newValue[index]) {
            _newValue[index][name] = e.target.value;
            setAddEmployeeForm(_newValue);
        }
    }

    const deleteAddOnService = (rowIndex) => {
        console.log("rowIndex", rowIndex)
        const newData = addEmployeeForm.filter(item => item.index !== rowIndex);
        console.log("newData", newData)
        setAddEmployeeForm(newData)
    }
    const insertAddOnService = async () => {
        if (addEmployeeForm.length === 10) {
            NotifyService.error("สามารถเพิ่มสูงสุด 10 รายการ")
            return
        }
        let lastElement = addEmployeeForm.length > 0 ? addEmployeeForm[addEmployeeForm.length - 1] : { index: 0 };
        let newService = {
            // index: lastElement.index + 1,
            // startDate: moment(new Date).format('YYYY-MM-DD'),
            // employee: "",
            // mainBranch: "",
            // subBranch: "",
            // task: "",
            // inventory: "",
            // wageType: "",
            // operationStatus: ""
        }
        setAddEmployeeForm((timeSheet) => [...timeSheet, newService]);
        console.log(newService)
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

                <Breadcrumbs title="ข้อมูลพนักงาน" breadcrumbs={breadcrumbs} />
                <div className="md:container md:mx-auto" style={{ overflow: "auto" }}>
                    <form className="space-y-4" id='inputForm'>
                        {addEmployeeForm && addEmployeeForm.map((employee, index) => {
                            return (
                                <CardEmployee index={index} employee={employee} onChange={onChange} deleteAddOnService={deleteAddOnService} />
                            )
                        })}
                    </form>
                    <div className="flex flex-row-reverse pt-4">
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-6 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                            onClick={insertAddOnService}
                        >
                            <PlusCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                            เพิ่มบันทึก
                        </button>
                    </div>
                    <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
                        <div className="flex justify-center items-center overflow-y-auto p-4" >
                            <div className="flex justify-center items-center">
                                <button type="button"
                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                    onClick={() => { router.push('/employee'); }}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="button"
                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={handleSave}
                                >
                                    บันทึก
                                </button>
                            </div>
                        </div>

                    </footer>

                </div>

            </LoadingOverlay>
        </Layout >
    )
}