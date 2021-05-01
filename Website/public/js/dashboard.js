const socket = io();

const latestTransactions = document.querySelector("#latest-transactions-ul");
const everyCocktailSupply = document.querySelector("#cocktails-ul");

/* 
------ Start of LATEST TRANSACTIONS code ------
    */

// Fetch all the orders when logging in or navigating back to dashboard
fetch("/orders", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => {
    const transactions = res.json();
    return transactions;
  })
  .then((transactions) => {
    transactions.reverse().forEach((transaction) => {
      const newLi = document.createElement("li");

      const amountSpan = document.createElement("span");
      amountSpan.setAttribute("class", "amountBought");
      amountSpan.textContent = `-${transaction.amount} `;

      const cocktail = document.createElement("span");
      cocktail.setAttribute("class", "cocktailBought");
      cocktail.textContent = `${transaction.cocktail} `;

      const dateBought = document.createElement("span");
      dateBought.setAttribute("class", "date");
      dateBought.textContent = `${transaction.date}`;

      newLi.appendChild(amountSpan);
      newLi.appendChild(cocktail);
      newLi.appendChild(dateBought);

      latestTransactions.appendChild(newLi);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// When new order is added the website is updated in real time by using socket io
socket.on("latestTransaction", (newTransaction) => {
  const newLi = document.createElement("li");

  const amountSpan = document.createElement("span");
  amountSpan.setAttribute("class", "amountBought");
  amountSpan.textContent = `-${newTransaction.amount} `;

  const cocktail = document.createElement("span");
  cocktail.setAttribute("class", "cocktailBought");
  cocktail.textContent = `${newTransaction.cocktail} `;

  const dateBought = document.createElement("span");
  dateBought.setAttribute("class", "date");
  dateBought.textContent = `${newTransaction.date}`;

  newLi.appendChild(amountSpan);
  newLi.appendChild(cocktail);
  newLi.appendChild(dateBought);

  latestTransactions.insertAdjacentElement("afterbegin", newLi);
});

/* 
------ End of LATEST TRANSACTIONS code ------------------------------------------------------------------------
    */

/* 
------ Start of INVENTORY TRACKING code ------
    */

const totalDrinks = document.querySelector("#total-drinks");
let inventory = 0;

fetch("/supply", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => {
    const currentSupply = res.json();
    return currentSupply;
  })
  .then((currentSupply) => {
    currentSupply.forEach((cocktailSupply) => {
      inventory += cocktailSupply.supplyLeft;
      totalDrinks.textContent = inventory;

      const newLi = document.createElement("li");

      const cocktail = document.createElement("span");
      cocktail.textContent = `${cocktailSupply.cocktail} `;
      cocktail.setAttribute("class", "cocktailInSupply");

      const br = document.createElement("br");

      const supplyLeft = document.createElement("span");
      supplyLeft.textContent = `${cocktailSupply.supplyLeft} `;
      supplyLeft.setAttribute("class", "amountSupply");
      const cocktailTrimmed = cocktailSupply.cocktail
        .split(" ")
        .join("")
        .split("'")
        .join("")
        .toLowerCase();
      supplyLeft.setAttribute("id", cocktailTrimmed);

      if (cocktailSupply.supplyLeft >= 10) {
        supplyLeft.setAttribute("style", "color: #05FF00;");
      } else if (
        cocktailSupply.supplyLeft > 0 &&
        cocktailSupply.supplyLeft < 10
      ) {
        supplyLeft.setAttribute("style", "color: #FF6B00;");
      } else {
        supplyLeft.setAttribute("style", "color: #FF0000;");
      }

      newLi.appendChild(cocktail);
      newLi.appendChild(br);
      newLi.appendChild(supplyLeft);

      everyCocktailSupply.insertAdjacentElement("afterbegin", newLi);
    });
  })
  .catch((err) => {
    console.log(err);
  });

socket.on("supplyUpdate", (latestPurchase) => {
  totalDrinks.textContent =
    parseInt(totalDrinks.textContent) - latestPurchase.amount;
    
  cocktailNameTrimmed = latestPurchase.cocktail
    .split(" ")
    .join("")
    .split("'")
    .join("")
    .toLowerCase();

  const cocktailTarget = document.querySelector(`#${cocktailNameTrimmed}`);
  cocktailTarget.textContent =
    parseInt(cocktailTarget.textContent) - latestPurchase.amount;

  if (parseInt(cocktailTarget.textContent) === 0) {
    cocktailTarget.setAttribute("style", "color: #FF0000;");
  }
});
