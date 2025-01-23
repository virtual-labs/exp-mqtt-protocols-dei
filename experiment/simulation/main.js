let image_tracker = "dis";
let updating = false;
let chartInterval;

am5.ready(function() {
    function createGauge(root, divId, value) {
        var gaugeChart = root.container.children.push(
            am5radar.RadarChart.new(root, {
                panX: false,
                panY: false,
                startAngle: 180,
                endAngle: 360
            })
        );

        var axisRenderer = am5radar.AxisRendererCircular.new(root, {
            innerRadius: -10,
            strokeOpacity: 1,
            strokeWidth: 15,
            strokeGradient: am5.LinearGradient.new(root, {
                rotation: 0,
                stops: [
                    { color: am5.color(0x19d228) },
                    { color: am5.color(0xf4fb16) },
                    { color: am5.color(0xf6d32b) },
                    { color: am5.color(0xfb7116) }
                ]
            })
        });

        var xAxis = gaugeChart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                maxDeviation: 0,
                min: 0,
                max: 100,
                strictMinMax: true,
                renderer: axisRenderer
            })
        );

        var axisDataItem = xAxis.makeDataItem({});
        axisDataItem.set("value", value);

        axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
            sprite: am5radar.ClockHand.new(root, {
                radius: am5.percent(99)
            })
        }));

        xAxis.createAxisRange(axisDataItem);
        axisDataItem.get("grid").set("visible", false);

        return { axisDataItem, gaugeChart };
    }

    // Create two gauges
    var root1 = am5.Root.new("gaugeDiv1");
    var { axisDataItem: axisDataItem1 } = createGauge(root1, "gaugeDiv1", 0);

    var root2 = am5.Root.new("gaugeDiv2");
    var { axisDataItem: axisDataItem2 } = createGauge(root2, "gaugeDiv2", 0);

    function updateGauges() {
        if (updating) {
            axisDataItem1.animate({
                key: "value",
                to: 24, // Fixed value for temperature in the gauge
                duration: 800,
                easing: am5.ease.out(am5.ease.cubic)
            });
            axisDataItem2.animate({
                key: "value",
                to: 40, // Fixed value for humidity in the gauge
                duration: 800,
                easing: am5.ease.out(am5.ease.cubic)
            });
        }
    }

    function createChart(chartId, fixedValue) {
        var root = am5.Root.new(chartId);
        root.setThemes([am5themes_Animated.new(root)]);

        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            focusable: true,
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX"
        }));

        var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
            maxDeviation: 0.5,
            extraMin: -0.1,
            extraMax: 0.1,
            groupData: false,
            baseInterval: {
                timeUnit: "second",
                count: 1
            },
            renderer: am5xy.AxisRendererX.new(root, {
                minorGridEnabled: true,
                minGridDistance: 60
            })
        }));

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        var series = chart.series.push(am5xy.LineSeries.new(root, {
            minBulletDistance: 10,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "date"
        }));

        var data = generateChartData(fixedValue);
        series.data.setAll(data);

        return series;
    }

    function generateChartData(fixedValue) {
        var chartData = [];
        var currentTime = new Date();

        for (var i = 0; i < 16; i++) {
            var newDate = new Date(currentTime.getTime() + i * 1000);
            chartData.push({ date: newDate.getTime(), value: fixedValue });
        }
        return chartData;
    }

    // Create temperature chart with fixed value 24
    var series1 = createChart("chartdiv1", 24);

    // Create humidity chart with fixed value 40
    var series2 = createChart("chartdiv2", 40);

    function addData(series, fixedValue) {
        var lastDataItem = series.dataItems[series.dataItems.length - 1];
        var lastDate = new Date(lastDataItem.get("valueX"));
        var newTime = new Date(lastDate.getTime() + 1000);
        series.data.removeIndex(0);
        series.data.push({ date: newTime.getTime(), value: fixedValue });
    }

    document.getElementById('pushbuttonPower').addEventListener('click', function() {
        let image = document.getElementById("ifimg");
        if (image_tracker === "dis") {
            image.src = "./src/images/dht_on.gif";
            this.innerHTML = "Stop Simulation";
            this.style.backgroundColor = "red";
            image_tracker = "off";
            updating = true;
            // Regenerate chart data when starting simulation again
            series1.data.setAll(generateChartData(24)); // Regenerate temperature chart data with fixed value 24
            series2.data.setAll(generateChartData(40)); // Regenerate humidity chart data with fixed value 40


            // Start updating gauges and charts
            chartInterval = setInterval(() => {
                updateGauges();
                addData(series1, 24); // Update temperature chart with fixed value 24
                addData(series2, 40); // Update humidity chart with fixed value 40
            }, 1000);
            
            
            alert("Data sending using HTTP protocol. Check IoT Server");
        } else {
            image.src = "./src/images/dht_off.gif";
            this.innerHTML = "Start Simulation";
            this.style.backgroundColor = "#009C4E";
            image_tracker = "dis";
            updating = false;

            // Stop updating charts
            clearInterval(chartInterval);
            // Clear chart data (removes all points)
            series1.data.clear();
            series2.data.clear();
            
        }
    });
}); // end am5.ready()

 // Initialize CodeMirror editor in read-only mode
 var editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
    mode: "text/x-c++src", // For C++/Arduino syntax highlighting
    lineNumbers: true, // Show line numbers
    matchBrackets: true, // Highlight matching brackets
    theme: "default", // You can change the theme
    readOnly: "nocursor", // Make the editor read-only
    tabSize: 4,
    indentUnit: 4
});

// Function to display the code in an alert (optional functionality)
function showCode() {
    const code = editor.getValue();
    alert("Current code:\n" + code);
}