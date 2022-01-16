const updateFile = async (name, description, formData) => {
  try {
    const file = await axios.post('/api/uploads', formData);
    const response = await axios.post('/api/movie', {
      title: name,
      content: description,
      imagepath: file.data.filename,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    location.reload();
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
