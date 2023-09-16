import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { _resObjConfig, isEmpty, renderOptions } from "../../helpers/utils";
import InputSelectGroup from "../InputSelectGroup";
import InputSelectGroupInline from "../InputSelectGroupInline";
import { useEffect, useState } from "react";
import InputGroupInline from "../InputGroupInline";
import InputGroupMaskInline from "../InputGroupMaskInline";

export default function ItemInventory({ extraInventory, deleteAddOnService, callbackInventory, inventoryOption }) {
  const [inventoryList, setInventoryList] = useState([]);
  useEffect(() => {
    setInventoryList(extraInventory);
  }, [extraInventory]);

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
      pickupAmount: ""
    };
    const _newValue = [...inventoryList, newService]
    setInventoryList((item) => [...item, newService]);
    callbackInventory(_newValue)
  };
  const deleteInventory = async (rowIndex) => {
    const _newValue = inventoryList.filter((item) => item.index !== rowIndex);
    setInventoryList(_newValue);
    callbackInventory(_newValue)
  };
  const onChange = (e, index, name) => {
    if (name === 'inventory') {
      let obj = {}
      obj = inventoryOption.find((ele => { return ele.inventoryCode === e.target.value }))
      if (!isEmpty(obj)) {
        let _newValue = [...inventoryList];
        _newValue[index]['inventoryCode'] = obj.inventoryCode;
        _newValue[index]['inventoryName'] = obj.inventoryName;
        _newValue[index]['unit'] = obj.unit;
        setInventoryList(_newValue);
      } else {
        let _newValue = [...inventoryList];
        _newValue[index]['inventoryCode'] = '';
        _newValue[index]['inventoryName'] = '';
        _newValue[index]['unit'] = '';
        setInventoryList(_newValue);
      }

    } else {
      console.log("onChange", e.target.value, index, name);
      let _newValue = [...inventoryList];
      _newValue[index][name] = e.target.value;
      setInventoryList(_newValue);
    }

  };
  return (
    <div className="flow-root">
      {inventoryList.length > 0 &&
        inventoryList.map((extra, index) => {
          return (
            <>

              <div className="flex space-x-4 items-center md:border-b lg:border-none " key={index}>
                < div className="grid grid-cols-8 md:grid-cols-2 lg:grid-cols-8 gap-4 md:py-2 lg:py-0">
                  <div className="col-span-4">
                    <InputSelectGroupInline
                      type="text"
                      id="inventory"
                      name="inventory"
                      label="สินค้าคงคลัง"
                      required
                      options={renderOptions(inventoryOption, "inventoryName", "inventoryCode")}
                      value={extra.inventoryCode}
                      onChange={(e) => {
                        onChange(e, index, "inventory");
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <InputGroupMaskInline
                      type="text"
                      id="pickupAmount"
                      name="pickupAmount"
                      label="จำนวน"
                      required
                      classes=""
                      value={extra.pickupAmount}
                      mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                      onChange={(e) => {
                        onChange(e, index, "pickupAmount");
                      }}
                    />
                  </div>
                  <div className="col-span-1 pt-2 text-left">
                    <p className="block text-sm font-medium text-gray-700">{extra.unit}</p>
                  </div>
                  <div className="col-span-1 m-0 pt-2">
                    <button
                      type="button"
                      onClick={() => deleteInventory(extra.index)}
                      className="bg-white hover:bg-gray-100 border border-gray-200 font-medium text-gray-500 rounded-lg text-sm px-1 py-1 text-center inline-flex items-center mt-0"
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
        })}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-2 mt-2">
        <div className="flex justify-end mb-4">
          <button
            type="button"
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
