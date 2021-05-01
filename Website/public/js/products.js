const productsTable = document.querySelector("#products-table");

fetch("/supply", { method: "GET" })
  .then((response) => {
    return response.json();
  })
  .then((supplies) => {
    supplies.forEach((supply) => {
      const newTr = document.createElement("tr");

      const tdProduct = document.createElement("td");
      tdProduct.textContent = supply.cocktail;

      const tdSupply = document.createElement("td");
      tdSupply.textContent = `${supply.supplyLeft} servings`;

      if (supply.supplyLeft >= 10) {
        tdSupply.style = "color: #05FF00;";
      } else if (supply.supplyLeft < 10 && supply.supplyLeft > 0) {
        tdSupply.style = "color: #FF6B00;";
      } else {
        tdSupply.style = "color: #FF0000;";
      }

      const tdPrice = document.createElement("td");
      tdPrice.textContent = `${supply.pricePer250ml} €`;

      const tdRedBlink = document.createElement("td");
      tdRedBlink.textContent = `${supply.redBlinks}x blinks`;

      const tdGreenBlink = document.createElement("td");
      tdGreenBlink.textContent = `${supply.greenBlinks}x blinks`;

      const tdBlueBlink = document.createElement("td");
      tdBlueBlink.textContent = `${supply.blueBlinks}x blinks`;

      const tdDelete = document.createElement("td");

      const ButtonDelete = document.createElement("button");
      ButtonDelete.id = supply.cocktail;
      ButtonDelete.className = "delete-btn";
      ButtonDelete.addEventListener("click", function () {
        if (confirm("Are you sure?")) {
          const newbody = { cocktail: supply.cocktail };
          fetch("/supply", {
            method: "DELETE",
            body: JSON.stringify(newbody),
            headers: { "Content-Type": "application/json" },
          }).then(() => {
            location.reload();
          });
        }
      });

      tdDelete.appendChild(ButtonDelete);

      const tdModify = document.createElement("td");

      const modifyButton = document.createElement("button");
      modifyButton.type = "button";
      modifyButton.className = "modify-btn";

      tdModify.appendChild(modifyButton);
      newTr.appendChild(tdProduct);
      newTr.appendChild(tdSupply);
      newTr.appendChild(tdPrice);
      newTr.appendChild(tdRedBlink);
      newTr.appendChild(tdGreenBlink);
      newTr.appendChild(tdBlueBlink);
      newTr.appendChild(tdDelete);
      newTr.appendChild(tdModify);

      modifyButton.addEventListener("click", (e) => {
        for (let i = 0; i < 6; i++) {
          const newInput = document.createElement("input");
          if (i >= 1 && i <= 5) {
            newInput.type = "number";
            newInput.value = parseInt(newTr.childNodes[i].textContent);

            newTr.childNodes[i].textContent = "";
            newTr.childNodes[i].appendChild(newInput);
          } else {
            newInput.value = newTr.childNodes[i].textContent;

            newTr.childNodes[i].textContent = "";
            newTr.childNodes[i].appendChild(newInput);
          }
        }

        if (newTr.childNodes[7].childNodes.length === 1) {
          const modifyButton = newTr.childNodes[7].childNodes[0];
          modifyButton.remove();

          const submitButton = document.createElement("button");
          submitButton.textContent = "Submit";
          submitButton.className = "submit-btn";
          newTr.childNodes[7].appendChild(submitButton);

          submitButton.addEventListener("click", () => {
            const newBody = {
              oldCocktailName: supply.cocktail,
              cocktail: newTr.childNodes[0].childNodes[0].value,
              supplyLeft: newTr.childNodes[1].childNodes[0].value,
              pricePer250ml: newTr.childNodes[2].childNodes[0].value,
              redBlinks: newTr.childNodes[3].childNodes[0].value,
              greenBlinks: newTr.childNodes[4].childNodes[0].value,
              blueBlinks: newTr.childNodes[5].childNodes[0].value,
            };
            fetch("/supply", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newBody),
            })
              .then((res) => {
                return res.json();
              })
              .then((resJson) => {
                console.log(resJson);
              })
              .then(() => {
                location.reload();
              });
          });
        }
      });

      productsTable.appendChild(newTr);
    });
    const hasLoaded = document.querySelector("#hasLoaded");
    hasLoaded.remove();
  });

const addBtn = document.querySelector("#add-btn");

addBtn.addEventListener("click", () => {
  const productName = document.querySelector("#product-name");
  const productSupply = document.querySelector("#product-supply");
  const productPrice = document.querySelector("#product-price");

  if (productName.value === "") {
    return alert("You need to specify the name of the cocktail!");
  } else if (productSupply.value === "") {
    return alert("You need to add the number of supplies");
  } else if (productPrice.value === "") {
    return alert("You need to specify the price!");
  }

  const redBlinks = prompt(
    "Specify the number of times the red led should blink:"
  );
  const greenBlinks = prompt(
    "Specify the number of times the green led should blink:"
  );
  const blueBlinks = prompt(
    "Specify the number of times the blue led should blink:"
  );

  const newSupply = {
    cocktail: productName.value,
    supplyLeft: productSupply.value,
    pricePer250ml: productPrice.value,
    redBlinks: parseInt(redBlinks),
    greenBlinks: parseInt(greenBlinks),
    blueBlinks: parseInt(blueBlinks),
  };

  fetch("/supply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSupply),
  })
    .then((response) => {
      return response.json();
    })
    .then((addedSupply) => {
      return alert(`'${addedSupply.cocktail}' has been added!`);
    })
    .then(() => {
      location.reload();
    })
    .catch((e) => {
      console.log("Error:", e);
    });
});
