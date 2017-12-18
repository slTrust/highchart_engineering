function nameSpace(param){
	//用于形成自己的闭包    避免变量污染
	
	funcSpace[param]={
			initData:function(){
				this.drillMap={};
			},
			drillMap:{},
			chartColumnDrill:function(data,containerId, chart_drill_level,chartJson) {
			
				var legendShow = chartJson.legendShow||false;   //图例    默认显示
				var chartTitle = chartJson.chartTitle||'';     //图表名称
				var xTitle = chartJson.xTitle||'x';			   //x标题
				var yTitle = chartJson.yTitle||'y';			   //y标题
				var xMax =  chartJson.xMax||null;
				var yMax = chartJson.yMax||null;
				var xMin = chartJson.xMin==0?0:(chartJson.xMin?chartJson.xMin:null);
				var yMin =chartJson.yMin==0?0:(chartJson.yMin?chartJson.yMin:null);
				
				var levelTitle = [];
				var sumTitle;
				var baseKeysCount = {};
				var drillKeysCount = {};
				var parentKeys = {};
				var LEVEL_COUNT = chart_drill_level;

				var currentCategorys = {};
				
				this.initData();
				
				if(data&&data.length&&data.length!=0){
					// 获取需要合计列的标题
					var idx = 0;
					$.each(data[0],function(k,v){
						if(idx == LEVEL_COUNT){
							// 获取数量合计列的标题
							sumTitle = k;
						}
						if(idx++ < LEVEL_COUNT){
							levelTitle.push(k);
						}

					});
					var that=this;
					// 数据逐条循环
					$.each(data,function(k,v){
						// 逐个列拼接
						var tempKey = "";
						var tempParentKey = "";
						$.each(levelTitle, function(index, value){
							parentKey = tempKey;			
							if(index == 0){
								tempKey = v[value];
								// 初始饼图
								if(baseKeysCount[tempKey]){
									// 存在的KEY，计数+1
									baseKeysCount[tempKey] += parseInt(v[sumTitle]);	// 列表下钻时取 +=1
								} else{
									// 不存在的KEY，计数初始化为1
									baseKeysCount[tempKey] = parseInt(v[sumTitle]);		// 列表下钻时取 =1
								}
							} else {
								tempKey += that.makeDrillKey(v[value]);
								// 下钻饼图
								if (drillKeysCount[tempKey]) {
									// 存在的KEY，计数+1
									drillKeysCount[tempKey] += parseInt(v[sumTitle]);	// 列表下钻时取 +=1
								} else {
									// 不存在的KEY，计数初始化为1
									drillKeysCount[tempKey] = parseInt(v[sumTitle]);	// 列表下钻时取 =1
								}

							}
							// 下钻数据最终层时，将drill ID与该行绑定
							if (index === LEVEL_COUNT - 1) {
								if(v['DRILL_ID']) {
									that.drillMap[tempKey] = v['DRILL_ID'];
								}
							}
							// 父饼图ID
							parentKeys[tempKey] = parentKey;
							currentCategorys[tempKey]  = v[value];
						});
					});


					
					// 第一层数据
					var	baseSeries = [];	
					// 第一层数据装填
					$.each(baseKeysCount,function(k,v){
						var tempSeries = {name: k,	y: v,	drilldown: k	,color:'#48c2a9'};
						if(LEVEL_COUNT == 1){
							tempSeries["events"] = {
									click: function(e) {
										if(that.drillMap[e.point.name]){
											that.archiveDetails(e.point.name + "列表","/data/drillPage.h?drillId="+that.drillMap[e.point.name]);
										}
									}
								}
						}
						baseSeries.push(tempSeries);
//						baseSeries.push({name: k,	y: v,	drilldown: k	});
					});
					
					// 生成父子关系Json（中间数据，用于格式转换）
					var parent_son = {};
					$.each(drillKeysCount,function(k,v){
						// 已存在父key时
						if(parent_son[parentKeys[k]]) {
							parent_son[parentKeys[k]]["data"].push({"name": k, "y": v,	"drilldown": k});
						} else {
							parent_son[parentKeys[k]] = {
								"id": parentKeys[k], 
								"name": parentKeys[k], 
								"data": [{"name": k, "y": v,	"drilldown": k}],
								"events": {
									click: function(e) {
										if(that.drillMap[e.point.name]){
											that.archiveDetails(e.point.name + "列表","/data/drillPage.h?drillId="+that.drillMap[e.point.name]);
										}
									}
								}
							}
						}
					});
					
					// 下钻饼图数据
					var drilldownSeries = [];	
					// 根据父子关系Json生成下钻饼图数据
					$.each(parent_son,function(k,v){
						drilldownSeries.push(v);
					});
				 	// X坐标轴标题	
				 	var titleX = getChartTitle("", chart_content_x);
				 	// 左Y坐标轴标题
				 	var titleY1 = getChartTitle("数量", chart_content_y1);
				 	// Y轴原点
				 	var minY1 = getChartNum(0, chart_min_y1);
					
//					container
					$(containerId).show();
					$(containerId).highcharts({
						chart: {
							type:'column',
					//		zoomType: 'xy'
				        },
				        legend: {
				            enabled:legendShow
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
						tooltip: {
				            formatter: function() {
				                return "<b>"+this.point.name+"</b>" + "<br>数量：<b>" + this.point.y+"</b>";
				            }			
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
				            type: 'category',
				            startOnTick: true,
				            endOnTick: true,
				            showLastLabel: true,
				            gridLineWidth: 1,
				            max:xMax,
				            min:xMin
				        },        

				        yAxis: { 
				            title: {
				                text:yTitle,
	/*			                align:'high',
				                rotation: 0,
				                y: 10,	*/
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
				            min :yMin,
				            max :yMax
				        },        
				        plotOptions: {
				        	series: {
				                allowPointSelect: false,  //是否允许选中
				                cursor: 'pointer',
				                showInLegend: true,
				                dataLabels: {
				                    enabled: false,
				                    color: '#000000',
				                    connectorColor: '#000000',
				                    format: '{point.name}',
				                    style: {   //设置数据字体的大小
				                        fontSize:'14px'
				                    }
				                },
				                size: 250,
				            }
				        },
				        exporting:{
				        	enabled:true
				        },
						series: [{
							name: levelTitle[0],
							colorByPoint: true,
							data: baseSeries
						}],        
						drilldown: {
							activeAxisLabelStyle: {
				                textDecoration: 'none',
				                fontStyle: 'none',
				                fontWeight:'none',
				                color:'#000'
				            },
				            activeDataLabelStyle: {
				                textDecoration: 'none',
				                fontWeight:'none',
				                fontStyle: 'none'
				            },
							series: drilldownSeries
						}
					});
				}else{ //没有数据的处理
//					container
					$(containerId).show();
					$(containerId).highcharts({
						chart: {
							type:'column',
					//		zoomType: 'xy'
				        },
				        legend: {
				            enabled:legendShow
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
						tooltip: {
				            formatter: function() {
				                return "<b>"+this.point.name+"</b>" + "<br>数量：<b>" + this.point.y+"</b>";
				            }			
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
				            type: 'category',
				            startOnTick: true,
				            endOnTick: true,
				            showLastLabel: true,
				            gridLineWidth: 1,
				            max:xMax,
				            min:xMin
				        },        

				        yAxis: { 
				            title: {
				                text:yTitle,
	/*			                align:'high',
				                rotation: 0,
				                y: 10,	*/
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
				            min :yMin,
				            max :yMax
				        },        
				        plotOptions: {
				        	series: {
				                allowPointSelect: false,  //是否允许选中
				                cursor: 'pointer',
				                showInLegend: true,
				                dataLabels: {
				                    enabled: false,
				                    color: '#000000',
				                    connectorColor: '#000000',
				                    format: '{point.name}',
				                    style: {   //设置数据字体的大小
				                        fontSize:'14px'
				                    }
				                },
				                size: 250,
				            }
				        },
				        exporting:{
				        	enabled:true
				        },
						series: []
					});
				}
			
				
			},
			chartColumn:function(data,containerId) {
				// 无数据时返回
				if(data == null || data.length == 0)	return;	
				if(!data[0])	return;

				var LEVEL_COUNT = (chart_drill_level === -1) ? 1 : chart_drill_level;	// 这个常量从DB中取得
				chartColumnDrill(data,containerId,LEVEL_COUNT);
			},
			makeDrillKey:function(addKey){
				return "-" + addKey;
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
};