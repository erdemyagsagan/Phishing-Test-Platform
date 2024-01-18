window.onload = async function () {
  try {
      const amazonResponse = await fetch('/getContent/1');
      const netflixResponse = await fetch('/getContent/2');
      const paymentResponse = await fetch('/getContent/3');

      const amazonContent = await amazonResponse.json();
      const netflixContent = await netflixResponse.json();
      const paymentContent = await paymentResponse.json();

      document.getElementById('amazonContent').innerText = amazonContent;
      document.getElementById('netflixContent').innerText = netflixContent;
      document.getElementById('paymentContent').innerText = paymentContent;
  } catch (error) {
      console.error('Error fetching template content:', error);
  }
};

async function updateTemplates() {
  try {
      const amazonContent = document.getElementById('amazonContent').innerText;
      const netflixContent = document.getElementById('netflixContent').innerText;
      const paymentContent = document.getElementById('paymentContent').innerText;

      const amazonUpdate = await fetch('/updateTemplateContent', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              templateId: 1,
              content: amazonContent,
          }),
      });

      const netflixUpdate = await fetch('/updateTemplateContent', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              templateId: 2,
              content: netflixContent,
          }),
      });

      const paymentUpdate = await fetch('/updateTemplateContent', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              templateId: 3,
              content: paymentContent,
          }),
      });

      const amazonResult = await amazonUpdate.json();
      const netflixResult = await netflixUpdate.json();
      const paymentResult = await paymentUpdate.json();

      alert(amazonResult.message);
      alert(netflixResult.message);
      alert(paymentResult.message);
  } catch (error) {
      console.error('Error updating templates:', error);
  }
}