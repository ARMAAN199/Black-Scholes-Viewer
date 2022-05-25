// import("black-scholes").then(function(bs) {
//     bsval = bs.blackScholes(30, 34, .25, .2, .08, "call");
//     console.log(bsval)
// }).catch(function(err) {
//     console.log(err);
// });
bsval = blackScholes(30, 34, .25, .2, .08, "call");
console.log(bsval)

class TableCsv {

    constructor(root) {
      this.root = root;
    }

    spaces = [" "," "," "]
    additional_headers = ['CE_DELTA', 'CE_GAMMA', 'CE_IV'];
    strike_price_index = 0
    ltp_index = 0
    ask_price_index = 0
    ce_delta_index = 0
    ce_gamma_index = 0
    ce_iv_index = 0
  
    /**
     * Clears existing data in the table and replaces it with new data.
     *
     * @param {string[][]} data A 2D array of data to be used as the table body
     * @param {string[]} headerColumns List of headings to be used
     */
    update(data, headerColumns = []) {
    console.log(data);
    console.log(headerColumns);
    this.root.innerHTML = "";
    // headerColumns = headerColumns + this.additional_headers;
    headerColumns.push(this.spaces)
    data[0] = data[0].concat(this.additional_headers)
    for(let i =0; i<data[0].length; i++) {
        if (data[0][i] == 'STRIKE PRICE') {
            this.strike_price_index = i
        }
        if (data[0][i] == 'LTP') {
            this.ltp_index = i
        }
        if (data[0][i] == 'ASK PRICE') {
            this.ask_price_index = i
        }
        if (data[0][i] == 'CE_DELTA') {
            this.ce_delta_index = i
        }
        if (data[0][i] == 'CE_GAMMA') {
            this.ce_gamma_index = i
        }
        if (data[0][i] == 'CE_IV') {
            this.ce_iv_index = i
        }
    }
    console.log(this.strike_price_index, this.ltp_index, this.ask_price_index)
    // data[0].push(...this.additional_headers)
    console.log(headerColumns);
      this.setHeader(headerColumns);
      this.setBody(data);
    }
  



    setHeader(headerColumns) {
      this.root.insertAdjacentHTML(
        "afterbegin",
        `
              <thead>
                  <tr>
                      ${headerColumns.map((text) => `<th>${text}</th>`).join("")}
                  </tr>
              </thead>
          `
      );
    }
  

    setBody(data) {
      const rowsHtml = data.map((row, index) => {
        if(index != 0)
        row = row.concat(this.spaces)
        return `
                  <tr>
                      ${row.map((text) => `<td>${text}</td>`).join("")}
                  </tr>
              `;
      });
  
      this.root.insertAdjacentHTML(
        "beforeend",
        `
              <tbody>
                  ${rowsHtml.join("")}
              </tbody>
          `
      );
    }
  }
  
  const tableRoot = document.querySelector("#csvRoot");
  const csvFileInput = document.querySelector("#csvFileInput");
  const tableCsv = new TableCsv(tableRoot);
  
  csvFileInput.addEventListener("change", (e) => {
    gobuttonclicked();
  });

  function gobuttonclicked(){
    Papa.parse(csvFileInput.files[0], {
        delimiter: ",",
        skipEmptyLines: true,
        complete: (results) => {
            // console.log(results.data[4][3]);
          tableCsv.update(results.data.slice(1), results.data[0]);
        }
      });
  }

