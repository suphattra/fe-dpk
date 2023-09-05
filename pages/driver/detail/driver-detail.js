import { ArrowLeftIcon, PencilIcon, PencilSquareIcon, PlusCircleIcon, TrashIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { CardBasic, InputGroup, InputGroupDate, InputGroupMask, InputRadioGroup, InputSelectGroup } from "../../../components";
import Breadcrumbs from "../../../components/Breadcrumbs";
import ListFile from "../../../components/ListFile";
import { renderConfigOptions, renderOptions } from "../../../helpers/utils";
import Layout from "../../../layouts";
import { DriverService } from "../../api/driver.service";
import { MasterService } from "../../api/master.service";

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { NotifyService } from "../../api/notify.service";
import { CustomerService } from "../../api/customer.service";
const breadcrumbs = [{ index: 1, href: '/driver', name: 'driver' }, { index: 2, href: '/driver/detail/detail-driver', name: 'detail' }]
LoadingOverlay.propTypes = undefined
export default function DriverDetail() {
    const router = useRouter();
    const id = router.query["id"];
    const mode_action = router.query["mode"];
    const [mode, setMode] = useState(mode_action)
    const [loading, setLoading] = useState(false)
    const [_id, setId] = useState(id)
    const [driver, setDriver] = useState({ driverType: '', status: 'A', idcardNo: '', birthDate: '', firstName: '', acceptConditionFlag: '', acceptPrivacyFlag: '', password: '', provinceTh: '' })
    const [driverType, setDriverType] = useState([])
    const [provinceList, setProvinceList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [subDistrictList, setSubDistrictList] = useState([])
    const [zipcodeList, setZipcodeList] = useState([])
    const [jobType, setJobType] = useState([])
    const [title, setTitle] = useState([])
    const [contactRelationship, setContactRelationship] = useState([])
    const [selectjobType, setSelectJobType] = useState([])
    const [jobTypeDefault, setJobTypeDefault] = useState([])
    const [listFile, setListFile] = useState([])
    const [listFileDefault, setListFileDefault] = useState([])
    const [listAttorney, setListAttorney] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [showAttorney, setShowAttorney] = useState(false)

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    useEffect(() => {
        getConfig('DRIVER_TYPE')
        getConfig('JOB_TYPE')
        getConfig('TITLE')
        getConfig('CONTACT_RELATIONSHIP')
        getCustomerList()

        async function fetchData() {
            await getProvince('')
            if (mode === "edit" || mode === "view") {
                await getDriverDetail();
                await getAttachDriver()
                await getAttorney()

            } else {

            }
        }
        fetchData();

    }, [mode]);
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
    const getCustomerList = async (customerType) => {
        let param = {
            status: 'A',
            limit: 10000,
            offset: 1
        }
        if (customerType !== "") {
            param.customerType = customerType
        }
        await CustomerService.getCustomerList(param)
            .then(res => {
                setCustomerList(res.data.resultData.customers)
            })
    }
    const getConfig = async (configCategory) => {
        let paramquery = {
            configCategory: configCategory,
            configCode: '',
            status: ''
        }
        await MasterService.getConfig(paramquery).then(res => {
            if (res.data.resultCode === "20000") {
                if (configCategory === 'DRIVER_TYPE') setDriverType(res.data.resultData.configs)
                if (configCategory === 'TITLE') setTitle(res.data.resultData.configs)
                if (configCategory === 'CONTACT_RELATIONSHIP') setContactRelationship(res.data.resultData.configs)
                if (configCategory === 'JOB_TYPE') {
                    let tmpJobType = []
                    res.data.resultData.configs.forEach(ele => {
                        tmpJobType.push({ driverId: _id, jobTypeCode: ele.configCode, recordStatus: 'A' })
                    })
                    if (mode === 'add') setSelectJobType(tmpJobType)
                    setJobType(res.data.resultData.configs)
                }
            } else {
                if (configCategory === 'DRIVER_TYPE') setDriverType([])
                if (configCategory === 'JOB_TYPE') setJobType([])
                if (configCategory === 'TITLE') setTitle([])
                if (configCategory === 'CONTACT_RELATIONSHIP') setContactRelationship([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getDriverDetail = async () => {
        setLoading(true)
        return await DriverService.getDriverDetail(id).then(res => {
            if (res.data.resultCode === "20000") {
                setDriver(res.data.resultData.driver)
                getDistrict(res.data.resultData.driver.districtTh, res.data.resultData.driver.provinceCode)
                getSubDistrict(res.data.resultData.driver.subDistrictTh, res.data.resultData.driver.districtTh, res.data.resultData.driver.provinceCode)
                getZipcode(res.data.resultData.driver.subDistrictTh, res.data.resultData.driver.districtTh, res.data.resultData.driver.provinceCode)
                setSelectJobType(res.data.resultData.driver.jobType)
                let jobtype = res.data.resultData.driver.jobType
                if (jobtype && jobtype.length > 0) {
                    const found = jobtype.find(e => e.jobTypeCode === "ATTORNEY")
                    if (found && found.jobTypeCode === "ATTORNEY") {
                        setShowAttorney(true)
                    }
                }
                setJobTypeDefault(res.data.resultData.driver.jobType)

                //Set Value
                setValue('driverType', res.data.resultData.driver ? res.data.resultData.driver?.driverType : '', { shouldValidate: true, shouldDirty: true })
                setValue('idCardNo', res.data.resultData.driver ? res.data.resultData.driver?.idCardNo : '', { shouldValidate: true, shouldDirty: true })
                setValue('birthDate', res.data.resultData.driver ? res.data.resultData.driver?.birthDate : '', { shouldValidate: true, shouldDirty: true })
                setValue('title', res.data.resultData.driver ? res.data.resultData.driver?.title : '', { shouldValidate: true, shouldDirty: true })
                setValue('firstname', res.data.resultData.driver ? res.data.resultData.driver?.firstname : '', { shouldValidate: true, shouldDirty: true })
                setValue('lastname', res.data.resultData.driver ? res.data.resultData.driver?.lastname : '', { shouldValidate: true, shouldDirty: true })
                setValue('address', res.data.resultData.driver ? res.data.resultData.driver?.address : '', { shouldValidate: true, shouldDirty: true })
                setValue('provinceTh', res.data.resultData.driver ? res.data.resultData.driver?.provinceTh : '', { shouldValidate: true, shouldDirty: true })
                setValue('districtTh', res.data.resultData.driver ? res.data.resultData.driver?.districtTh : '', { shouldValidate: true, shouldDirty: true })
                setValue('subDistrictTh', res.data.resultData.driver ? res.data.resultData.driver?.subDistrictTh : '', { shouldValidate: true, shouldDirty: true })
                setValue('zipcodeId', res.data.resultData.driver ? res.data.resultData.driver?.zipcodeId : '', { shouldValidate: true, shouldDirty: true })
                setValue('phoneNo', res.data.resultData.driver ? res.data.resultData.driver?.phoneNo : '', { shouldValidate: true, shouldDirty: true })
                setValue('altPhoneNo', res.data.resultData.driver ? res.data.resultData.driver?.altPhoneNo : '', { shouldValidate: true, shouldDirty: true })
                setValue('password', res.data.resultData.driver ? res.data.resultData.driver?.password : '', { shouldValidate: true, shouldDirty: true })
            } else {
                setDriver({})
            }
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }
    const getAttachDriver = async () => {
        return await DriverService.getAttachDriver(id).then(res => {
            if (res.data.resultCode === "20000") {
                res.data.resultData.attachs.forEach((ele, index) => {
                    ele.index = index
                })
                setListFile(res.data.resultData.attachs)
                setListFileDefault(res.data.resultData.attachs)
            } else {
                setListFile([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getAttorney = async () => {
        let param = {
            driverId: id
        }
        return await DriverService.getAttorney(param).then(res => {
            if (res.data.resultCode === "20000") {
                setListAttorney(res.data.resultData.driverAttorney)
            } else {
                setListAttorney([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const handleChange = async (evt) => {

        const { name, value, checked, type } = evt.target;
        setDriver(data => ({ ...data, [name]: value }));
        setValue(name, evt.target.value, {
            shouldValidate: true
        });
    }

    function handleChangeJobType(checked, value, name, other) {
        if (checked) {
            const found = selectjobType.find(e => e.jobTypeCode === value)
            if (value === "ATTORNEY") {
                setShowAttorney(true)
            }
            if (!found) {
                let temp = {
                    driverId: _id, jobTypeCode: value, recordStatus: 'A', action: 'add'
                }
                setSelectJobType(data => [...data, temp]);
            }
            else if (found) {
                const index = selectjobType.findIndex(e => e.jobTypeCode === value)
                let objectivesCopy = [...selectjobType];
                objectivesCopy[index] = { driverId: _id, jobTypeCode: value, recordStatus: 'A', action: 'add' }
                setSelectJobType(objectivesCopy);
            }
        } else {

            var foundDel = jobTypeDefault.find((e, i) => e.jobTypeCode === value)
            if (value === "ATTORNEY") {
                setShowAttorney(false)
            }
            if (foundDel) {
                let obj = {
                    driverId: _id, jobTypeCode: value, recordStatus: 'A', action: 'delete', jobTypeId: foundDel.jobTypeId
                }
                let temp = selectjobType.filter((e, i) => e.jobTypeCode !== value)
                let arr = [...temp, obj]
                setSelectJobType(arr);
            } else {
                setSelectJobType(selectjobType.filter((e, i) => e.jobTypeCode !== value))
            }
        }
    }

    const onsave = async () => {
        setLoading(true)
        console.log(selectjobType)
        console.log(listFileDefault)
        // driver.userId = driver.driverId
        if (mode === 'edit') {
            await DriverService.updateDriver(id, driver).then(res => {
                if (res.data.resultCode === "20000") {
                    if (selectjobType.length > 0) {
                        selectjobType.forEach(ele => {
                            ele.driverId = id
                            if (ele.action && ele.action === 'add') {
                                DriverService.createJobType(ele).then(res => {

                                }).catch(err => {
                                    console.log(err)
                                })
                            } else if (ele.action && ele.action === 'delete') {
                                DriverService.deleteJobType(ele.jobTypeId).then(res => {

                                }).catch(err => {
                                    console.log(err)
                                })
                            }
                        })
                    }
                    console.log("listFile", listFile)
                    if (listFile.length > 0) {
                        listFile.forEach(ele => {
                            ele.driverId = id
                            if (ele.action && ele.action === 'add') {
                                const files = ele.file;
                                let formData = new FormData();
                                formData.append('driverId', id);
                                formData.append('fileName', ele.fileName);
                                formData.append('file', files);
                                formData.append('recordStatus', 'A');
                                DriverService.attachfile(formData).then(res => {
                                    if (res.data.resultCode === "20000") {

                                    } else {
                                    }
                                }).finally(() => {
                                }).catch(err => {
                                    console.log(err)
                                })
                            } else if (ele.action && ele.action === 'delete') {
                                DriverService.deleteAttachfile(ele.attachId).then(res => {

                                }).catch(err => {
                                    console.log(err)
                                })
                            }
                        })
                    }
                    if (listAttorney.length > 0) {
                        listAttorney.forEach(ele => {
                            if (ele.action && ele.action === 'add') {
                                let body = {
                                    driverId: id,
                                    customerId: ele.customerId
                                }
                                DriverService.addAttorney(body).then(res => {
                                    if (res.data.resultCode === "20000") {

                                    } else {
                                    }
                                }).finally(() => {
                                }).catch(err => {
                                    console.log(err)
                                })
                            } else if (ele.action && ele.action === 'delete') {
                                let body = {
                                    driverId: id,
                                    customerId: ele.customerId
                                }
                                DriverService.deleteAttorney(body).then(res => {

                                }).catch(err => {
                                    console.log(err)
                                })
                            }
                        })
                    }
                    NotifyService.success('แก้ไขข้อมูลเรียบร้อยเเล้ว')
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
        } else {
            driver.recordStatus = 'A'
            console.log(driver)
            await DriverService.createDriver(driver).then(res => {
                if (res.data.resultCode === "20000") {
                    if (selectjobType.length > 0) {
                        selectjobType.forEach(ele => {
                            ele.driverId = res.data.resultData
                            if (ele.action && ele.action === 'add') {
                                DriverService.createJobType(ele).then(res => {
                                    console.log(res)
                                })
                            }

                        })
                    }
                    if (listFile.length > 0) {
                        listFile.forEach(ele => {
                            ele.driverId = res.data.resultData
                            if (ele.action && ele.action === 'add') {
                                const files = ele.file;
                                let formData = new FormData();
                                formData.append('driverId', ele.driverId);
                                formData.append('fileName', ele.fileName);
                                formData.append('file', files);
                                formData.append('recordStatus', 'A');
                                DriverService.attachfile(formData).then(res => {
                                    if (res.data.resultCode === "20000") {

                                    } else {
                                    }
                                }).finally(() => {
                                }).catch(err => {
                                    console.log(err)
                                })
                            } else if (ele.action && ele.action === 'delete') {
                                DriverService.deleteAttachfile(ele.attachId).then(res => {

                                }).catch(err => {
                                    console.log(err)
                                })
                            }
                        })
                    }
                    if (listAttorney.length > 0) {
                        listAttorney.forEach(ele => {
                            let driverId = res.data.resultData
                            if (ele.action && ele.action === 'add') {
                                let body = {
                                    driverId: driverId,
                                    customerId: ele.customerId
                                }
                                DriverService.addAttorney(body).then(res => {
                                    if (res.data.resultCode === "20000") {

                                    } else {
                                    }
                                }).finally(() => {
                                }).catch(err => {
                                    console.log(err)
                                })
                            }
                        })
                    }
                    NotifyService.success('บันทึกข้อมูลเรียบร้อยเเล้ว')
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
    const ondelete = async () => {
        await DriverService.deleteDriver(id, driver).then(res => {
            if (res.data.resultCode === "20000") {

            } else {
            }
            setLoading(false)
        }).finally(() => {
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }
    const handleFileChange = async (e) => {
        e.preventDefault();
        const files = e.target.files
        let param = {
            index: listFile.length + 1,
            file: files[0],
            fileName: files[0].name,
            fileSizeKb: files[0].size,
            recordStatus: 'A',
            filePath: files[0].name,
            action: 'add'
        };
        setListFile([...listFile, param])
    }
    const onDeleteFile = async (e) => {
        console.log(e)
        var foundDel = listFileDefault.find((item, i) => item.attachId === e.attachId)
        console.log(foundDel)
        if (foundDel) {
            let obj = {
                attachId: foundDel.attachId, fileName: foundDel.fileName, fileSizeKb: foundDel.fileName, recordStatus: 'A', action: 'delete', filePath: foundDel.filePath
            }
            let temp = listFileDefault.filter((item, i) => item.attachId !== e.attachId)
            let arr = [...temp, obj]
            setListFileDefault(arr);
            setListFile(arr)

        } else {
            setListFile(listFile.filter((item, i) => item.index !== e.index))
        }
    }
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const addAttorney = async () => {
        setListAttorney([...listAttorney, { customerId: "", action: 'add' }])
    }
    const onChangeAttorney = async (evt, index) => {
        const { name, value, checked, type } = evt.target;
        let objectivesCopy = [...listAttorney];
        objectivesCopy[index].customerId = value
        setListAttorney(objectivesCopy);
    }
    const deleteAttorney = async (evt, index) => {
        let objectivesCopy = [...listAttorney];
        objectivesCopy[index].action = objectivesCopy[index].action === 'add' ? 'delete_n' : 'delete'
        setListAttorney(objectivesCopy);
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

                <div className="md:container md:mx-auto">
                    <div className="flex items-end justify-end sm:px-6 lg:px-2 sm:py-0 lg:pt-4">
                        <button type="button"
                            onClick={() => { router.push('/driver'); }}
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />BACK
                        </button>
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
                    <CardBasic title={`${mode === 'create' ? 'New Driver' : 'Edit Driver'}`}>
                        <form onSubmit={handleSubmit(onsave)} id="inputForm">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 mt-4">
                                <InputSelectGroup type="select" id="driverType" name="driverType" label="Driver Type:"
                                    options={renderConfigOptions(driverType)}
                                    value={driver.driverType}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                    refs={{ ...register("driverType", { required: "This field is required." }) }}
                                    invalid={errors.driverType}
                                    required
                                />

                                <InputSelectGroup type="select" id="status" name="status" label="Status:"
                                    options={[{ name: 'Active', value: 'A' }, { name: 'Inactive', value: 'S' }]}
                                    value={driver.status}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                    required />
                                <InputGroupMask
                                    type="text" id="idCardNo" name="idCardNo" label="Identication Card:"
                                    value={driver.idCardNo}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                    refs={{ ...register("idCardNo", { required: "This field is required." }) }}
                                    invalid={errors.idCardNo}
                                    mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                    required />

                                <InputGroupDate type="date" id="birthDate" name="birthDate" label="Date Of Birth:"
                                    format="YYYY-MM-DD"
                                    value={driver.birthDate}
                                    onChange={handleChange}
                                    refs={{ ...register("birthDate", { required: "This field is required." }) }}
                                    invalid={errors.birthDate}
                                    disabled={mode === 'view'}
                                    required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputSelectGroup type="select" id="title" name="title" label="Name Tiltle"
                                    value={driver.title}
                                    options={renderConfigOptions(title)}
                                    onChange={handleChange}
                                    refs={{ ...register("title", { required: "This field is required." }) }}
                                    invalid={errors.title}
                                    disabled={mode === 'view'}
                                    required
                                />

                                <InputGroup type="text" id="firstname" name="firstname" label="First Name:"
                                    value={driver.firstname}
                                    onChange={handleChange}
                                    refs={{ ...register("firstname", { required: "This field is required." }) }}
                                    invalid={errors.firstname}
                                    disabled={mode === 'view'}
                                    required />

                                <InputGroup type="text" id="lastname" name="lastname" label="Last Name:"
                                    value={driver.lastname}
                                    onChange={handleChange}
                                    refs={{ ...register("lastname", { required: "This field is required." }) }}
                                    invalid={errors.lastname}
                                    disabled={mode === 'view'}
                                    required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputGroup type="text" id="address" name="address" label="Address:" classes=""
                                    value={driver.address}
                                    onChange={handleChange}
                                    refs={{ ...register("address", { required: "This field is required." }) }}
                                    invalid={errors.address}
                                    disabled={mode === 'view'}
                                    required />

                                <InputSelectGroup type="select" id="provinceTh" name="provinceTh" label="Province"
                                    options={renderOptions(provinceList, 'provinceTh', 'provinceCode')}
                                    value={driver.provinceCode}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setDriver(data => ({ ...data, provinceCode: e.target.value }));
                                        onChangeProvince(e);
                                    }}
                                    refs={{ ...register("provinceTh", { required: "This field is required." }) }}
                                    invalid={errors.provinceTh}
                                    disabled={mode === 'view'}
                                    isSearchable
                                    required
                                />
                                <InputSelectGroup type="select" id="districtTh" name="districtTh" label="District"
                                    options={renderOptions(districtList, 'districtTh', 'districtTh')}
                                    value={driver.districtTh}
                                    onChange={(e) => {
                                        handleChange(e);
                                        onChangeDistrict(e, driver.provinceCode);

                                    }}
                                    refs={{ ...register("districtTh", { required: "This field is required." }) }}
                                    invalid={errors.districtTh}
                                    disabled={mode === 'view'}
                                    isSearchable
                                    required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputSelectGroup type="select" id="subDistrictTh" name="subDistrictTh" label="Sub District"
                                    options={renderOptions(subDistrictList, 'subDistrictTh', 'subDistrictTh')}
                                    value={driver.subDistrictTh}
                                    onChange={(e) => {
                                        handleChange(e);
                                        onChangeSubDistrict(e, driver.districtTh, driver.provinceCode);
                                    }}
                                    refs={{ ...register("subDistrictTh", { required: "This field is required." }) }}
                                    invalid={errors.subDistrictTh}
                                    disabled={mode === 'view'}
                                    isSearchable
                                    required
                                />

                                <InputSelectGroup type="select" id="zipcodeId" name="zipcodeId" label="Zipcode"
                                    options={renderOptions(zipcodeList, 'zipcode', 'zipcodeId')}
                                    value={driver.zipcodeId}
                                    onChange={handleChange}
                                    refs={{ ...register("zipcodeId", { required: "This field is required." }) }}
                                    invalid={errors.zipcodeId}
                                    disabled={mode === 'view'}
                                    required
                                />
                                <InputGroupMask
                                    type="text" id="phoneNo" name="phoneNo" label="Phone Number:" classes=""
                                    value={driver.phoneNo}
                                    onChange={handleChange}
                                    refs={{ ...register("phoneNo", { required: "This field is required." }) }}
                                    invalid={errors.phoneNo}
                                    disabled={mode === 'view'}
                                    required
                                    mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]} />
                                <InputGroupMask
                                    type="text" id="altPhoneNo" name="altPhoneNo" label="Alternative Phone Number"
                                    value={driver.altPhoneNo}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                    mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]} />
                            </div>
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-start">
                                    <span className="bg-white pr-2 text-lg font-bold text-gray-900">Person to notify in case of emergency</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputSelectGroup type="select" id="contactTitle" name="contactTitle" label="Name Tiltle"
                                    value={driver.contactTitle}
                                    options={renderConfigOptions(title)}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                />

                                <InputGroup type="text" id="contactFirstname" name="contactFirstname" label="First Name:"
                                    value={driver.contactFirstname}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                />

                                <InputGroup type="text" id="contactLastname" name="contactLastname" label="Last Name:"
                                    value={driver.contactLastname}
                                    onChange={handleChange}
                                    disabled={mode === 'view'} />

                                <InputSelectGroup type="select" id="relationship" name="relationship" label="Relationship"
                                    value={driver.relationship}
                                    options={renderConfigOptions(contactRelationship)}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                <InputGroupMask
                                    type="text" id="contactPhoneNo" name="contactPhoneNo" label="Phone Number:" classes=""
                                    value={driver.contactPhoneNo}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                    mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]} />

                                <InputGroup type="text" id="password" name="password" label="Password:" classes=""
                                    value={driver.password}
                                    onChange={handleChange}
                                    // ref={{ ...register("password", { required: "This field is required." }) }}
                                    // invalid={errors.password}
                                    disabled={mode === 'view'}
                                // required
                                />

                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-10 lg:grid-cols-10 gap-4 mb-4">
                                <label htmlFor="shipmentDate" className="block text-sm font-medium text-gray-700">
                                    Job Type:
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-10 lg:grid-cols-1 gap-4 mb-4">
                                {jobType.map(function (item) {
                                    return (
                                        <div className="">
                                            <InputRadioGroup classes="h-4 w-4" key={item.configCode}
                                                checked={selectjobType && ((selectjobType.find(e => (e.jobTypeCode === item.configCode && e.action !== 'delete')))) ? true : false}
                                                type={"checkbox"} id={item.configCode}
                                                name="jobType" value={item.configCode} label={item.configValue}
                                                onChange={e => { handleChangeJobType(e.target.checked, e.target.value, item.configValue, undefined) }}
                                                disabled={mode === 'view'} />
                                            {showAttorney && item.configCode === 'ATTORNEY' &&
                                                <div className='w-9/12 pt-1 pl-12 pb-2'>
                                                    <div className='w-100 flex flex-1 justify-end border-b border-gray-200'>
                                                        <p className="pb-2 text-gray-500 text-xs">เพิ่มรายชื่อที่ต้องการมอบอำนาจ</p>
                                                    </div>
                                                    <table className="w-full divide-y divide-gray-300 border">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6" width="5%">
                                                                    No.
                                                                </th>
                                                                <th scope="col" className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6" width="90%">
                                                                    Customer Name
                                                                </th>
                                                                <th scope="col" className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6" width="5%">
                                                                    <button type="button"
                                                                        disabled={mode === 'view'}
                                                                        onClick={() => { addAttorney() }}
                                                                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-green-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-0 disabled:opacity-50">
                                                                        <PlusCircleIcon className="h-4 w-4 mr-0" />
                                                                    </button>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200 bg-white">
                                                            {listAttorney.map((attorney, index) => {
                                                                return (
                                                                    <>
                                                                        {(attorney.action !== "delete" && attorney.action != 'delete_n') && <tr key={index}>
                                                                            <td className=" whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6" width="5%">
                                                                                {index + 1}
                                                                            </td>
                                                                            <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-center" width="90%">
                                                                                <InputSelectGroup type="text" id="customerId" name="customerId" label=""
                                                                                    options={renderOptions(customerList, "fullName", "customerId")}
                                                                                    onChange={(e) => { onChangeAttorney(e, index) }}
                                                                                    isSearchable
                                                                                    value={attorney.customerId}
                                                                                    disabled={attorney.action !== 'add'} />
                                                                            </td>
                                                                            <td className=" whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6" width="5%">
                                                                                <button type="button"
                                                                                    disabled={mode === 'view'}
                                                                                    onClick={(e) => { deleteAttorney(e, index) }}
                                                                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-1 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-0 disabled:opacity-50">
                                                                                    <TrashIcon className="h-4 w-4 mr-0" />
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                        }
                                                                    </>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="grid grid-cols-12 md:grid-cols-6 lg:grid-cols-6 gap-4 mb-4 mt-6">
                                <label className="block">
                                    <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={e => { handleFileChange(e) }} disabled={mode === 'view'} />
                                    <span className="sr-only">Choose File</span>

                                </label>

                            </div>
                            <div className="grid grid-cols-12 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-4 mt-6">
                                <ListFile data={listFile}
                                    onDelete={onDeleteFile}
                                    disabled={mode === 'view'}
                                // onDelete={e => { setData (data => ({ ...data, ['methodology_documents']: [] })) }}
                                />
                            </div>

                        </form>
                    </CardBasic>
                    <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
                        {/* <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-4"
                            onClick={() => deleteDriver()}
                        >
                            DELETE
                        </button> */}
                        <button
                            form="inputForm"
                            type="submit"
                            disabled={mode === 'view'}
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        // onClick={() => onsave()}
                        >
                            SAVE
                        </button>
                    </footer>
                </div>
            </LoadingOverlay>
        </Layout >
    )
}