// ========== 第一步：定义课程成绩数据（输入） ==========
const courses = [
  { name: '高等数学', credit: 5, score: 92 },
  { name: '大学英语', credit: 3, score: 78 },
  { name: '数据结构', credit: 4, score: 85 },
  { name: '体育',     credit: 1, score: 90 },
  { name: '思想道德', credit: 2, score: 55 },  
  { name: '程序设计', credit: 4, score: 105 }, 
  { name: '音乐鉴赏', credit: 2, score: -5 },  
];

console.log('========== 原始课程数据 ==========');
console.table(courses);
const cleanCourses = (list) =>
  list.filter(c => c.score >= 0 && c.score <= 100 && c.credit > 0);
const toGP = (score) => {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.0;
  if (score >= 70) return 2.0;
  if (score >= 60) return 1.0;
  return 0;   
};
const weightedAvg = (list) => {
  if (list.length === 0) return 0;   
  const total = list.reduce((sum, c) => sum + c.score * c.credit, 0);
  const credits = list.reduce((sum, c) => sum + c.credit, 0);
  return (total / credits).toFixed(2);
};
const calcGPA = (list) => {
  if (list.length === 0) return 0;   
  const points = list.reduce((sum, c) => sum + toGP(c.score) * c.credit, 0);
  const credits = list.reduce((sum, c) => sum + c.credit, 0);
  return (points / credits).toFixed(2);
};
const best = (list) =>
  list.reduce((top, c) => c.score > top.score ? c : top, list[0]);
const failed = (list) => list.filter(c => c.score < 60).map(c => c.name);
const valid = cleanCourses(courses);
console.log('\n========== 清洗与统计 ==========');
console.log('清洗后：', valid);
console.log('加权平均分：', weightedAvg(valid));
console.log('GPA（4.0制）：', calcGPA(valid));
console.log('最高分课程：', best(valid));
console.log('挂科名单：', failed(valid));
const report = (list) => {
  const valid = cleanCourses(list);
  if (valid.length === 0) {
    return '没有有效课程成绩';   
  }
  return `有效课程${valid.length}门，加权平均分${weightedAvg(valid)}，GPA（4.0制）${calcGPA(valid)}；
单科最高：${best(valid).name} ${best(valid).score}分；
挂科名单：${failed(valid).join('、') || '无'}`;
};

try {
  console.log('\n========== 成绩报告 ==========');
  console.log(report(courses));
} catch (err) {
  console.error('报告生成失败：', err.message);
}