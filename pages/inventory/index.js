import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { convertFilter, isEmpty } from "../../helpers/utils";
import Layout from "../../layouts";
import { MasterService } from "../api/master.service";
import SearchTimeSheet from "../../components/time-sheet/SearchTimeSheet";
import ResultTimeSheet from "../../components/time-sheet/ResultTimeSheet";
import Breadcrumbs from "../../components/Breadcrumbs";
import moment from "moment";
import SearchInventory from "../../components/inventory/SearchInventory";
import ResultInventory from "../../components/inventory/ResultInventory";
import { InventoryService } from "../api/inventory.service";
LoadingOverlay.propTypes = undefined;
const initial = {
  search: {
    inventoryCode: "",
    importDateFrom: "",
    importDateTo: "",
    desc: "DESC",
    sort: "updatedDate",
    limit: 10,
    offset: 0,
    status: 'Active',
  },
  jobList: [],
};
export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const [searchParam, setSearchParam] = useState(initial.search);
  const [inventoryList, setInventoryList] = useState(initial.jobList);
  const [inventoryListExcel, setInventoryListExcel] = useState(
    initial.jobList
  );
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const breadcrumbs = [
    { index: 1, href: "/inventory", name: "สินค้า & ทรัพย์สิน" },
  ];
  const [paramSearch, setParamSearch] = useState({});
  useEffect(() => {
    async function fetchData() {
      await getInvenrotyList(searchParam);
      await getInvenrotyListReport(searchParam);
    }
    fetchData();
  }, []);
  const handleReset = async () => {
    setSearchParam(initial.search);
    setInventoryList([]);
    setInventoryListExcel([]);
    setCurrentPage(1);
    getInvenrotyList(initial.search);
    getInvenrotyListReport(initial.search);
  };
  const handleChange = (evt) => {
    const { name, value, checked, type } = evt.target;
    if (name === "dates") {
      if (!isEmpty(value.startDate)) {
        setSearchParam((data) => ({
          ...data,
          ["importDateFrom"]: value.startDate,
        }));
      } else {
        setSearchParam((data) => ({ ...data, ["importDateFrom"]: "" }));
      }
      if (!isEmpty(value.endDate)) {
        setSearchParam((data) => ({
          ...data,
          ["importDateTo"]: value.endDate,
        }));
      } else {
        setSearchParam((data) => ({ ...data, ["importDateTo"]: "" }));
      }
    } else {
      setSearchParam((data) => ({ ...data, [name]: value }));
    }
  };
  const parstFilter = async () => {
    let param = {};
    console.log("searchParam", searchParam);
    if (searchParam.inventoryCode) {
      param.inventoryCode = searchParam.inventoryCode;
    }
    if (searchParam.inventoryName) {
      param.inventoryName = searchParam.inventoryName;
    }
    if (searchParam.importDateFrom) {
      param.importDateFrom = searchParam.importDateFrom;
    }
    if (searchParam.importDateTo) {
      param.importDateTo = searchParam.importDateTo;
    }
    if (searchParam.status) {
      param.status = searchParam.status;
    }
    if (searchParam.inventoryType) {
      let split = "";
      searchParam.inventoryType.map((ele) => {
        split += ele.value + "|";
      });
      param.inventoryType = split;
    }
    if (searchParam.paymentType) {
      let split = "";
      searchParam.paymentType.map((ele) => {
        split += ele.value + "|";
      });
      param.paymentType = split;
    }
    param.limit = 10
    param.offset = 0
    return param
  }
  const handleSearch = async () => {
    let param = await parstFilter(searchParam)
    setCurrentPage(1);
    // setParamSearch(param);
    console.log(param);
    getInvenrotyList(param);
    getInvenrotyListReport(param);
  };
  const getInvenrotyList = async (searchParam) => {
    setLoading(true);
    let param = convertFilter(searchParam);
    await InventoryService.getInventoryList(param)
      .then((res) => {
        if (res.data.resultCode === 200) {
          setInventoryList(res.data.resultData);
          setTotal(res.data.total);
        } else {
          setInventoryList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("==> list job3");
        setLoading(false);
      });
  };
  const getInvenrotyListReport = async (searchParam) => {
    setLoading(true);
    let param = convertFilter(searchParam);
    param.limit = 100000;
    await InventoryService.getInventoryList(param)
      .then((res) => {
        if (res.data.resultCode === 200) {
          setInventoryListExcel(res.data.resultData);
          setTotal(res.data.total);
        } else {
          setInventoryListExcel([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("==> list job3");
        setLoading(false);
      });
  };
  const paginate = async (pageNumber) => {
    setCurrentPage(pageNumber);
    setSearchParam((data) => ({ ...data, offset: 10 * (pageNumber - 1) }));
    let param = await parstFilter(searchParam)
    getInvenrotyList({ ...param, offset: 10 * (pageNumber - 1) });
  };
  const onsort = async (sort, desc) => {
    setSearchParam((data) => ({
      ...data,
      sort: sort,
      desc: desc ? "DESC" : "ASC",
    }));
    let param = await parstFilter(searchParam)
    getInvenrotyList({
      ...param,
      sort: sort,
      desc: desc ? "DESC" : "ASC",
    });
  };
  return (
    <>
      <Layout>
        <LoadingOverlay
          active={loading}
          className="h-[calc(100vh-4rem)]"
          spinner
          text="Loading..."
          styles={{
            overlay: (base) => ({
              ...base,
              background: "rgba(215, 219, 227, 0.6)",
            }),
            spinner: (base) => ({ ...base }),
            wrapper: {
              overflowY: loading ? "scroll" : "scroll",
            },
          }}
        >
          <Breadcrumbs
            title="สินค้า & ทรัพย์สิน"
            breadcrumbs={breadcrumbs}
          ></Breadcrumbs>
          <SearchInventory
            handleReset={handleReset}
            handleChange={handleChange}
            searchParam={searchParam}
            handleSearch={handleSearch}
            inventoryList={inventoryListExcel}
          />
          <ResultInventory
            inventoryList={inventoryList}
            total={total}
            paginate={paginate}
            currentPage={currentPage}
            onSort={onsort}
            callBack={handleSearch}
          />
        </LoadingOverlay>
      </Layout>
    </>
  );
}
