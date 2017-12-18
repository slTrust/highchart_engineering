function nameSpace(param){
	//用于形成自己的闭包    避免变量污染
	
	funcSpace[param]={
			chartTree:function(data,containerId,chartJson) {
				
				var resData = [];
				//种类的颜色数组
				
				//value值得幂数 用于控制他们的所占比例
				var powerNumber = chartJson.powNum||2;
				
				//各个种类对应的颜色 和类型
				var categoryJson2 = {
						'01':{name:'哺乳犊牛',color:'#abd8f3'},
						'02':{name:'小育成牛',color:'#47a9e5'},
						'03':{name:'大育成牛',color:'#47a9e5'},
						'04':{name:'青年牛',color:'#1c84c6'},
						'05':{name:'高产牛',color:'#148f74'},
						'06':{name:'低产牛',color:'#85d1c1'},
						'07':{name:'干奶牛',color:'#f9ad5a'},
						'08':{name:'围产牛',color:'#f9ad5a'},
						'09':{name:'新产牛',color:'#a3e1d5'},
						'10':{name:'围产后',color:'#f9ad5a'},
						'11':{name:'病牛',color:'#f37e89'},
						'12':{name:'隔离牛',color:'#f37e89'},
						'13':{name:'公牛',color:'#f7adb3'},
						'14':{name:'其它',color:'#f37e89'},
						'15':{name:'断奶犊牛',color:'#abd8f3'},
						'16':{name:'中产牛',color:'#1ab395'}
				};
				
				
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
						
						var obj ={
								name:v[columnArr[3]],
								parent:v[columnArr[0]],
								value:value,
								columnValue:columnValue,
								barnId:v[columnArr[2]]
							//	max:v[columnArr[5]]
						};
						for(var j=5;j<columnArr.length;j++){
							var addKey = columnArr[j];
							obj[addKey] = v[addKey];
						}
						resData.push(obj);
					});
					
					//将种类  push到结果集里
					 		/*{
				            id: '02',
				            name: '小育成牛',
				            color: '#85d1c1'
				            }*/
					var idx = 0;
					
					for(var name in categoryJson){
						var key = name;  //类别KEY
						var categoryName = categoryJson[name];
						
						//用key去取 对应类型的颜色
						var color = '';
						color = categoryJson2[key]['color'];
						
						resData.unshift({
							id:key,
							sortIndex: idx,
							name:categoryName,
							color:color
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
			        plotOptions: {
		                series: {
		                	cursor: 'hand'
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
			        exporting:{
			        	enabled:legendShow
			        },
			        tooltip: {
			            shared: true,
			            formatter: function () {
			            	//种类特有的字段
			            	var parentKey = 'id';
			            	var name = this.point.name;
	                    	var value =this.point.columnValue;
	                    	
	                    	//如果是种类   就只显示种类名
	                    	if(this.point[parentKey]){
	                    		return '牛舍类型:'+name;
	                    	}
	                    	
	                    	var str ='<b>'+value+''+'</b><br/>牛舍:'+name+'<br/>';
	                    	//显示附加项信息
	                    	for(var i=5;i<columnArr.length;i++){
	                    		var value  = this.point[columnArr[i]]==undefined?'':this.point[columnArr[i]];
		                		str+= columnArr[i] + ':'+value+'<br/>';
		                	}
	                    	return str;
			            }
			        },
			        series: [{
			            type: "treemap",
			            //排列方式   条纹
			            layoutAlgorithm: 'stripes',
			            layoutStartingDirection:'vertical',
			            alternateStartingDirection: true,
			            levels: [{
			                level: 1,
			               /* layoutAlgorithm: 'sliceAndDice',*/
			                dataLabels: {
			                    enabled: true,
			                    align: 'left',
			                    verticalAlign: 'top',
			                    style: {
			                        fontSize: '16px',
			                        fontWeight: 'bold',
			                        textOutline:false
			                    }
			                }
			            },
			            {
			                level: 2,
			                //排列方式   显示形式切片
			                layoutAlgorithm: 'sliceAndDice',
			                dataLabels: {
			                    enabled: true,
			                    align: 'center',
			                    verticalAlign: 'middle',
			                    style: {
			                        fontSize: '14px',
			                        fontWeight: 'none',
			                        textOutline:false
			                    },
			                    formatter:function(){
			                    	var name = this.point.name;
			                    	var value =this.point.columnValue;
			                    	var str ='<div style="font-size:22px;text-align:center;">'+value+''+'</div><br/>牛舍:'+name+'<br/>';
			                    	//显示附加项信息
			                    	for(var i=5;i<columnArr.length;i++){
			                    		var value = this.point[columnArr[i]]==undefined?'':this.point[columnArr[i]];
				                		str+= columnArr[i] + ':'+value+'<br/>';
				                	}
			                    	return str;
			                    }
			                }
			            }
			            
			            
			            ],
			            events:{
			                click:function(e){
			                    // e.point代表点击位置的数据项
			                    var barnId = e.point.barnId;
			                    var barnName = e.point.name;
			                    var barn_Type = e.point.parent;
			                    if(barnId&&barnName){
			                    	chartJson.fnClick&&chartJson.fnClick(barnId,barnName,barn_Type);
			                    }
			                   
			                }
			            },
			            data:resData
			        }]
			       
			      
			    });
			}
	}
}

