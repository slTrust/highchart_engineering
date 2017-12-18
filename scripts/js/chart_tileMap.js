function nameSpace(param){
	//根据容器宽度设定一行排列多少个
	CONST_MAX_Y = 0;
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
			
			openDetailWindow:function(cattleId,cattleNo){
				openPopWindow_cattle(cattleId,cattleNo);
			},
			setX_Y:function(count,scale){
				//tileMap的横轴代表y  纵轴代表x   第二个参数代表幂数 根号2
//				var y = Math.ceil(Math.sqrt(count*scale));
				var y = CONST_MAX_Y;
				var x = Math.ceil(Math.sqrt(count/scale));
				return {x:x,y:y};
			},
			chartTileMap:function(data,containerId,chartJson) {
				//根据容器宽度  设置一行显示的个数
				var containerWidth = parseInt($(containerId).css('width'));
				if(containerWidth>1400){
					CONST_MAX_Y = 15;
				}else if(containerWidth>1100){
					CONST_MAX_Y = 10;
				}else if(containerWidth>800){
					CONST_MAX_Y = 7;
				}else{
					CONST_MAX_Y = 5;
				}
				var chartTitle = chartJson.chartTitle||'';     //图表名称
				var xMax = null;
				var yMax = null;
				var series = [];
			 	if(data&&data.length!=0){
		            var json = this.setX_Y(data.length,3)
					//获得纵轴最大值
					var x = json.x;
					//获得横轴最大值
					var y = json.y;
					if(data.length>CONST_MAX_Y){
						xMax =parseInt(data.length/y);
					}else{
						xMax = 0;
					}
					yMax = y;
					
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
					var color_arr1= [] ;
					if(chartJson&&chartJson.colorArr&&chartJson.colorArr.length!=0){
						color_arr1 = chartJson.colorArr;
					}else{
						color_arr1 = const_color;
					}
		            // 初始化类别数组 和 series类别
					var categoryArr =[];
					
					colorJson = {
							'禁配':'#ed5464',
							'已配未检':'#f9ad5a',
							'怀孕':'#1ab395',
							'其他':'#b5b9cf',
							'无':'#b5b9cf',
							'待配':'#85d1c1',
							'流产':'#f7adb3',
							'新产':'#b5b9cf',
							'未孕':'#e5f1fb',
							
					};
					for(var name in categoryJson){
		                categoryArr.push(name);
		                // 划分类别
		                series.push({
		                    name:name,
		                    data:[],
		                    color:colorJson[name]
		                });
					}
					var that = this;
					for(var i=0;i<count;i++){
		                // 获取当前类别
		                categoryKey = data[i][column2];
		                // 寻找类别 索引
		                var idx = that.findInArrIndex(categoryKey,categoryArr);
		                //x代表纵轴方向  y代表横轴   左上角是原点
		                //具体点 的所有值  对象 
		                var obj ={
								keyId:data[i][column1],
								name:data[i][column0],
								category:data[i][column2],
								//x:parseInt(i/y)%x,
								x:parseInt(i/y),
								y:i%y
								//value:data[i][column3]
							}
		                for(var j=3;j<key_arr.length;j++){
		                	var addKey = key_arr[j];
		                	obj[addKey] = data[i][addKey];
		                }
		                
		               /* series[idx].data.push(
							{
								keyId:data[i][column1],
								name:data[i][column0],
								category:data[i][column2],
								//x:parseInt(i/y)%x,
								x:parseInt(i/y),
								y:i%y,
								value:data[i][column3]
							}
						)*/
		               series[idx].data.push(obj);
					}
					var addHeight = 180;
					if(xMax == 0) {
						addHeight += 40;
					} else{
						addHeight += 40 - Math.abs(10 - xMax)*10 ;
					}
					
					//根据宽度设置高度
					var containerW = parseInt($(containerId).css('width'));
					var containerH = containerW/CONST_MAX_Y*Math.ceil((data.length/CONST_MAX_Y))*0.85 + addHeight;
					var sixW = ((containerW-20)/(CONST_MAX_Y+1.5));
					var sixH = (sixW/1.731)*2;
				
					var lineCount = Math.ceil((data.length/CONST_MAX_Y));
					
					var innerH = (lineCount-1)* (sixH*0.75) +sixH;
					if(lineCount==1) innerH = sixH *7/4;
					
					var innerWrapH = innerH+50;
					var outerH = innerWrapH+100;
//					console.log('宽'+sixW);
//					console.log('高'+sixH);
//					console.log('innerH'+innerH)
//					console.log('innerWrapH'+innerWrapH)
//					console.log('总高度'+outerH);
//					console.log('之前的高度'+containerH)
					$(containerId).css('height',outerH+'px')
				}

				
				
				
				
				
				$(containerId).highcharts({
					chart: {
		                type: 'tilemap',
		                //borderColor:'#dddddd',
		                //borderWidth:1,
		                inverted: true//xy轴颠倒
		               // ,height: xMax*100/yMax+'%'
			        },       
					lang: {
						printChart: '打印图表',
						downloadJPEG:'导出 jpeg',
						downloadPDF: '导出 pdf',
						downloadPNG: '导出 PNG',
						downloadSVG: '导出 SVG',
		            },
		            //colors:color_arr1,
			        title: {
			            text: chartTitle,
			            floating:false,
			            style: {
			                color: '#444',
			                fontWeight: 'bold',
			                fontSize:'16px'
			            }
			        },
			        xAxis: {
		                visible: false,
			        	//设置轴线颜色  以及宽度
			        	lineColor: '#999',
			            lineWidth:2,
			            title: {
			                enabled: true,
			                text: ' ',   //x轴title
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
		                min:0,
		                max:xMax
			        },
			        yAxis: {
		                
			        	visible: false,
			        	//设置轴线颜色  以及宽度
			        	lineColor: '#999',
			            lineWidth:2,
			            title: {
			                text:' ', //y轴title
				            align: 'high',
			                offset: 0,
			                rotation: 0,
			                y: -15
			            },
		                gridLineWidth: 1,
		                min:0,
		                max:CONST_MAX_Y
		            },
			        tooltip: {
		                headerFormat: '',
		                //pointFormat: '<b> {point.name}</b><br/>:<b>{point.value}</b>泌乳:{point.泌乳}泌乳2：{point.泌乳2}'
		                formatter:function(){
		                	var str ='<b>'+this.point.name+'</b><br/>';
		                	for(var i=3;i<key_arr.length;i++){
		                		var value  = this.point[key_arr[i]]=='undefined'?'':this.point[key_arr[i]];
		                		str+= key_arr[i] + ':'+value+'<br/>'
		                	}
		                	return str;
		                }
			        },
		          //图例
			        legend: {
			            //布局   默认是水平
			       	    layout: 'horizontal',
			            align: 'center',
			            verticalAlign: 'bottom',
			            enabled: true //是否显示图例   
			        },
		            plotOptions: {
		                series: {
		                	cursor:'hand',  
		                    dataLabels: {
		                        enabled: true,
								format: '{point.name}',
		                        color: '#000000',
		                        style: {
		                            textOutline: false,
		                            fontWeight:'none',
		                            fontSize:'12px'
		                        }
		                    },
		                    events: {  
				                click: function(e) {  
				                	var cattleId = e.point.keyId;
				                	var cattleNo = e.point.name;
									if(cattleId&&cattleNo){
										that.openDetailWindow(cattleId,cattleNo);
									}
				                } 
				            }
		                }
		            },
		            exporting:{
			        	enabled:false
			        },
			        series: series
				});
				
				
			}
	}
}