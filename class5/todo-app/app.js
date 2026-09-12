// app.js
const form = document.querySelector('#add-form');
const input = document.querySelector('#task-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#task-list');
const filters = document.querySelector('.filters');

let tasks = [];
let currentFilter = 'all'; // all / active / done

// 统一渲染：根据 currentFilter 过滤后重建列表
const render = () => {
  list.innerHTML = '';

  // 按当前过滤条件筛选
  const shown = tasks.filter(t =>
    currentFilter === 'all' ? true :
    currentFilter === 'active' ? !t.done :
    t.done
  );

  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的任务';
    list.appendChild(li);
    return;
  }

  shown.forEach(task => {
    const li = document.createElement('li');

    // 任务文本
    const span = document.createElement('span');
    span.textContent = task.text;
    li.appendChild(span);

    if (task.done) li.classList.add('done');

    // 删除按钮
    const delBtn = document.createElement('button');
    delBtn.textContent = '删除';
    delBtn.className = 'del';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止冒泡，避免触发 li 的完成切换
      tasks = tasks.filter(t => t !== task);
      render();
    });
    li.appendChild(delBtn);

    // 点击任务切换完成状态
    li.addEventListener('click', () => {
      task.done = !task.done; // 改的是数组里的对象引用
      render();
    });

    list.appendChild(li);
  });
};

// 添加功能：表单提交时新增任务
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === '') {
    tip.textContent = '任务名不能为空';
    return;
  }
  tasks.push({ text: text, done: false });
  tip.textContent = '';
  input.value = '';
  render();
});

// 过滤功能：事件委托，点击按钮切换 currentFilter
filters.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFilter = e.target.dataset.filter; // 读取 data-filter
  render();
});

// 首次渲染
render();
