function nameSpace(param){
	//用于形成自己的闭包    避免变量污染
	
	funcSpace[param]={
			initData:function(){
				this.drillMap={};
			},
			drillMap:{},
			chartLineColumn:function(data,containerId,chartJson) {	
				
				var legendShow = chartJson.legendShow||false;   //图例    默认显示
				var chartTitle = chartJson.chartTitle||'';     //图表名称
				var xTitle = chartJson.xTitle||'x';			   //x标题
				var yTitle = chartJson.yTitle||'y';			   //y标题
				var y2Title =  chartJson.y2Title||'y2';	
				var xMax =  chartJson.xMax||null;
				var yMax = chartJson.yMax||null;
				var y2Max = chartJson.y2Max||null;
				var xMin = chartJson.xMin==0?0:(chartJson.xMin?chartJson.xMin:null);
				var yMin =chartJson.yMin==0?0:(chartJson.yMin?chartJson.yMin:null);
				var y2Min =chartJson.y2Min==0?0:(chartJson.y2Min?chartJson.y2Min:null);
				
				var legend_show = (data.length > 0);
				var drillFlg = false; 
				this.initData();
				var xData = [];
				var titles=[];
				//step1数据表的key数组				
				if(data[0]){
					$.each(data[0],function(k,v){
						if(k == 'DRILL_ID'){
							drillFlg = true;
						} else {
							titles.push(k);
						}
					});
				}
				//48c2a9
				
				series = [];
				series.push({'name':titles[1], 'type':'column','yAxis':1,'data':[],'color':'#48c2a9'});
				for(var i=2; i < titles.length; i++){
					series.push({'name':titles[i], 'type':'spline','marker':{radius:4}, 'lineWidth':4,'color':'#979797','data':[]});
				}
			/*	X轴一般为年月日，不做处理
				var minX = 0;
				var maxX = 0;
			*/	
				var minY1 = 0;
				var maxY1 = 0;
				var minY2 = 0;
				var maxY2 = 0;
				var that=this;
			//step5循环data  push数据
				$.each(data,function(i,value){
					xData.push(value[titles[0]]);			 		
					series[0]["data"].push(value[titles[1]]);
					minY2 = Math.min(minY2,value[titles[1]]);		
					maxY2 = Math.max(maxY2,value[titles[1]]);		
					
					for(var i=2; i < titles.length; i++){
						series[i-1]["data"].push(value[titles[i]]);
					/*	minY1 = Math.min(minY1,value[titles[i]]);
						maxY1 = Math.max(maxY1,value[titles[i]]);*/
					}
					
					if(value['DRILL_ID']) {
						that.drillMap[value[titles[0]]] = value['DRILL_ID'];
					}
					
				}); //最外层循环
			/*	X轴一般为年月日，不做处理
			 	minX = getChartNum(minX, chart_min_x);
			 	maxX = getChartNum(maxX, chart_max_x);
			 	minY1 = getChartNum(minY1, chart_min_y1);
			 	maxY1 = getChartNum(maxY1, chart_max_y1);	
			 	minY2 = getChartNum(minY2, chart_min_y2);
			 	maxY2 = getChartNum(maxY2, chart_max_y2);
			*/ 	

			 	// X坐标轴标题	
			 	var titleX = getChartTitle(titles[0], chart_content_x);
			 	// 左Y坐标轴标题
			 	var titleY1 = getChartTitle(titles[2], chart_content_y1);
			 	// 右Y坐标轴标题
			 	var titleY2 = getChartTitle(titles[1], chart_content_y2);	
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
			        plotOptions: {
			        	column : {
			                events: {
			                    click: function(e) {
			                    	if(!drillFlg)	return false;
			                    	that.archiveDetails(e.point.category + "列表","/data/drillPage.h?drillId="+that.drillMap[e.point.category]);
			                    }
			                }
			            }
			        },
			        xAxis: {
			        	//设置轴线颜色  以及宽度
			        	lineColor: '#999',
			            lineWidth:2,
			            title: {
			                enabled: true,
			                text: xTitle,   //x轴数据列单位
			                align: 'high',
			                offset: 0,
			                rotation: 0,
			                x: 10,
			                y:15
			            },
			            categories: xData,
			            startOnTick: true,
			            endOnTick: true,
			            showLastLabel: true,
			            gridLineWidth: 1,
			            min:xMin,
			            max:xMax
			        },
			        
			        yAxis: [ 
			            { // Secondary yAxis
				            title: {
				                text: y2Title,
	/*			                align:'high',
	//			                rotation: 0,
				                y: 10,*/
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
				            min : y2Min,
				            max : y2Max
			            },
			            { // Primary yAxis
				            labels: {
				                format: '{value}',
				                style: {
				                    color: Highcharts.getOptions().colors[1]
				                }
				            },
				            title: {
				                text: yTitle,
				                style: {
				                    color: Highcharts.getOptions().colors[1]
				                }
				            },
			            	opposite: true,
				            min : yMin,
				            max : yMax
			        	}], 
			        
			        //图例
			        legend: {
			            //布局   默认是水平
			       	    layout: 'horizontal',
			            align: 'center',
			            verticalAlign: 'bottom',
			            enabled: legendShow //是否显示图例   
			        },
			        colors: ['#2185c5','#ff7f66','#98c000'] , 
			        series: series
			    });
			},
			archiveDetails:function(title,url){
				layer.open({
					type: 2,
				    title: [title,'background-color:#1ab395;color:#fff;font-size:16px;font-weight:bold;height:40px;'],
				    maxmin: false,
				    area: ['1024px', '640px'],
				    content: url,
				    scrollbar: false,
				    closeBtn: 1,
					end: function(){}
				});
			}
	}
}

