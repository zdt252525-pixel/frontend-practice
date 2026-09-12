// app.js —— 图书收藏管理
const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#book-title');
const authorInput = document.querySelector('#book-author');
const ratingInput = document.querySelector('#book-rating');
const tip = document.querySelector('#tip');
const list = document.querySelector('#book-list');

let books = [];

// 统一渲染：根据 books 数组重建列表
const render = () => {
  list.innerHTML = '';
  if (books.length === 0) {
    const li = document.createElement('li');
    li.textContent = '暂无藏书';
    list.appendChild(li);
    return;
  }
  books.forEach(book => {
    const li = document.createElement('li');

    const titleSpan = document.createElement('span');
    titleSpan.className = 'title';
    titleSpan.textContent = book.title;

    const authorSpan = document.createElement('span');
    authorSpan.className = 'meta';
    authorSpan.textContent = book.author;

    const ratingSpan = document.createElement('span');
    ratingSpan.className = 'rating';
    ratingSpan.textContent = '★ ' + book.rating;

    li.appendChild(titleSpan);
    li.appendChild(authorSpan);
    li.appendChild(ratingSpan);
    list.appendChild(li);
  });
};

// 添加功能：表单提交时新增图书（含输入校验）
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const ratingVal = ratingInput.value.trim();

  // 输入校验
  if (title === '') {
    tip.textContent = '书名不能为空';
    return;
  }
  if (author === '') {
    tip.textContent = '作者不能为空';
    return;
  }
  const rating = parseFloat(ratingVal);
  if (isNaN(rating) || rating < 0 || rating > 10) {
    tip.textContent = '评分必须是 0-10 之间的数字';
    return;
  }

  books.push({ title: title, author: author, rating: rating });
  tip.textContent = '';
  titleInput.value = '';
  authorInput.value = '';
  ratingInput.value = '';
  render();
});

// 首次渲染
render();
