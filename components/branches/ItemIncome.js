import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { _resObjConfig, isEmpty, renderOptions } from "../../helpers/utils";
import InputSelectGroup from "../InputSelectGroup";
import InputSelectGroupInline from "../InputSelectGroupInline";
import { useEffect, useState } from "react";
import InputGroupInline from "../InputGroupInline";
import InputGroupMaskInline from "../InputGroupMaskInline";

export default function ItemIncome({ extraProduct, deleteAddOnService, callbackIncome, inventoryOption, disabled, errors }) {
  const [inventoryList, setInventoryList] = useState([]);
  const [errorsList, setErrorsList] = useState({});

  useEffect(() => {
    setInventoryList(extraProduct);
  }, [extraProduct]);

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
      year: "",
      income: "",
      productAmount:""
    };
    const _newValue = [...inventoryList, newService]
    setInventoryList((item) => [...item, newService]);
    callbackIncome(_newValue)
  };
  const deleteInventory = async (rowIndex) => {
    const _newValue = inventoryList.filter((item) => item.index !== rowIndex);
    setInventoryList(_newValue);
    callbackIncome(_newValue)
  };
  const handleOnChange = (e, index, name) => {
    if (name === 'product') {
      let obj = {}
      obj = inventoryOption.find((ele => { return ele.code === e.target.value }))
      if (!isEmpty(obj)) {
        let _newValue = [...inventoryList];
        _newValue[index]['code'] = obj.code;
        _newValue[index]['value1'] = obj.value1;
        // _newValue[index]['unit'] = obj.unit;
        // setInventoryList(_newValue);
        callbackIncome(_newValue)
      } else {
        let _newValue = [...inventoryList];
        _newValue[index]['code'] = '';
        _newValue[index]['inventoryName'] = '';
        // _newValue[index]['unit'] = '';
        // setInventoryList(_newValue);
        callbackIncome(_newValue)
      }

    } else {
      console.log("onChange", e.target.value, index, name);
      let _newValue = [...inventoryList];
      _newValue[index][name] = e.target.value;
      // setInventoryList(_newValue);
      callbackIncome(_newValue)
    }

  };
  return (
    <div className="flow-root">
      {inventoryList.length > 0 &&
        inventoryList.map((extra, index) => {
          return (
            <>

              <div className=" " key={index}>
                < div className="grid grid-cols-10 md:grid-cols-2 lg:grid-cols-10 gap-4 md:py-2 lg:py-0">
                  <div className="col-span-3">
                    <InputGroupMaskInline
                      type="text"
                      mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                      id={"year" + index + 1}
                      name="year"
                      label="ปี (พ.ศ.)"
                      invalid={errorsList?.inventoryCode?errorsList?.inventoryCode[extra.index]:false}
                      disabled={disabled}
                      value={extra.year}
                      onChange={(e) => {
                        handleOnChange(e, index, "year");
                      }}
                    />
                  </div>
                  <div className="col-span-3">
                  <InputGroupMaskInline
                      type="text"
                      id="productAmount"
                      name="productAmount"
                      label="จำนวน"
                      // unit={"ต้น"}
                      classes=""
                      disabled={disabled}
                      value={extra.productAmount}
                      mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                      onChange={(e) => {
                        handleOnChange(e, index, "productAmount");
                      }}
                    />
                    </div>
                  <div className="col-span-3">
                    <InputGroupMaskInline
                      type="text"
                      id="income"
                      name="income"
                      label="รายได้"
                      unit={"บาท"}
                      classes=""
                      disabled={disabled}
                      value={extra.income}
                      mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                      onChange={(e) => {
                        handleOnChange(e, index, "income");
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
