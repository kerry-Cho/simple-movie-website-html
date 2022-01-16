const appendToDOM = (movies) => {
  const body = document.getElementsByClassName('cards');
  movies.data.map((movie) => {
    const a = document.createElement('a');
    const div = document.createElement('div');
    div.className = 'column cars show';

    const content = document.createElement('div');
    content.className = 'content';

    const img = document.createElement('img');
    img.className = 'image';
    img.src = `/api/uploads/${movie.imagepath}`;
    img.alt = `${movie.imagepath}`;
    content.appendChild(img);

    const h4 = document.createElement('h4');
    h4.innerText = `${movie.title}`;
    content.appendChild(h4);

    div.appendChild(content);

    a.href = `info/${movie.id}`;
    a.appendChild(div);

    body[0].appendChild(a);
  });
};

const fetchUsers = () => {
  axios
    .get('/api/movie/')
    .then((response) => {
      const data = response.data;
      // append to DOM
      appendToDOM(data);
    })
    .catch((error) => {
      console.error(error);
    });
};

fetchUsers();
