window.onload = async function () {
  try {
      const response = await fetch('/emailTemplates');
      const templates = await response.json();

      const templateDropdown = document.getElementById('templateId');

      templates.forEach(template => {
          const option = document.createElement('option');
          option.value = template;
          option.textContent = template;
          templateDropdown.appendChild(option);
      });
  } catch (error) {
      console.error('Error fetching email templates:', error);
  }
};

async function sendMail() {
  try {
      const email = document.getElementById('email').value;
      const templateDropdown = document.getElementById('templateId');
      const selectedTemplate = templateDropdown.value;

      if (!email || !selectedTemplate) {
          alert('Please enter email and select a template.');
          return;
      }

      let templateId;
      if (selectedTemplate === 'Amazon') {
          templateId = 1;
      } else if (selectedTemplate === 'Netflix') {
          templateId = 2;
      } else if (selectedTemplate === 'Payment Form') {
          templateId = 3;
      } else {
          alert('Invalid template selected.');
          return;
      }

      const response = await fetch('/addTarget', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email,
              templateId,
          }),
      });

      const result = await response.json();

      alert(result.message);

      location.reload();
  } catch (error) {
      console.error('Error sending mail:', error);
  }
}