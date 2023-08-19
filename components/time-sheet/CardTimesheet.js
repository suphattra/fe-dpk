import moment from "moment";
import CardBasic from "../CardBasic";
import InputGroupDate from "../InputGroupDate";
import InputRadioGroup from "../InputRadioGroup";
import InputSelectGroup from "../InputSelectGroup";
import { isEmpty, renderOptions } from "../../helpers/utils";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import ItemInventory from "./ItemInventory";
import InputGroupMask from "../InputGroupMask";

export default function CardTimesheet({ index, timeSheet, onChange, deleteAddOnService }) {
    const [openAddInventory, setAddInventory] = useState(false)
    const [otAmount, setOtAmount] = useState(timeSheet.otAmount ? timeSheet.otAmount : null)
    const [otRate, setOtRate] = useState(timeSheet.otRate ? timeSheet.otRate : null)
    const [wageType, setWageType] = useState([{
        "code": "MD0031",
        "value1": "รายวัน",
        "value2": "daily"
    }, {
        "code": "MD0032",
        "value1": "เหมาจ่าย",
        "value2": "เหมาจ่าย"
    }, {
        "code": "MD0033",
        "value1": "เงินเดือน",
        "value2": "เงินเดือน"
    }]) //get จาก config
    const [operationStatus, setOperationStatus] = useState([{
        "code": "MD0024",
        "value1": "รอการอนุมัติ",
        "value2": "รอการอนุมัติ"
    },
    {
        "code": "MD0025",
        "value1": "อนุมัติงาน",
        "value2": "อนุมัติงาน"
    }])//get จาก config
    useEffect(() => {
        calculatorOT()
    }, [otAmount, otRate])
    const checkInventory = (e) => {
        setAddInventory(e.target.checked)
    }
    const callbackInventory = (e) => {
        console.log('dedefef', e)
        //onChange to extraInventory
    }
    const handleChange = (e, index, name) => {
        let obj = {}
        if (name === 'wageType') {
            obj = wageType.find((ele => { return ele.code === e.target.value }))
            onChange({ target: { name: name, value: obj } }, index, name)
        }
    }
    const calculatorOT = () => {
        if (!isEmpty(otAmount) && !isEmpty(otRate)) {
            const otTotal = parseInt(otAmount) * parseInt(otRate)
            onChange({ target: { name: 'otTotal', value: otTotal } }, index, 'otTotal')
        } else {
            onChange({ target: { name: 'otTotal', value: null } }, index, 'otTotal')

        }
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

                            <InputSelectGroup type="text" id={"employee" + timeSheet.index} name="employee" label="พนักงาน"
                                onChange={(e) => onChange(e, index, "employee")}
                                isSearchable
                                options={[{ name: "นวลเพ็ญ", value: 1 }, { name: "ทอมมี่(แมว)", value: 2 }, { name: "ปีโป้(นวล)", value: 3 }]}
                                value="นวลเพ็ญ"
                                required />
                            <InputSelectGroup type="text" id={"mainBranch" + timeSheet.index} name="mainBranch" label="แปลงใหญ่"
                                options={renderOptions([], "fullName", "customerId")}
                                onChange={onChange}
                                isSearchable
                                value="นวลเพ็ญ"
                                required />
                            <InputSelectGroup type="text" id={"subBranch" + timeSheet.index} name="subBranch" label="แปลงย่อย"
                                options={[]}
                                onChange={onChange}
                                value={timeSheet.estStartTime}
                                isSearchable
                            />
                            <InputSelectGroup type="text" id={"task" + timeSheet.index} name="task" label="งาน"
                                options={renderOptions([], "fullName", "customerId")}
                                onChange={onChange}
                                isSearchable
                                value="นวลเพ็ญ"
                                required />
                            <InputSelectGroup type="text" id={"product" + timeSheet.index} name="product" label="ผลผลิต"
                                options={[]}
                                onChange={onChange} value={timeSheet.estStartTime}
                                isSearchable />
                            <div className="block w-full">
                                <label htmlFor={"remark"} className="block text-sm font-medium text-gray-700">
                                    {"หมายเหตุ:"}
                                </label>
                                <textarea
                                    onChange={(e) => onChange(e, index, "remark")}
                                    id="remark" name="หมายเหตุ"
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
                                    <ItemInventory extraInventory={timeSheet.extraInventory}
                                        callbackInventory={(e) => callbackInventory(e)} />

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
                                    {wageType.map(function (item, inx) {
                                        return (
                                            <InputRadioGroup key={inx} classes="h-4 w-4" type={"radio"}
                                                id={"wageType_" + inx + timeSheet.index} name={"wageType" + timeSheet.index} label={item.value1}
                                                onChange={(e) => handleChange(e, index, "wageType")}
                                                value={item.code}
                                                checked={item.code === timeSheet.wageType.code ? true : false} />
                                        )
                                    })}

                                </div>
                            </div>
                            <InputGroupMask type="text" id="taskAmount" name="taskAmount" label="จำนวนงาน"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => onChange(e, index, "taskAmount")}
                                value={timeSheet.taskAmount} />
                            <InputGroupMask type="text" id="taskPaymentRate" name="taskPaymentRate" label="ค่าแรง"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => onChange(e, index, "taskPaymentRate")}
                                value={timeSheet.taskPaymentRate} />
                            <InputGroupMask type="text" id="otAmount" name="otAmount" label="จำนวน OT"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => { setOtAmount(e.target.value), onChange(e, index, "otAmount") }}
                                value={otAmount}
                            />
                            <InputGroupMask type="text" id="otRate" name="otRate" label="อัตรา OT"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => { setOtRate(e.target.value), onChange(e, index, "otRate") }}
                                value={otRate}
                            />
                            <InputGroupMask type="text" id="otTotal" name="otTotal" label="รวมเงิน OT"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => handleChange(e, index, "otTotal")}
                                value={timeSheet.otTotal}
                                disabled
                            />
                            <div class="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    สถานะงาน:
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-4 mt-4">
                                    {operationStatus.map(function (item, inx) {
                                        return (
                                            <InputRadioGroup key={inx} classes="h-4 w-4" type={"radio"}
                                                id={"operationStatus_" + inx + timeSheet.index} name={"operationStatus" + timeSheet.index} label={item.value1}
                                                onChange={(e) => onChange(e, index, "operationStatus")}
                                                value={item.code}
                                                checked={item.code === timeSheet.operationStatus ? true : false} />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}