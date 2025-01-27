am5.ready(function() {

  // Create root element
  var root = am5.Root.new("chartdiv");
  
  // Set themes
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  // Generate initial data
  var value = 12; // Start value, ensure it's less than 24
  
  function generateChartData() {
      var chartData = [];
      var firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 1000);
      firstDate.setHours(0, 0, 0, 0);
  
      for (var i = 0; i < 50; i++) {
          var newDate = new Date(firstDate);
          newDate.setSeconds(newDate.getSeconds() + i);
  
          value += (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10;
          value = Math.max(0, Math.min(value, 24)); // Constrain value between 0 and 24
          
          chartData.push({
              date: newDate.getTime(),
              value: value
          });
      }
      return chartData;
  }
  
  var data = generateChartData();
  
  // Create chart
  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    focusable: true,
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true,
    paddingLeft: 0
  }));
  
  var easing = am5.ease.linear;
  
  // Create axes
  var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
    maxDeviation: 0.5,
    groupData: false,
    extraMax: 0.1,
    extraMin: -0.1,
    baseInterval: {
      timeUnit: "second",
      count: 1
    },
    renderer: am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 50
    }),
    tooltip: am5.Tooltip.new(root, {})
  }));
  
  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {}),
    min: 0, // Set minimum value
    max: 24 // Set maximum value
  }));
  
  // Add series
  var series = chart.series.push(am5xy.LineSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: "{valueY}"
    })
  }));
  
  // Tell that the last data item must create bullet
  data[data.length - 1].bullet = true;
  series.data.setAll(data);
  
  // Create animating bullet
  series.bullets.push(function(root, series, dataItem) {  
    if (dataItem.dataContext.bullet) {    
      var container = am5.Container.new(root, {});
      var circle0 = container.children.push(am5.Circle.new(root, {
        radius: 5,
        fill: am5.color(0xff0000)
      }));
      var circle1 = container.children.push(am5.Circle.new(root, {
        radius: 5,
        fill: am5.color(0xff0000)
      }));
  
      circle1.animate({
        key: "radius",
        to: 20,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity
      });
      circle1.animate({
        key: "opacity",
        to: 0,
        from: 1,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity
      });
  
      return am5.Bullet.new(root, {
        locationX: undefined,
        sprite: container
      });
    }
  });
  
  // Add cursor
  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    xAxis: xAxis
  }));
  cursor.lineY.set("visible", false);
  
  // Update data every second
  setInterval(function () {
    addData();
  }, 1000);
  
  function addData() {
    var lastDataItem = series.dataItems[series.dataItems.length - 1];
  
    var lastValue = lastDataItem.get("valueY");
    var newValue = lastValue + ((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
    newValue = Math.max(0, Math.min(newValue, 24)); // Constrain new value between 0 and 24
    
    var lastDate = new Date(lastDataItem.get("valueX"));
    var time = am5.time.add(new Date(lastDate), "second", 1).getTime();
    series.data.removeIndex(0);
    series.data.push({
      date: time,
      value: newValue
    });
  
    var newDataItem = series.dataItems[series.dataItems.length - 1];
    newDataItem.animate({
      key: "valueYWorking",
      to: newValue,
      from: lastValue,
      duration: 600,
      easing: easing
    });
  
    // Use the bullet of last data item so that a new sprite is not created
    newDataItem.bullets = [];
    newDataItem.bullets[0] = lastDataItem.bullets[0];
    newDataItem.bullets[0].get("sprite").dataItem = newDataItem;
    // Reset bullets
    lastDataItem.dataContext.bullet = false;
    lastDataItem.bullets = [];
  
    var animation = newDataItem.animate({
      key: "locationX",
      to: 0.5,
      from: -0.5,
      duration: 600
    });
    if (animation) {
      var tooltip = xAxis.get("tooltip");
      if (tooltip && !tooltip.isHidden()) {
        animation.events.on("stopped", function () {
          xAxis.updateTooltip();
        });
      }
    }
  }
  
  // Make stuff animate on load
  chart.appear(1000, 100);
  
});
