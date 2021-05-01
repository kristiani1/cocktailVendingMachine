const earningsParagraph = document.querySelector("#total-earnings");

const incomeList = document.querySelector("#income-list");
const mostProfitableList = document.querySelector("#profitable-list");

const incomeTitle = document.querySelector("#income-title");
const profitableTitle = document.querySelector("#profitable-title");

fetch("/orders", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((response) => response.json())
  .then((orders) => {
    let earningsTotal = 0;
    let cocktailEarnings = [];

    orders.forEach((order) => {
      earningsTotal += order.pricePerDrink * order.amount;
      console.log("earnings", earningsTotal);
      result = cocktailEarnings.find(
        ({ cocktail }) => cocktail === order.cocktail
      );

      if (result === undefined) {
        let orderBody = {
          cocktail: order.cocktail,
          transactionTotal: order.pricePerDrink * order.amount,
        };
        cocktailEarnings.push(orderBody);
      } else if (result.cocktail === order.cocktail) {
        console.log("already on");
        const index = cocktailEarnings.findIndex(
          ({ cocktail }) => cocktail === order.cocktail
        );
        cocktailEarnings[index].transactionTotal +=
          order.pricePerDrink * order.amount;
      }
    });

    earningsParagraph.innerText = `${earningsTotal} €`;

    console.log("cocktailEarnings", cocktailEarnings);
    orders.reverse().forEach((order) => {
      const newLi = document.createElement("li");

      transactionTotal = order.pricePerDrink * order.amount;

      newLi.innerText = `+${transactionTotal} € `;

      const newSpan = document.createElement("span");
      newSpan.innerText = `  (${order.date})`;

      newLi.appendChild(newSpan);

      incomeList.appendChild(newLi);
    });

    let cocktailSpots = 3;

    const transactionTotalsMap = cocktailEarnings.map(
      (cocktail) => cocktail.transactionTotal
    );

    for (let i = 0; i <= transactionTotalsMap.length; i++) {
      if (cocktailSpots !== 0) {
        const largestNumber = Math.max(...transactionTotalsMap);
        const index = transactionTotalsMap.findIndex(
          (value) => value === largestNumber
        );
        console.log(index);

        cocktailName = cocktailEarnings[index].cocktail;

        const newLi = document.createElement("li");
        newLi.innerText = `${cocktailName} `;

        const newSpan = document.createElement("span");
        newSpan.innerText = `(Total: ${largestNumber} €)`;

        newLi.appendChild(newSpan);

        mostProfitableList.appendChild(newLi);

        cocktailSpots -= 1;

        cocktailEarnings.splice(index, 1);
        transactionTotalsMap.splice(index, 1);
      } else {
        break;
      }
    }

    incomeTitle.innerText = "Income";
    profitableTitle.innerText = "Top 3 most profitable";
  });
  