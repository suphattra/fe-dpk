import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useEffect } from "react";
import InputGroup from "../InputGroup";
import { _resObjConfig, renderOptions } from "../../helpers/utils";
import InputSelectGroup from "../InputSelectGroup";
import { MasterService } from "../../pages/api/master.service";
import { isEmpty } from "lodash";
import ImageUploading from "react-images-uploading";
import InputGroupDate from "../InputGroupDate";
import moment from "moment";
import InputGroupMask from "../InputGroupMask";
import ItemProduct from "./ItemProduct";
import { BranchService } from "../../pages/api/branch.service";
import LoadingTemplate from "../LoadingTemplate";
export default function CardInventory({
  index,
  inventory,
  onChange,
  deleteAddOnService,
  mode,
  dateSelect,
  onErrors,
  fieldRegister = () => { },
}) {
  const [querySucess, setQuerySucess] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentType, setPaymentType] = useState([]);
  const [inventoryType, setInventoryType] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [images, setImages] = useState([]);
  const [loadingItem, setLoadingItem] = useState(false);
  const maxNumber = 69;
  useEffect(() => {
    async function fetchData() {
      await getConfigList("PAYMENT_TYPE");
      await getConfigList("INVENTORY_TYPE");
      await getBranchList()
      setQuerySucess(true);
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (!isEmpty(inventory.bill)) {
      let a = []
      a.push({
        data_url: inventory.bill?.filePath,
        file: inventory.bill?.filePath
      })
      setImages(a);
    }

  }, [inventory.bill]);
  useEffect(() => {
    setErrors(onErrors);
  }, [onErrors]);
  const getConfigList = async (code) => {
    let param = {
      type: "INVENTORY",
      subType: code,
      status: 'Active'
    };
    await MasterService.getConfig(param)
      .then((res) => {
        if (res.data.resultCode === 200) {
          if (code === "PAYMENT_TYPE") setPaymentType(res.data.resultData);
          if (code === "INVENTORY_TYPE") setInventoryType(res.data.resultData);
        } else {
          if (code === "PAYMENT_TYPE") setPaymentType([]);
          if (code === "INVENTORY_TYPE") setInventoryType([]);
        }
      })
      .catch((err) => { });
  };

  const handleChange = (e, index, name) => {
    let obj = {};
    if (name === "paymentType" || name === "inventoryType") {
      let _option = [];
      switch (name) {
        case "paymentType":
          _option = paymentType;
          break;
        case "inventoryType":
          _option = inventoryType;
          break;
        default:
      }
      obj = _resObjConfig(e.target.value, _option);
      onChange({ target: { name: name, value: obj } }, index, name);
    }

    if (name === "bill") {
      console.log(e)
      if (!isEmpty(e)) {
        let obj = {
          filePath: e[0].data_url
        }
        onChange({ target: { name: name, value: obj } }, index, name);
      } else {
        let obj = {
          filePath: {}
        }
        onChange({ target: { name: name, value: obj } }, index, name);
      }
    }
  };
  const getBranchList = async () => {
    let param = {
      limit: 1000,
      offset: 1,
      branchType: 'MD0014',
      status: 'Active'

    }
    await BranchService.getBranchList(param).then(res => {
      if (res.data.resultCode === 200) {
        console.log(res.data.resultData)
        setBranchList(res.data.resultData)
        setLoadingItem(true)
      } else {
        setBranchList([])
        setLoadingItem(true)
      }
    }).catch(err => {
      console.log("==> list job3")
    })
  }

  const onChangeImg = (imageList, addUpdateIndex, index) => {
    setImages(imageList);
    handleChange(imageList, index, 'bill')
  };

  const callbackProduct = (e, index, name) => {
    console.log('dde', e)
    onChange({ target: { name: "distribution", value: e } }, index - 1, "distribution");
  };
  return (
    <div className="mt-4 flex flex-col">
      {mode != "edit" && (
        <div className="flex flex-row-reverse py-2 px-2 border border-gray-200 rounded-t-md">
          <button
            type="button"
            className="flex justify-center inline-flex items-center rounded-md border border-transparent  text-xs font-medium text-black shadow-sm hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-80"
            onClick={(e) => deleteAddOnService(inventory.index)}
          >
            <XMarkIcon className="h-8 w-8  pointer" aria-hidden="true" />
          </button>
        </div>
      )}
      {querySucess && (
        <div className="rounded-md p-4 shadow-md">
          <div className="grid grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4 mr-6">
            <InputGroupDate
              type="date" id={"importDate" + inventory.index} name="importDate" label="วันที่นำเข้า"
              format="YYYY-MM-DD"
              onChange={(e) => { onChange(e, index, "importDate") }}
              value={inventory.importDate ? moment(new Date(inventory.importDate)).format('YYYY-MM-DD') : ""}
              invalid={errors?.importDate ? errors?.importDate[inventory.index] : false}
              required />
            <InputSelectGroup
              type="text"
              id={"inventory" + inventory.index}
              name="inventoryType"
              label="ประเภทสินค้า"
              onChange={(e) => handleChange(e, index, "inventoryType")}
              isSearchable
              options={renderOptions(inventoryType, "value1", "code")}
              value={inventory.inventoryType.code}
              invalid={
                errors?.inventoryType ? errors?.inventoryType[inventory.index] : false
              }
              required
            />
            <InputGroup
              type="text"
              label="ชื่อร้านค้า"
              id={"sellerName" + inventory.index}
              name="sellerName"
              onChange={(e) => onChange(e, index, "sellerName")}
              value={inventory.sellerName}
              required
              invalid={
                errors?.sellerName ? errors?.sellerName[inventory.index] : false
              }
            />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4 mr-6 mt-4 mb-4">
            <InputGroup
              type="text"
              label="ชื่อสามัญ"
              id={"inventoryName" + inventory.index}
              name="inventoryName"
              onChange={(e) => onChange(e, index, "inventoryName")}
              value={inventory.inventoryName}
              required
              invalid={
                errors?.inventoryName ? errors?.inventoryName[inventory.index] : false
              }
            />
            <InputGroup
              type="text"
              label="ชื่อการค้า"
              id={"inventoryTradeName" + inventory.index}
              name="inventoryTradeName"
              onChange={(e) => onChange(e, index, "inventoryTradeName")}
              value={inventory.inventoryTradeName}
              required
              invalid={
                errors?.inventoryTradeName ? errors?.inventoryTradeName[inventory.index] : false
              }
            />
          </div>
          <div className="grid grid-cols-4 md:grid-cols-1 lg:grid-cols-4 gap-4 mr-6 mt-4 mb-4">
            <InputGroup
              type="text"
              label="หน่วยนับ"
              id={"unit" + inventory.index}
              name="unit"
              onChange={(e) => onChange(e, index, "unit")}
              value={inventory.unit}
              required
              invalid={
                errors?.unit ? errors?.unit[inventory.index] : false
              }
            />
            <InputGroupMask
              type="text"
              label="ราคา/หน่วย"
              id={"pricePerUnit" + inventory.index}
              name="pricePerUnit"
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
              onChange={(e) => onChange(e, index, "pricePerUnit")}
              value={inventory.pricePerUnit}
              required
              invalid={
                errors?.pricePerUnit ? errors?.pricePerUnit[inventory.index] : false
              }
            />
            <InputGroupMask
              type="text"
              label="จำนวน"
              id={"amount" + inventory.index}
              name="amount"
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
              onChange={(e) => onChange(e, index, "amount")}
              value={inventory.amount}
              required
              invalid={
                errors?.amount ? errors?.amount[inventory.index] : false
              }
            />
            <InputSelectGroup
              type="text"
              id={"paymentType" + inventory.index}
              name="paymentType"
              label="รูปแบบการจ่าย"
              onChange={(e) => handleChange(e, index, "paymentType")}
              isSearchable
              options={renderOptions(paymentType, "value1", "code")}
              value={inventory.paymentType.code}
              invalid={
                errors?.paymentType ? errors?.paymentType[inventory.index] : false
              }
              required
            />
          </div>
          <label htmlFor="" className="block text-sm font-medium text-gray-700">อัพโหลดใบเสร็จ:</label>
          <ImageUploading
            value={images}
            onChange={(e, addUpdateIndex) => { onChangeImg(e, addUpdateIndex, index) }}
            maxNumber={maxNumber}
            dataURLKey="data_url"
            acceptType={["jpg"]}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps
            }) => (
              <div className="upload__image-wrapper ">
                <div className="flex items-center justify-center space-x-4">
                  {imageList.length <= 0 && <div className="w-100 border rounded-md" for="photo" style={{ textAlign: "center", width: "50%" }} {...dragProps}>
                    <div onClick={onImageUpload} className="icon-add-photo" style={{
                      backgroundColor: "white",
                      width: "max-content",
                      margin: "0 auto",
                      padding: "10px",
                      borderRadius: "50%"
                    }}>
                      <svg
                        width="42"
                        height="43"
                        viewBox="0 0 42 43"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M33.25 12.5413V17.8984C33.25 17.8984 29.7675 17.9163 29.75 17.8984V12.5413H24.5C24.5 12.5413 24.5175 8.97592 24.5 8.95801H29.75V3.58301H33.25V8.95801H38.5V12.5413H33.25ZM28 19.708V14.333H22.75V8.95801H8.75C6.825 8.95801 5.25 10.5705 5.25 12.5413V34.0413C5.25 36.0122 6.825 37.6247 8.75 37.6247H29.75C31.675 37.6247 33.25 36.0122 33.25 34.0413V19.708H28ZM8.75 34.0413L14 26.8747L17.5 32.2497L22.75 25.083L29.75 34.0413H8.75Z"
                          fill="#DF3062"
                        />
                      </svg>
                    </div>
                    <div style={{ color: "#344358", paddingTop: "5px", paddingBottom: "10px" }}>
                      <h3 style={{ margin: "0" }}>อัพโหลดรูปภาพ</h3>
                      <span>หรือลากไฟล์วางที่นี่</span>
                    </div>
                  </div>
                  }
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  {imageList.map((image, index) => (

                    <div key={index} className="image-item" style={{ textAlign: "center", width: "50%" }}>
                      <img src={image.data_url} alt="" width="100%" style={{ textAlign: "center" }} className="p-4 border rounded-md" />
                      <hr />
                      <div className="flex justify-between ">
                        <button
                          className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-2 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                          type="button" onClick={() => onImageUpdate(index)}>
                          <PencilIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                          แก้ไข</button>
                        <button
                          className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-2 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                          type="button" onClick={() => onImageRemove(index)}>
                          <TrashIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                          ลบ</button>
                      </div>
                    </div>

                  ))}
                </div>
              </div>
            )}
          </ImageUploading>
          <div className="grid grid-cols-ๅ md:grid-cols-1 lg:grid-cols-ๅ gap-4 mr-6 mt-4 mb-4">
            <div className="block w-full">
              <label
                htmlFor={"remark"}
                className="block text-xs font-medium text-gray-700"
              >
                {"หมายเหตุ"}
              </label>
              <textarea
                value={inventory.remark}
                onChange={(e) => onChange(e, index, "remark")}
                id="remark"
                name="remark"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
              />
            </div>
            {mode === 'create' && <label className="block text-sm font-medium text-red-700 text-center"
            >
              {"*สินค้าจะถูกเก็บเข้าคลังกลาง*"}
            </label>}
          </div>

          {mode !== 'create' && <div className="grid grid-cols-ๅ md:grid-cols-1 lg:grid-cols-ๅ gap-4 mr-6 mt-4 mb-4">
            <hr />
            <label className="block text-sm font-bold text-gary-700">กระจายสินค้า</label>
            {inventory.distribution && inventory.distribution.length <= 0 && (
              <div
                className="flex bg-blue-100 rounded-lg p-4 text-sm text-blue-700"
                role="alert"
              >
                <svg
                  className="w-5 h-5 inline mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <div>กดปุ่มเพิ่มเมื่อต้องการเพิ่มรายการกระจายสินค้า</div>
              </div>
            )}
            <ItemProduct
              loadingItem={loadingItem}
              mode={mode}
              extraProduct={inventory.distribution ? inventory.distribution : []}
              inventoryOption={branchList}
              errors={errors?.distribution ? errors?.distribution[inventory.index] : false}
              callbackProduct={(e) => callbackProduct(e, inventory.index)} />
          </div>}
        </div>
      )}
      {!querySucess && <LoadingTemplate />}
    </div>
  );
}
