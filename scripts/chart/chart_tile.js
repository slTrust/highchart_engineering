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
			setX_Y:function(count,scale){
				//tileMap的横轴代表y  纵轴代表x   第二个参数代表幂数 根号2
				var y = Math.ceil(Math.sqrt(count*scale));
				var x = Math.ceil(Math.sqrt(count/scale));
				return {x:x,y:y};
			},
			chartTileMap:function(data,containerId,chartJson) {

				var xTitle = chartJson.xTitle||'x';			   //x标题
				var yTitle = chartJson.yTitle||'y';		
				var chartTitle = chartJson.chartTitle||'';     //图表名称

				var series = [];
				if(data&&data.length!=0){
					var json = this.setX_Y(data.length,1.5)
					console.log(json);
					//获得纵轴最大值
					var x = json.x;
					//获得横轴最大值
					var y = json.y;
					
					
					var key_arr= [];
					for(var name in data[0]){
						key_arr.push(name);
					}
	
					var column0 = key_arr[0];//牛号
					var column1 = key_arr[1];//牛号id
					var column2 = key_arr[2];//繁育状态    这个用来区分种类的颜色 **
					var column3 = key_arr[3];//产奶量      传递的标识信息
					// var column4 = key_arr[4];
					var count = data.length;


					var categoryJson = {};
					//筛选出所有种类
					for(var i=0;i<count;i++){
						var key = data[i][column2];
						categoryJson[key]= '';
					}
					var const_color=[   
						'#ff8f74',
						'#ffb395',
						'#85d1c1',
						'#ffe1d5',
						'#e5f1fb',
						'#b5b9cf',
						'#dfdfdf',
						'#b3b3b3',
						'#979797'
						];	
					var idx =0;
					//初始化  类别的颜色
					var dataClasses = [];
					for(var name in categoryJson){
						categoryJson[name]=idx;
					
						dataClasses.push({
                                from: idx,
                                to:idx,
                                color: const_color[idx%const_color.length],
                                name: name
						});
						idx++;
					}
					console.log(categoryJson)
					
				


					//横纵坐标
					series.push({
						name:'',
						data:[]
					});
					for(var i=0;i<count;i++){
						//x代表纵轴方向  y代表横轴

						categoryKey = data[i][column2];
						categoryValue = categoryJson[categoryKey];

						series[0].data.push(
							{
								keyId:data[i][column1],
								name:data[i][column0],
								dataValue:data[i][column3],
								x:parseInt(i/y)%x,
								y:i%y,
								value:categoryValue  //此value用来 标识种类
							}
						)
					}
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
                            type: 'tilemap',
                            inverted: true,
                            height: '80%'
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
                            max:null
				        },
				        yAxis: {
				        	//设置轴线颜色  以及宽度
				        	lineColor: '#999',
				            lineWidth:2,
				            title: {
				                text:'2222', //y轴title
					            align: 'high',
				                offset: 0,
				                rotation: 0,
				                y: -15
				            },
                            gridLineWidth: 1
                        },
                        colorAxis: {
							 dataClasses:dataClasses
                            // dataClasses: [{
                            //     from: 0,
                            //     to: 1000000,
                            //     color: '#F9EDB3',
                            //     name: '< 1M'
                            // }, {
                            //     from: 1000000,
                            //     to: 5000000,
                            //     color: '#FFC428',
                            //     name: '1M - 5M'
                            // }, {
                            //     from: 5000000,
                            //     to: 20000000,
                            //     color: '#FF7987',
                            //     name: '5M - 20M'
                            // }, {
                            //     from: 20000000,
                            //     color: '#FF2371',
                            //     name: '> 20M'
                            // }]
                        },
				        tooltip: {
                            headerFormat: '',
                            pointFormat: 'The population of <b> {point.name}</b> is <b>{point.value}</b>'
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
									format: '{point.name}',
                                    color: '#000000',
                                    style: {
                                        textOutline: false
                                    }
                                }
                            }
                        },
				        series: series,
				        exporting:{
				        	enabled:true
				        }
					});
				
				
			}
	}
}