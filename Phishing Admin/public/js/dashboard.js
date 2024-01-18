

async function fetchMostPhishedUsers(endpoint, tableId) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        const tableBody = document.getElementById(tableId);
        tableBody.innerHTML = ''; // Clear existing data in the table

        for (const row of data) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${row.EMAIL_OR_PHONE}</td><td>${await fetchSiteName(row.SITE_ID)}</td>`;
            tableBody.appendChild(tr);
        }
    } catch (error) {
        console.error('Error fetching most phished users data:', error);
    }
}

// Fetch site name based on site ID
async function fetchSiteName(siteId) {
    try {
        const siteResponse = await fetch(`/getSiteName/${siteId}`); // Adjust the endpoint accordingly
        const siteData = await siteResponse.json();
        return siteData.SITE_NAME;
    } catch (error) {
        console.error(`Error fetching site name for SITE_ID ${siteId}:`, error);
        return 'Unknown Site';
    }
}

async function fetchEngagedCategoriesCount() {
    try {
        const response = await fetch('/engagedCategoriesCount');
        const data = await response.json();

        document.getElementById('amazonCount').textContent = data.amazonCount;
        document.getElementById('netflixCount').textContent = data.netflixCount;
        document.getElementById('paymentCount').textContent = data.paymentCount;
        document.getElementById('sumCount').textContent = parseInt(data.amazonCount) + parseInt(data.netflixCount) + parseInt(data.paymentCount);

    } catch (error) {
        console.error('Error fetching engaged categories count:', error);
    }
}

async function fetchMostEngagedCategoriesCount() {
    try {
        const response = await fetch('/engagedCategoriesCount');
        const data = await response.json();

        document.getElementById('aamazonCount').textContent = data.amazonCount;
        document.getElementById('nnetflixCount').textContent = data.netflixCount;
        document.getElementById('ppaymentCount').textContent = data.paymentCount;
    } catch (error) {
        console.error('Error fetching engaged categories count:', error);
    }
}

// fetchMostPhishedUsers fonksiyonunu çağırdıktan sonra bu fonksiyonu da çağırın
window.onload = function () {
    fetchMostPhishedUsers('/mostPhishedUsers', 'mostPhishedUsersBody');
    fetchEngagedCategoriesCount(); // Yeni eklenen fonksiyonu çağırın
    fetchMostEngagedCategoriesCount();
};


