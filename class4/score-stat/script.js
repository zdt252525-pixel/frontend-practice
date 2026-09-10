const scores = [
  { name: '李四', score: 92 },
  { name: '王五', score: 45 },
  { name: '赵六', score: 77 },
  { name: '孙七', score: 59 },
  { name: '周八', score: 88 },
  { name: '吴九', score: 105 },  // 非法：超过满分100
  { name: '郑十', score: -3 },   // 非法：负分
];
console.log('========== 原始数据 ==========');
console.table(scores);
const validScores = scores.filter(
  item => typeof item.score === 'number' && item.score >= 0 && item.score <= 100
);
const invalidScores = scores.filter(
  item => !(typeof item.score === 'number' && item.score >= 0 && item.score <= 100)
);
console.log('\n========== 清洗后有效数据 ==========');
console.table(validScores);
console.log('被过滤的非法数据：', invalidScores);
const maxScore = Math.max(...validScores.map(s => s.score));
const minScore = Math.min(...validScores.map(s => s.score));
const avgScore =
  validScores.reduce((sum, s) => sum + s.score, 0) / validScores.length;
const topStudent   = validScores.find(s => s.score === maxScore);
const bottomStudent = validScores.find(s => s.score === minScore);
console.log('\n========== 统计信息 ==========');
console.log(`最高分：${maxScore} 分（${topStudent.name}）`);
console.log(`最低分：${minScore} 分（${bottomStudent.name}）`);
console.log(`平均分：${avgScore.toFixed(2)} 分`);
const passList = validScores.filter(s => s.score >= 60);
const failList = validScores.filter(s => s.score < 60);
console.log('\n========== 及格情况 ==========');
console.log(`及格：${passList.length} 人`);
console.log(`不及格：${failList.length} 人`);
if (failList.length > 0) {
  console.log(
    '不及格名单：' + failList.map(s => `${s.name}(${s.score})`).join('、')
  );
}
const ranked = [...validScores].sort((a, b) => b.score - a.score);

console.log('\n========== 成绩排名 ==========');
console.table(ranked);