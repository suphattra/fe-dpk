import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { _resObjConfig, isEmpty, renderOptions } from "../../helpers/utils";
import InputSelectGroupInline from "../InputSelectGroupInline";
import { useEffect, useState } from "react";
import InputGroupMaskInline from "../InputGroupMaskInline";
import Loading from "../loading";

export default function ItemProduct({
  extraProduct,
  deleteAddOnService,
  callbackProduct,
  inventoryOption,
  disabled,
  errors,
  loadingItem,
  mode
}) {
  const [inventoryList, setInventoryList] = useState([]);
  const [errorsList, setErrorsList] = useState({});

  useEffect(() => {
    setInventoryList(extraProduct);
  }, [extraProduct]);

  useEffect(() => {
    console.log(errors);
    setErrorsList(errors);
  }, [errors]);

  const insertInventory = async () => {
    let lastElement =
      inventoryList.length > 0
        ? inventoryList[inventoryList.length - 1]
        : { index: 0 };
    let newService = {
      index: lastElement.index + 1,
      branchCode: "",
      branchName: "",
      amount: "",
    };
    const _newValue = [...inventoryList, newService];
    setInventoryList((item) => [...item, newService]);
    callbackProduct(_newValue);
  };
  const deleteInventory = async (rowIndex) => {
    const _newValue = inventoryList.filter((item) => item.index !== rowIndex);
    setInventoryList(_newValue);
    callbackProduct(_newValue);
  };
  const handleOnChange = (e, index, name) => {
    if (name === "distribution") {
      let obj = {};
      obj = inventoryOption.find((ele) => {
        return ele.branchCode === e.target.value;
      });
      if (!isEmpty(obj)) {
        let _newValue = [...inventoryList];
        _newValue[index]["branchCode"] = obj.branchCode;
        _newValue[index]["branchName"] = obj.branchName;
        callbackProduct(_newValue, name);
      } else {
        let _newValue = [...inventoryList];
        _newValue[index]["branchCode"] = "";
        _newValue[index]["branchName"] = "";
        callbackProduct(_newValue, name);
      }
    } else {
      console.log("onChange ", e.target.value, index, name);
      let _newValue = [...inventoryList];
      _newValue[index][name] = e.target.value;
      callbackProduct(_newValue, name);
    }
  };
  return (
    <div className="flow-root">
      {!loadingItem && mode == 'edit' ? 
       <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-2 mt-2">
       
       <Loading/><Loading/> </div>
      :
      inventoryList.length > 0 &&
        inventoryList.map((extra, index) => {
          return (
            <>
              <div
                className="grid grid-cols-8 md:grid-cols-2 lg:grid-cols-8 gap-4 md:py-2 lg:py-0"
                key={index}
              >
                <div className="col-span-4">
                  <InputSelectGroupInline
                    type="text"
                    id={"distribution" + index + 1}
                    name="distribution"
                    label="แปลง"
                    required
                    invalid={
                      errorsList?.branchCode ? errorsList?.branchCode[extra.index] : false
                    }
                    isSearchable
                    disabled={disabled}
                    options={renderOptions(inventoryOption, "branchName", "branchCode")}
                    value={extra.branchCode}
                    onChange={(e) => {
                      handleOnChange(e, index, "distribution");
                    }}
                  />
                </div>
                <div className="col-span-3">
                  <InputGroupMaskInline
                    type="text"
                    id="amount"
                    name="amount"
                    label="จำนวน"
                    required
                    classes=""
                    disabled={disabled}
                    invalid={
                      errorsList?.amount
                        ? errorsList?.amount[extra.index]
                        : false
                    }
                    value={extra.amount}
                    mask={[
                      /[0-9]/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    onChange={(e) => {
                      handleOnChange(e, index, "amount");
                    }}
                  />
                </div>
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
