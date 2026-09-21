// ===== 自习室数据（写死在JS数组） =====
const rooms = [
    { name: "101自习室", floor: 1, capacity: 60, open: true },
    { name: "102自习室", floor: 1, capacity: 50, open: true },
    { name: "201自习室", floor: 2, capacity: 80, open: true },
    { name: "202自习室", floor: 2, capacity: 40, open: false },
    { name: "301自习室", floor: 3, capacity: 100, open: true },
    { name: "302自习室", floor: 3, capacity: 70, open: true },
    { name: "401自习室", floor: 4, capacity: 60, open: false },
    { name: "402自习室", floor: 4, capacity: 90, open: true }
];

// ===== 渲染自习室列表 =====
function renderRooms(list) {
    const container = document.getElementById("roomList");
    if (list.length === 0) {
        container.innerHTML = '<div class="text-muted text-center py-4">没有符合条件的自习室</div>';
        return;
    }
    container.innerHTML = list.map(r => `
        <div class="col-md-4 col-sm-6 mb-3">
            <div class="card ${r.open ? '' : 'opacity-50'}">
                <div class="card-body">
                    <h5 class="card-title">${r.name}</h5>
                    <p class="card-text mb-1">楼层：${r.floor} 楼</p>
                    <p class="card-text mb-1">容量：${r.capacity} 人</p>
                    <span class="badge ${r.open ? 'bg-success' : 'bg-secondary'}">
                        ${r.open ? '开放中' : '已关闭'}
                    </span>
                </div>
            </div>
        </div>
    `).join("");
}

// ===== 筛选逻辑 =====
function applyFilter() {
    const floor = document.getElementById("floorFilter").value;
    const status = document.getElementById("statusFilter").value;

    let result = rooms.filter(r => {
        if (floor !== "all" && r.floor != floor) return false;
        if (status === "open" && !r.open) return false;
        if (status === "closed" && r.open) return false;
        return true;
    });
    renderRooms(result);
}

// ===== 渲染统计图表 =====
function renderChart(data) {
    const chart = echarts.init(document.getElementById("usageChart"));
    const option = {
        title: {
            text: "各自习室使用量统计",
            subtext: `数据来源：${data.source}　单位：${data.unit}`,
            left: "center"
        },
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" }
        },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: {
            type: "category",
            data: data.rooms.map(r => r.name),
            axisLabel: { rotate: 30 }
        },
        yAxis: {
            type: "value",
            name: data.unit
        },
        series: [{
            name: "使用量",
            type: "bar",
            data: data.rooms.map(r => r.usage),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#667eea" },
                    { offset: 1, color: "#764ba2" }
                ])
            },
            label: { show: true, position: "top" }
        }]
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
}

// ===== 页面加载完成后初始化 =====
document.addEventListener("DOMContentLoaded", function () {
    // 初始化自习室列表
    renderRooms(rooms);
    document.getElementById("floorFilter").addEventListener("change", applyFilter);
    document.getElementById("statusFilter").addEventListener("change", applyFilter);

    // 加载 data.json 渲染图表
    fetch("data.json")
        .then(res => res.json())
        .then(data => renderChart(data))
        .catch(err => console.error("加载 data.json 失败：", err));
});