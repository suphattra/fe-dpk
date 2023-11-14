import React from "react";

export default function Loading() {
  return (
    <>
      <div class="w-full h-16 border rounded-md mx-auto mt-1">
        <div class="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
         <div class="h-4 bg-gray-300 rounded w-1/3"></div>
          <div class="flex flex-col space-y-3">
            <div class="w-56 bg-gray-300 h-4 rounded-md ">
            </div>  </div>
        </div>
      </div>
    </>
  );
}
