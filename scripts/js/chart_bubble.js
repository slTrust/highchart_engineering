function nameSpace(param){
	
	funcSpace[param]={
			//查找字符串所在数组的  位置
			findInArrIndex:function(str,arr){
				for(var i=0;i<arr.length;i++){
					if(str==arr[i]){
						return i;
					}
				}
				return -1;
			},
			chartBubble:function(data,containerId,chartJson) {
				var xTitle = chartJson.xTitle||'x';			   //x标题
				var yTitle = chartJson.yTitle||'y';		
				var zTitle = chartJson.zTitle||'z';
				var chartTitle = chartJson.chartTitle||'';     //图表名称
				var xMax =  chartJson.xMax||null;
				var yMax = chartJson.yMax||null;
				var xMin = chartJson.xMin==0?0:(chartJson.xMin?chartJson.xMin:null);
				var yMin =chartJson.yMin==0?0:(chartJson.yMin?chartJson.yMin:null);
				var series = [];
				
				if(data&&data.length!=0){
					
					//每列的 key名
					var key_arr = [];
					$.each(data[0],function(k,v){
						key_arr.push(k);
					});
					
					var categoryJson={};
					$.each(data,function(i,v){
						var categoryName = v[key_arr[5]];
						categoryJson[categoryName] = '';
					});	
					var seriesIndexArr = [];
					//定义类型
					$.each(categoryJson,function(k,v){
						seriesIndexArr.push(k);
						series.push({
							"name":k,
							"data":[],
							"maxSize":60,
							"minSize":15
							});
					});
					var that = this;
					$.each(data,function(i,v){
						var id = '';
						var cattleNo = '';
						var x=0;//第三列
						var y=0;//第四列
						var z=0;//第五列
						var categoryName='';//第六列 决定数据de 	
						id = v[key_arr[0]];
						cattleNo =v[key_arr[1]];
						x = v[key_arr[2]];
						y = v[key_arr[3]];
						z = v[key_arr[4]];
						categoryName = v[key_arr[5]];
						var idx = that.findInArrIndex(categoryName,seriesIndexArr);
						series[idx]['data'].push({
												x:x,
												y:y,
												z:z,
												cattleNo:cattleNo,
												cattleId:id
						});
						
					});
				
				}
				var const_color=[   
				                    '#148f74',
									'#1ab395',
									'#85d1c1',
									'#a3e1d5',
									'#e5f1fb',
									'#b5b9cf',
									'#dfdfdf',
									'#b3b3b3',
									'#979797'
					                ];	
				var color_arr1= [] ;
				if(chartJson&&chartJson.colorArr&&chartJson.colorArr.length!=0){
					color_arr1 = chartJson.colorArr;
				}else{
					color_arr1 = const_color;
				}
//					container
					$(containerId).show();
					$(containerId).highcharts({
						chart: {
							 type: 'bubble',
					         zoomType: 'xy'
				        },       
						lang: {
							printChart: '打印图表',
							downloadJPEG:'导出 jpeg',
							downloadPDF: '导出 pdf',
							downloadPNG: '导出 PNG',
							downloadSVG: '导出 SVG',
				        },
				        title: {
				            text: chartTitle,
				            style: {
				                color: '#444',
				                fontWeight: 'bold',
				                fontSize:'16px'
				            }
				        },
				        xAxis: {
				        	//设置轴线颜色  以及宽度
				        	lineColor: '#999',
				            lineWidth:2,
				            title: {
				                enabled: true,
				                text: xTitle,   //x轴title
				                align: 'high',
				                offset: 0,
				                rotation: 0,
				                x: 10,
				                y:18
				            },
				            startOnTick: true,
				            endOnTick: true,
				            showLastLabel: true,
				            gridLineWidth: 1,
				            min : xMin,
							max : xMax
				        },
				        yAxis: {
				        	//设置轴线颜色  以及宽度
				        	lineColor: '#999',
				            lineWidth:2,
				            title: {
				                text:yTitle, //y轴title
					            align: 'high',
				                offset: 0,
				                rotation: 0,
				                y: -15
				            },
				            gridLineWidth: 1,
				            min : yMin,
				            max : yMax
				        },
				        tooltip: {
				            shared: true,
				            formatter: function () {
				            	var str = '牛号:'+ this.point.cattleNo+'<br/>'+
				            				xTitle+':'+this.point.x +'<br/>'+
				            				yTitle+'：' + this.point.y + '<br/>'+
				            				zTitle+':'+this.point.z;
				            	return str;
				            }
				        },
				        //点击事件
				        plotOptions: {  
					        series: {  
					            cursor: 'hand',  
					            events: {  
					                click: function(e) { 
					                	var cattleId = e.point.cattleId;
					                	var cattleNo = e.point.cattleNo;
										that.openDetailWindow(cattleId,cattleNo);
					                } 
					            }
					        }
				        },  
				        colors:color_arr1,
				        series: series,
				        exporting:{
				        	enabled:true
				        }
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
			},
			openDetailWindow:function(cattleId,cattleNo){
				openPopWindow_cattle(cattleId,cattleNo);
			}
	}
}