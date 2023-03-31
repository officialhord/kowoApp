
export default function Currency({ amount = "" }) {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (numberWithCommas(amount));
}