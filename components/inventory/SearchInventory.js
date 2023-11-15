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
}) {
  const router = useRouter();
  const [paymentType, setPaymentType] = useState([]);
  const [employeesOption, setEmployeesOption] = useState([]);
  const [inventoryType, setInventoryType] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await getConfig("PAYMENT_TYPE");
      await getConfig("INVENTORY_TYPE");
      await getInventoryList();
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
  const getInventoryList = async () => {
    await InventoryService.getInventoryList()
      .then((res) => {
        if (res.data.resultCode === 200) {
          setEmployeesOption(res.data.resultData);
        } else {
          setEmployeesOption([]);
        }
      })
      .catch((err) => { });
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
      { title: "ชื่อ", style: styleHeader },
      { title: "ประเภท", style: styleHeader },
      { title: "หน่วย", style: styleHeader },
      { title: "รูปแบบการจ่ายเงิน", style: styleHeader },
      { title: "จำนวนคงเหลือ", style: styleHeader },
      { title: "นำเข้าล่าสุด", style: styleHeader },
      { title: "หมายเหตุ", style: styleHeader },
    ];
    let dataRecord = [];
    if (inventoryList && inventoryList.length > 0) {
      dataRecord = inventoryList.map((item, index) => {
        return [
          { value: index + 1, style: styleData },
          { value: item.inventoryCodee ? item.inventoryCode : "" },
          {
            value: item.inventoryName ? item.inventoryName : "",
          },
          { value: item.inventoryType.value1 ? item.inventoryType.value1 : "" },
          { value: item.unit ? item.unit : "" },
          {
            value: item.paymentType.value1 ? item.paymentType.value1 : "",
            style: styleData,
          },
          { value: item.amount ? item.amount : "" },
          {
            value: item.importDate
              ? moment(item.importDate).format("DD/MM/YYYY")
              : "",
          }, { value: item.remark ? item.remark : "" },
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
              name="สร้างรายงาน"
              filename="รายงานสินค้า & ทรัพย์สิน"
            />
          )}
          <button
            type="button"
            onClick={() => {
              router.push("inventory/detail");
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
