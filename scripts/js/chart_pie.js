function nameSpace(param){
	//用于形成自己的闭包    避免变量污染
	
	funcSpace[param]={
			initData:function(){
				this.drillMap={};
			},
			drillMap:{},
			chartPie:function(data,containerId,chart_drill_level,chartJson) {
				
				var chartTitle = chartJson.chartTitle||'';     //图表名称
				
				
				// 无数据时返回
				/*if(data == null || data.length == 0)	return;	
				if(!data[0])	return;*/

				var LEVEL_COUNT = (chart_drill_level === -1) ? 1 : chart_drill_level;	// 这个常量从DB中取得
				//var LEVEL_COUNT = 3;	// 这个常量从DB中取得
				var levelTitle = [];
				var sumTitle;
				var baseKeysCount = {};
				var drillKeysCount = {};
				var parentKeys = {};
				
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
						});
					});

					// 第一层饼图数据
					var	baseSeries = [];	
					// 第一层饼图数据装填
					$.each(baseKeysCount,function(k,v){
						var tempSeries = {name: k,	y: v,	drilldown: k	};
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
					//	baseSeries.push({name: k,	y: v,	drilldown: k	});
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
						
					var color_arr1=[
									'#1ab395',
									'#85d1c1',
									'#a3e1d5',
									'#e5f1fb',
									'#dfdfdf',
									'#b5b9cf',
									'#b3b3b3'
					                ];
//					container
					$(containerId).show();
					$(containerId).highcharts({
						chart: {
							type:'pie',
				            plotBackgroundColor: null,
				            plotBorderWidth: null,
				            plotShadow: false/*,
				            borderWidth:0*/
				        },       
						lang: {
							printChart: '打印图表',
							downloadJPEG:'导出 jpeg',
							downloadPDF: '导出 pdf',
							downloadPNG: '导出 PNG',
							downloadSVG: '导出 SVG',
				        },
				        colors:color_arr1,
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
				                return "<b>"+this.point.name+"</b>" + "<br>" +  Highcharts.numberFormat(this.percentage, 1, '.') +' %' + "<br>"+this.point.y;
				            }			
				       //     pointFormat: '<b>{point.percentage:.1f}%</b>'
				        },
				        plotOptions: {
				        	pie: {
				        		allowPointSelect: false,  //是否允许选中
				                cursor: 'pointer',
				                showInLegend: true,
				                dataLabels: {
				                    enabled: true,
				                    color: '#000000',
				                    connectorColor: '#000000',
				                    //format: '{point.name}',
				                    format: '{point.name}<b>{point.percentage:.1f}%</b>',
				                    style: {   //设置饼图数据字体的大小
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
				            activeDataLabelStyle: {
				                textDecoration: 'none',
				                fontWeight:'none',
				                fontStyle: 'none',
					            color:'#000'
				            },
				            series: drilldownSeries
						}
					});
				}else{
					//没数据的情况
					$(containerId).show();
					$(containerId).highcharts({
						chart: {
							type:'pie',
				            plotBackgroundColor: null,
				            plotBorderWidth: null,
				            plotShadow: false/*,
				            borderWidth:0*/
				        },       
						lang: {
							printChart: '打印图表',
							downloadJPEG:'导出 jpeg',
							downloadPDF: '导出 pdf',
							downloadPNG: '导出 PNG',
							downloadSVG: '导出 SVG',
				        },
				        colors:color_arr1,
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
				                return "<b>"+this.point.name+"</b>" + "<br>" +  Highcharts.numberFormat(this.percentage, 1, '.') +' %' + "<br>"+this.point.y;
				            }			
				       //     pointFormat: '<b>{point.percentage:.1f}%</b>'
				        },
				        plotOptions: {
				        	pie: {
				        		allowPointSelect: false,  //是否允许选中
				                cursor: 'pointer',
				                showInLegend: true,
				                dataLabels: {
				                    enabled: true,
				                    color: '#000000',
				                    connectorColor: '#000000',
				                    //format: '{point.name}',
				                    format: '{point.name}<b>{point.percentage:.1f}%</b>',
				                    style: {   //设置饼图数据字体的大小
				                        fontSize:'14px'
				                    }
				                },
				                size: 250,
				            }
				        },
				        exporting:{
				        	enabled:true
				        },
						series:[]
					});
				}
				
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
}

