import { CheckIcon, EyeIcon } from "@heroicons/react/24/outline";
import Router, { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Pagination from "../Pagination";
import ModalUpdateEmployee from "./ModalUpdateEmployee";
import moment from "moment";
import { BarsArrowDownIcon, BarsArrowUpIcon } from "@heroicons/react/20/solid";
import ModalUpdateFinancialsEmployee from "./ModalUpdateFinancialsEmployee";

export default function ResultEmployeeFinancials({
  employeesFinancialsList,
  total,
  currentPage,
  paginate,
  callBack,
  onSort,
}) {
  const router = useRouter();
  const [sort, setSort] = useState(true);
  const [open, setOpen] = useState(false);
  const [showModalDetialEmp, setShowModalDetialEmp] = useState(false);
  const [employeeDetail, setEmployeeDetail] = useState({});
  const openPopup = async () => {
    setOpen(true);
  };

  const onChangeStatus = async (status) => {
    if (status === "Ok") {
      console.log("OK");
    } else {
      setOpen(false);
    }
  };
  const onSetOpenModalEdit = (value) => {
    setShowModalDetialEmp(value);
  };
  const sortTable = async (name) => {
    onSort(name, sort);
  };
  return (
    <div className="md:container md:mx-auto">
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="text-center py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      <div
                        class="flex items-center cursor-pointer"
                        onClick={() => {
                          sortTable("financialType.code");
                          setSort(!sort);
                        }}
                      >
                        {" "}
                        ประเภท
                        {sort ? (
                          <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" />
                        ) : (
                          <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      <div
                        class="flex items-center cursor-pointer"
                        onClick={() => {
                          sortTable("financialTopic.code");
                          setSort(!sort);
                        }}
                      >
                        {" "}
                        รายการ
                        {sort ? (
                          <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" />
                        ) : (
                          <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      <div
                        class="flex items-center cursor-pointer"
                        onClick={() => {
                          sortTable("amount");
                          setSort(!sort);
                        }}
                      >
                        {" "}
                        จำนวน
                        {sort ? (
                          <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" />
                        ) : (
                          <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      <div
                        class="flex items-center cursor-pointer"
                        onClick={() => {
                          sortTable("remark");
                          setSort(!sort);
                        }}
                      >
                        {" "}
                        หมายเหตุ
                        {sort ? (
                          <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" />
                        ) : (
                          <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      <div
                        class="flex items-center cursor-pointer"
                        onClick={() => {
                          sortTable("updatedDate");
                          setSort(!sort);
                        }}
                      >
                        {" "}
                        วันเดือนปี
                        {sort ? (
                          <BarsArrowUpIcon className="w-3 h-3 ml-1.5 mt-1" />
                        ) : (
                          <BarsArrowDownIcon className="w-3 h-3 ml-1.5 mt-1" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    ></th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employeesFinancialsList?.map((employees) => (
                    <tr>
                      <td className="whitespace-nowrap  py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {employees.financialType?.value1}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {employees.financialTopic?.value1}
                      </td>
                      <td className="whitespace-nowrap  px-3 py-4 text-sm text-gray-500">
                        {employees?.amount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {employees?.remark}
                      </td>
                      <td className="whitespace-nowrap  px-3 py-4 text-sm text-gray-500">
                        {employees.transactionDate ? moment(employees.transactionDate).format('DD/MM/YYYY') : ""}
                      </td>

                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => {
                            onSetOpenModalEdit(true);
                            setEmployeeDetail(employees);
                          }}
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                          />
                        </svg>
                        <span className="sr-only">, </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              totalPosts={total}
              currentPage={currentPage}
              postsPerPage={10}
              paginate={paginate}
              lengthList={employeesFinancialsList}
            />
          </div>
        </div>
        {showModalDetialEmp && (
          <ModalUpdateFinancialsEmployee
            open={showModalDetialEmp}
            setOpen={onSetOpenModalEdit}
            mode={"edit"}
            callbackLoad={callBack}
            _id={employeeDetail._id}
          />
        )}
        <Transition.Root show={open}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Confirm
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Do you want to change status driver?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                        onClick={() => {
                          onChangeStatus("Ok");
                        }}
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={() => {
                          onChangeStatus("Cancel");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  );
}
