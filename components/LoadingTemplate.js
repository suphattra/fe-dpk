import React from "react";
import Loading from "./loading";

export default function LoadingTemplate() {
  return (
    <>
      <div className="flex flex-1 items-stretch">
        <div className="relative w-0 flex-1 mr-6 border-r">
          <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 mr-6">
            <Loading />
            <Loading />
            <Loading />
            <Loading />
            <Loading />
            <Loading />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 ml-2 py-4 mr-6">
            <Loading />
            <Loading />
          </div>
        </div>
      </div>
    </>
  );
}
