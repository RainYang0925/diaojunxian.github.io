$(function() {

	$("table#table_id td.pic").each(function() {
		file_data = get_File($(this).siblings("td.perf").children("a").attr("href"));
		if(file_data.length > 0) {
			time = get_data(file_data, 1);
			cpu = get_data(file_data, 2);
			pss = get_data(file_data, 3);
			num = xAxis_distance(time);
			make_chart(num,time,cpu,pss,this);
		}
	})

	function get_File(urladdr) {
		var file_data = [];
		$.ajax({
			url: urladdr,
			dataType: 'text',
			async: false,
			success: function(data) {
				data = data.replace(/\n/g, ", ");
				file_data = data.split(', ');
			},
			error: function(a, b) {

			}
		});
		return file_data;
	}

	function get_data(data_all, k) {
		// 获取数据值
		var pss = [];
		var cpu_percent = [];
		var run_time = [];
		for (var i = 0, j = 0; i < data_all.length - 1; i = i + 4) {
			run_time[j] = getTime(parseFloat(data_all[i]));
			pss[j] = parseFloat(data_all[i + 3]);
			if (parseFloat(data_all[i + 1]) > 0) {
				cpu_percent[j] = (parseFloat(data_all[i + 2])) / (parseFloat(data_all[i + 1]));
			} else {
				cpu_percent[j] = 0;
			}
			j = j + 1;
		}
		// alert(run_time.length);
		switch (k) {
			case 1:
				return run_time;
			case 2:
				return cpu_percent;
			case 3:
				return pss;
		}
	}

	// 转换时间戳
	function getTime(ns) {
		// return new Date(parseInt(ns) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
		var newDate = new Date();
    	newDate.setTime(ns * 1000);
   	 	Date.prototype.format = function(format) {
           var date = {
                  "M+": this.getMonth() + 1,
                  "d+": this.getDate(),
                  "h+": this.getHours(),
                  "m+": this.getMinutes(),
                  "s+": this.getSeconds(),
                  "q+": Math.floor((this.getMonth() + 3) / 3),
                  "S+": this.getMilliseconds()
           };
           if (/(y+)/i.test(format)) {
                  format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
           }
           for (var k in date) {
                  if (new RegExp("(" + k + ")").test(format)) {
                         format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                  }
           }
       	return format;
    }
    return newDate.format('yyyy-MM-dd h:m:s');
	}

	function xAxis_distance(run_time) {
		var num;

		num = run_time.length-2;
		return num;
	}

	function make_chart(num, run_time, cpu_percent, pss, ele) {
		$(ele).children('.container').highcharts({
			legend: {
				enabled: false //true //
			},
			chart: {
				type: 'spline'
			},
			title: {
				// text: $(ele).siblings("td.case").html()
				text:null
			},
			xAxis: {
				tickInterval: num,
				categories: run_time
				//categories: [1,2,3]
			},
			yAxis: [{
				lineColor: '#FF4500',
				lineWidth: 1,
				tickColor: '#FF4500',
				tickWidth: 1,
				title: {
					text: 'PSS',
					color: '#FF4500'
				},
				labels: {
					formatter: function() {
						return this.value + 'M';
					}
				}
			}, {
				lineColor: '#6495ED',
				lineWidth: 1,
				tickColor: '#6495ED',
				tickWidth: 1,
				opposite: true,
				showLastLabel: true,
				showFirstLabel: true,
				title: {
					text: 'Cpu-Percent'
				},
				labels: {
					formatter: function() {
						return this.value + '%';
					}
				},
				max: 1,
			}],
			tooltip: {
				crosshairs: true,
				shared: true
			},
			plotOptions: {
				spline: {
					marker: {
						radius: 1,
						lineColor: '#666666',
						lineWidth: 1
					}
				}
			},
			credits: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			series: [{
				name: 'PSS值',
				color: '#FF4500',
				yAxis: 0,
				marker: {
					symbol: 'square'
				},
				data: pss
			}, {
				name: 'Cpu-Percent',
				color: '#6495ED',
				yAxis: 1,
				data: cpu_percent
			}]
		});
	}
})