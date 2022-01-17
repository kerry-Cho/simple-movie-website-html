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
    img.id = movie.id;
    content.appendChild(img);

    const h4 = document.createElement('h4');
    h4.innerText = `${movie.title}`;
    content.appendChild(h4);

    div.appendChild(content);

    a.id = movie.id;
    a.onclick = showDetail;
    a.appendChild(div);

    body[0].appendChild(a);
  });
};

const fetchMovies = () => {
  axios
    .get('/api/movie/')
    .then((response) => {
      const data = response.data;
      appendToDOM(data);
    })
    .catch((error) => {
      console.error(error);
    });
};

const createTableRow = (rowHearder, data) => {
  const tr = document.createElement('tr');
  const th = document.createElement('th');
  th.scope = 'row';
  th.innerText = `${rowHearder}`;
  tr.appendChild(th);

  const td = document.createElement('td');
  td.innerText = `${data}`;
  tr.appendChild(td);

  return tr;
};

const showDetail = async (e) => {
  const response = await axios.get(`/api/movie/${e.target.id}`);
  let body = document.getElementsByClassName('cards');
  body[0].innerHTML = '';
  body[0].className = 'movive-main';

  body = document.getElementsByClassName('movive-main');

  const imgdiv = document.createElement('div');
  imgdiv.className = 'image-container';
  const imageBox = document.createElement('div');
  imageBox.className = 'content';
  const img = document.createElement('img');
  img.src = `/api/uploads/${response.data.data.imagepath}`;
  img.alt = `${response.data.data.imagepath}`;
  imageBox.appendChild(img);
  imgdiv.appendChild(imageBox);

  body[0].appendChild(imgdiv);

  const contentdiv = document.createElement('div');

  contentdiv.className = 'container-description';

  const table = document.createElement('table');
  table.className = 'properties';
  const tbody = document.createElement('tbody');

  tbody.appendChild(createTableRow('No', response.data.data.id));
  tbody.appendChild(createTableRow('Title', response.data.data.title));
  tbody.appendChild(createTableRow('Content', response.data.data.content));
  tbody.appendChild(
    createTableRow(
      'RegistordAt',
      `${new Date(response.data.data.createdAt).toLocaleString('kr', {
        timeZone: 'asia/seoul',
      })}`,
    ),
  );

  table.appendChild(tbody);
  contentdiv.appendChild(table);

  //const ul2 = document.createElement('ul');
  //const liNo2 = document.createElement('li');
  //const liTitle2 = document.createElement('li');
  //const liDes2 = document.createElement('li');
  //const liCreateAt2 = document.createElement('li');
  //liNo2.innerText = `${response.data.data.id}`;
  //ul2.appendChild(liNo2);
  //liTitle2.innerText = `${response.data.data.title}`;
  //ul2.appendChild(liTitle2);
  //liDes2.innerText = `${response.data.data.content}`;
  //ul2.appendChild(liDes2);
  //liCreateAt2.innerText = `${new Date(
  //  response.data.data.createdAt,
  //).toLocaleString('kr', {
  //  timeZone: 'asia/seoul',
  //})}`;
  //ul2.appendChild(liCreateAt2);
  body[0].appendChild(contentdiv);
};

fetchMovies();
