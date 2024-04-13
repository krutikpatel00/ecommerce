

export const Percentage = (TotolPrice, Price) => {
      let avereg = Price * 100 / TotolPrice
      return Math.floor(100 - avereg)
}