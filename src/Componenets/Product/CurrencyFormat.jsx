{/* <CurrencyFormat
  value={total}
  displayType={"text"}
  decimalScale={"2"}
  thousandSeparator={true}
  prefix={"$"}
  renderText={(value) => <p>{value}</p>}
/>; */}


function CurrencyFormat({ amount }) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return <div>{formattedAmount}</div>;
}

export default CurrencyFormat;

