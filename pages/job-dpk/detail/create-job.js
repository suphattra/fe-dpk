import React, {  useEffect, useRef, useState } from "react";
import Layout from "../../../layouts";
import { PencilSquareIcon, PlusIcon, PlusIcon as PlusIconMini, PrinterIcon, Squares2X2Icon as Squares2X2IconMini, XMarkIcon } from '@heroicons/react/20/solid'
import { InputGroup, InputGroupCurrency, InputGroupDate, InputGroupMask, InputRadioGroup, InputSelectGroup } from "../../../components";
import { JobService } from "../../api/job.service";
import { useRouter } from "next/router";
import { MasterService } from "../../api/master.service";
import LoadingOverlay from "react-loading-overlay";
import Script from 'next/script'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { PaymentService } from "../../api/payment.service";
import { CustomerService } from "../../api/customer.service";
import { MapService } from "../../api/map.service";
import { NotifyService } from "../../api/notify.service";
import { DriverService } from "../../api/driver.service";
import { PackageService } from "../../api/package.service";

export default function CreateJob() {
    const handleLoadScript = () => {
    }
    return (
        <Layout>
            <Script src="https://cdn.omise.co/omise.js" onLoad={handleLoadScript} />
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
                <div className="flex flex-1 items-stretch overflow-hidden">
                    <div className='flex flex-1 justify-between border-b border-gray-200'>
                        <div className="w-full">
                            <main className="flex-1">
                                <div className="mx-auto w-full max-w-full pt-6">
                                  

                                    {/* Tabs */}
                                    <div className="mt-3 sm:mt-2 sm:pl-6 lg:pl-8">
                                        <div className="hidden sm:block">
                                            <div className="flex items-center border-b border-gray-200">
                                                <nav className="-mb-px flex flex-1 space-x-6 xl:space-x-8" id="tabs-tab" role="tablist">
                                                    <a   onClick={() => { router.push('/operations') }}>
                                                        บันทึกการทำงาน
                                                    </a>
                                                    <a >
                                                        สร้างบันทึก
                                                    </a>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={openTab === 0 ? "block" : "hidden"}>
                                        {/* Form Job Detail*/}
                                        <div className="tab-content" id="tabs-tabContent">
                                            <section className={""}
                                                id="tabs-home" role="tabpanel" aria-labelledby="tabs-home-tab">
                                                <form className="space-y-4"  id='inputForm'>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 mt-4">
                                                        <>
                                                            <InputGroupDate
                                                                type="date" id="shipmentDate" name="shipmentDate" label="วัน/เดือน/ปี"
                                                                format="YYYY-MM-DD"
                                                                onChange={onChange}
                                                                />

                                                            <InputSelectGroup type="text" id="customerId" name="customerId" label="พนักงาน"
                                                                {...register("customerId", { required: "This field is required." })}
                                                                // options={renderOptions(customerList, "fullName", "customerId")}
                                                                onChange={onChange}
                                                                isSearchable
                                                                options={[{ name: "นวลเพ็ญ", value: 1 }, { name: "ทอมมี่(แมว)", value: 2 }, { name: "ปีโป้(นวล)", value: 3 }]}
                                                                value="นวลเพ็ญ"
                                                                invalid={errors.customerId ? true : false}
                                                                disabled={mode === 'view' || mode === 'edit'} required />
                                                            <td className=" whitespace-nowrap py-2 text-sm font-medium text-gray-900 lg:pl-6 pr-6"
                                                            >
                                                                <p className="ml-2">ประเภทค่าเเรง</p>
                                                                <div className="flex items-center">
                                                                    <InputRadioGroup type="radio" name="status" />
                                                                    <span className="ml-2 mr-2">รายวัน</span>
                                                                    <InputRadioGroup type="radio" name="status" className="ml-2" />
                                                                    <span className="ml-2 mr-2">เหมาจ่าย</span>
                                                                    <InputRadioGroup type="radio" name="status" className="ml-2" />
                                                                    <span className="ml-2">เงินเือนห</span>
                                                                </div>
                                                                {/* <div className="flex items-center">
                                                                        <InputRadioGroup type="radio" name="status" />
                                                                        <span className="ml-2">อนุมัติงาน</span>
                                                                    </div> */}
                                                            </td>
                                                          
                                                            <InputSelectGroup type="text" id="customerId" name="customerId" label="แปลงใหญ่"
                                                                {...register("customerId", { required: "This field is required." })}
                                                                options={renderOptions(customerList, "fullName", "customerId")}
                                                                onChange={onChange}
                                                                isSearchable
                                                                value="นวลเพ็ญ"
                                                                invalid={errors.customerId ? true : false}
                                                                disabled={mode === 'view' || mode === 'edit'} required />
                                                            <InputSelectGroup type="text" id="estStartTime" name="estStartTime" label="แปลงย่อย"
                                                                options={[...EST_BOOKING_FINISHTIME]}
                                                                onChange={onChange} value={jobDetail.estStartTime}
                                                                isSearchable
                                                                disabled={mode === 'view'} />
                                                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="จำนวนงาน"
                                                                onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />
                                                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="ค่าแรง"
                                                                onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />

                                                            <InputSelectGroup type="text" id="customerId" name="customerId" label="งาน"
                                                                {...register("customerId", { required: "This field is required." })}
                                                                options={renderOptions(customerList, "fullName", "customerId")}
                                                                onChange={onChange}
                                                                isSearchable
                                                                value="นวลเพ็ญ"
                                                                invalid={errors.customerId ? true : false}
                                                                disabled={mode === 'view' || mode === 'edit'} required />
                                                            <InputSelectGroup type="text" id="estStartTime" name="estStartTime" label="ผลผลิต"
                                                                options={[...EST_BOOKING_FINISHTIME]}
                                                                onChange={onChange} value={jobDetail.estStartTime}
                                                                isSearchable
                                                                disabled={mode === 'view'} />
                                                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="จำนวน OT"
                                                                onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />
                                                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="อัตรา OT"
                                                                onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />
                                                            <div className="block w-full">
                                                                <label htmlFor={"taxAddress"} className="block text-sm font-medium text-gray-700">
                                                                    {"Tax Address:"}
                                                                </label>
                                                                <textarea
                                                                    id="taxAddress" name="หมายเหตุ"
                                                                    rows={3}
                                                                    className="mt-1 block w-9/12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                                                                />

                                                            </div>
                                                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="รวมเงิน OT"
                                                                onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />

                                                            <div>
                                                                <td className=" border border-gray-300 whitespace-nowrap py-2 text-sm font-medium text-gray-900 lg:pl-6 pr-6">
                                                                    <p className="ml-2">สถานะงาน</p>
                                                                    <div className="flex items-center">
                                                                        <InputRadioGroup type="radio" name="status" />
                                                                        <span className="ml-2 mr-2">รอการอนุมัติ</span>
                                                                        <InputRadioGroup type="radio" name="status" className="ml-2" />
                                                                        <span className="ml-2">อนุมัติงาน</span>
                                                                        <InputRadioGroup type="radio" name="status" className="ml-2" />
                                                                        <InputRadioGroup type="radio" name="status" className="ml-2" />
                                                                        <span className="ml-2"> ยกเลิกงาน</span>
                                                                    </div>
                                                                
                                                                </td>


                                                            </div>
                                                        </>

                                                    </div>

                                                    <div className="grid grid-cols-12 md:grid-cols-10 lg:grid-cols-10 gap-4 mb-4">
                                                        เบิกสินค้าคลัง
                                                        <InputRadioGroup
                                                            type={"checkbox"}
                                                            name="status"
                                                        />
                                                    </div>

                                                </form>

                                            </section>
                                        </div>
                                        <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4 bg-gray-100">
                                            <div className="flex justify-center items-center overflow-y-auto p-4" >
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

                                        </footer>
                                    </div>

                                </div>

                            </main>
                        </div>
                    </div>

                </div >
            </LoadingOverlay >
        </Layout >
    )
}
