import React from "react";

const FormatCurrency = ({ value, removeDecimals = false }) => {
  const formatCurrency = (value) => {
    let formattedValue = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    })
      .format(value)
      .replace("Rp", "Rp. ")
      .replace(/,00$/, "");

    return formattedValue;
  };

  return <span>{formatCurrency(value)}</span>;
};

export default FormatCurrency;
