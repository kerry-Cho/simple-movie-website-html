const updateFile = async (name, description, formData) => {
  try {
    const response = await fetch('api/uploads', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    const sendData = {
      title: name,
      content: description,
      imagepath: data.filename,
    };
    const movie = await fetch('/api/movie', {
      method: 'POST',
      body: JSON.stringify(sendData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.log(err);
  }
};

window.onload = function () {
  document.getElementById('onFileUpload').onclick = function (e) {
    const name = document.getElementById('inputmoive').value;
    const description = document.getElementById('inputdescription').value;
    if (!name || !description) {
      alert('name or description empyty');
      return;
    }
    let img = document.getElementById('thumbnail').files[0];
    let formData = new FormData();
    formData.append('file', img);
    onSumit(name, description, formData);

    e.preventDefault();
  };
};

function onSumit(name, description, formData) {
  updateFile(name, description, formData);
}
