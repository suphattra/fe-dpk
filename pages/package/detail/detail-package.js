import { ArrowLeftIcon, PencilSquareIcon, PrinterIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CardBasic, InputGroup, InputGroupDate, InputGroupMask, InputRadioGroup, InputSelectGroup } from "../../../components";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Layout from "../../../layouts";
import { CustomerService } from "../../api/customer.service";
import { MasterService } from "../../api/master.service";
import { PackageService } from "../../api/package.service";
import { renderOptions } from "../../../helpers/utils";
import { useForm } from "react-hook-form";
import AsyncSelect from 'react-select/async';
import AsynSelectCustom from "../../../components/AsynSelect";
import { NotifyService } from "../../api/notify.service";
import LoadingOverlay from "react-loading-overlay";
import ModalPrintTax from "../../../components/report/ModalPrintTax";
LoadingOverlay.propTypes = undefined
export default function CreatePackage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const _id = router.query["id"];
    const _effectiveDate = router.query["effectiveDate"];
    const mode_action = router.query["mode"];
    const [mode, setMode] = useState(mode_action)
    const [id, setId] = useState(_id)
    const [packages, setPackages] = useState({ packageType: 'TRIP', status: 'A', idcardNo: '', birthDate: '', firstName: '', acceptConditionFlag: '', acceptPrivacyFlag: '', password: '', provinceTh: '' })
    const [packageType, setPackageType] = useState([])
    const [senderList, setSenderList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [isOpenPrintTax, setIsOpenPrintTax] = useState(false)
    const breadcrumbs = [{ index: 1, href: '/package', name: 'package' }, { index: 2, href: '/package/detail/detail-package', name: 'detail' }]
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    useEffect(() => {
        getConfig('PACKAGE_TYPE')
        getSenderList()
        // getCustomerList();
        async function fetchData() {
            if (mode === "edit" || mode === "view") {
                await getPackageDetail();
            } else {

            }
        }
        fetchData();

    }, [mode]);
    const getConfig = async (configCategory) => {
        let paramquery = {
            configCategory: configCategory,
            configCode: '',
            status: ''
        }
        await MasterService.getConfig(paramquery).then(res => {
            if (res.data.resultCode === "20000") {
                if (configCategory === 'PACKAGE_TYPE') setPackageType(res.data.resultData.configs)
            } else {
                if (configCategory === 'PACKAGE_TYPE') setPackageType([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getPackageDetail = async () => {
        setLoading(true)
        let query = {
            effectiveDate: _effectiveDate
        }
        return await PackageService.getPackageDetail(id, query).then(res => {
            if (res.data.resultCode === "20000") {
                setPackages(res.data.resultData.package)

                //Set Value
                setValue('customerId', res.data.resultData.package ? res.data.resultData.package?.customerId : '', { shouldValidate: true, shouldDirty: true })
                setValue('effectiveDateFrom', res.data.resultData.package ? res.data.resultData.package?.effectiveDateFrom : '', { shouldValidate: true, shouldDirty: true })
                setValue('effectiveDateTo', res.data.resultData.package ? res.data.resultData.package?.effectiveDateTo : '', { shouldValidate: true, shouldDirty: true })
                setValue('distanceLimit', res.data.resultData.package ? res.data.resultData.package?.distanceLimit : '', { shouldValidate: true, shouldDirty: true })
                setValue('tripLimit', res.data.resultData.package ? res.data.resultData.package?.tripLimit : '', { shouldValidate: true, shouldDirty: true })
                // setValue('pointLimit', res.data.resultData.package ? res.data.resultData.package?.pointLimit : '', { shouldValidate: true, shouldDirty: true })
                setValue('packagePrice', res.data.resultData.package ? res.data.resultData.package?.packagePrice : '', { shouldValidate: true, shouldDirty: true })
            } else {
                setPackages({})
            }
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }
    const getSenderList = async (searchParam) => {
        setLoading(true)
        console.log(searchParam)
        let param = {
            senderName: searchParam
        }
        await MasterService.getSenderList(param).then(res => {
            if (res.data.resultCode === "20000") {
                setSenderList(res.data.resultData.senders)
            } else {
                setSenderList([])
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }
    const getCustomerList = async () => {
        setLoading(true)
        setCustomerList([])
        let param = {
            limit: 10000,
            offset: 1
        }
        await CustomerService.getCustomerList(param).then(res => {
            if (res.data.resultCode === "20000") {
                setCustomerList(res.data.resultData.customers)
                setTotal(res.data.resultData.total)
            } else {
                setCustomerList([])
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }
    const handleChange = async (evt) => {
        const { name, value, checked, type } = evt.target;
        setPackages(data => ({ ...data, [name]: value }));
        setValue(name, evt.target.value, {
            shouldValidate: true
        });
    }
    const onsave = async () => {
        setLoading(true)
        if (mode === 'edit') {
            packages.pointLimit = packages.pointLimit ? packages.pointLimit : 0
            await PackageService.updatePackage(id, packages).then(res => {
                if (res.data.resultCode === "20000") {
                    NotifyService.success('แก้ไขข้อมูลเรียบร้อยเเล้ว')
                    setMode("view")
                } else {
                    // setCustomer({})
                }
            }).finally(() => {
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })
        } else {
            await PackageService.createPackage(packages).then(res => {
                if (res.data.resultCode === "20000") {
                    setId(res.data.resultData)
                    NotifyService.success('บันทึกข้อมูลเรียบร้อยเเล้ว')
                    setMode("view")
                } else {
                    NotifyService.error(res.data.developerMessage)
                }
            }).finally(() => {
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })
        }
    }
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    // const loadOptions = (
    //     inputValue,
    //     callback: (options) => void
    // ) => {
    //     setTimeout(() => {
    //         callback(filterColors(inputValue));
    //     }, 1000);
    // };
    return (
        <Layout>
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
                <Breadcrumbs title="Package" breadcrumbs={breadcrumbs} />

                <div className="md:container md:mx-auto">
                    <div className="flex items-end justify-end sm:px-6 lg:px-2 sm:py-0 lg:pt-4">
                        <div className="flex items-end justify-end sm:px-6 lg:px-2 sm:py-0 lg:pt-4">
                            <button type="button"
                                onClick={() => { router.push('/package'); }}
                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />BACK
                            </button>
                            {(mode === 'view' || mode === 'edit') && <button type="button"
                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-green-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2  mr-2"
                                onClick={() => setIsOpenPrintTax(true)}
                            >
                                <PrinterIcon className="text-white-600 hover:text-white-900 h-4 w-4 mr-2" />  PRINT TAX INV
                            </button>}
                            {mode === 'view' && <button type="button"
                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={() => setMode('edit')}
                            >
                                <PencilSquareIcon className="text-white-600 hover:text-white-900 h-4 w-4 mr-2" />  EDIT
                            </button>}
                            {mode === 'edit' && <button type="button"
                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                onClick={() => setMode('view')}>
                                <XCircleIcon className="text-white-600 hover:text-white-900 h-4 w-4 mr-2" />CANCEL
                            </button>}
                        </div>
                    </div>
                    <CardBasic title={`${mode === 'create' ? 'New Package' : 'Edit Package'}`}>
                        <form onSubmit={handleSubmit(onsave)} id="inputForm">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputGroup type="text" id="packageCode" name="packageCode" label="Package Code:"
                                    value={packages.packageCode}
                                    onChange={handleChange}
                                    // refs={{ ...register("packageCode", { required: "This field is required." }) }}
                                    // invalid={errors.packageCode}
                                    disabled={true} />
                                {/* <AsynSelectCustom
                                id="customerId" name="customerId" label="Customer Name:"
                                options={renderOptions(senderList, 'senderName', 'senderName')} />
                            <div>
                                <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                                    {"Customer Name:"} {<span className="text-red-800">*</span>}
                                </label>
                                <div className="mt-1">
                                    <AsyncSelect cacheOptions loadOptions={getSenderList} defaultOptions
                                        refs={{ ...register("customerId", { required: "This field is required." }) }}
                                        disabled={mode === 'view'}
                                        onChange={handleChange}
                                        options={renderOptions(senderList, 'senderName', 'senderName')}
                                        className={classNames(errors.customerId ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500', "", "block w-full rounded-md shadow-sm sm:text-sm disabled:text-gray-800 disabled:bg-gray-50")}
                                    />
                                </div>
                            </div> */}

                                <InputSelectGroup type="text" id="customerId" name="customerId" label="Customer Name:"
                                    value={packages.customerId}
                                    options={renderOptions(senderList, 'senderName', 'customerId')}
                                    disabled={mode === 'view'}
                                    onChange={handleChange}
                                    refs={{ ...register("customerId", { required: "This field is required." }) }}
                                    invalid={errors.customerId}
                                    isSearchable
                                    required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4 mb-4 mt-4">
                                <label htmlFor="shipmentDate" className="block text-sm font-medium text-gray-700">
                                    Type: <span className="text-red-800">*</span>
                                </label>
                                {packageType.map(function (item) {
                                    return (
                                        <InputRadioGroup classes="h-4 w-4" key={item.configCode}
                                            checked={packages.packageType === item.configCode ? true : false}
                                            type={"radio"} id={item.configCode}
                                            name="packageType"
                                            value={item.configCode}
                                            label={item.configValue}
                                            onChange={handleChange}
                                            disabled={mode === 'view'} />
                                    )
                                })}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputGroupDate type="date" id="effectiveDateFrom" name="effectiveDateFrom" label="Effective Date From:"
                                    format="YYYY-MM-DD"
                                    value={packages.effectiveDateFrom}
                                    disabled={mode === 'view'}
                                    onChange={handleChange}
                                    refs={{ ...register("effectiveDateFrom", { required: "This field is required." }) }}
                                    invalid={errors.effectiveDateFrom}
                                    required />
                                <InputGroupDate type="date" id="effectiveDateTo" name="effectiveDateTo" label="Effective Date To:"
                                    format="YYYY-MM-DD"
                                    value={packages.effectiveDateTo}
                                    disabled={mode === 'view'}
                                    onChange={handleChange}
                                    refs={{ ...register("effectiveDateTo", { required: "This field is required." }) }}
                                    invalid={errors.effectiveDateTo}
                                    required />
                                <InputGroupMask
                                    type="text" id="distanceLimit" name="distanceLimit" label="Distance Limit Per Job(Km):"
                                    value={packages.distanceLimit}
                                    disabled={mode === 'view'}
                                    onChange={handleChange}
                                    refs={{ ...register("distanceLimit", { required: "This field is required." }) }}
                                    invalid={errors.distanceLimit}
                                    required
                                    mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputGroupMask type="text" id="tripLimit" name="tripLimit" label="Trip Limit Per Day:"
                                    value={packages.tripLimit}
                                    disabled={mode === 'view'}
                                    onChange={handleChange}
                                    refs={{ ...register("tripLimit", { required: "This field is required." }) }}
                                    invalid={errors.tripLimit}
                                    mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                    required />
                                <InputGroupMask type="text" id="pointLimit" name="pointLimit" label="Point:"
                                    value={packages.pointLimit}
                                    disabled={mode === 'view'}
                                    onChange={handleChange}
                                    mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                    // refs={{ ...register("pointLimit", { required: "This field is required." }) }}
                                    invalid={errors.pointLimit}
                                />
                                <InputGroupMask type="text" id="packagePrice" name="packagePrice" label="Fee:"
                                    value={packages.packagePrice}
                                    disabled={mode === 'view'}
                                    mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                    onChange={handleChange}
                                    refs={{ ...register("packagePrice", { required: "This field is required." }) }}
                                    invalid={errors.packagePrice}
                                    required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                <div className="block w-full">
                                    <label htmlFor="taxAddress" className="block text-sm font-medium text-gray-700">
                                        Remark:
                                    </label>
                                    <textarea rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                                        placeholder=""
                                        defaultValue={''}
                                        id="remark"
                                        name="remark"
                                        onChange={handleChange}
                                        value={packages.remark}
                                        disabled={mode === 'view'}
                                    />
                                </div>
                            </div>


                        </form>
                    </CardBasic>
                    {isOpenPrintTax && <ModalPrintTax
                        open={isOpenPrintTax}
                        setOpen={setIsOpenPrintTax}
                        packages={packages}
                        page={"PACKAGE"} />
                    }
                    <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
                        {/* <button type="button"
                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-4"
                                onClick={() => console.log()}
                            >
                                DELETE
                            </button> */}
                        <button
                            form="inputForm"
                            type="submit"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            disabled={mode === 'view'}
                        >
                            SAVE
                        </button>
                    </footer>
                </div>
            </LoadingOverlay>


        </Layout >
    )
}