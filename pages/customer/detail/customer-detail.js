import { ArchiveBoxXMarkIcon, ArrowLeftIcon, PencilSquareIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoadingOverlay from "react-loading-overlay";
import { CardBasic, InputGroup, InputGroupMask, InputRadioGroup, InputSelectGroup } from "../../../components";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { renderConfigOptions, renderOptions } from "../../../helpers/utils";
import Layout from "../../../layouts";
import { CustomerService } from "../../api/customer.service";
import { MasterService } from "../../api/master.service";
import { NotifyService } from "../../api/notify.service";
const breadcrumbs = [{ index: 1, href: '/customer', name: 'customer' }, { index: 2, href: '/customer/detail/customer-detail', name: 'detail' }]
LoadingOverlay.propTypes = undefined
export default function CustomerDetail() {
    const router = useRouter();
    const id = router.query["id"];
    const mode_action = router.query["mode"];
    const [mode, setMode] = useState(mode_action)
    const [loading, setLoading] = useState(false)
    const [customer, setCustomer] = useState({ customerType: 'CASH', firstName: '', acceptConditionFlag: '', acceptPrivacyFlag: '', password: '', priceRate: 'NORMAL' })
    const [title, setTitle] = useState([])
    const [customerType, setCustomerType] = useState([])
    const [priceRate, setPriceRate] = useState([])

    const [provinceList, setProvinceList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [subDistrictList, setSubDistrictList] = useState([])
    const [zipcodeList, setZipcodeList] = useState([])
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    useEffect(() => {
        console.log('i fire once');
        getConfig('TITLE')
        getConfig('CUSTOMER_TYPE')
        getConfig('PRICE_RATE')
        async function fetchData() {
            await getProvince('')
            if (mode === "edit" || mode === "view") {
                getCustomerDetail();
            }
        }
        fetchData();
        setValue('priceRate', 'NORMAL')
    }, []);
    const getConfig = async (configCategory) => {
        let paramquery = {
            configCategory: configCategory,
            configCode: '',
            status: ''
        }
        await MasterService.getConfig(paramquery).then(res => {
            if (res.data.resultCode === "20000") {
                if (configCategory === 'CUSTOMER_TYPE') setCustomerType(res.data.resultData.configs)
                if (configCategory === 'TITLE') setTitle(res.data.resultData.configs)
                if (configCategory === 'PRICE_RATE') setPriceRate(res.data.resultData.configs)
            } else {
                if (configCategory === 'TITLE') setTitle([])
                if (configCategory === 'CUSTOMER_TYPE') setCustomerType([])
                if (configCategory === 'PRICE_RATE') setPriceRate([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getProvince = async (provinceTh) => {
        const param = {
            provinceTh: provinceTh
        }
        await MasterService.getProvince(param).then(res => {
            if (res.data.resultCode === "20000") {
                setProvinceList(res.data.resultData.provinces)
            } else {
                setProvinceList([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getDistrict = async (provinceTh, provinceCode) => {
        const param = {
            provinceTh: provinceTh,
            provinceCode: provinceCode
        }
        await MasterService.getDistrict(param).then(res => {
            if (res.data.resultCode === "20000") {
                setDistrictList(res.data.resultData.districts)
                // setDistrictList(renderOptions(res.data.resultData.districts, 'districtTh', 'districtTh'))
            } else {
                setDistrictList([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getSubDistrict = async (subDistrictTh, districtTh, provinceCode) => {
        const param = {
            provinceCode: provinceCode,
            districtTh: districtTh,
            subDistrictTh: subDistrictTh
        }
        await MasterService.getSubDistrict(param).then(res => {
            if (res.data.resultCode === "20000") {
                setSubDistrictList(res.data.resultData.subDistricts)
            } else {
                setSubDistrictList([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getZipcode = async (subDistrictTh, districtTh, provinceCode) => {
        const param = {
            provinceCode: provinceCode,
            districtTh: districtTh,
            subDistrictTh: subDistrictTh
        }
        await MasterService.getZipcode(param).then(res => {
            if (res.data.resultCode === "20000") {
                setZipcodeList(res.data.resultData.zipcodes)
            } else {
                setZipcodeList([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const onChangeProvince = async (e) => {
        const param = {
            provinceCode: e.target.value,
            districtTh: ''
        }
        await MasterService.getDistrict(param).then(res => {
            if (res.data.resultCode === "20000") {
                console.log(res.data.resultData.districts)
                setDistrictList(res.data.resultData.districts)
            } else {
                setDistrictList([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const onChangeDistrict = async (e, provinceCode) => {
        const param = {
            provinceCode: provinceCode,
            districtTh: e.target.value,
            subDistrictTh: ''
        }
        await MasterService.getSubDistrict(param).then(res => {
            if (res.data.resultCode === "20000") {
                setSubDistrictList(res.data.resultData.subDistricts)
            } else {
                setSubDistrictList([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const onChangeSubDistrict = async (e, districtTh, provinceCode) => {
        const param = {
            provinceCode: provinceCode,
            districtTh: districtTh,
            subDistrictTh: e.target.value
        }
        await MasterService.getZipcode(param).then(res => {
            if (res.data.resultCode === "20000") {
                setZipcodeList(res.data.resultData.zipcodes)
            } else {
                setZipcodeList([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getCustomerDetail = async () => {
        setLoading(true)
        await CustomerService.getCustomerDetail(id).then(res => {
            if (res.data.resultCode === "20000") {
                setCustomer(res.data.resultData.customer)
                getDistrict(res.data.resultData.customer.districtTh, res.data.resultData.customer.provinceCode)
                getSubDistrict(res.data.resultData.customer.subDistrictTh, res.data.resultData.customer.districtTh, res.data.resultData.customer.provinceCode)
                getZipcode(res.data.resultData.customer.subDistrictTh, res.data.resultData.customer.districtTh, res.data.resultData.customer.provinceCode)
                //Set Value
                setValue('priceRate', res.data.resultData.customer ? res.data.resultData.customer?.priceRate : '', { shouldValidate: true, shouldDirty: true })
                setValue('title', res.data.resultData.customer ? res.data.resultData.customer?.title : '', { shouldValidate: true, shouldDirty: true })
                setValue('firstname', res.data.resultData.customer ? res.data.resultData.customer?.firstname : '', { shouldValidate: true, shouldDirty: true })
                setValue('lastname', res.data.resultData.customer ? res.data.resultData.customer?.lastname : '', { shouldValidate: true, shouldDirty: true })
                setValue('phoneNo', res.data.resultData.customer ? res.data.resultData.customer?.phoneNo : '', { shouldValidate: true, shouldDirty: true })
                setValue('email', res.data.resultData.customer ? res.data.resultData.customer?.email : '', { shouldValidate: true, shouldDirty: true })
                setValue('recordStatus', res.data.resultData.customer ? res.data.resultData.customer?.recordStatus : '', { shouldValidate: true, shouldDirty: true })
            } else {
                setCustomer({})
            }
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    const saveCustomer = async () => {
        setLoading(true)
        if (mode === 'edit') {
            await CustomerService.updateCustomer(id, customer).then(res => {
                if (res.data.resultCode === "20000") {
                    NotifyService.success('แก้ไขข้อมูลเรียบร้อยเเล้ว')
                    setMode("view")
                } else {
                    NotifyService.error(res.data.developerMessage)
                }
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })

        } else {
            // customer.password = ''
            customer.acceptConditionFlag = 1
            customer.acceptPrivacyFlag = 1
            await CustomerService.createCustomer(customer).then(res => {
                if (res.data.resultCode === "20000") {
                    NotifyService.success('บันทึกข้อมูลเรียบร้อยเเล้ว')
                } else {
                    NotifyService.error(res.data.developerMessage)
                }
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })
        }

    }
    const handleChange = async (evt) => {
        const { name, value, checked, type } = evt.target;
        setCustomer(data => ({ ...data, [name]: value }));
        setValue(name, evt.target.value, {
            shouldValidate: true
        });
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
                <Breadcrumbs title="Customer" breadcrumbs={breadcrumbs} />

                <div className="md:container md:mx-auto">
                    <div className="flex items-end justify-end sm:px-6 lg:px-2 sm:py-0 lg:pt-4">
                        <button type="button"
                            onClick={() => { router.push('/customer'); }}
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />BACK
                        </button>
                        {mode === 'view' && <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={() => setMode('edit')}>
                            <PencilSquareIcon className="text-white-600 hover:text-white-900 h-4 w-4 mr-2" /> EDIT
                        </button>}
                        {mode === 'edit' && <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            onClick={() => setMode('view')}>
                            <XCircleIcon className="text-white-600 hover:text-white-900 h-4 w-4 mr-2" />CANCEL
                        </button>}
                    </div>
                    <CardBasic title={`${mode === 'create' ? 'New Customer' : 'Edit Customer'}`}>
                        <form onSubmit={handleSubmit(saveCustomer)} id="inputForm">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4 mb-4 mt-4">
                                <label htmlFor="shipmentDate" className="block text-sm font-medium text-gray-700">
                                    Customer Type: <span className="text-red-800">*</span> : <></>
                                </label>
                                {customerType.map(function (item) {
                                    return (
                                        <InputRadioGroup classes="h-4 w-4" key={item.configCode}
                                            checked={customer.customerType === item.configCode ? true : false}
                                            type={"radio"} id={item.configCode}
                                            name="customerType" value={item.configCode} label={item.configValue}
                                            onChange={handleChange}
                                            disabled={mode === 'view'} />
                                    )
                                })}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputSelectGroup type="select" id="priceRate" name="priceRate" label="Rate"
                                    value={customer.priceRate}
                                    options={renderConfigOptions(priceRate)}
                                    disabled={mode === 'view'}
                                    onChange={handleChange}
                                    refs={{ ...register("priceRate", { required: "This field is required." }) }}
                                    invalid={errors.priceRate}
                                    required />
                                <InputSelectGroup type="select" id="title" name="title" label="Name Tiltle"
                                    value={customer.title}
                                    onChange={handleChange}
                                    refs={{ ...register("title", { required: "This field is required." }) }}
                                    invalid={errors.title}
                                    disabled={mode === 'view'}
                                    options={renderConfigOptions(title)}
                                    required />
                                <InputGroup type="text" id="firstname" name="firstname" label="Firstname/Company:"
                                    onChange={handleChange}
                                    refs={{ ...register("firstname", { required: "This field is required." }) }}
                                    invalid={errors.firstname}
                                    value={customer.firstname}
                                    disabled={mode === 'view'}
                                    required />
                                <InputGroup type="text" id="lastname" name="lastname" label="Last Name:"
                                    onChange={handleChange}
                                    // refs={{ ...register("lastname", { required: "This field is required." }) }}
                                    invalid={errors.lastname}
                                    value={customer.lastname}
                                    disabled={mode === 'view'}
                                />
                            </div>
                            {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">


                            </div> */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputGroupMask
                                    type="text" id="phoneNo" name="phoneNo" label="Phone Number:" classes=""
                                    onChange={handleChange}
                                    refs={{ ...register("phoneNo", { required: "This field is required." }) }}
                                    invalid={errors.phoneNo}
                                    value={customer.phoneNo}
                                    disabled={mode === 'view'}
                                    required
                                    mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]} />
                                <InputGroup type="text" id="email" name="email" label="Email:" classes=""
                                    onChange={handleChange}
                                    refs={{ ...register("email", { required: "This field is required." }) }}
                                    invalid={errors.email}
                                    value={customer.email}
                                    disabled={mode === 'view'}
                                    required />
                                <InputSelectGroup type="select" id="recordStatus" name="recordStatus" label="Status"
                                    value={customer.recordStatus}
                                    disabled={mode === 'view'}
                                    onChange={handleChange}
                                    refs={{ ...register("recordStatus", { required: "This field is required." }) }}
                                    invalid={errors.recordStatus}
                                    options={[{ name: 'Please Select', value: '' }, { name: 'Active', value: 'A' }, { name: 'Inactive', value: 'S' }]}
                                    required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputGroup type="text" id="address" name="address" label="Address:" classes=""
                                    value={customer.address}
                                    onChange={handleChange}
                                    disabled={mode === 'view'} />

                                <InputSelectGroup type="select" id="provinceTh" name="provinceTh" label="Province"
                                    options={renderOptions(provinceList, 'provinceTh', 'provinceCode')}
                                    value={customer.provinceCode}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setCustomer(data => ({ ...data, provinceCode: e.target.value }));
                                        onChangeProvince(e);
                                    }}
                                    isSearchable
                                    disabled={mode === 'view'}
                                />
                                <InputSelectGroup type="select" id="districtTh" name="districtTh" label="District"
                                    options={renderOptions(districtList, 'districtTh', 'districtTh')}
                                    value={customer.districtTh}
                                    onChange={(e) => {
                                        handleChange(e);
                                        onChangeDistrict(e, customer.provinceCode);

                                    }}
                                    isSearchable
                                    disabled={mode === 'view'} />
                                <InputSelectGroup type="select" id="subDistrictTh" name="subDistrictTh" label="Sub District"
                                    options={renderOptions(subDistrictList, 'subDistrictTh', 'subDistrictTh')}
                                    value={customer.subDistrictTh}
                                    onChange={(e) => {
                                        handleChange(e);
                                        onChangeSubDistrict(e, customer.districtTh, customer.provinceCode);
                                    }}
                                    isSearchable
                                    disabled={mode === 'view'}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputSelectGroup type="select" id="zipcodeId" name="zipcodeId" label="Zipcode"
                                    options={renderOptions(zipcodeList, 'zipcode', 'zipcodeId')}
                                    value={customer.zipcodeId}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    disabled={mode === 'view'}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputGroup type="text" id="taxId" name="taxId" label="Tax ID:" classes=""
                                    value={customer.taxId}
                                    onChange={handleChange}
                                    disabled={mode === 'view'} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-4">
                                {/* <InputGroup type="textarea" id="taxAddress" name="taxAddress" label="Tax Address:" classes=""
                                onChange={handleChange}
                                value={customer.taxAddress}
                                disabled={mode === 'view'} /> */}
                                <div className="block w-full">
                                    <label htmlFor={"taxAddress"} className="block text-sm font-medium text-gray-700">
                                        {"Tax Address:"}
                                    </label>
                                    <textarea
                                        id="taxAddress" name="taxAddress"
                                        rows={3}
                                        className="mt-1 block w-9/12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                                        value={customer.taxAddress}
                                        onChange={(e) => {
                                            handleChange(e);
                                        }}
                                        disabled={mode === 'view'}
                                    />
                                </div>
                            </div>

                            {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                            <InputGroup type="text" id="driverType" name="driverType" label="Tax Number:" classes="" />
                            <InputGroup type="text" id="driverType" name="driverType" label="Tax ID:" classes="" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                            <div className="block w-full">
                                <label htmlFor="taxAddress" className="block text-sm font-medium text-gray-700">
                                    Tax Address:
                                </label>
                                <textarea id="about" name="about" rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder=""
                                    defaultValue={''}
                                />
                            </div>
                        </div> */}
                        </form>
                    </CardBasic>
                    <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
                        {/* <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-4"
                            onClick={() => handleDelete()}
                        >
                            <ArchiveBoxXMarkIcon className="h-4 w-4 mr-2" />DELETE
                        </button> */}
                        <button
                            form="inputForm"
                            type="submit"
                            disabled={mode === 'view'}
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        // onClick={() => saveCustomer()}
                        >
                            SAVE
                        </button>
                    </footer>
                </div>
            </LoadingOverlay>
        </Layout >
    )
}