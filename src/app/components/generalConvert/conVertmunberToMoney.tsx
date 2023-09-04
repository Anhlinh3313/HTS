export const Money = (data: any) => {
  if (data) {
    if (typeof data == "number") {
      if (!Number.isInteger(data)) {
        data = data.toFixed(2);
      }
    }
    const str = data.toString().split(".");

    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  } else {
    return "0";
  }
};
