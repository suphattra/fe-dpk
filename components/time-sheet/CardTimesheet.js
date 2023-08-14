import moment from "moment";
import CardBasic from "../CardBasic";
import InputGroupDate from "../InputGroupDate";
import InputRadioGroup from "../InputRadioGroup";
import InputSelectGroup from "../InputSelectGroup";
import { renderOptions } from "../../helpers/utils";
import InputGroup from "../InputGroup";
import { useState } from "react";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import ItemInventory from "./ItemInventory";

export default function CardTimesheet({ index, timeSheet, onChange, deleteAddOnService }) {
    const [openAddInventory, setAddInventory] = useState(false)
    const [wageType, setWageType] = useState([{
        "code": "MD0032",
        "value1": "รายวัน",
        "value2": "daily"
    }, {
        "code": "MD0033",
        "value1": "รายเดือน",
        "value2": "ssss"
    }, {
        "code": "MD0033",
        "value1": "รายเดือน",
        "value2": "ssss"
    }]) //get จาก config
    const [operationStatus, setOperationStatus] = useState([{
        "code": "MD0024",
        "value1": "ทุเรียน",
        "value2": "Durian"
    },
    {
        "code": "MD0025",
        "value1": "กล้วย",
        "value2": "Banana"
    }])//get จาก config
    const checkInventory = (e) => {
        setAddInventory(e.target.checked)
    }

    return (
        <div className="mt-4 flex flex-col">
            <div className="flex flex-row-reverse py-2 px-2 border border-gray-200 rounded-t-md">
                <button type="button"
                    className="flex justify-center inline-flex items-center rounded-md border border-transparent  text-xs font-medium text-black shadow-sm hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-80"
                    onClick={(e) => deleteAddOnService(timeSheet.index)}
                >
                    <XMarkIcon className="h-8 w-8  pointer" aria-hidden="true" />
                </button>

            </div>
            <div className="rounded-md p-4 shadow-md">
                <div className="flex flex-1 items-stretch overflow-hidden">
                    <div className='relative w-0 flex-1 mr-6 border-r'>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mr-6">
                            <InputGroupDate
                                type="date" id={"startDate" + timeSheet.index} name="startDate" label="วัน/เดือน/ปี"
                                format="YYYY-MM-DD"
                                onChange={(e) => onChange(e, index, "startDate")}
                                value={timeSheet.startDate ? moment(new Date(timeSheet.startDate)).format('YYYY-MM-DD') : ""}
                                required />

                            <InputSelectGroup type="text" id="customerId" name="customerId" label="พนักงาน"
                                onChange={onChange}
                                isSearchable
                                options={[{ name: "นวลเพ็ญ", value: 1 }, { name: "ทอมมี่(แมว)", value: 2 }, { name: "ปีโป้(นวล)", value: 3 }]}
                                value="นวลเพ็ญ"
                                required />
                            <InputSelectGroup type="text" id="customerId" name="customerId" label="แปลงใหญ่"
                                options={renderOptions([], "fullName", "customerId")}
                                onChange={onChange}
                                isSearchable
                                value="นวลเพ็ญ"
                                required />
                            <InputSelectGroup type="text" id="estStartTime" name="estStartTime" label="แปลงย่อย"
                                options={[]}
                                onChange={onChange}
                                value={timeSheet.estStartTime}
                                isSearchable
                            />
                            <InputSelectGroup type="text" id="customerId" name="customerId" label="งาน"
                                options={renderOptions([], "fullName", "customerId")}
                                onChange={onChange}
                                isSearchable
                                value="นวลเพ็ญ"
                                required />
                            <InputSelectGroup type="text" id="estStartTime" name="estStartTime" label="ผลผลิต"
                                options={[]}
                                onChange={onChange} value={timeSheet.estStartTime}
                                isSearchable />
                            <div className="block w-full">
                                <label htmlFor={"taxAddress"} className="block text-sm font-medium text-gray-700">
                                    {"หมายเหตุ:"}
                                </label>
                                <textarea
                                    id="taxAddress" name="หมายเหตุ"
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                                />

                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 ml-2 py-4 mr-6">
                            <InputRadioGroup
                                type={"checkbox"}
                                name="status"
                                id={"addInventory" + timeSheet.index}
                                label={"เบิกสินค้าคงคลัง"}
                                onChange={checkInventory}
                            />
                        </div>
                        {openAddInventory &&
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mr-6">
                                    <ItemInventory extraInventory={timeSheet.extraInventory} />

                                </div>
                            </>}
                    </div>
                    <div className="relative w-0 flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            <div class="col-span-2">

                                <label className="block text-sm font-medium text-gray-700">
                                    ประเภทค่าเเรง:
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-2 mt-4">
                                    {wageType.map((item, index) => (
                                        <InputRadioGroup key={index} classes="h-4 w-4" type={"radio"}
                                            id={item.code} name="wageType" label={item.value1}
                                            onChange={onChange} value={item.code}
                                            checked={item.code === timeSheet.wageType ? true : false} />
                                    ))}

                                </div>
                            </div>
                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="จำนวนงาน"
                                onChange={onChange}
                                value={timeSheet.trackingNo} />
                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="ค่าแรง"
                                onChange={onChange}
                                value={timeSheet.trackingNo} />
                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="จำนวน OT"
                                onChange={onChange} value={timeSheet.trackingNo}
                            />
                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="อัตรา OT"
                                onChange={onChange} value={timeSheet.trackingNo} />
                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="รวมเงิน OT"
                                onChange={onChange} value={timeSheet.trackingNo} />
                            <div class="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    สถานะงาน:
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-4 mt-4">
                                    {operationStatus.map((item, index) => (
                                        <InputRadioGroup key={index} classes="h-4 w-4" type={"radio"}
                                            id={item.code} name="operationStatus" label={item.value1}
                                            onChange={onChange} value={item.code}
                                            checked={item.code === timeSheet.operationStatus ? true : false} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}