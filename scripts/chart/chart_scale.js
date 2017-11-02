function nameSpace(param){
	//用于形成自己的闭包    避免变量污染
	funcSpace[param]={
			//拼接每个点的字符串key
			convertPointId:function(x,y,promise){
				return x + "-" + y + '-' + promise;
			},
			//查找字符串所在数组的  位置
			findInArrIndex:function(str,arr){
				for(var i=0;i<arr.length;i++){
					if(str==arr[i]){
						return i;
					}
				}
				return -1;
            },
            getChartNum:function(realNum, defaultNum){
                // 预设的默认坐标值优先
                return (defaultNum == -1) ? realNum : defaultNum;
            },
            getNumVal:function (numValue) {
                if(!numValue)		return -1;
                if(numValue == "")	return -1;
                return parseInt(numValue);
            },
			//定义自己的格式化函数
			tooltipFormat:function(x, y, promise){
				var key = this.convertPointId(x, y, promise);
				saveKey = key;
				return '<b>' + this.json_name[key] + '</b><br/>'
//						+ 'id:'+json_id[key]
						+'<br/>' + this.key_arr[2] + ':'+ x + '<br/>'
						+'<br/>' + this.key_arr[3] + ':'+ y + '<br/>'
				;
			},
			radius_arr:[4,4,4,4,4,4,4,4,4,4],
			shape_arr:["circle","circle","circle","circle","circle","circle","circle","circle","circle","circle"],
			key_arr:[],
			//step10  x-y:id   对象数组  x-y:num 数组
			json_id:{},
			json_name:{},
			initData:function(){
				this.key_arr=[];
				//step10  x-y:id   对象数组  x-y:num 数组
				this.json_id={};
				this.json_name={};
			},
			saveKey:"",
			chartScatter:function(data,containerId,chartJson) {
				//printLogJ(data);
				var legendShow = chartJson.legendShow||false;   //图例    默认显示
				var chartTitle = chartJson.chartTitle||'';     //图表名称
				var chartSubTitle =chartJson.chartSubTitle||''; //副标题
				var xTitle = chartJson.xTitle||'x';			   //x标题
				var yTitle = chartJson.yTitle||'y';			   //y标题
				var xMax =  chartJson.xMax||null;
				var yMax = chartJson.yMax||null;
				var xMin = chartJson.xMin==0?0:(chartJson.xMin?chartJson.xMin:null);
				var yMin =chartJson.yMin==0?0:(chartJson.yMin?chartJson.yMin:null);
				var color_arr=[   
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
				this.initData();
				//step1数据表的key数组	
				
				var that=this;
				if(data[0]){
					$.each(data[0],function(k,v){
						that.key_arr.push(k);
					});
				}
				//step2实际传递到  highchars里的 初始化种类数组s
				var seriesData=[];
				//step3第五列 决定风格的种类数组
				var category=[];//实际得到的种类			
				//step4 标记一行数据列的数组     对应值
				var id='';//第一列
				var cate_num=0;//第二列
				var x=0;//第三列
				var y=0;//第四列
				var promise='';//决定数据de 		
				var minX = 0;
				var maxX = 0;
				var minY = 0;
				var maxY = 0;
				var that=this;
                //step5循环data  push数据
			 	$.each(data,function(i,value){			 		
			 		id = value[that.key_arr[0]];
			 		cate_num = value[that.key_arr[1]];
			 		x = that.getNumVal(value[that.key_arr[2]]);
			 		y = that.getNumVal(value[that.key_arr[3]]);
			 		
			 		minX = Math.min(minX,x);
			 		maxX = Math.max(maxX,x);
			 		minY = Math.min(minY,y);
			 		maxY = Math.max(maxY,y);
			 		
			 		promise=value[that.key_arr[4]];
					//step7 标记series种类数组的索引
					var index = that.findInArrIndex(promise,category);
					//如果不存在  push
					if(index == -1){
						category.push(promise);
						//step8获取决定种类的索引 
						index=category.length - 1;
						//step9 初始化新增种类对象
						 var simpleSeries={
				            marker:{ 
				                    radius: that.radius_arr[index],  //曲线点半径，默认是4
				                    symbol: that.shape_arr[index] //曲线点类型："circle", "square", "diamond", "triangle","triangle-down"，默认是"circle"
				                  },
				            name:promise,//胎次
				            color: color_arr[index],//颜色
				            data:[]//数据集合          
						 };	
						var pos=[x,y];
						 simpleSeries.data.push(pos);						
						 seriesData.push(simpleSeries);
					}else{  //如果已经存在
						var pos=[x,y];
						seriesData[index].data.push(pos);
					} 
				    //step11初始化    json_name  json_id数组
				    var pos_key= that.convertPointId(x, y, promise);
				    that.json_id[pos_key]=id;
				    that.json_name[pos_key]=cate_num;

				}); //最外层循环
			 	// minX = that.getChartNum(minX, chart_min_x);
			 	// maxX = that.getChartNum(maxX, chart_max_x);
			 	// minY = that.getChartNum(minY, chart_min_y1);
			 	// maxY = that.getChartNum(maxY, chart_max_y1);
			 	// var titleX = getChartTitle(this.key_arr[2], chart_content_x);
			 	// var titleY = getChartTitle(this.key_arr[3], chart_content_y1);
			 	
			 	//printLogJ(seriesData);
				//没有数据时候的显示   **要引入 一个js才可以生效
				Highcharts.setOptions({
					lang: {
						noData: '暂无数据',
						downloadJPEG:'d5465496'
					}
				});
				$(containerId).show();
				$(containerId).highcharts({
			        chart: {
			            type: 'scatter',
			            zoomType: 'xy'
			        },
			        legend: {
			            enabled:legendShow
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
			            text: chartSubTitle
			        },
			        exporting:{
			        	enabled:true
			        },
			        //点击事件
			        plotOptions: {  
				        series: {  
				            cursor: 'hand',  
				            events: {  
				                click: function(e) {  
				                } 
				            }
				        }
			        },  
			        //数据提示框
				        tooltip: {
			   //             enabled: true,
			            formatter:function(){
			              return that.tooltipFormat(this.x, this.y, this.series.name);
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
			        //图例
			        legend: {
			            //布局   默认是水平
			    	    layout: 'horizontal',
			            align: 'center',
			            verticalAlign: 'bottom'
			        },
			        series:seriesData
			    }); 
			}
	}
}
