import React from "react";
import { useRouter } from "next/router";
import {
  CardBasic,
  InputGroup,
  InputSelectGroup,
  InputGroupDate,
  InputGroupMultipleDate,
} from "../../components";
import { renderOptions } from "../../helpers/utils";
import { MasterService } from "../../pages/api/master.service";
import { useEffect, useState } from "react";
import moment from "moment";
import DownloadExcel from "../DownloadExcel";
import { InventoryService } from "../../pages/api/inventory.service";
export default function SearchInventory({
  handleSearch,
  handleReset,
  handleChange,
  searchParam,
  inventoryList,
  generateReport
}) {
  const router = useRouter();
  const [paymentType, setPaymentType] = useState([]);
  const [inventoryType, setInventoryType] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await getConfig("PAYMENT_TYPE");
      await getConfig("INVENTORY_TYPE");
    }
    fetchData();
  }, []);
  useEffect(() => {
    initExport();
  }, [inventoryList]);
  const getConfig = async (configCategory) => {
    let paramquery = {
      type: "INVENTORY",
      subType: configCategory,
    };
    await MasterService.getConfig(paramquery)
      .then((res) => {
        if (res.data.resultCode === 200) {
          if (configCategory === "PAYMENT_TYPE")
            setPaymentType(res.data.resultData);
          if (configCategory === "INVENTORY_TYPE")
            setInventoryType(res.data.resultData);
        } else {
          if (configCategory === "PAYMENT_TYPE") setPaymentType([]);
          if (configCategory === "INVENTORY_TYPE") setInventoryType([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const initExport = async () => {
    const styleHeader = {
      fill: { fgColor: { rgb: "6aa84f" } },
      font: { bold: true },
      alignment: { horizontal: "center" },
    };
    const styleData = {
      font: { bold: false },
      alignment: { horizontal: "center" },
    };
    const column = [
      { title: 'ลำดับ', style: styleHeader },
      { title: "รหัส", style: styleHeader },
      { title: "วันที่นำเข้า", style: styleHeader },
      { title: "ชื่อร้านค้า", style: styleHeader },
      { title: "รูปแบบการจ่ายเงิน", style: styleHeader },
      { title: "ประเภท", style: styleHeader },
      { title: "ชื่อการค้า", style: styleHeader },
      { title: "หน่วย", style: styleHeader },
      { title: "ราคา/หน่วย", style: styleHeader },
      { title: "จำนวนนำเข้า", style: styleHeader },
      { title: "จำนวนบาท", style: styleHeader },
      { title: "หมายเหตุ", style: styleHeader },
      { title: "ผู้นำเข้าระบบ (Admin)", style: styleHeader },
      // { title: "รูปแบบการจ่ายเงิน", style: styleHeader },

    ];
    let dataRecord = [];
    if (inventoryList && inventoryList.length > 0) {
      dataRecord = inventoryList.map((item, index) => {
        return [
          { value: index + 1, style: styleData },
          { value: item.inventoryCode ? item.inventoryCode : "" },
          { value: item.importDate ? moment(item.importDate).format("DD/MM/YYYY") : "" },
          { value: item.sellerName ? item.sellerName : "", },
          { value: item.paymentType.value1 ? item.paymentType.value1 : "" },
          { value: item.inventoryType.value1 ? item.inventoryType.value1 : "" },
          { value: item.inventoryTradeName ? item.inventoryTradeName : "" },
          { value: item.unit ? item.unit : "" },
          { value: item.pricePerUnit ? parseInt(item.pricePerUnit) : "" },
          { value: item.amount },//ต้อง join จาก history
          { value: parseInt(item.amount) * parseInt(item.pricePerUnit) },
          { value: item.remark ? item.remark : "" },
          { value: item.createdBy ? item.createdBy : "" },
        ];
      });
    }
    let multiDataSet = [];

    if (dataRecord.length > 0) {
      multiDataSet = [
        {
          columns: column,
          data: dataRecord,
        },
      ];
    }
    setReportData(multiDataSet);
  };

  return (
    <>
      <div className="md:container md:mx-auto">
        <div
          className="flex justify-end w-full max-w-screen pt-4"
          aria-label="Breadcrumb"
        >
          {reportData.length > 0 && (
            <DownloadExcel
              reportData={reportData}
              name="ดาวน์โหลดรายงาน"
              filename="รายงานสินค้าคงคลัง"
            />
          )}
          {reportData.length <= 0 && (<button
            type="button"
            onClick={generateReport}
            className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2 disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500"
          >  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 48 48" className='mr-2'>
              <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
            </svg>
            สร้างรายงาน
          </button>
          )}
          < button
            type="button"
            onClick={() => {
              router.push("inventory/detail?mode=create");
            }}
            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
          >
            เพิ่มสินค้า
          </button>
        </div>
        <CardBasic>
          <div className="flex justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
            <InputGroup
              type="text"
              id="inventoryName"
              name="inventoryName"
              label="ชื่อ"
              value={searchParam.inventoryName}
              onChange={handleChange}
            />
            <InputGroup
              type="text"
              id="inventoryCode"
              name="inventoryCode"
              label="รหัส"
              value={searchParam.inventoryCode}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
            <InputSelectGroup
              type="text"
              id="inventoryType"
              name="inventoryType"
              label="ประเภท"
              isMulti
              isSearchable
              options={renderOptions(
                inventoryType,
                "value1", "code"
              )}
              value={searchParam.inventoryType}
              onChange={handleChange}
              placeholder="ทั้งหมด"
            />
            <InputSelectGroup
              type="text"
              id="paymentType"
              name="paymentType"
              label="รูปแบบการจ่าย"
              options={renderOptions(paymentType, "value1", "code")}
              isMulti
              isSearchable
              value={searchParam.paymentType}
              placeholder="ทั้งหมด"
              onChange={handleChange}
            />
            <InputGroupMultipleDate
              type="text"
              id="dates"
              name="dates"
              label="วันที่นำเข้า"
              onChange={handleChange}
              startDate={
                searchParam.importDateFrom ? searchParam.importDateFrom : ""
              }
              endDate={searchParam.importDateTo ? searchParam.importDateTo : ""}
              format="YYYY-MM-DD"
            />
          </div>
          <div className="flex justify-center items-center overflow-y-auto p-4">
            <button
              type="button"
              className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
              onClick={handleReset}
            >
              ล้าง
            </button>
            <button
              type="button"
              className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleSearch}
            >
              ค้นหา
            </button>
          </div>
        </CardBasic>
      </div>
    </>
  );
}
