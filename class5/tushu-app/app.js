// app.js —— 图书收藏管理
const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#book-title');
const authorInput = document.querySelector('#book-author');
const ratingInput = document.querySelector('#book-rating');
const tip = document.querySelector('#tip');
const list = document.querySelector('#book-list');
const searchInput = document.querySelector('#search-input');

let books = [];
let searchKeyword = '';
let editingId = null; // 当前正在编辑的书的 id
let nextId = 1;

// 统一渲染：根据搜索关键词过滤后重建列表
const render = () => {
  list.innerHTML = '';

  // 查询：按书名或作者模糊匹配
  const shown = books.filter(b => {
    const kw = searchKeyword.trim().toLowerCase();
    if (kw === '') return true;
    return b.title.toLowerCase().includes(kw) || b.author.toLowerCase().includes(kw);
  });

  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = books.length === 0 ? '暂无藏书' : '没有匹配的图书';
    list.appendChild(li);
    return;
  }

  shown.forEach(book => {
    const li = document.createElement('li');

    if (book.id === editingId) {
      // 编辑态：显示输入框
      li.classList.add('edit-row');

      const titleEdit = document.createElement('input');
      titleEdit.type = 'text';
      titleEdit.value = book.title;
      titleEdit.placeholder = '书名';

      const authorEdit = document.createElement('input');
      authorEdit.type = 'text';
      authorEdit.value = book.author;
      authorEdit.placeholder = '作者';

      const ratingEdit = document.createElement('input');
      ratingEdit.type = 'number';
      ratingEdit.value = book.rating;
      ratingEdit.min = '0';
      ratingEdit.max = '10';
      ratingEdit.step = '0.1';
      ratingEdit.placeholder = '评分';

      const saveBtn = document.createElement('button');
      saveBtn.textContent = '保存';
      saveBtn.className = 'save-btn';
      saveBtn.addEventListener('click', () => {
        const newTitle = titleEdit.value.trim();
        const newAuthor = authorEdit.value.trim();
        const newRating = parseFloat(ratingEdit.value);
        if (newTitle === '') { tip.textContent = '书名不能为空'; return; }
        if (newAuthor === '') { tip.textContent = '作者不能为空'; return; }
        if (isNaN(newRating) || newRating < 0 || newRating > 10) {
          tip.textContent = '评分必须是 0-10 之间的数字'; return;
        }
        book.title = newTitle;
        book.author = newAuthor;
        book.rating = newRating;
        tip.textContent = '';
        editingId = null;
        render();
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '取消';
      cancelBtn.className = 'cancel-btn';
      cancelBtn.addEventListener('click', () => {
        editingId = null;
        tip.textContent = '';
        render();
      });

      li.appendChild(titleEdit);
      li.appendChild(authorEdit);
      li.appendChild(ratingEdit);
      li.appendChild(saveBtn);
      li.appendChild(cancelBtn);
    } else {
      // 普通态：显示信息 + 编辑/删除按钮
      const titleSpan = document.createElement('span');
      titleSpan.className = 'title';
      titleSpan.textContent = book.title;

      const authorSpan = document.createElement('span');
      authorSpan.className = 'meta';
      authorSpan.textContent = book.author;

      const ratingSpan = document.createElement('span');
      ratingSpan.className = 'rating';
      ratingSpan.textContent = '★ ' + book.rating;

      const actions = document.createElement('div');
      actions.className = 'actions';

      const editBtn = document.createElement('button');
      editBtn.textContent = '编辑';
      editBtn.className = 'edit';
      editBtn.addEventListener('click', () => {
        editingId = book.id;
        render();
      });

      const delBtn = document.createElement('button');
      delBtn.textContent = '删除';
      delBtn.className = 'del';
      delBtn.addEventListener('click', () => {
        books = books.filter(b => b.id !== book.id);
        render();
      });

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      li.appendChild(titleSpan);
      li.appendChild(authorSpan);
      li.appendChild(ratingSpan);
      li.appendChild(actions);
    }

    list.appendChild(li);
  });
};

// 添加功能：表单提交时新增图书（含输入校验）
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const ratingVal = ratingInput.value.trim();

  if (title === '') { tip.textContent = '书名不能为空'; return; }
  if (author === '') { tip.textContent = '作者不能为空'; return; }
  const rating = parseFloat(ratingVal);
  if (isNaN(rating) || rating < 0 || rating > 10) {
    tip.textContent = '评分必须是 0-10 之间的数字'; return;
  }

  books.push({ id: nextId++, title: title, author: author, rating: rating });
  tip.textContent = '';
  titleInput.value = '';
  authorInput.value = '';
  ratingInput.value = '';
  render();
});

// 查询功能：搜索框输入时实时过滤
searchInput.addEventListener('input', (e) => {
  searchKeyword = e.target.value;
  render();
});

// 首次渲染
render();
