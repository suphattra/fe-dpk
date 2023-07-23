import { useEffect, useState } from "react";
import { InputSelectGroup } from "..";
import { renderOptions } from "../../helpers/utils";
export default function JobExtraCharge({ deleteAddOnService, jobExtraCharge, extraCharge, disabled, callbackValueOnChangePointExtra, jobDetail }) {
    const [extraCharges, setExtraCharges] = useState([])
    useEffect(() => {
        setExtraCharges(jobExtraCharge)
    }, [jobExtraCharge]);

    const onChangePointExtra = (e, index, name,) => {
        let _newValue = [...extraCharges]
        _newValue[index][name] = e.target.value
        _newValue[index]["extraCharge"] = extraCharge.find(c => e.target.value === c.configCode)?.configValue2
        _newValue[index]["extraChargeTypeTxt"] = extraCharge.find(c => e.target.value === c.configCode)?.configValue
        setExtraCharges(_newValue)
        callbackValueOnChangePointExtra(_newValue)
    }
    const onChange = (e, index, name,) => {
        let _newValue = [...extraCharges]
        _newValue[index][name] = e.target.value
        setExtraCharges(_newValue)
        callbackValueOnChangePointExtra(_newValue)
    }
    return (
        <div className="flow-root">
            <label htmlFor="" className="block text-sm font-medium text-gray-700">บริการเสริม:</label>
            {extraCharges && extraCharges.map((extra, index) => {
                return (
                    <div className="flex space-x-4 items-center" key={index}>
                        <div className="flex-auto w-64">
                            <InputSelectGroup type="text" id="extraChargeType" name="extraChargeType" label=""
                                options={renderOptions(extraCharge, "configValue", "configCode")}
                                // options={renderOptions(enp, "configValue", "configCode")} 
                                value={extra.extraChargeType}
                                onChange={(e) => { onChangePointExtra(e, index, "extraChargeType") }}
                                disabled={disabled || (jobDetail.jobPackageType === "NORMAL" && jobDetail.paymentStatus === 'PAID')}
                            />
                        </div>
                        <div className="flex-auto w-64">
                            <InputSelectGroup type="select" id="pointSeq" name="pointSeq" label=""
                                options={[{ name: "จุดที่ 1", value: 1 }, { name: "จุดที่ 2", value: 2 }]}
                                value={extra.pointSeq}
                                onChange={(e) => { onChange(e, index, "pointSeq") }}
                                disabled={disabled || (jobDetail.jobPackageType === "NORMAL" && jobDetail.paymentStatus === 'PAID')}
                            />
                        </div>
                        <div className="flex-auto w-4 mt-0">
                            <label
                                className="block text-lg font-medium text-gray-700">+{extra.extraCharge}
                            </label>
                        </div>
                        <button type="button"
                            disabled={disabled || (jobDetail.jobPackageType === "NORMAL" && jobDetail.paymentStatus === 'PAID')}
                            onClick={() => deleteAddOnService(index)}
                            className="bg-white hover:bg-gray-100 border border-gray-200 font-medium text-gray-500 rounded-lg text-sm px-1 py-1 text-center inline-flex items-center mt-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )
            })}
        </div>
    )
}