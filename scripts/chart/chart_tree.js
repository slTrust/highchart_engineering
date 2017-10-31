function nameSpace(param){
	//用于形成自己的闭包    避免变量污染
	
	funcSpace[param]={
			
			chartTree:function(data,containerId,chartJson) {
				var resData = [];
				//种类的颜色数组
				
				//value值得幂数 用于控制他们的所占比例
				var powerNumber = chartJson.powNum||2;
				
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
				
				
				//初始化resData
				if(data&&data.length!=0){
					
					//一条数据包含  如下    类型id 、类型名称 、  牛舍id 、牛舍名称、  牛只数量 、上限 、下限....
					//必须保证有前5列
					//初始化列名
					var columnArr = [];
					for(var name in data[0]){
						columnArr.push(name);
					};
					//去重的  种类json   k ==>类型id   v ==>类型名称
					var categoryJson = {};
					// 每一条数据  
					 /*{name: '牛舍001',
		                parent: '00',
		                value: 35,
		                barnId:'321312312',
		                up:44,
		                down:20
		                }*/
					$.each(data,function(i,v){
						//v 代表一条数据
						//columnArr[0]代表   类型id
						//columnArr[1]代表   类型名称
						//columnArr[2]代表   对应类型下的   牛舍  id
						//columnArr[3]代表   对应类型下的  牛舍名称
						//columnArr[4]代表   对应类型下的  牛只数量
						//columnArr[5]代表   对应类型下的  牛只上限
						categoryJson[v[columnArr[0]]] = v[columnArr[1]];
						//实际数值
						var columnValue = parseInt(v[columnArr[4]])?parseInt(v[columnArr[4]]):0; 
						//开方后的值
						var value =  Math.pow(columnValue,1/powerNumber);
						
						resData.push({
										name:v[columnArr[3]],
										parent:v[columnArr[0]],
										value:value,
										columnValue:columnValue,
										barnId:v[columnArr[2]],
										max:v[columnArr[5]]
										});
					});
					
					//将种类  push到结果集里
					 		/*{
				            id: '02',
				            name: '小育成牛',
				            color: '#85d1c1'
				            }*/
					var idx = 0;
					
					for(var name in categoryJson){
						
						resData.unshift({
							id:name,
							sortIndex: idx,
							name:categoryJson[name],
							color:color_arr1[idx%color_arr1.length]
						});
						idx++;
					}
					
				}
				
				
				
			    var legendShow = chartJson.legendShow||false;   //图例    默认显示
				var chartTitle = chartJson.chartTitle||'';     //图表名称
				$(containerId).show();
				$(containerId).highcharts({
			        title: {
			            text: chartTitle,
			            style: {
			                color: '#444',
			                fontWeight: 'bold',
			                fontSize:'16px'
			            }
			        },
			      //图例
			        legend: {
			            //布局   默认是水平
			       	    layout: 'horizontal',
			            align: 'center',
			            verticalAlign: 'bottom',
			            enabled: legendShow //是否显示图例   
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
			        /*colors:color_arr1,*/
			        exporting:{
			        	enabled:legendShow
			        },
			        tooltip: {
			            shared: true,
			            formatter: function () {
			            	if(this.point.columnValue){
			            		return  this.point.name +
			                    '：<b>' + this.point.columnValue + '</b>';
			            	}
			            }
			        },
			        series: [{
			            type: "treemap",
			            layoutStartingDirection:'vertical',
			            alternateStartingDirection: true,
			            levels: [{
							level: 1,
							//设置一级类型的形状   条纹
			                layoutAlgorithm: 'stripes',
			                dataLabels: {
			                    enabled: true,
			                    align: 'left',
			                    verticalAlign: 'top',
			                    style: {
			                        fontSize: '18px',
			                        fontWeight: 'bold'
			                    }
			                }
			            },
			            {
			                level: 2,
			                //排列方式   显示形式   切片和切块
			                layoutAlgorithm: 'sliceAndDice',
			                dataLabels: {
			                    enabled: true,
			                    align: 'center',
			                    verticalAlign: 'middle',
			                    format: '{point.name}',
			                    style: {
			                        fontSize: '16px',
			                        fontWeight: 'none'
			                    }
			                }
			            }
			            
			            
			            ],
			            events:{
			                click:function(e){
			                    // e.point代表点击位置的数据项
			                    var barnId = e.point.barnId;
			                    var barnName = e.point.name;
			                    if(barnId&&barnName){
			                    	chartJson.fnClick&&chartJson.fnClick(barnId,barnName);
			                    }
			                   
			                }
			            },
			            data:resData
			        }]
			       
			      
			    });
			}
	}
}

