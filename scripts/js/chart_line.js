function nameSpace(param){
	//用于形成自己的闭包    避免变量污染
	funcSpace[param]={
			initData:function(){},
			chartLine:function(data,containerId ,chartJson) {
				var legendShow = chartJson.legendShow||false;   //图例    默认显示
				var chartTitle = chartJson.chartTitle||'';     //图表名称
				var xTitle = chartJson.xTitle||'x';			   //x标题
				var yTitle = chartJson.yTitle||'y';			   //y标题
				var xMax =  chartJson.xMax||null;
				var yMax = chartJson.yMax||null;
				var xMin = chartJson.xMin==0?0:(chartJson.xMin?chartJson.xMin:null);
				var yMin =chartJson.yMin==0?0:(chartJson.yMin?chartJson.yMin:null);
				
				
				var legend_show = (data.length > 0);
				this.initData();
				var xData = [];
				var titles=[];
				//step1数据表的key数组				
				if(data[0]){
					$.each(data[0],function(k,v){
						titles.push(k);
					});
				}
				series = [];
				var minY = 0;
				var maxY = 0;
				
				for(var i=1; i < titles.length; i++){
					series.push({'name':titles[i], 'marker': {'radius': 1}, 'type':'spline','color':color_arr[i], 'data':[]});
				}
//				series[1]['yAxis']=1;
				
			//step5循环data  push数据
				$.each(data,function(i,value){
					// 这是X轴 点标签
					xData.push(value[titles[0]]);
					for(var i=1; i < titles.length; i++){
						series[i-1]["data"].push(value[titles[i]]);
						minY = Math.min(minY,value[titles[i]]);		
						maxY = Math.max(maxY,value[titles[i]]);			
					}
				}); //最外层循环
				
			 	minY = getChartNum(minY, chart_min_y1);
			 	maxY = getChartNum(maxY, chart_max_y1);		
			 	// X坐标轴标题	
			 	var titleX = getChartTitle(titles[0], chart_content_x);
			 	// 左Y坐标轴标题
			 	var titleY1 = getChartTitle(titles[1], chart_content_y1);
			 	// 右Y坐标轴标题 暂时只用一个Y轴
//			 	var titleY2 = getChartTitle(titles[1], chart_content_y2);		

				
				$(containerId).show();
				$(containerId).highcharts({
			        chart: {
			            type: 'spline',
			            zoomType: 'xy'
			        },
			        title: {
			            text: chartTitle,
			            style: {
			                color: '#444',
			                fontWeight: 'bold',
			                fontSize:'16px'
			            }
			        },
			        lang: {
						printChart: '打印图表',
						downloadJPEG:'导出 jpeg',
						downloadPDF: '导出 pdf',
						downloadPNG: '导出 PNG',
						downloadSVG: '导出 SVG',
			        },
			        subtitle: {
			            text: ''
			        },
			        exporting:{
			        	enabled:legend_show
			        },
			        tooltip: {
			            shared: true
			        },				        
			        xAxis: {
			        	//设置轴线颜色  以及宽度
			        	lineColor: '#999',
			            lineWidth:2,
			            title: {
			                enabled: true,
			                text:xTitle,   //x轴数据列单位
			                align: 'high',
			                offset: 0,
			                rotation: 0,
			                x: 10,
			                y:18
			            },
			            categories: xData,
			            startOnTick: true,
			            endOnTick: true,
			            showLastLabel: true,
			            gridLineWidth: 1,
			            max:xMax,
			            min:xMin
			        },
			        yAxis: [ 
			            { // Secondary yAxis
				            title: {
				                text: yTitle,
				                style: {
				                    color: Highcharts.getOptions().colors[13]
				                }
				            },
				            labels: {
				                format: '{value}',
				                style: {
				                    color: Highcharts.getOptions().colors[13]
				                }
				            },
				            min : yMin,
				            max : yMax
			            }
			            
			        	], 
			        //图例
			        legend: {
			            //布局   默认是水平
			       	    layout: 'horizontal',
			            align: 'center',
			            verticalAlign: 'bottom',
			            enabled: legendShow //是否显示图例   
			        },
			        series: series
			    });
			}	
	}
}

