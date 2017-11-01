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
				var dataClasses = [];
				if(data&&data.length!=0){
                    var json = this.setX_Y(data.length,chartJson.scale)
                    console.log('````x   y``````');
                    console.log(json);
                    console.log('``````````');
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
                    // 初始化  类别的颜色
					var color_arr= [] ;
					if(chartJson&&chartJson.colorArr&&chartJson.colorArr.length!=0){
						color_arr = chartJson.colorArr;
					}else{
						color_arr = const_color;
                    }
                    // 初始化类别数组 和 series类别
					var categoryArr =[];
					for(var name in categoryJson){
                        categoryArr.push(name);
                        // 划分类别
                        series.push({
                            name:name,
                            data:[]
                        });
					}
                   
					var that = this;
					for(var i=0;i<count;i++){
                        // 获取当前类别
                        categoryKey = data[i][column2];
                        // 寻找类别 索引
                        var idx = that.findInArrIndex(categoryKey,categoryArr);
                        //x代表纵轴方向  y代表横轴   左上角是原点
                        series[idx].data.push(
							{
								keyId:data[i][column1],
								name:data[i][column0],
								category:data[i][column2],
								x:parseInt(i/y)%x,
								y:i%y,
								value:data[i][column3]
							}
						)
					}
				}
					$(containerId).show();
					$(containerId).highcharts({
						chart: {
                            type: 'tilemap',
                            inverted: true,//xy轴颠倒
                            height: '80%'
				        },       
						lang: {
							printChart: '打印图表',
							downloadJPEG:'导出 jpeg',
							downloadPDF: '导出 pdf',
							downloadPNG: '导出 PNG',
							downloadSVG: '导出 SVG',
                        },
                        colors:color_arr,
				        title: {
				            text: chartTitle,
				            style: {
				                color: '#444',
				                fontWeight: 'bold',
				                fontSize:'16px'
				            }
				        },
				        xAxis: {
                            //visible: false,
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
                            gridLineWidth: 1
				        },
				        yAxis: {
                            //visible: false,
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
                            gridLineWidth: 1
                        },
				        tooltip: {
                            headerFormat: '',
                            pointFormat: '<b> {point.name}</b> : <b>{point.value}</b>'
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
                        exporting:{
				        	enabled:true
				        },
				        series: series
				       
					});
				
				
			}
	}
}