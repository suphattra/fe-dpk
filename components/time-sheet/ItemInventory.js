import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { _resObjConfig, isEmpty, renderOptions } from "../../helpers/utils";
import InputSelectGroup from "../InputSelectGroup";
import InputSelectGroupInline from "../InputSelectGroupInline";
import { useEffect, useState } from "react";
import InputGroupInline from "../InputGroupInline";
import InputGroupMaskInline from "../InputGroupMaskInline";
import InputGroupMask from "../InputGroupMask";

export default function ItemInventory({ extraInventory, deleteAddOnService, callbackInventory, inventoryOption, disabled, errors, mode, statusOperation }) {
  const [inventoryList, setInventoryList] = useState([]);
  const [errorsList, setErrorsList] = useState({});

  useEffect(() => {
    // const _newValue = extraInventory.filter((item) => (item.action !== 'DELETE'));

    for (let extra of extraInventory) {
      if(!extra.action){
        extra.action = ""
      }
    }
    setInventoryList(extraInventory);
  }, [extraInventory]);

  useEffect(() => {
    console.log(errors)
    setErrorsList(errors);
  }, [errors]);

  const insertInventory = async () => {
    let lastElement =
      inventoryList.length > 0
        ? inventoryList[inventoryList.length - 1]
        : { index: 0 };
    let newService = {
      index: lastElement.index + 1,
      inventoryCode: "",
      inventoryName: "",
      unit: "",
      pickupAmount: "",
      action: 'NEW'
    };
    const _newValue = [...inventoryList, newService]
    setInventoryList((item) => [...item, newService]);
    callbackInventory(_newValue)
  };
  const deleteInventory = async (rowIndex) => {

    const _oldValue = inventoryList.find((item) => item.index === rowIndex);
    let _newValue = [...inventoryList];
    _newValue[rowIndex-1]['action'] = 'DELETE';
    _newValue[rowIndex-1]['index'] = _oldValue.index;
    _newValue[rowIndex-1]['inventoryCode'] = _oldValue.inventoryCode;
    _newValue[rowIndex-1]['inventoryName'] = _oldValue.inventoryName;
    _newValue[rowIndex-1]['pickupAmount'] = _oldValue.pickupAmount;
    _newValue[rowIndex-1]['unit'] = _oldValue.unit;

    setInventoryList(_newValue);
    callbackInventory(_newValue)
  };
  const handleOnChange = (e, index, name) => {
    if (name === 'inventory') {
      let obj = {}
      obj = inventoryOption.find((ele => { return ele.inventoryCode === e.target.value }))
      if (!isEmpty(obj)) {
        let _newValue = [...inventoryList];
        _newValue[index]['inventoryCode'] = obj.inventoryCode;
        _newValue[index]['inventoryName'] = obj.inventoryName;
        _newValue[index]['unit'] = obj.unit;
        // setInventoryList(_newValue);
        callbackInventory(_newValue, name)
      } else {
        let _newValue = [...inventoryList];
        _newValue[index]['inventoryCode'] = '';
        _newValue[index]['inventoryName'] = '';
        _newValue[index]['unit'] = '';
        // setInventoryList(_newValue);
        callbackInventory(_newValue, name)
      }

    } else {
      console.log("onChange", e.target.value, index, name);
      let _newValue = [...inventoryList];
      _newValue[index][name] = e.target.value;
      // setInventoryList(_newValue);
      callbackInventory(_newValue, name)
    }

  };
  return (
    <div className="flow-root">
      {inventoryList.length > 0 &&
        // .filter((item) => (item.action !== 'DELETE'))
        inventoryList.map((extra, index) => {
          if(extra.action !== 'DELETE'){
            return (
              <>
  
                <div className="flex space-x-4 items-center md:border-b lg:border-none " key={index}>
                  < div className="grid grid-cols-8 md:grid-cols-2 lg:grid-cols-8 gap-4 md:py-2 lg:py-0">
                    <div className="col-span-4">
                      <InputSelectGroupInline
                        type="text"
                        // id="inventory"
                        id={"inventory" + index + 1}
                        name="inventory"
                        label="สินค้าคงคลัง"
                        required
                        isSearchable={true}
                        invalid={errorsList?.inventoryCode ? errorsList?.inventoryCode[extra.index] : false}
                        disabled={extra.action === 'NEW' ? false : statusOperation === 'MD0028' ? true : (mode === 'view') ? true : false}
                        options={renderOptions(inventoryOption, "inventoryTradeName", "inventoryCode")}
                        value={extra.inventoryCode}
                        onChange={(e) => {
                          handleOnChange(e, index, "inventory");
                        }}
                      />
                    </div>
                    <div className="col-span-3">
                      <InputGroupMaskInline
                        type="number"
                        id="pickupAmount"
                        name="pickupAmount"
                        label="จำนวน"
                        unit={extra.unit ? extra.unit : "หน่วย"}
                        required
                        classes=""
                        // disabled={disabled}
                        disabled={extra.action === 'NEW' ? false : statusOperation === 'MD0028' ? true : (mode === 'view') ? true : false}
                        invalid={errorsList?.pickupAmount ? errorsList?.pickupAmount[extra.index] : false}
                        value={extra.pickupAmount}
                        mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                        onChange={(e) => {
                          handleOnChange(e, index, "pickupAmount");
                        }}
                      />
                    </div>
                    {/* <div className="col-span-1 pt-2 text-left">
                      <p className="block text-sm font-medium text-gray-700">{extra.unit}</p>
                    </div> */}
                    <div className="col-span-1 m-0 pt-2">
                      <button
                        type="button"
                        onClick={() => deleteInventory(extra.index)}
                        disabled={disabled}
                        className="bg-white hover:bg-gray-100 border border-gray-200 font-medium text-gray-500 rounded-lg text-sm px-1 py-1 text-center inline-flex items-center mt-0 disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            );
          }
         
        })}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-2 mt-2">
        <div className="flex justify-end mb-4">
          <button
            type="button"
            disabled={disabled}
            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-6 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
            onClick={insertInventory}
          >
            <PlusCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            เพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
}
