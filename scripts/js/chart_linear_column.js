//数据类型   [{x:0,y:1,category:01},{x:0,y:1,category:02}] 第三列是种类
function nameSpace(param){
	//用于形成自己的闭包    避免变量污染
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
			dataJsonKey:{},
			chartLinearColumn:function(data,containerId ,chartJson) {
				          
				var legendShow = chartJson.legendShow||false;   //图例    默认显示
				var chartTitle = chartJson.chartTitle||'';     //图表名称
				var chartSubTitle =chartJson.chartSubTitle||''; //副标题
				var xTitle = chartJson.xTitle||'x';			   //x标题
				var yTitle = chartJson.yTitle||'y';			   //y标题
				var xMax =  chartJson.xMax||null;
				var yMax = chartJson.yMax||null;
				var xMin = chartJson.xMin==0?0:(chartJson.xMin?chartJson.xMin:null);
				var yMin =chartJson.yMin==0?0:(chartJson.yMin?chartJson.yMin:null);
				var xType = chartJson.xType||'linear';
				var legend_show = (data.length > 0);
				
				var series = [];
				
				var const_color=[   
				                    '#148f74',
									'#f8ac59',
									'#85d1c1',
									'#a3e1d5',
									'#e5f1fb',
									'#b5b9cf',
									'#dfdfdf',
									'#b3b3b3',
									'#979797'
					                ];	
				if(data&&data.length&&data.length>0){
					var titles=[];
					
					var that = this;
					//step1数据表的key数组				
					if(data[0]){
						$.each(data[0],function(k,v){
							titles.push(k);
						});
					}
						
//					var column0 = titles[0]; //x
//					var column1 = titles[1]; //y
//					var column2 = titles[2]; //category 区分种类的
					
					var column0 = titles[0]; //category
					var column1 = titles[1]; //x
					var column2 = titles[2]; //y 
					var column3 = titles[3]; //下钻列表id
					
					var categoryJson = {};
					$.each(data,function(i,v){
//						categoryJson[v[column2]]='';
						categoryJson[v[column0]]='';
					});
					//遍历种类 来初始化 series
					var idx =0;
					var categoryArr = [];
					$.each(categoryJson,function(k,v){
						
						categoryArr.push(k);
						series.push({
									'name':k, 
									'marker': {'radius': 1}, 
									'type':'column',
									'color':const_color[idx%(const_color.length-1)], 
									'data':[],
									"events": {
										click: function(e) {
											//取出 x  y 
											var x = e.point.x;
											var y = e.point.y;
											var name = e.point.series.name;
											var convertKey = name+'-'+x;
											//drill_id
											var drill_id = that.dataJsonKey[convertKey];
											if(drill_id){
												that.archiveDetails(name + "列表","/data/drillPage.h?drillId="+drill_id);
											}
										}
									}
							});
							idx++;
						});
						
						
					}
					//最后循环data 往对应种类里 填充数据
					$.each(data,function(i,v){
						var x = v[column1];
						var y = v[column2];
						
						x = getNumVal(x);
						y = getNumVal(y);
						//先取出种类
						var key = v[column0];
						var index = that.findInArrIndex(key,categoryArr);
						//找到  series 类别的索引   
						
						series[index].data.push([x,y]);
						//初始化根据  类型-x-y 查找DRILL_ID 》》key 
						var convertKey =key+'-'+x;
						that.dataJsonKey[convertKey] = v[column3];
					});
					
				$(containerId).show();
				$(containerId).highcharts({
			        chart: {
			            type: 'column',
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
			        subtitle: {
			            text: chartSubTitle
			        },
			        lang: {
						printChart: '打印图表',
						downloadJPEG:'导出 jpeg',
						downloadPDF: '导出 pdf',
						downloadPNG: '导出 PNG',
						downloadSVG: '导出 SVG',
			        },
			        exporting:{
			        	enabled:false
			        },
			        tooltip: {
			            shared: true,
			            formatter:function(){
		            		if(xType=='datetime'){
		            			return xTitle+':'+new Date(this.x).Format("yyyy/MM")+'<br/>'+yTitle+':'+this.y;
		            		}else{
		            			return xTitle+':'+this.x+'<br/>'+yTitle+':'+this.y;
		            		}
		            		
		            	}
			        },				        
			        xAxis: {
			        	//设置轴线颜色  以及宽度
			        	allowDecimals:false,
			        	lineColor: '#999',
			            lineWidth:2,
			            title: {
			                enabled: true,
			                text:xTitle,   //x轴数据列单位
			                align: 'high',
			                offset: 0,
			                rotation: 0,
			                x: 10,
			                y:25
			            },
			            labels:{
			            	formatter:function(){
			            		if(xType=='datetime'){
			            			return new Date(this.value).Format("yyyy/MM");
			            		}else{
			            			return this.value;
			            		}
			            		
			            	}
			            },
			            startOnTick: true,
			            endOnTick: true,
			            showLastLabel: true,
			            gridLineWidth: 1,
			            max:xMax,
			            min:xMin,
			            type:xType
			        },
			        yAxis:  
			            { // Secondary yAxis
			        		allowDecimals:false,
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
			            }, 
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

