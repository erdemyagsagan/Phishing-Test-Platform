
    document.addEventListener('DOMContentLoaded', function () {
      const form = document.querySelector('.form');
  
      form.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const nameOnCard = document.getElementById('nameOnCard').value;
        const cardNumber = document.getElementById('number').value;
        const expiredDate = document.getElementById('date').value;
        const cvv = document.getElementById('cvv').value;
  
        // Validate form data (you might want to add more validation)
  
        // Prepare data to send
        const formData = {
          nameOnCard: nameOnCard,
          cardNumber: cardNumber,
          expiredDate: expiredDate,
          cvv: cvv,
        };
  
        // Send the data to the server
        fetch('/addPaymentTarget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            return response.text();
          })
          .then(data => {
            console.log(data); // Log the server response
            alert('Payment Successful'); // You can customize this alert
            location.reload();
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Payment Failed. Please try again.'); // You can customize this alert
          });
      });
    });

  