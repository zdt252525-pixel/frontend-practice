// ========== 第一步：定义课程成绩数据（输入） ==========
const courses = [
  { name: '高等数学', credit: 5, score: 92 },
  { name: '大学英语', credit: 3, score: 78 },
  { name: '数据结构', credit: 4, score: 85 },
  { name: '体育',     credit: 1, score: 90 },
  { name: '思想道德', credit: 2, score: 55 },  // 故意混入：挂科
  { name: '程序设计', credit: 4, score: 105 }, // 非法：超过满分100
  { name: '音乐鉴赏', credit: 2, score: -5 },  // 非法：负分
];

console.log('========== 原始课程数据 ==========');
console.table(courses);