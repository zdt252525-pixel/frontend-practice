// ===== 建筑数据（写死在 JS 数组）=====
const buildings = [
    { name: "主教学楼",  type: "教学", floors: 5, open: true  },
    { name: "图书馆",    type: "学习", floors: 4, open: true  },
    { name: "实验楼A",   type: "实验", floors: 3, open: true  },
    { name: "实验楼B",   type: "实验", floors: 3, open: false },
    { name: "行政楼",    type: "办公", floors: 4, open: true  },
    { name: "体育馆",    type: "体育", floors: 2, open: true  },
    { name: "食堂",      type: "生活", floors: 2, open: true  },
    { name: "学生宿舍1", type: "生活", floors: 6, open: true  }
];

// ===== 渲染建筑卡片 =====
function renderList(list) {
    const box = document.getElementById("buildingList");
    if (list.length === 0) {
        box.innerHTML = '<div class="text-muted text-center py-4">没有符合条件的建筑</div>';
        return;
    }
    box.innerHTML = list.map(b => `
        <div class="col-md-4 col-sm-6 mb-3">
            <div class="card ${b.open ? '' : 'opacity-50'}">
                <div class="card-body">
                    <h5 class="card-title mb-2">${b.name}</h5>
                    <p class="mb-1 text-muted small">类型：${b.type}　楼层：${b.floors}F</p>
                    <span class="badge ${b.open ? 'bg-success' : 'bg-secondary'}">
                        ${b.open ? '开放中' : '已关闭'}
                    </span>
                </div>
            </div>
        </div>
    `).join("");
}

// ===== 筛选 =====
function applyFilter() {
    const type  = document.getElementById("typeFilter").value;
    const floors = document.getElementById("floorFilter").value;
    const status = document.getElementById("statusFilter").value;

    const result = buildings.filter(b => {
        if (type !== "all" && b.type !== type) return false;
        if (floors !== "all" && b.floors != floors) return false;
        if (status === "open" && !b.open) return false;
        if (status === "closed" && b.open) return false;
        return true;
    });
    renderList(result);
}

// ===== 渲染 ECharts 柱状图 =====
function renderChart(data) {
    const chart = echarts.init(document.getElementById("barChart"));
    chart.setOption({
        title: {
            text: "校园各建筑月访问量",
            subtext: `数据来源：${data.source}　单位：${data.unit}`,
            left: "center"
        },
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: {
            type: "category",
            data: data.buildings.map(b => b.name),
            axisLabel: { rotate: 25 }
        },
        yAxis: { type: "value", name: data.unit },
        series: [{
            name: "访问量",
            type: "bar",
            data: data.buildings.map(b => b.visits),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#1a2a6c" },
                    { offset: 0.5, color: "#b21f1f" },
                    { offset: 1, color: "#fdbb2d" }
                ])
            },
            label: { show: true, position: "top" }
        }]
    });
    window.addEventListener("resize", () => chart.resize());
}

// ===== 初始化 =====
document.addEventListener("DOMContentLoaded", () => {
    renderList(buildings);
    ["typeFilter", "floorFilter", "statusFilter"].forEach(id =>
        document.getElementById(id).addEventListener("change", applyFilter)
    );

    fetch("data.json")
        .then(r => r.json())
        .then(d => renderChart(d))
        .catch(err => console.error("加载 data.json 失败:", err));
});
