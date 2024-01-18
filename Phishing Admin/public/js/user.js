
// Sayfa yüklendiğinde rolleri getir ve dropdown'a ekle
window.onload = async function () {
try {
    const response = await fetch('/userRoles');
    const roles = await response.json();

    const roleDropdown = document.getElementById('roleDropdown');

    roles.forEach(role => {
        const option = document.createElement('option');
        option.textContent = role;
        roleDropdown.appendChild(option);
    });
} catch (error) {
    console.error('Error fetching user roles:', error);
}
};


const addUserForm = document.getElementById('addUserForm');
addUserForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const username = addUserForm.elements.username.value;
  const role = addUserForm.elements.role.value;
  const password = addUserForm.elements.password.value;

  try {
    const response = await fetch('/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, role, password }),
    });

    const newUser = await response.json();
    console.log('Yeni kullanıcı eklendi:', newUser);

    // İsteğe bağlı olarak, kullanıcı arayüzünü güncelleme veya başka işlemler gerçekleştirme

    // Örnek: Kullanıcı eklenen bilgileri gösterme
    alert('Yeni kullanıcı eklendi:\nUsername: ' + username + '\nRole: ' + role);

    // Örnek: Sayfayı yenileme
    location.reload();
  } catch (error) {
    console.error('Yeni kullanıcı eklenirken hata oluştu:', error);
    // Hata durumunu ihtiyaca göre ele alın.
  }
});

