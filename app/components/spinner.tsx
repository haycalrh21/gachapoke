"use client";
import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center ">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="4" // Ubah menjadi lebih kecil
        animationDuration="0.75"
        width="48" // Ubah ukuran menjadi lebih kecil
        visible={true}
      />
    </div>
  );
};

export default Spinner;
